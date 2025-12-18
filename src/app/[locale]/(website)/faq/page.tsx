// src/app/[locale]/(website)/faq/page.tsx

import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "~/i18n/routing";
import { generateSEOMetadata } from "~/i18n/seo/hreflang";
import { generateFAQSchema } from "~/i18n/seo/json-ld";
import { api } from "~/trpc/server";
import { FAQClient } from "./FAQClient";

type Props = {
	params: Promise<{ locale: string }>;
};

// ========================================
// SEO METADATA
// ========================================
export async function generateMetadata({ params }: Props) {
	const { locale } = await params;
	const t = await getTranslations({ locale, namespace: 'faq' });

	return generateSEOMetadata({
		currentLocale: locale,
		path: '/faq',
		title: t('headline'),
		description: t('subHeadline'),
		type: 'website',
	});
}

// ========================================
// STATIC GENERATION
// ========================================
export function generateStaticParams() {
	return routing.locales.map((locale) => ({ locale }));
}

// ========================================
// PAGE COMPONENT
// ========================================
export default async function FAQPage({ params }: Props) {
	const { locale } = await params;

	// Enable static rendering
	setRequestLocale(locale);

	// Map URL Locale to DB Region/Locale
	let region: "US" | "ROW" = "ROW";
	let dbLocale = locale;

	if (locale === "us") {
		region = "US";
		dbLocale = "en"; // US uses English content
	}

	// ========================================
	// FETCH FAQ DATA FOR JSON-LD
	// ========================================
	const faqData = await api.faq.getForPublic({
		locale: dbLocale,
		region: region,
	});

	// Flatten all questions across categories for schema
	const allQuestions = faqData.flatMap(category =>
		category.items.map(item => ({
			question: item.question || '',
			answer: item.answer || ''
		}))
	).filter(q => q.question && q.answer); // Only valid Q&A pairs

	// Generate FAQ Schema
	const faqJsonLd = generateFAQSchema(allQuestions);

	return (
		<>
			{/* Inject FAQ Schema if we have questions */}
			{faqJsonLd && (
				<script
					type="application/ld+json"
					dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
				/>
			)}

			<FAQClient region={region} dbLocale={dbLocale} />
		</>
	);
}