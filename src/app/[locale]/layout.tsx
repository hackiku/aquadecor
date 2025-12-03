// src/app/[locale]/layout.tsx
import { Nav } from "~/components/navigation/Nav";
import { Footer } from "~/components/navigation/Footer";
import type { Locale } from "~/lib/i18n/dictionaries";

// Generate static params for supported locales
export function generateStaticParams() {
	return [
		{ locale: "us" },
		{ locale: "de" },
		{ locale: "nl" },
	] satisfies { locale: Locale }[];
}

// Layout accepts `params` as Promise<{ locale: string }>
export default async function LocaleLayout({
	children,
	params,
}: {
	children: React.ReactNode;
	params: Promise<{ locale: string }>;
}) {
	const { locale } = await params;

	// Runtime validation: ensure locale is valid
	const validLocales: Locale[] = ["us", "de", "nl"];
	const safeLocale = validLocales.includes(locale as Locale)
		? (locale as Locale)
		: "us"; // fallback

	// Optional: set i18n context here later
	// setRequestLocale(safeLocale);

	return (
		<>
			{/* <Nav /> */}
			{children}
			<Footer />
		</>
	);
}