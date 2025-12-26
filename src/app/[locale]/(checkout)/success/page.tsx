// src/app/[locale]/(checkout)/success/page.tsx
import { setRequestLocale } from 'next-intl/server'
import { routing } from '~/i18n/routing'
import { OrderConfirmation } from '../_components/OrderConfirmation'

type Props = {
	params: Promise<{ locale: string }>
	searchParams: Promise<{ orderId?: string }>
}

export function generateStaticParams() {
	return routing.locales.map((locale) => ({ locale }))
}

export default async function SuccessPage({ params, searchParams }: Props) {
	const { locale } = await params
	const { orderId } = await searchParams

	setRequestLocale(locale)

	if (!orderId) {
		return (
			<div className="max-w-2xl mx-auto text-center py-24">
				<h1 className="text-3xl font-display font-light mb-4">Order Not Found</h1>
				<p className="text-muted-foreground font-display font-light">
					No order ID was provided. Please check your email for order details.
				</p>
			</div>
		)
	}

	return <OrderConfirmation orderId={orderId} />
}