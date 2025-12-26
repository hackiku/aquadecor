// src/app/[locale]/(checkout)/page.tsx
import { setRequestLocale } from 'next-intl/server'
import { routing } from '~/i18n/routing'
import { CartSummary } from '../_components/CartSummary'
import { EnterDiscountCode } from '../_components/EnterDiscountCode'
import { ShippingInformation } from '../_components/ShippingInformation'
import { CheckoutButtons } from '../_components/CheckoutButtons'

type Props = {
	params: Promise<{ locale: string }>
}

export function generateStaticParams() {
	return routing.locales.map((locale) => ({ locale }))
}

export default async function CheckoutPage({ params }: Props) {
	const { locale } = await params
	setRequestLocale(locale)

	return (
		<section className="max-w-7xl mx-auto px-4 py-16 lg:py-20">
			{/* Header */}
			<div className="space-y-4 mb-8">
				<h1 className="text-4xl md:text-7xl font-extralight font-display">
					Checkout
				</h1>
				<p className="md:text-lg font-display font-light text-base text-muted-foreground">
					Complete your purchase by providing shipping details.
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
					<CheckoutButtons />
				</div>
			</div>
		</section>
	)
}