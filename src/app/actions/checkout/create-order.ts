// src/app/actions/checkout/create-order.ts
'use server'

import { db } from '~/server/db'
import { orders, orderItems } from '~/server/db/schema'
import { eq, and } from 'drizzle-orm'
import { products, productPricing } from '~/server/db/schema/shop'
import { validateDiscountCode } from '~/lib/discount-validation'
import { z } from 'zod'

// ============================================================================
// TYPES
// ============================================================================

const checkoutSchema = z.object({
	// Cart items
	cartItems: z.array(z.object({
		productId: z.string(),
		quantity: z.number().min(1),
		selectedOptions: z.any().optional(),
	})),

	// Shipping address
	shippingAddress: z.object({
		firstName: z.string().min(1),
		lastName: z.string().min(1),
		email: z.string().email(),
		phone: z.string().min(1),
		address1: z.string().min(1),
		address2: z.string().optional(),
		city: z.string().min(1),
		state: z.string().optional(),
		postalCode: z.string().min(1),
		countryCode: z.string().length(2),
	}),

	// Optional
	discountCode: z.string().optional(),
	locale: z.string().default('en'),
})

type CheckoutInput = z.infer<typeof checkoutSchema>

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function generateOrderNumber(): string {
	const year = new Date().getFullYear()
	const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0')
	return `ORD-${year}-${random}`
}

function detectMarket(countryCode: string): string {
	switch (countryCode) {
		case 'US':
			return 'US'
		case 'DE':
			return 'DE'
		case 'NL':
			return 'NL'
		case 'IT':
			return 'IT'
		default:
			return 'ROW'
	}
}

// ============================================================================
// MAIN FUNCTION
// ============================================================================

export async function createOrder(input: CheckoutInput) {
	try {
		// 1. Validate input
		const validated = checkoutSchema.parse(input)
		const { cartItems, shippingAddress, discountCode, locale } = validated

		if (cartItems.length === 0) {
			return { success: false, error: 'Cart is empty' }
		}

		// 2. Fetch products with pricing
		const productIds = cartItems.map(item => item.productId)
		const market = detectMarket(shippingAddress.countryCode)

		const productsData = await db
			.select({
				id: products.id,
				name: products.sku, // Will get translation later
				sku: products.sku,
				stockStatus: products.stockStatus,
				priceId: productPricing.id,
				pricingType: productPricing.pricingType,
				unitPriceEurCents: productPricing.unitPriceEurCents,
			})
			.from(products)
			.leftJoin(
				productPricing,
				and(
					eq(productPricing.productId, products.id),
					eq(productPricing.market, market)
				)
			)
			.where(eq(products.id, productIds.length === 1 ? productIds[0]! : productIds[0]!))

		// 3. Validate stock availability
		for (const item of cartItems) {
			const product = productsData.find(p => p.id === item.productId)
			if (!product) {
				return { success: false, error: `Product not found: ${item.productId}` }
			}
			if (product.stockStatus === 'out_of_stock') {
				return { success: false, error: `${product.name} is out of stock` }
			}
		}

		// 4. Calculate totals (NEVER trust client)
		let subtotal = 0
		const itemsWithPrices = cartItems.map(item => {
			const product = productsData.find(p => p.id === item.productId)!
			const pricePerUnit = product.unitPriceEurCents ?? 0
			const itemTotal = pricePerUnit * item.quantity
			subtotal += itemTotal

			return {
				...item,
				product,
				pricePerUnit,
				itemTotal,
			}
		})

		// 5. Apply discount (TODO: Validate discount code from DB)
		let discount = 0
		let promoterId: string | undefined = undefined
		let saleId: string | undefined = undefined

		if (discountCode) {
			const result = await validateDiscountCode(
				discountCode,
				subtotal,
				market,
				shippingAddress.email
			)

			if (result.success) {
				discount = result.discountAmount
				promoterId = result.promoterId
				saleId = result.saleId
			} else {
				console.warn(`Invalid discount code at checkout: ${discountCode}`)
				// Don't fail the order, just ignore the code
			}
		}

		// 6. Calculate shipping & tax (TODO: Real calculation)
		const shipping = 0 // Free shipping for now
		const tax = 0 // Calculate based on country

		const total = subtotal - discount + shipping + tax

		// 7. Create order in DB
		const [order] = await db.insert(orders).values({
			orderNumber: generateOrderNumber(),

			// Customer info
			email: shippingAddress.email,
			firstName: shippingAddress.firstName,
			lastName: shippingAddress.lastName,

			// Pricing (all in cents)
			subtotal,
			discount,
			shipping,
			tax,
			total,
			currency: 'EUR',

			// Market tracking
			market,
			countryCode: shippingAddress.countryCode,

			// Status
			status: 'pending',
			paymentStatus: 'pending',

			// Shipping address
			shippingAddress: {
				firstName: shippingAddress.firstName,
				lastName: shippingAddress.lastName,
				address1: shippingAddress.address1,
				address2: shippingAddress.address2,
				city: shippingAddress.city,
				state: shippingAddress.state,
				postalCode: shippingAddress.postalCode,
				country: shippingAddress.countryCode, // TODO: Get full name
				countryCode: shippingAddress.countryCode,
				phone: shippingAddress.phone,
			},

			// Promo tracking (if applicable)
			discountCode,
		}).returning()

		if (!order) {
			return { success: false, error: 'Failed to create order' }
		}

		// 8. Create order items with FULL pricing snapshots
		await db.insert(orderItems).values(
			itemsWithPrices.map(item => ({
				orderId: order.id,
				productId: item.productId,

				// Product snapshot (immutable)
				productName: item.product.name,
				sku: item.product.sku,
				productSlug: '', // TODO: Get from product

				// Pricing snapshot (CRITICAL: never changes)
				pricingSnapshot: {
					pricingType: 'simple' as const,
					market,
					currency: 'EUR',
					unitPriceEurCents: item.pricePerUnit,
					quantity: item.quantity,
					// TODO: Add bundle/configuration/addons if applicable
				},

				// Calculated totals
				quantity: item.quantity,
				pricePerUnit: item.pricePerUnit,
				subtotal: item.itemTotal,
				addonsTotal: 0,
				customizationsTotal: 0,
				total: item.itemTotal,

				// Fulfillment
				isCustom: false,
				productionStatus: 'pending',
			}))
		)

		console.log('✅ Order created:', order.id, order.orderNumber)

		return {
			success: true,
			orderId: order.id,
			orderNumber: order.orderNumber,
			total: order.total,
		}

	} catch (error) {
		console.error('❌ Order creation failed:', error)

		if (error instanceof z.ZodError) {
			return { success: false, error: 'Invalid form data' }
		}

		return { success: false, error: 'Failed to create order' }
	}
}