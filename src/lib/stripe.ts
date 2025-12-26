// src/lib/stripe.ts
import Stripe from 'stripe'

if (!process.env.STRIPE_SECRET_KEY) {
	throw new Error('Missing STRIPE_SECRET_KEY environment variable')
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
	apiVersion: '2024-11-20.acacia',
	typescript: true,
})

// Helper to format cents to Stripe amount
export function toStripeAmount(cents: number): number {
	return cents // Stripe uses smallest currency unit (cents for EUR/USD)
}

// Helper to format Stripe amount to cents
export function fromStripeAmount(amount: number): number {
	return amount
}