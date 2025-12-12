// src/app/[locale]/(website)/faq/page.tsx

import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "~/i18n/routing";
import { FAQClient } from "./FAQClient";

type Props = {
	params: Promise<{ locale: string }>;
};

// 1. Generate Metadata for SEO
export async function generateMetadata({ params }: Props) {
	const { locale } = await params;
	const t = await getTranslations({ locale, namespace: "faq" });

	return {
		title: t("headline"),
		description: t("subHeadline"),
	};
}

// 2. Generate static params for all locales
export function generateStaticParams() {
	return routing.locales.map((locale) => ({ locale }));
}

// 3. The Page Component
export default async function FAQPage({ params }: Props) {
	const { locale } = await params;

	// Enable static rendering
	setRequestLocale(locale);

	// 4. LOGIC: Map URL Locale to DB Region/Locale
	// If URL is /us -> Region: US, DB Language: English
	// If URL is /de -> Region: ROW, DB Language: German
	// If URL is /en -> Region: ROW, DB Language: English

	let region: "US" | "ROW" = "ROW";
	let dbLocale = locale;

	if (locale === "us") {
		region = "US";
		dbLocale = "en"; // US uses English content
	}

	return <FAQClient region={region} dbLocale={dbLocale} />;
}