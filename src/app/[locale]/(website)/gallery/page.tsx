// src/app/[locale]/(website)/gallery/page.tsx

import { setRequestLocale, getTranslations } from "next-intl/server";
import { routing } from "~/i18n/routing";
import { generateSEOMetadata } from "~/i18n/seo/hreflang";
import type { Metadata } from "next";
import { GalleryClient } from "./GalleryClient";

type Props = {
	params: Promise<{ locale: string }>;
};

// ========================================
// SEO METADATA
// ========================================
export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { locale } = await params;
	const t = await getTranslations({ locale, namespace: 'gallery' });

	return generateSEOMetadata({
		currentLocale: locale,
		path: '/gallery',
		title: t('meta.title'),
		description: t('meta.description'),
		type: 'website',
	});
}

// ========================================
// STATIC GENERATION
// ========================================
export function generateStaticParams() {
	return routing.locales.map((locale) => ({ locale }));
}

// Dynamic - gallery loads images from API
export const dynamic = 'force-dynamic';

export default async function GalleryPage({ params }: Props) {
	const { locale } = await params;

	// Enable static rendering
	setRequestLocale(locale);

	return <GalleryClient />;
}