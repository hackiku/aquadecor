// src/app/[locale]/(checkout)/checkout/CheckoutPageClient.tsx
'use client'

import { CartSummary } from '../_components/CartSummary'
import { EnterDiscountCode } from '../_components/EnterDiscountCode'
import { ShippingInformation } from '../_components/ShippingInformation'
import { CheckoutButtons } from '../_components/CheckoutButtons'
import { StripeProvider } from '~/app/_context/StripeProvider'
import { useCheckout } from '~/app/_context/CheckoutContext'
import { useTranslations } from 'next-intl'

export function CheckoutPageClient() {
	const t = useTranslations('checkout')
	const { total } = useCheckout()

	return (
		<section className="max-w-7xl mx-auto px-4 py-16 lg:py-20">
			{/* Header */}
			<div className="space-y-4 mb-8">
				<h1 className="text-4xl md:text-6xl font-extralight font-display">
					{t('header.title')}
				</h1>
				<p className="md:text-lg font-display font-light text-base text-muted-foreground">
					{t('header.subtitle')}
				</p>
			</div>

			{/* Two Column Layout */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

				{/* LEFT: Cart Summary + Discount */}
				<div className="space-y-6">
					<CartSummary />
					<EnterDiscountCode />
				</div>

				{/* RIGHT: Shipping + Payment */}
				<div className="space-y-6">
					<ShippingInformation />

					{/* Only render Stripe when we have a valid amount */}
					{total > 0 ? (
						<StripeProvider amount={total} currency="eur">
							<CheckoutButtons />
						</StripeProvider>
					) : (
						<div className="border rounded-3xl p-6 text-center text-muted-foreground">
							{t('payment.loading')}
						</div>
					)}
				</div>
			</div>
		</section>
	)
}