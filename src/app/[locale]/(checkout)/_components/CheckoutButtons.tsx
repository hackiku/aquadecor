// src/app/[locale]/(checkout)/_components/CheckoutButtons.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CreditCard } from 'lucide-react'
import { Button } from '~/components/ui/button'
import { useCheckout } from '~/app/_context/CheckoutContext'
import { createOrder } from '~/app/actions/checkout/create-order'
import { createStripePayment } from '~/app/actions/checkout/create-stripe-payment'
import { createPayPalPayment } from '~/app/actions/checkout/create-paypal-payment'
import { useElements, useStripe, PaymentElement } from '@stripe/react-stripe-js'
import { useTranslations } from 'next-intl'

export function CheckoutButtons() {
	const t = useTranslations('checkout.payment')
	const router = useRouter()
	const stripe = useStripe()
	const elements = useElements()
	const { cartItems, shippingAddress, discountCode } = useCheckout()
	const [isProcessing, setIsProcessing] = useState(false)
	const [error, setError] = useState<string | null>(null)

	const isDisabled = cartItems.length === 0 || !shippingAddress

	const handleStripeCheckout = async (e: React.FormEvent) => {
		e.preventDefault()

		if (!stripe || !elements || isDisabled) return

		setIsProcessing(true)
		setError(null)

		try {
			// 1. Create order in DB
			const orderResult = await createOrder({
				cartItems: cartItems.map(item => ({
					productId: item.productId,
					quantity: item.quantity,
					selectedOptions: item.selectedOptions,
				})),
				shippingAddress: {
					firstName: shippingAddress.firstName,
					lastName: shippingAddress.lastName,
					email: shippingAddress.email,
					phone: shippingAddress.phone,
					address1: shippingAddress.address1,
					address2: shippingAddress.address2,
					city: shippingAddress.city,
					state: shippingAddress.state,
					postalCode: shippingAddress.postalCode,
					countryCode: shippingAddress.countryCode,
				},
				discountCode: discountCode || undefined,
				locale: 'en', // TODO: Get from useLocale()
			})

			if (!orderResult.success) {
				setError(orderResult.error || t('errors.createOrder'))
				setIsProcessing(false)
				return
			}

			// 2. Create Stripe PaymentIntent
			const paymentResult = await createStripePayment({
				orderId: orderResult.orderId!,
				locale: 'en',
			})

			if (!paymentResult.success) {
				setError(paymentResult.error || t('errors.initPayment'))
				setIsProcessing(false)
				return
			}

			// 3. Confirm payment with Stripe Elements
			const { error: stripeError } = await stripe.confirmPayment({
				elements,
				confirmParams: {
					return_url: `${window.location.origin}/success?orderId=${orderResult.orderId}`,
				},
			})

			if (stripeError) {
				setError(stripeError.message || t('errors.paymentFailed'))
				setIsProcessing(false)
			}

			// Note: If successful, Stripe redirects automatically

		} catch (err) {
			console.error('Stripe checkout error:', err)
			setError(t('errors.unexpected'))
			setIsProcessing(false)
		}
	}

	const handlePayPalCheckout = async () => {
		if (isDisabled) return

		setIsProcessing(true)
		setError(null)

		try {
			// 1. Create order in DB
			const orderResult = await createOrder({
				cartItems: cartItems.map(item => ({
					productId: item.productId,
					quantity: item.quantity,
					selectedOptions: item.selectedOptions,
				})),
				shippingAddress: {
					firstName: shippingAddress.firstName,
					lastName: shippingAddress.lastName,
					email: shippingAddress.email,
					phone: shippingAddress.phone,
					address1: shippingAddress.address1,
					address2: shippingAddress.address2,
					city: shippingAddress.city,
					state: shippingAddress.state,
					postalCode: shippingAddress.postalCode,
					countryCode: shippingAddress.countryCode,
				},
				discountCode: discountCode || undefined,
				locale: 'en',
			})

			if (!orderResult.success) {
				setError(orderResult.error || t('errors.createOrder'))
				setIsProcessing(false)
				return
			}

			// 2. Create PayPal payment
			const paypalResult = await createPayPalPayment({
				orderId: orderResult.orderId!,
			})

			if (!paypalResult.success || !paypalResult.approvalUrl) {
				setError(paypalResult.error || t('errors.initPayment'))
				setIsProcessing(false)
				return
			}

			// 3. Redirect to PayPal for approval
			window.location.href = paypalResult.approvalUrl

		} catch (err) {
			console.error('PayPal checkout error:', err)
			setError(t('errors.unexpected'))
			setIsProcessing(false)
		}
	}

	return (
		<div className="border rounded-3xl p-6 space-y-4">
			<form onSubmit={handleStripeCheckout} className="space-y-4">
				{/* Stripe Payment Element */}
				<PaymentElement />

				{/* Stripe Button */}
				<Button
					type="submit"
					disabled={isDisabled || isProcessing || !stripe || !elements}
					className="w-full rounded-full px-9 py-6 text-base"
					size="lg"
				>
					{isProcessing ? (
						<span className="animate-pulse">{t('processing')}</span>
					) : (
						<>
							<CreditCard className="w-4 mr-2" />
							{t('stripe')}
						</>
					)}
				</Button>
			</form>

			{/* Error Message */}
			{error && (
				<p className="text-red-500 text-center text-sm">
					{error}
				</p>
			)}

			{isDisabled && !error && (
				<p className="text-red-500 text-center text-sm">
					{t('errors.invalidAddress')}
				</p>
			)}

			{/* Divider */}
			<div className="relative">
				<div className="absolute inset-0 flex items-center">
					<span className="w-full border-t" />
				</div>
				<div className="relative flex justify-center text-xs uppercase">
					<span className="bg-background px-2 text-muted-foreground">
						{t('orPayWith')}
					</span>
				</div>
			</div>

			{/* PayPal Button */}
			<button
				onClick={handlePayPalCheckout}
				disabled={isDisabled || isProcessing}
				className={`w-full bg-[#FFC439] hover:bg-[#FFD166] disabled:opacity-50 rounded-full h-[52px] flex items-center justify-center font-semibold text-[#003087] transition-colors ${isDisabled ? 'opacity-40 pointer-events-none' : ''
					}`}
			>
				{isProcessing ? t('processing') : t('paypal')}
			</button>
		</div>
	)
}