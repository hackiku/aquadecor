// src/app/[locale]/(checkout)/payment/page.tsx
import { setRequestLocale } from 'next-intl/server'
import { routing } from '~/i18n/routing'
import { PaymentMethods } from '../_components/PaymentMethods'

type Props = {
	params: Promise<{ locale: string }>
}

export function generateStaticParams() {
	return routing.locales.map((locale) => ({ locale }))
}

export default async function PaymentPage({ params }: Props) {
	const { locale } = await params
	setRequestLocale(locale)

	return (
		<div className="max-w-5xl mx-auto">
			{/* Header */}
			<div className="mb-8">
				<h1 className="text-3xl md:text-4xl font-display font-light tracking-tight mb-2">
					Payment
				</h1>
				<p className="text-muted-foreground font-display font-light">
					Choose your payment method
				</p>
			</div>

			{/* Payment Options */}
			<PaymentMethods />
		</div>
	)
}