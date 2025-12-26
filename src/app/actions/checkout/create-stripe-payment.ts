// src/app/actions/checkout/create-stripe-payment.ts
'use server'

import { stripe } from '~/lib/stripe'
import { db } from '~/server/db'
import { orders } from '~/server/db/schema'
import { eq } from 'drizzle-orm'

interface CreateStripePaymentInput {
	orderId: string
	locale?: string
}

export async function createStripePayment(input: CreateStripePaymentInput) {
	try {
		const { orderId, locale = 'en' } = input

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

		// 2. Fetch order items for metadata
		const orderItemsData = await db.query.orderItems.findMany({
			where: (items, { eq }) => eq(items.orderId, orderId),
		})

		// 3. Create Stripe PaymentIntent
		const paymentIntent = await stripe.paymentIntents.create({
			amount: order.total, // Already in cents
			currency: order.currency.toLowerCase(),

			// Metadata (available in webhooks & dashboard)
			metadata: {
				orderId: order.id,
				orderNumber: order.orderNumber,
				customerEmail: order.email,
				locale,
				market: order.market,

				// Serialize cart items (max 500 chars per value)
				cartItems: JSON.stringify(orderItemsData.map(item => ({
					productId: item.productId,
					name: item.productName,
					sku: item.sku,
					quantity: item.quantity,
					price: item.pricePerUnit,
				}))).slice(0, 500), // Truncate if too long
			},

			// Description visible to customer
			description: `${order.orderNumber} - ${orderItemsData.length} items`,

			// Automatic payment methods (card, Apple Pay, Google Pay)
			automatic_payment_methods: {
				enabled: true,
			},

			// Receipt email
			receipt_email: order.email,
		})

		// 4. Update order with payment intent ID
		await db
			.update(orders)
			.set({
				paymentIntentId: paymentIntent.id,
				paymentProvider: 'stripe',
			})
			.where(eq(orders.id, orderId))

		console.log('✅ Stripe PaymentIntent created:', paymentIntent.id)

		return {
			success: true,
			clientSecret: paymentIntent.client_secret,
			paymentIntentId: paymentIntent.id,
		}

	} catch (error) {
		console.error('❌ Stripe payment creation failed:', error)
		return { success: false, error: 'Failed to create payment' }
	}
}