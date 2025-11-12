import type React from "react"
// src/app/[locale]/layout.tsx

import { Nav } from "~/components/navigation/Nav"
import { Footer } from "~/components/navigation/Footer"
import type { Locale } from "~/lib/i18n/dictionaries"

export async function generateStaticParams() {
	return [{ locale: "us" }, { locale: "de" }, { locale: "nl" }]
}

export default async function LocaleLayout({
	children,
	params,
}: {
	children: React.ReactNode
	params: Promise<{ locale: Locale }>
}) {
	const { locale } = await params

	return (
		<>
			<Nav />
			{children}
			<Footer />
		</>
	)
}
