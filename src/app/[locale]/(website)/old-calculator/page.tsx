// src/app/[locale]/(website)/calculator/page.tsx
import { setRequestLocale, getTranslations } from "next-intl/server";
import { routing } from "~/i18n/routing";
import { api, HydrateClient } from "~/trpc/server";
import { CalculatorFlow } from "./_components/CalculatorFlow";
import { VeenieKitBadge } from "./_components/VeenieKitBadge";
// seo
import type { Metadata } from "next";
import { generateWebApplicationSchema } from "~/i18n/seo/json-ld";
import { generateSEOMetadata } from "~/i18n/seo/hreflang";

type Props = {
	params: Promise<{ locale: string }>;
};

// ========================================
// SEO METADATA
// ========================================
export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { locale } = await params;
	const t = await getTranslations({ locale, namespace: 'calculator' });

	return generateSEOMetadata({
		currentLocale: locale,
		path: '/calculator',
		title: t('metadata.title'),
		description: t('metadata.description'),
		type: 'website',
	});
}

// ========================================
// STATIC GENERATION
// ========================================
export function generateStaticParams() {
	return routing.locales.map((locale) => ({ locale }));
}

// Dynamic - calculator needs real-time data
export const dynamic = 'force-dynamic';

export default async function CalculatorPage({ params }: Props) {
	const { locale } = await params;

	// Enable static rendering
	setRequestLocale(locale);

	// Get translations
	const t = await getTranslations({ locale, namespace: 'calculator' });

	// Fetch initial model categories server-side
	const dbLocale = locale === 'us' ? 'en' : locale;
	const categories = await api.calculator.getCalculatorModels({ locale: dbLocale });

	// ========================================
	// JSON-LD for WebApplication (Tool/Calculator)
	// ========================================
	const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://aquadecorbackgrounds.com';
	const canonicalUrl = `${baseUrl}/${locale}/calculator`;

	const webAppJsonLd = generateWebApplicationSchema({
		name: t('metadata.title'),
		description: t('metadata.description'),
		url: canonicalUrl,
		features: [
			"Real-time price estimation",
			"Custom dimensions input",
			"3D visualization",
			"Material selection",
			"Instant quote generation"
		]
	});

	return (
		<HydrateClient>
			{/* Inject JSON-LD */}
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppJsonLd) }}
			/>

			<main className="min-h-screen">

				{/* Hero Section */}
				<section className="pt-16 md:pt-24 bg-linear-to-b from-muted/50 via-muted/30 to-transparent">
					<div className="container px-4 max-w-7xl mx-auto text-center space-y-3">
						<span className="inline-block bg-primary/20 px-4 py-2 rounded-full text-primary/90 text-sm font-display font-medium">
							{t('hero.badge')}
						</span>
						<h1 className="mt-6 text-4xl md:text-5xl lg:text-6xl font-display font-extralight tracking-tight">
							{t('hero.title')}
						</h1>
						<p className="text-lg md:text-xl text-muted-foreground font-display font-light max-w-3xl mx-auto leading-relaxed">
							{t('hero.subtitle')}
						</p>
					</div>
				</section>

				{/* Interactive Calculator Flow */}
				<section className="py-12">
					<div className="container px-4 max-w-6xl mx-auto">
						<CalculatorFlow initialCategories={categories} />
					</div>
				</section>

				{/* Trust Signals */}
				<section className="py-16 bg-accent/5 border-y">
					<div className="container px-4 max-w-5xl mx-auto">
						<div className="grid md:grid-cols-3 gap-8 text-center">
							<div className="space-y-2">
								<div className="text-4xl font-display font-light text-primary">
									{t('trustSignals.responseTime.value')}
								</div>
								<p className="text-sm text-muted-foreground font-display">
									{t('trustSignals.responseTime.label')}
								</p>
							</div>
							<div className="space-y-2">
								<div className="text-4xl font-display font-light text-primary">
									{t('trustSignals.experience.value')}
								</div>
								<p className="text-sm text-muted-foreground font-display">
									{t('trustSignals.experience.label')}
								</p>
							</div>
							<div className="space-y-2">
								<div className="text-4xl font-display font-light text-primary">
									{t('trustSignals.handcrafted.value')}
								</div>
								<p className="text-sm text-muted-foreground font-display">
									{t('trustSignals.handcrafted.label')}
								</p>
							</div>
						</div>
					</div>
				</section>

				{/* Veenie Kit Attribution */}
				<section className="py-8 border-t">
					<div className="container px-4 max-w-5xl mx-auto flex justify-center">
						<VeenieKitBadge />
					</div>
				</section>
			</main>
		</HydrateClient>
	);
}