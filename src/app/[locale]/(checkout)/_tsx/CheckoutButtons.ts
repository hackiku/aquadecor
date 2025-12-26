// src/app/[locale]/(checkout)/_components/CheckoutButtons.tsx
'use client'

import { CreditCard } from 'lucide-react'
import { Button } from '~/components/ui/button'
import { useCheckout } from './CheckoutContext'

export function CheckoutButtons() {
	const { cartItems } = useCheckout()
	const isDisabled = cartItems.length === 0

	const handleStripeCheckout = () => {
		console.log('Stripe checkout clicked')
		// TODO: Create order + Stripe PaymentIntent
	}

	const handlePayPalCheckout = () => {
		console.log('PayPal checkout clicked')
		// TODO: Create PayPal order
	}

	return (
		<div className="border rounded-3xl p-6 space-y-4">
			{/* Stripe Button */}
			<Button
				onClick={handleStripeCheckout}
				disabled={isDisabled}
				className="w-full rounded-full px-9 py-6 text-base"
				size="lg"
			>
				<CreditCard className="w-4 mr-2" />
				Pay with debit card
			</Button>

			{/* Error Message */}
			{isDisabled && (
				<p className="text-red-500 text-center text-sm">
					Please enter valid shipping address to proceed
				</p>
			)}

			{/* PayPal Button */}
			<div className={`relative w-full ${isDisabled ? 'opacity-40 pointer-events-none' : ''}`}>
				<button
					onClick={handlePayPalCheckout}
					disabled={isDisabled}
					className="w-full bg-[#FFC439] hover:bg-[#FFD166] disabled:opacity-50 rounded-full h-[52px] flex items-center justify-center font-semibold text-[#003087] transition-colors"
				>
					PayPal
				</button>
			</div>
		</div>
	)
}