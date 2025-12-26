// src/app/[locale]/(checkout)/cart/page.tsx
import { setRequestLocale } from 'next-intl/server'
import { routing } from '~/i18n/routing'
import { CartReview } from '../_components/CartReview'

type Props = {
	params: Promise<{ locale: string }>
}

export function generateStaticParams() {
	return routing.locales.map((locale) => ({ locale }))
}

export default async function CartPage({ params }: Props) {
	const { locale } = await params
	setRequestLocale(locale)

	return (
		<div className="max-w-5xl mx-auto">
			{/* Header */}
			<div className="mb-8">
				<h1 className="text-3xl md:text-4xl font-display font-light tracking-tight mb-2">
					Shopping Cart
				</h1>
				<p className="text-muted-foreground font-display font-light">
					Review your items before checkout
				</p>
			</div>

			{/* Cart Content */}
			<CartReview />
		</div>
	)
}