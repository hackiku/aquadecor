// src/app/[locale]/(website)/about/page.tsx

import { setRequestLocale, getTranslations } from "next-intl/server";
import { routing } from "~/i18n/routing";
import { generateSEOMetadata } from "~/i18n/seo/hreflang";
import type { Metadata } from "next";
import { HeroSection } from "./_components/HeroSection";
import { StorySection } from "./_components/StorySection";
import { FamilySection } from "./_components/FamilySection";
import { ProcessSection } from "./_components/ProcessSection";
import { GalleryPreview } from "./_components/GalleryPreview";
import { DistributorsPreview } from "./_components/DistributorsPreview";

type Props = {
	params: Promise<{ locale: string }>;
};

// ========================================
// SEO METADATA
// ========================================
export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { locale } = await params;
	const t = await getTranslations({ locale, namespace: 'about' });

	return generateSEOMetadata({
		currentLocale: locale,
		path: '/about',
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

export default async function AboutPage({ params }: Props) {
	const { locale } = await params;
	
	// Enable static rendering
	setRequestLocale(locale);

	return (
		<main className="min-h-screen -mt-16">
			<HeroSection />
			<StorySection />
			<ProcessSection />
			<FamilySection />
			<GalleryPreview />
			<DistributorsPreview />
		</main>
	);
}