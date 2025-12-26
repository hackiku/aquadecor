// src/app/[locale]/(checkout)/_context/StripeProvider.tsx
'use client'

import { type ReactNode } from 'react'
import { useEffect, useState } from 'react'
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe, type StripeElementsOptions } from '@stripe/stripe-js'

// Load Stripe outside component to avoid recreating instance
const stripePromise = loadStripe(
	process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_placeholder'
)

interface StripeProviderProps {
	children: ReactNode
	amount: number // in cents
	currency?: string
}

export function StripeProvider({
	children,
	amount,
	currency = 'eur'
}: StripeProviderProps) {
	const [clientSecret, setClientSecret] = useState<string>('')

	// Create PaymentIntent on mount
	useEffect(() => {
		if (amount <= 0) return

		// Create PaymentIntent
		fetch('/api/create-payment-intent', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ amount, currency }),
		})
			.then(res => res.json())
			.then(data => {
				if (data.clientSecret) {
					setClientSecret(data.clientSecret)
				}
			})
			.catch(err => console.error('Failed to create PaymentIntent:', err))
	}, [amount, currency])

	// Don't render until we have clientSecret
	if (!clientSecret) {
		return (
			<div className="border rounded-3xl p-6 text-center text-muted-foreground">
				Initializing payment...
			</div>
		)
	}

	const options: StripeElementsOptions = {
		clientSecret,
		appearance: {
			theme: 'stripe',
			variables: {
				colorPrimary: '#0066cc',
				colorBackground: '#ffffff',
				colorText: '#1a1a1a',
				colorDanger: '#df1b41',
				fontFamily: 'system-ui, sans-serif',
				spacingUnit: '4px',
				borderRadius: '16px',
			},
		},
	}

	return (
		<Elements stripe={stripePromise} options={options}>
			{children}
		</Elements>
	)
}