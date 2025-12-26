// src/app/api/webhooks/stripe/route.ts

import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import { stripe } from '~/lib/stripe'
import { db } from '~/server/db'
import { orders, orderStatusHistory } from '~/server/db/schema'
import { eq } from 'drizzle-orm'

export async function POST(req: Request) {
	const body = await req.text()
	const headersList = await headers()
	const sig = headersList.get('stripe-signature')

	if (!sig) {
		return NextResponse.json({ error: 'No signature' }, { status: 400 })
	}

	let event

	try {
		// Verify webhook signature
		event = stripe.webhooks.constructEvent(
			body,
			sig,
			process.env.STRIPE_WEBHOOK_SECRET!
		)
	} catch (err) {
		console.error('❌ Webhook signature verification failed:', err)
		return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
	}

	// Handle the event
	try {
		switch (event.type) {
			case 'payment_intent.succeeded': {
				const paymentIntent = event.data.object
				const orderId = paymentIntent.metadata.orderId

				if (!orderId) {
					console.error('❌ No orderId in payment metadata')
					break
				}

				console.log('✅ Payment succeeded:', paymentIntent.id)

				// Update order status
				await db
					.update(orders)
					.set({
						status: 'confirmed',
						paymentStatus: 'paid',
						paidAt: new Date(),
						confirmedAt: new Date(),
					})
					.where(eq(orders.id, orderId))

				// Log status change
				await db.insert(orderStatusHistory).values({
					orderId,
					fromStatus: 'pending',
					toStatus: 'confirmed',
					notes: `Payment succeeded: ${paymentIntent.id}`,
					changedBy: 'system',
				})

				// TODO: Send confirmation email
				// await sendOrderConfirmation(orderId)

				break
			}

			case 'payment_intent.payment_failed': {
				const paymentIntent = event.data.object
				const orderId = paymentIntent.metadata.orderId

				if (!orderId) {
					console.error('❌ No orderId in payment metadata')
					break
				}

				console.log('❌ Payment failed:', paymentIntent.id)

				// Update order status
				await db
					.update(orders)
					.set({
						paymentStatus: 'failed',
					})
					.where(eq(orders.id, orderId))

				// Log status change
				await db.insert(orderStatusHistory).values({
					orderId,
					fromStatus: null,
					toStatus: 'pending',
					notes: `Payment failed: ${paymentIntent.last_payment_error?.message || 'Unknown error'}`,
					changedBy: 'system',
				})

				break
			}

			case 'payment_intent.canceled': {
				const paymentIntent = event.data.object
				const orderId = paymentIntent.metadata.orderId

				if (!orderId) {
					console.error('❌ No orderId in payment metadata')
					break
				}

				console.log('⚠️ Payment canceled:', paymentIntent.id)

				await db
					.update(orders)
					.set({
						status: 'cancelled',
						paymentStatus: 'pending',
						cancelledAt: new Date(),
					})
					.where(eq(orders.id, orderId))

				break
			}

			default:
				console.log(`Unhandled event type: ${event.type}`)
		}

		return NextResponse.json({ received: true })

	} catch (error) {
		console.error('❌ Webhook handler error:', error)
		return NextResponse.json(
			{ error: 'Webhook handler failed' },
			{ status: 500 }
		)
	}
}