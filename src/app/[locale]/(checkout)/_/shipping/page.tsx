// src/app/[locale]/(checkout)/shipping/page.tsx
import { setRequestLocale } from 'next-intl/server'
import { routing } from '~/i18n/routing'
import { ShippingForm } from '../_components/ShippingForm'
import { redirect } from 'next/navigation'

type Props = {
	params: Promise<{ locale: string }>
}

export function generateStaticParams() {
	return routing.locales.map((locale) => ({ locale }))
}

export default async function ShippingPage({ params }: Props) {
	const { locale } = await params
	setRequestLocale(locale)

	// TODO: Check if cart has items, redirect if empty
	// const cart = getCartFromCookie()
	// if (!cart || cart.length === 0) redirect('/cart')

	return (
		<div className="max-w-5xl mx-auto">
			{/* Header */}
			<div className="mb-8">
				<h1 className="text-3xl md:text-4xl font-display font-light tracking-tight mb-2">
					Shipping Information
				</h1>
				<p className="text-muted-foreground font-display font-light">
					Enter your delivery address
				</p>
			</div>

			{/* Shipping Form */}
			<ShippingForm />
		</div>
	)
}