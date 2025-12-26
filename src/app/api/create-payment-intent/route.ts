// src/app/api/create-payment-intent/route.ts
import { NextResponse } from 'next/server'
import { stripe } from '~/lib/stripe'

export async function POST(req: Request) {
	try {
		const { amount, currency } = await req.json()

		// Validate
		if (!amount || amount <= 0) {
			return NextResponse.json(
				{ error: 'Invalid amount' },
				{ status: 400 }
			)
		}

		// Create PaymentIntent
		const paymentIntent = await stripe.paymentIntents.create({
			amount,
			currency: currency || 'eur',
			automatic_payment_methods: {
				enabled: true,
			},
		})

		return NextResponse.json({
			clientSecret: paymentIntent.client_secret,
		})
	} catch (error) {
		console.error('PaymentIntent creation failed:', error)
		return NextResponse.json(
			{ error: 'Failed to create payment intent' },
			{ status: 500 }
		)
	}
}