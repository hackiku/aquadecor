// src/app/[locale]/shop/aquarium-decorations/page.tsx

import Image from "next/image";
import { ArrowRight, Package, AlertCircle } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { api, HydrateClient } from "~/trpc/server";
import { CategoryGrid } from "~/components/shop/category/CategoryGrid";
import { WaveDivider } from "~/components/ui/water/wave-divider";
import { WaveContainer } from "~/components/ui/water/wave-container";
import { Button } from "~/components/ui/button";
import { generateSEOMetadata } from "~/i18n/seo/hreflang";
import { Link } from '~/i18n/navigation'; // ✅ i18n-aware Link

export const dynamic = 'force-dynamic';
export const revalidate = 3600;

export async function generateStaticParams() {
	return [{}];
}

type Props = {
	params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props) {
	const { locale } = await params;
	const t = await getTranslations({ locale, namespace: 'shop' });

	return generateSEOMetadata({
		currentLocale: locale,
		path: '/shop/aquarium-decorations',
		title: t('metadata.decorations.title'),
		description: t('metadata.decorations.description'),
		image: '/media/images/additional-items_500px.webp',
		type: 'website',
	});
}

export default async function AquariumDecorationsPage({ params }: Props) {
	const { locale } = await params;
	setRequestLocale(locale);

	const t = await getTranslations('shop');
	const dbLocale = locale === 'us' ? 'en' : locale;

	let categories: Awaited<ReturnType<typeof api.product.getCategoriesForProductLine>> = [];
	let error = false;

	try {
		categories = await api.product.getCategoriesForProductLine({
			productLineSlug: "aquarium-decorations",
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
							src="/media/images/additional-items_500px.webp"
							alt="Aquarium Decorations"
							fill
							className="object-cover"
							priority
						/>
						<div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-black/30" />

						<div className="absolute inset-0 flex items-end">
							<div className="px-4 pb-16 md:pb-20 max-w-7xl mx-auto w-full">
								<div className="max-w-3xl space-y-6">
									<div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/20 backdrop-blur-sm rounded-full border border-primary/30">
										<Package className="h-4 w-4 text-primary" />
										<span className="text-sm text-primary font-display font-medium">
											{t('hero.decorations.badge')}
										</span>
									</div>
									<h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-extralight text-white tracking-tight">
										{t('hero.decorations.title')}
									</h1>
									<p className="text-lg md:text-xl text-white/90 font-display font-light leading-relaxed max-w-2xl">
										{t('hero.decorations.subtitle')}
									</p>
									<div className="flex flex-wrap gap-3">
										{/* ✅ Anchor link - stays as regular 'a' */}
										<a
											href="#categories"
											className="inline-flex text-white items-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 rounded-full font-display font-medium transition-all hover:scale-105"
										>
											{t('hero.decorations.ctaPrimary')}
											<ArrowRight className="h-4 w-4" />
										</a>
										{/* ✅ i18n Link - auto handles locale */}
										<Link
											href="/shop/3d-backgrounds"
											className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white rounded-full font-display font-medium transition-colors border border-white/20"
										>
											{t('hero.decorations.ctaSecondary')}
										</Link>
									</div>
								</div>
							</div>
						</div>
					</div>
				</section>

				{/* Categories Section */}
				<section id="categories" className="relative md:pt-6 pb-24 bg-gradient-to-b from-muted/30 to-background">
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
								productLineSlug="aquarium-decorations"
								initialColumns="3"
							/>
						)}
					</div>
				</section>

				{/* <div className="relative -mb-16 py-12 z-20 bg-transparent __rotate-180">
					<WaveDivider position="bottom" color="black" />
				</div> */}

				{/* Safe for All Species */}
				<section className="relative py-16 md:py-20 overflow-hidden">
					<div className="absolute inset-0 bg-linear-to-br from-cyan-500/5 via-blue-500/5 to-transparent" />
					<div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
					<div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />

					<div className="px-4 max-w-7xl mx-auto relative z-10">
						<div className="grid md:grid-cols-2 gap-12 items-center">
							<div className="relative aspect-square overflow-hidden order-2 md:order-1">
								<Image
									src="/media/images/additional-items_500px.webp"
									alt="Neutral Materials"
									fill
									className="object-cover"
								/>
							</div>
							<div className="space-y-6 order-1 md:order-2">
								<h2 className="text-3xl md:text-4xl font-display font-light">
									{t('sections.safeForAllSpecies')}
								</h2>
								<div className="space-y-4">
									<div className="flex items-start gap-3">
										<span className="text-primary text-lg">✓</span>
										<div>
											<p className="font-display font-medium">
												{t('features.neutralChemistry.title')}
											</p>
											<p className="text-sm text-muted-foreground font-display font-light">
												{t('features.neutralChemistry.description')}
											</p>
										</div>
									</div>
									<div className="flex items-start gap-3">
										<span className="text-primary text-lg">✓</span>
										<div>
											<p className="font-display font-medium">
												{t('features.fishSafe.title')}
											</p>
											<p className="text-sm text-muted-foreground font-display font-light">
												{t('features.fishSafe.description')}
											</p>
										</div>
									</div>
									<div className="flex items-start gap-3">
										<span className="text-primary text-lg">✓</span>
										<div>
											<p className="font-display font-medium">
												{t('features.easyClean.title')}
											</p>
											<p className="text-sm text-muted-foreground font-display font-light">
												{t('features.easyClean.description')}
											</p>
										</div>
									</div>
									<div className="flex items-start gap-3">
										<span className="text-primary text-lg">✓</span>
										<div>
											<p className="font-display font-medium">
												{t('features.unlimited.title')}
											</p>
											<p className="text-sm text-muted-foreground font-display font-light">
												{t('features.unlimited.description')}
											</p>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</section>

				{/* Mix & Match CTA */}
				<WaveContainer className="relative -mt-16">
					<div className="max-w-7xl mx-auto px-4 pb-24">
						<div className="text-center space-y-8 mb-12">
							<div className="max-w-2xl mx-auto space-y-4">
								<h2 className="text-3xl md:text-4xl font-display font-light text-white">
									{t('sections.mixAndMatch')}
								</h2>
								{/* <p className="text-lg text-cyan-100/80 font-display font-light">
									Create a complete ecosystem by combining decorations with our custom 3D backgrounds for a truly immersive aquascape
								</p> */}
							</div>

							<Button
								asChild
								size="lg"
								className="bg-white hover:bg-white/90 text-cyan-900 rounded-full font-display font-medium text-base px-8 py-6"
							>
								{/* ✅ i18n Link - auto handles locale */}
								<Link href="/shop/3d-backgrounds" className="inline-flex items-center gap-2">
									{t('ctas.exploreBackgrounds')}
									<ArrowRight className="h-4 w-4" />
								</Link>
							</Button>
						</div>

						{/* Trust signals */}
						{/* <div className="flex flex-wrap items-center justify-center gap-8 text-sm font-display font-light text-white/90 pt-8 border-white/10">
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
						</div> */}
					</div>
				</WaveContainer>
			</main>
		</HydrateClient>
	);
}