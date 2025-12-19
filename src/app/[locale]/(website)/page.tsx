// src/app/[locale]/(website)/page.tsx

import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "~/i18n/routing";
import { generateSEOMetadata } from "~/i18n/seo/hreflang";
import type { Metadata } from "next";

import { FeaturedProductSlider } from "~/components/shop/product/FeaturedProductSlider";
import { SocialLinks } from "~/components/social/SocialLinks";
import { SocialGrid } from "~/components/social/SocialGrid";
import { NewsletterForm } from "~/components/cta/email/NewsletterForm";
import { CompaniesLogos } from "~/components/proof/CompaniesLogos";
import { WaveDivider } from "~/components/ui/water/wave-divider";
import { WaveContainer } from "~/components/ui/water/wave-container";

import { HeroSection } from "./_components/HeroSection";
import { ComparisonTable } from "./_components/ComparisonTable";
import { FeaturesLayout } from "./_components/FeaturesLayout";
import { StickyShop } from "~/components/cta/StickyShop";
import { ProductSliderSection } from "./_components/ProductSliderSection";

type Props = {
	params: Promise<{ locale: string }>;
};

// ========================================
// SEO METADATA
// ========================================
export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { locale } = await params;
	const t = await getTranslations({ locale, namespace: 'home' });

	return generateSEOMetadata({
		currentLocale: locale,
		path: '/',
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

export default async function HomePage({ params }: Props) {
	const { locale } = await params;
	setRequestLocale(locale);

	const t = await getTranslations({ locale, namespace: 'home' });

	return (
		<main className="min-h-screen">
			{/* Hero with video background - full viewport */}
			<HeroSection locale={locale} />

			{/* Tagline + Product Slider with Parallax Scrollytelling Effect */}
			<ProductSliderSection
				headline={t('tagline.headline')}
				subheadline={t('tagline.subheadline')}
				backgroundsTitle={t('slider.backgrounds.title')}
				backgroundsSubtitle={t('slider.backgrounds.subtitle')}
				backgroundsHref={t('slider.backgrounds.href')}
				backgroundsCta={t('slider.backgrounds.cta')}
				decorationsTitle={t('slider.decorations.title')}
				decorationsSubtitle={t('slider.decorations.subtitle')}
				decorationsHref={t('slider.decorations.href')}
				decorationsCta={t('slider.decorations.cta')}
				locale={locale}
			/>

			{/* Features Section with Parallax Annotations */}
			<FeaturesLayout
				headline={t('features.headline')}
				subheadline={t('features.description')}
			/>

			<StickyShop />
			{/* Social Proof - Customer Content */}
			<section className="relative py-24 md:py-36 bg-linear-to-b from-card/80 to-transparent overflow-hidden">
				<WaveDivider position="top" color="currentColor" className="text-background" />

				<div className="px-4 relative z-10 max-w-7xl mx-auto">
					<div className="text-center mx-auto max-w-3xl mb-12 md:mb-16">
						<h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-light tracking-normal mb-4">
							{t('social.headline')}
						</h2>
						<p className="text-xl text-muted-foreground font-display font-light max-w-2xl mx-auto">
							{t('social.subheadline')}
						</p>
					</div>

					<SocialGrid initialLimit={6} showTabs={true} />

					<div className="flex justify-center mt-12">
						<SocialLinks showFollowers={true} />
					</div>
				</div>

				<div className="mt-24 px-4 max-w-7xl mx-auto">
					<div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
						<div className="text-center space-y-2">
							<p className="text-4xl md:text-5xl font-display font-light text-primary">{t('stats.years.number')}</p>
							<p className="text-sm md:text-base text-muted-foreground font-display">{t('stats.years.label')}</p>
						</div>
						<div className="text-center space-y-2">
							<p className="text-4xl md:text-5xl font-display font-light text-primary">{t('stats.shipped.number')}</p>
							<p className="text-sm md:text-base text-muted-foreground font-display">{t('stats.shipped.label')}</p>
						</div>
						<div className="text-center space-y-2">
							<p className="text-4xl md:text-5xl font-display font-light text-primary">{t('stats.designs.number')}</p>
							<p className="text-sm md:text-base text-muted-foreground font-display">{t('stats.designs.label')}</p>
						</div>
						<div className="text-center space-y-2">
							<p className="text-4xl md:text-5xl font-display font-light text-primary">{t('stats.countries.number')}</p>
							<p className="text-sm md:text-base text-muted-foreground font-display">{t('stats.countries.label')}</p>
						</div>
					</div>
				</div>
			</section>

			{/* Calculator and Custom section */}
			<section className="relative">
				<WaveContainer>
					<div className="max-w-7xl mx-auto px-4">
						<div className="text-center mb-16">
							<h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-light tracking-normal mb-4 text-white">
								{t('comparison.headline')}
							</h2>
							<p className="text-lg text-cyan-100/80 font-display font-light max-w-2xl mx-auto">
								{t('comparison.subheadline')}
							</p>
						</div>

						<ComparisonTable />

						{/* Calculator Demo Video */}
						<div className="mt-24 text-center">
							<h3 className="text-2xl md:text-3xl font-display font-light text-white mb-4">
								{t('calculator.headline')}
							</h3>
							<p className="text-base text-cyan-100/70 font-display font-light mb-8 max-w-2xl mx-auto">
								{t('calculator.description')}
							</p>

							<div className="max-w-4xl mx-auto rounded-2xl overflow-hidden border-2 border-cyan-400/30 shadow-2xl">
								<video
									autoPlay
									loop
									muted
									playsInline
									className="w-full h-auto"
									poster="/media/images/calculator-poster.jpg"
								>
									<source src="/media/videos/calculator-screencast-1.7x.mp4" type="video/mp4" />
								</video>
							</div>

							<div className="mt-8">
								<a
									href="/calculator"
									className="inline-flex items-center gap-2 px-8 py-4 bg-cyan-400 hover:bg-cyan-300 text-cyan-950 rounded-full font-display font-medium text-lg transition-all hover:scale-105"
								>
									{t('calculator.cta')}
									<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
									</svg>
								</a>
							</div>
						</div>

						<div className="relative mt-24 pb-12">
							<NewsletterForm />
						</div>
					</div>
				</WaveContainer>
			</section>
		</main>
	);
}