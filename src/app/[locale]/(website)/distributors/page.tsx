// src/app/[locale]/(website)/distributors/page.tsx

import { setRequestLocale, getTranslations } from "next-intl/server";
import { routing } from "~/i18n/routing";
import { generateSEOMetadata } from "~/i18n/seo/hreflang";
import type { Metadata } from "next";
import { DistributorsGrid } from "./DistributorsGrid";
import { AlertTriangle, Info, Mail } from "lucide-react";

type Props = {
	params: Promise<{ locale: string }>;
};

// ========================================
// SEO METADATA
// ========================================
export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { locale } = await params;
	const t = await getTranslations({ locale, namespace: 'distributors' });

	return generateSEOMetadata({
		currentLocale: locale,
		path: '/distributors',
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

export default async function DistributorsPage({ params }: Props) {
	const { locale } = await params;

	// Enable static rendering
	setRequestLocale(locale);

	const t = await getTranslations({ locale, namespace: 'distributors' });

	return (
		<main className="min-h-screen">
			{/* Hero */}
			<section className="relative pt-16 md:pt-24 pb-12 bg-linear-to-b from-muted/50 to-transparent">
				<div className="container px-4 max-w-5xl mx-auto">
					<div className="space-y-6">
						<div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 backdrop-blur-sm rounded-full border border-primary/20">
							<span className="text-sm text-primary font-display font-medium">
								{t('hero.badge')}
							</span>
						</div>
						<h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-extralight tracking-tight">
							{t('hero.title')}
						</h1>
						<p className="text-lg md:text-xl text-muted-foreground font-display font-light max-w-3xl leading-relaxed">
							{t('hero.subtitle')}{" "}
							<a
								href="mailto:support@aquadecorbackgrounds.com"
								className="text-primary hover:underline font-medium inline-flex items-center gap-1"
							>
								support@aquadecorbackgrounds.com
								<Mail className="h-4 w-4" />
							</a>
						</p>
					</div>
				</div>
			</section>

			{/* Alerts */}
			<section className="py-8 bg-accent/5">
				<div className="gap-4 flex flex-col md:flex-row px-4 max-w-5xl mx-auto">
					{/* Scam Warning */}
					<div className="bg-red-500/10 border-2 border-red-500/20 rounded-2xl p-6">
						<div className="flex items-start gap-4">
							<AlertTriangle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
							<div className="space-y-2">
								<h3 className="font-display font-medium text-red-500">
									{t('alerts.scam.title')}
								</h3>
								<p className="text-sm font-display font-light text-muted-foreground leading-relaxed">
									{t('alerts.scam.description')}
								</p>
							</div>
						</div>
					</div>

					{/* Official Notice */}
					<div className="bg-primary/5 border-2 border-primary/20 rounded-2xl p-6">
						<div className="flex items-start gap-4">
							<Info className="h-5 w-5 text-primary shrink-0 mt-0.5" />
							<div className="space-y-2">
								<h3 className="font-display font-medium text-primary">
									{t('alerts.official.title')}
								</h3>
								<p className="text-sm font-display font-light text-muted-foreground leading-relaxed">
									{t('alerts.official.description')}{" "}
									<strong className="text-foreground font-medium">
										www.aquadecorbackgrounds.com
									</strong>{" "}
									{t('alerts.official.and')}
								</p>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Distributors Grid */}
			<section className="py-8 md:py-16">
				<div className="container px-4 max-w-7xl mx-auto">
					<div className="mb-12">
						<h2 className="text-3xl md:text-4xl font-display font-light mb-4">
							{t('grid.title')}
						</h2>
						<p className="text-lg text-muted-foreground font-display font-light">
							{t('grid.subtitle')}
						</p>
					</div>

					<DistributorsGrid />
				</div>
			</section>

			{/* CTA */}
			<section className="py-16 md:py-24 bg-accent/5">
				<div className="container px-4 max-w-4xl mx-auto text-center">
					<div className="space-y-6">
						<h2 className="text-3xl md:text-4xl font-display font-light">
							{t('cta.title')}
						</h2>
						<p className="text-lg text-muted-foreground font-display font-light max-w-2xl mx-auto">
							{t('cta.subtitle')}
						</p>
						<div className="pt-4">
							<a
								href="mailto:support@aquadecorbackgrounds.com?subject=Distributor Inquiry"
								className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-white rounded-full font-display font-medium hover:bg-primary/90 transition-all hover:scale-105"
							>
								{t('cta.button')}
							</a>
						</div>
					</div>
				</div>
			</section>
		</main>
	);
}