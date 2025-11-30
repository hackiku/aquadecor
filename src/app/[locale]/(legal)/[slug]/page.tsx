// src/app/[locale]/(legal)/[slug]/page.tsx

import { notFound } from "next/navigation";
import { type Locale } from "~/lib/i18n/dictionaries";
import { legalTranslations } from "~/lib/i18n/legal";
import type { Metadata } from "next";

import { TermsOfService } from "../_components/TermsOfService";
import { PrivacyPolicy } from "../_components/PrivacyPolicy";
import { ShippingPolicy } from "../_components/ShippingPolicy";
import { RefundPolicy } from "../_components/RefundPolicy";

const policies = {
	"terms": TermsOfService,
	"privacy": PrivacyPolicy,
	"shipping": ShippingPolicy,
	"refund": RefundPolicy,
};

// Map slug to dictionary key
const metaKeys = {
	"terms": "terms",
	"privacy": "privacy",
	"shipping": "shipping",
	"refund": "refund",
} as const;

export async function generateMetadata({
	params,
}: {
	params: Promise<{ locale: Locale; slug: string }>;
}): Promise<Metadata> {
	const { locale, slug } = await params;
	const t = legalTranslations[locale] || legalTranslations.us;

	const key = metaKeys[slug as keyof typeof metaKeys];
	if (!key) return {};

	return {
		title: t.meta[key].title,
		description: t.meta[key].desc,
		alternates: {
			canonical: `https://aquadecorbackgrounds.com/${locale}/${slug}`
		}
	};
}

export function generateStaticParams() {
	return Object.keys(policies).map((slug) => ({ slug }));
}

export default async function LegalPage({
	params,
}: {
	params: Promise<{ locale: Locale; slug: string }>;
}) {
	const { locale, slug } = await params;

	const PolicyComponent = policies[slug as keyof typeof policies];

	if (!PolicyComponent) {
		return notFound();
	}

	return <PolicyComponent locale={locale} />;
}