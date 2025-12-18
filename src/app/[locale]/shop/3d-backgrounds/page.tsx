// src/app/[locale]/shop/3d-backgrounds/page.tsx

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Package, AlertCircle } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { api, HydrateClient } from "~/trpc/server";
import { CategoryGrid } from "~/components/shop/category/CategoryGrid";
import { WaveDivider } from "~/components/ui/water/wave-divider";
import { WaveContainer } from "~/components/ui/water/wave-container";
import { Button } from "~/components/ui/button";
import { generateSEOMetadata } from "~/i18n/seo/hreflang";

export const dynamic = 'force-dynamic';
export const revalidate = 3600;

export async function generateStaticParams() {
	// Even though page is dynamic, this helps Next.js understand structure
	// and can pre-render a "default" version at build time
	return [{}]; // Empty object = generate this route once
}


type Props = {
	params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props) {
	const { locale } = await params;
	const t = await getTranslations({ locale, namespace: 'shop' });

	return generateSEOMetadata({
		currentLocale: locale,
		path: '/shop/3d-backgrounds', // Canonical path (no locale)
		title: t('metadata.backgrounds.title'),
		description: t('metadata.backgrounds.description'),
		image: '/media/images/3d-backgrounds_500px.webp', // Automatically adds to OpenGraph & Twitter
		type: 'website',
	});
};

export default async function BackgroundsPage({ params }: Props) {
	const { locale } = await params;
	setRequestLocale(locale);

	const t = await getTranslations('shop');
	const dbLocale = locale === 'us' ? 'en' : locale;

	// Load categories
	let categories: Awaited<ReturnType<typeof api.product.getCategoriesForProductLine>> = [];
	let error = false;

	try {
		categories = await api.product.getCategoriesForProductLine({
			productLineSlug: "3d-backgrounds",
			locale: dbLocale,
		});
	} catch (err) {
		console.error('Failed to load categories:', err);
		error = true;
	}

	return (
		<HydrateClient>
			<main className="min-h-screen">
				{/* Hero Section */}
				<section className="relative overflow-hidden bg-black">
					<div className="relative h-[500px] md:h-[500px]">
						<Image
							src="/media/images/3d-backgrounds_500px.webp"
							alt="3D Aquarium Backgrounds"
							fill
							className="object-cover"
							priority
						/>
						<div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/60 to-black/30" />

						<div className="absolute inset-0 flex items-end">
							<div className="px-4 pb-16 md:pb-20 max-w-7xl mx-auto w-full">
								<div className="max-w-3xl space-y-6">
									<div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/20 backdrop-blur-sm rounded-full border border-primary/30">
										<Package className="h-4 w-4 text-primary" />
										<span className="text-sm text-primary font-display font-medium">
											{t('hero.backgrounds.badge')}
										</span>
									</div>
									<h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-extralight text-white tracking-tight">
										{t('hero.backgrounds.title')}
									</h1>
									<p className="text-lg md:text-xl text-white/90 font-display font-light leading-relaxed max-w-2xl">
										{t('hero.backgrounds.subtitle')}
									</p>
									<div className="flex flex-wrap gap-3">
										<Link
											href="#categories"
											className="inline-flex text-white items-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 rounded-full font-display font-medium transition-all hover:scale-105"
										>
											{t('hero.backgrounds.ctaPrimary')}
											<ArrowRight className="h-4 w-4" />
										</Link>
										<Link
											href="/shop/aquarium-decorations"
											className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white rounded-full font-display font-medium transition-colors border border-white/20"
										>
											{t('hero.backgrounds.ctaSecondary')}
										</Link>
									</div>
								</div>
							</div>
						</div>
					</div>
				</section>

				{/* Categories Section */}
				<section id="categories" className="relative md:pt-6 pb-24 bg-linear-to-b from-muted/30 to-background">
					<WaveDivider position="top" color="black" />
					<div className="px-4 max-w-7xl mx-auto">
						{error ? (
							<div className="py-16 text-center space-y-4">
								<AlertCircle className="h-12 w-12 text-muted-foreground/50 mx-auto" />
								<div className="space-y-2">
									<p className="text-lg font-display font-normal">
										{t('error.loadFailed')}
									</p>
									<p className="text-muted-foreground font-display font-light">
										{t('error.tryAgain')}
									</p>
								</div>
							</div>
						) : categories.length === 0 ? (
							<div className="py-16 text-center">
								<p className="text-muted-foreground font-display font-light">
									{t('productGrid.noProducts')}
								</p>
							</div>
						) : (
							<CategoryGrid
								categories={categories}
								productLineSlug="3d-backgrounds"
								initialColumns="3"
							/>
						)}
					</div>
				</section>

				{/* Mix & Match CTA */}
				<div className="relative -mb-16 py-12 z-20 bg-transparent __rotate-180">
					<WaveDivider position="bottom" color="black" />
				</div>

				<WaveContainer className="relative mt-16 py-12">
					<div className="max-w-7xl mx-auto px-4 pt-32 pb-24">
						<div className="text-center space-y-8 mb-12">
							<div className="max-w-2xl mx-auto space-y-4">
								<h2 className="text-3xl md:text-4xl font-display font-light text-white">
									{t('sections.mixAndMatch')}
								</h2>
								<p className="text-lg text-cyan-100/80 font-display font-light">
									Create a complete ecosystem by combining backgrounds with our decorations for a truly immersive aquascape
								</p>
							</div>

							<Button
								asChild
								size="lg"
								className="bg-white hover:bg-white/90 text-cyan-900 rounded-full font-display font-medium text-base px-8 py-6"
							>
								<Link href="/shop/aquarium-decorations" className="inline-flex items-center gap-2">
									{t('ctas.exploreDecorations')}
									<ArrowRight className="h-4 w-4" />
								</Link>
							</Button>
						</div>

						{/* Trust signals */}
						<div className="flex flex-wrap items-center justify-center gap-8 text-sm font-display font-light text-white/90 pt-8 border-white/10">
							<div className="flex items-center gap-2">
								<span className="text-cyan-300 text-lg">✓</span>
								<span>{t('trustSignals.freeShipping')}</span>
							</div>
							<div className="flex items-center gap-2">
								<span className="text-cyan-300 text-lg">✓</span>
								<span>{t('trustSignals.inStock')}</span>
							</div>
							<div className="flex items-center gap-2">
								<span className="text-cyan-300 text-lg">✓</span>
								<span>{t('trustSignals.lifetimeWarranty')}</span>
							</div>
						</div>
					</div>
				</WaveContainer>
			</main>
		</HydrateClient>
	);
}