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
	const [clientSecret, setClientSecret] = useState<string | null>(null)

	// For now, we'll create the PaymentIntent when user submits form
	// This is just the wrapper that provides Stripe context

	const options: StripeElementsOptions = {
		mode: 'payment',
		amount,
		currency,
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