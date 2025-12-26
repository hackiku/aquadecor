// src/components/shop/checkout/PaymentMethods.tsx
'use client'

import { useState } from 'react'
import { CreditCard, Wallet, Building } from 'lucide-react'
import { Button } from '~/components/ui/button'
import { useCheckout } from './CheckoutContext'
import { cn } from '~/lib/utils'

type PaymentMethod = 'card' | 'paypal' | 'bank'

export function PaymentMethods() {
	const { shippingAddress, subtotal, total } = useCheckout()
	const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('card')

	// TODO: Initialize order with Server Action
	// TODO: Create Stripe PaymentIntent
	// TODO: Render Stripe Elements

	return (
		<div className="grid lg:grid-cols-3 gap-8">
			{/* Payment Method Selection */}
			<div className="lg:col-span-2 space-y-6">
				{/* Method Selector */}
				<div className="bg-card rounded-2xl border p-6 space-y-4">
					<h2 className="text-lg font-display font-medium mb-4">Select Payment Method</h2>

					<div className="grid gap-3">
						{/* Card Payment */}
						<button
							onClick={() => setSelectedMethod('card')}
							className={cn(
								'flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left',
								selectedMethod === 'card'
									? 'border-primary bg-primary/5'
									: 'border-border hover:border-primary/50'
							)}
						>
							<div className={cn(
								'w-12 h-12 rounded-full flex items-center justify-center',
								selectedMethod === 'card' ? 'bg-primary text-white' : 'bg-muted'
							)}>
								<CreditCard className="h-5 w-5" />
							</div>
							<div className="flex-1">
								<p className="font-display font-medium">Credit / Debit Card</p>
								<p className="text-sm text-muted-foreground font-display font-light">
									Visa, Mastercard, Amex
								</p>
							</div>
						</button>

						{/* PayPal */}
						<button
							onClick={() => setSelectedMethod('paypal')}
							className={cn(
								'flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left',
								selectedMethod === 'paypal'
									? 'border-primary bg-primary/5'
									: 'border-border hover:border-primary/50'
							)}
						>
							<div className={cn(
								'w-12 h-12 rounded-full flex items-center justify-center',
								selectedMethod === 'paypal' ? 'bg-primary text-white' : 'bg-muted'
							)}>
								<Wallet className="h-5 w-5" />
							</div>
							<div className="flex-1">
								<p className="font-display font-medium">PayPal</p>
								<p className="text-sm text-muted-foreground font-display font-light">
									Fast & secure checkout
								</p>
							</div>
						</button>

						{/* Bank Transfer */}
						<button
							onClick={() => setSelectedMethod('bank')}
							className={cn(
								'flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left',
								selectedMethod === 'bank'
									? 'border-primary bg-primary/5'
									: 'border-border hover:border-primary/50'
							)}
						>
							<div className={cn(
								'w-12 h-12 rounded-full flex items-center justify-center',
								selectedMethod === 'bank' ? 'bg-primary text-white' : 'bg-muted'
							)}>
								<Building className="h-5 w-5" />
							</div>
							<div className="flex-1">
								<p className="font-display font-medium">Bank Transfer</p>
								<p className="text-sm text-muted-foreground font-display font-light">
									For large orders (manual processing)
								</p>
							</div>
						</button>
					</div>
				</div>

				{/* Payment Form Placeholder */}
				<div className="bg-card rounded-2xl border p-6">
					{selectedMethod === 'card' && (
						<div className="space-y-4">
							<h3 className="text-lg font-display font-medium mb-4">Card Details</h3>

							{/* TODO: Integrate Stripe Elements here */}
							<div className="bg-muted/30 rounded-xl p-8 text-center border-2 border-dashed">
								<CreditCard className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
								<p className="text-muted-foreground font-display font-light">
									Stripe Elements will be rendered here
								</p>
								<p className="text-sm text-muted-foreground/70 font-display font-light mt-2">
									Secure payment processing via Stripe
								</p>
							</div>

							<Button className="w-full rounded-full" size="lg" disabled>
								Complete Order • €{(total / 100).toFixed(2)}
							</Button>
						</div>
					)}

					{selectedMethod === 'paypal' && (
						<div className="space-y-4">
							<h3 className="text-lg font-display font-medium mb-4">PayPal Checkout</h3>

							{/* TODO: Integrate PayPal Buttons here */}
							<div className="bg-muted/30 rounded-xl p-8 text-center border-2 border-dashed">
								<Wallet className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
								<p className="text-muted-foreground font-display font-light">
									PayPal buttons will be rendered here
								</p>
								<p className="text-sm text-muted-foreground/70 font-display font-light mt-2">
									You'll be redirected to PayPal for secure checkout
								</p>
							</div>
						</div>
					)}

					{selectedMethod === 'bank' && (
						<div className="space-y-4">
							<h3 className="text-lg font-display font-medium mb-4">Bank Transfer Details</h3>

							<div className="bg-muted/30 rounded-xl p-6 space-y-3">
								<p className="text-sm font-display font-light">
									After placing your order, we'll email you bank transfer details.
								</p>
								<p className="text-sm font-display font-light">
									Production starts after payment confirmation (2-3 business days).
								</p>
							</div>

							<Button className="w-full rounded-full" size="lg">
								Place Order
							</Button>
						</div>
					)}
				</div>

				{/* Security Badge */}
				<div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
					<div className="flex items-center gap-2">
						<svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
						</svg>
						<span className="font-display font-light">SSL Encrypted</span>
					</div>
					<div className="h-4 w-px bg-border" />
					<span className="font-display font-light">PCI Compliant</span>
				</div>
			</div>

			{/* Order Summary Sidebar */}
			<div className="lg:col-span-1">
				<div className="bg-card rounded-2xl border p-6 space-y-6 sticky top-24">
					<h2 className="text-xl font-display font-medium">Order Summary</h2>

					<div className="space-y-3">
						<div className="flex justify-between text-sm">
							<span className="text-muted-foreground font-display">Subtotal</span>
							<span className="font-display font-medium">€{(subtotal / 100).toFixed(2)}</span>
						</div>
						<div className="flex justify-between text-sm">
							<span className="text-muted-foreground font-display">Shipping</span>
							<span className="font-display font-medium text-primary">Free</span>
						</div>
					</div>

					<div className="h-px bg-border" />

					<div className="flex justify-between items-baseline">
						<span className="text-lg font-display font-medium">Total</span>
						<span className="text-2xl font-display font-semibold">€{(total / 100).toFixed(2)}</span>
					</div>

					{/* Shipping Address */}
					{shippingAddress && (
						<>
							<div className="h-px bg-border" />
							<div className="space-y-2">
								<p className="text-sm font-display font-medium">Shipping to:</p>
								<div className="text-sm text-muted-foreground font-display font-light space-y-1">
									<p>{shippingAddress.firstName} {shippingAddress.lastName}</p>
									<p>{shippingAddress.address1}</p>
									{shippingAddress.address2 && <p>{shippingAddress.address2}</p>}
									<p>{shippingAddress.city}, {shippingAddress.postalCode}</p>
									<p>{shippingAddress.countryCode}</p>
								</div>
							</div>
						</>
					)}
				</div>
			</div>
		</div>
	)
}