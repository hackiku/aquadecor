// src/app/[locale]/(checkout)/checkout/page.tsx
import { setRequestLocale } from 'next-intl/server'
import { routing } from '~/i18n/routing'
import { CheckoutContainer } from '../_components/CheckoutContainer'

type Props = {
	params: Promise<{ locale: string }>
}

export function generateStaticParams() {
	return routing.locales.map((locale) => ({ locale }))
}

export default async function CheckoutPage({ params }: Props) {
	const { locale } = await params
	setRequestLocale(locale)

	return <CheckoutContainer />
}