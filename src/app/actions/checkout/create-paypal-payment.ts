// src/app/actions/checkout/create-paypal-payment.ts
'use server'

import { db } from '~/server/db'
import { orders } from '~/server/db/schema'
import { eq } from 'drizzle-orm'

interface CreatePayPalPaymentInput {
	orderId: string
}

// Get PayPal access token
async function getPayPalAccessToken(): Promise<string> {
	const auth = Buffer.from(
		`${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
	).toString('base64')

	const response = await fetch(
		`${process.env.PAYPAL_API_URL}/v1/oauth2/token`,
		{
			method: 'POST',
			headers: {
				'Authorization': `Basic ${auth}`,
				'Content-Type': 'application/x-www-form-urlencoded',
			},
			body: 'grant_type=client_credentials',
		}
	)

	const data = await response.json()
	return data.access_token
}

export async function createPayPalPayment(input: CreatePayPalPaymentInput) {
	try {
		const { orderId } = input

		// 1. Fetch order from DB
		const [order] = await db
			.select()
			.from(orders)
			.where(eq(orders.id, orderId))
			.limit(1)

		if (!order) {
			return { success: false, error: 'Order not found' }
		}

		if (order.paymentStatus === 'paid') {
			return { success: false, error: 'Order already paid' }
		}

		// 2. Fetch order items
		const orderItemsData = await db.query.orderItems.findMany({
			where: (items, { eq }) => eq(items.orderId, orderId),
		})

		// 3. Get PayPal access token
		const accessToken = await getPayPalAccessToken()

		// 4. Create PayPal order
		const response = await fetch(
			`${process.env.PAYPAL_API_URL}/v2/checkout/orders`,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${accessToken}`,
				},
				body: JSON.stringify({
					intent: 'CAPTURE',
					purchase_units: [
						{
							reference_id: order.id,
							amount: {
								currency_code: order.currency,
								value: (order.total / 100).toFixed(2),
								breakdown: {
									item_total: {
										currency_code: order.currency,
										value: (order.subtotal / 100).toFixed(2),
									},
									discount: order.discount > 0 ? {
										currency_code: order.currency,
										value: (order.discount / 100).toFixed(2),
									} : undefined,
									shipping: order.shipping > 0 ? {
										currency_code: order.currency,
										value: (order.shipping / 100).toFixed(2),
									} : undefined,
									tax_total: order.tax > 0 ? {
										currency_code: order.currency,
										value: (order.tax / 100).toFixed(2),
									} : undefined,
								},
							},
							items: orderItemsData.map(item => ({
								name: item.productName,
								sku: item.sku,
								quantity: item.quantity.toString(),
								unit_amount: {
									currency_code: order.currency,
									value: (item.pricePerUnit / 100).toFixed(2),
								},
							})),
							shipping: {
								name: {
									full_name: `${order.firstName} ${order.lastName}`,
								},
								address: {
									address_line_1: order.shippingAddress?.address1 || '',
									address_line_2: order.shippingAddress?.address2 || undefined,
									admin_area_2: order.shippingAddress?.city || '',
									admin_area_1: order.shippingAddress?.state || undefined,
									postal_code: order.shippingAddress?.postalCode || '',
									country_code: order.countryCode,
								},
							},
						},
					],
					application_context: {
						brand_name: 'Aquadecor Backgrounds',
						locale: 'en-US', // TODO: Use order locale
						landing_page: 'NO_PREFERENCE',
						shipping_preference: 'SET_PROVIDED_ADDRESS',
						user_action: 'PAY_NOW',
						return_url: `${process.env.NEXT_PUBLIC_APP_URL}/success?orderId=${orderId}`,
						cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout`,
					},
				}),
			}
		)

		const paypalOrder = await response.json()

		if (!paypalOrder.id) {
			console.error('❌ PayPal order creation failed:', paypalOrder)
			return { success: false, error: 'Failed to create PayPal order' }
		}

		// 5. Update order with PayPal order ID
		await db
			.update(orders)
			.set({
				paymentIntentId: paypalOrder.id,
				paymentProvider: 'paypal',
			})
			.where(eq(orders.id, orderId))

		console.log('✅ PayPal order created:', paypalOrder.id)

		// 6. Find approval URL
		const approvalUrl = paypalOrder.links?.find(
			(link: any) => link.rel === 'approve'
		)?.href

		return {
			success: true,
			paypalOrderId: paypalOrder.id,
			approvalUrl,
		}

	} catch (error) {
		console.error('❌ PayPal payment creation failed:', error)
		return { success: false, error: 'Failed to create PayPal payment' }
	}
}

// Capture PayPal payment after approval
export async function capturePayPalPayment(paypalOrderId: string) {
	try {
		const accessToken = await getPayPalAccessToken()

		const response = await fetch(
			`${process.env.PAYPAL_API_URL}/v2/checkout/orders/${paypalOrderId}/capture`,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${accessToken}`,
				},
			}
		)

		const capture = await response.json()

		if (capture.status === 'COMPLETED') {
			// Update order in DB
			const orderId = capture.purchase_units[0].reference_id

			await db
				.update(orders)
				.set({
					status: 'confirmed',
					paymentStatus: 'paid',
					paidAt: new Date(),
					confirmedAt: new Date(),
				})
				.where(eq(orders.id, orderId))

			console.log('✅ PayPal payment captured:', paypalOrderId)

			return { success: true, orderId }
		}

		return { success: false, error: 'Payment not completed' }

	} catch (error) {
		console.error('❌ PayPal capture failed:', error)
		return { success: false, error: 'Failed to capture payment' }
	}
}