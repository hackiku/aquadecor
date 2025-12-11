// src/app/[locale]/(website)/faq/page.tsx

import { getTranslations } from "next-intl/server";
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

// 2. The Page Component
export default async function FAQPage({ params }: Props) {
	const { locale } = await params;

	// 3. LOGIC: Map URL Locale to DB Region/Locale
	// If URL is /us -> Region: US, DB Language: English
	// If URL is /de -> Region: ROW, DB Language: German
	// If URL is /en -> Region: ROW, DB Language: English

	let region: "US" | "ROW" = "ROW";
	let dbLocale = locale;

	if (locale === "us") {
		region = "US";
		dbLocale = "en"; // US uses English content
	}

	return (
		<FAQClient
			region={region}
			dbLocale={dbLocale}
		/>
	);
}