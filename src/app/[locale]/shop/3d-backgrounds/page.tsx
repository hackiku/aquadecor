// src/app/[locale]/shop/3d-backgrounds/page.tsx

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Package, AlertCircle } from "lucide-react";
import { api, HydrateClient } from "~/trpc/server";
import { CategoryGrid } from "~/components/shop/category/CategoryGrid";
import { WaveDivider } from "~/components/ui/water/wave-divider";
import { WaveContainer } from "~/components/ui/water/wave-container";
import { Button } from "~/components/ui/button";

export default async function ThreeDBackgroundsPage() {
	// Load categories with error handling
	let categories: Awaited<ReturnType<typeof api.product.getCategoriesForProductLine>> = [];
	let error = false;

	try {
		categories = await api.product.getCategoriesForProductLine({
			productLineSlug: "3d-backgrounds",
			locale: "en",
		});
	} catch (err) {
		console.error('Failed to load categories:', err);
		error = true;
	}

	return (
		<HydrateClient>
			<main className="min-h-screen">
				{/* Hero Section - ALWAYS LOADS (no DB) */}
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
											Handcrafted Since 2004
										</span>
									</div>
									<h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-extralight text-white tracking-tight">
										3D Aquarium Backgrounds
									</h1>
									<p className="text-lg md:text-xl text-white/90 font-display font-light leading-relaxed max-w-2xl">
										Transform your aquarium with custom-made 3D backgrounds so realistic that even experts can't tell the difference from natural rock formations.
									</p>
									<div className="flex flex-wrap gap-3">
										<Link
											href="/calculator"
											className="inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full font-display font-medium transition-all hover:scale-105"
										>
											Get Custom Quote
											<ArrowRight className="h-4 w-4" />
										</Link>
										<Link
											href="#categories"
											className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white rounded-full font-display font-medium transition-colors border border-white/20"
										>
											Browse Models
										</Link>
									</div>
								</div>
							</div>
						</div>
					</div>
				</section>

				{/* Categories Grid - Only part that needs DB */}
				<section id="categories" className="relative md:pt-10 pb-24 bg-linear-to-b from-muted/30 to-background">
					<WaveDivider position="top" color="black" className="" />
					<div className="px-4 max-w-7xl mx-auto">
						{/* <div className="mb-12">
							<h2 className="text-3xl md:text-4xl font-display font-light mb-4">
								Choose Your Style
							</h2>
							<p className="text-lg text-muted-foreground font-display font-light">
								From classic rocky terrains to slim profiles for rimless tanks
							</p>
						</div> */}

						{/* Error State */}
						{error ? (
							<div className="py-16 text-center space-y-4">
								<AlertCircle className="h-12 w-12 text-muted-foreground/50 mx-auto" />
								<div className="space-y-2">
									<p className="text-lg font-display font-normal">
										Unable to load categories
									</p>
									<p className="text-muted-foreground font-display font-light">
										Please try refreshing the page
									</p>
								</div>
							</div>
						) : categories.length === 0 ? (
							<div className="py-16 text-center">
								<p className="text-muted-foreground font-display font-light">
									No categories available yet
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

				{/* Why Choose Us - ALWAYS LOADS (no DB) */}
				<section className="py-16 md:py-24 bg-gradient-to-b from-background to-muted/30">
					<div className="px-4 max-w-7xl mx-auto">
						<div className="text-center mb-12">
							<h2 className="text-3xl md:text-4xl font-display font-light mb-4">
								Why 50,000+ Aquarists Choose Aquadecor
							</h2>
							<p className="text-lg text-muted-foreground font-display font-light max-w-2xl mx-auto">
								Two decades of perfecting the craft of realistic aquarium backgrounds
							</p>
						</div>

						<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
							<div className="text-center space-y-4">
								<div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 border border-primary/20">
									<svg className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
									</svg>
								</div>
								<h3 className="text-xl font-display font-normal">Fully Custom Fit</h3>
								<p className="text-sm text-muted-foreground font-display font-light">
									Built to your exact aquarium dimensions, accounting for bracing systems and overflow boxes
								</p>
							</div>

							<div className="text-center space-y-4">
								<div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 border border-primary/20">
									<svg className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
									</svg>
								</div>
								<h3 className="text-xl font-display font-normal">Lifetime Warranty</h3>
								<p className="text-sm text-muted-foreground font-display font-light">
									Chemical-resistant, heat-proof material that never leaches or affects water chemistry
								</p>
							</div>

							<div className="text-center space-y-4">
								<div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 border border-primary/20">
									<svg className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
									</svg>
								</div>
								<h3 className="text-xl font-display font-normal">Modular Sections</h3>
								<p className="text-sm text-muted-foreground font-display font-light">
									Numbered pieces for easy assembly, perfect for tanks with center braces
								</p>
							</div>

							<div className="text-center space-y-4">
								<div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 border border-primary/20">
									<svg className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
									</svg>
								</div>
								<h3 className="text-xl font-display font-normal">Hidden Equipment</h3>
								<p className="text-sm text-muted-foreground font-display font-light">
									Hollow-back design conceals heaters, pipes, and filtration without restricting flow
								</p>
							</div>
						</div>
					</div>
				</section>

				<div className="relative -mb-16 py-12 z-20 bg-transparent">
					<WaveDivider position="bottom" color="black" className="" />
				</div>

				{/* Built to Last Forever - ALWAYS LOADS (no DB) */}
				<section className="relative py-16 md:py-20 overflow-hidden">
					<div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-cyan-500/5 to-transparent" />
					<div className="absolute top-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
					<div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />

					<div className="px-4 max-w-7xl mx-auto relative z-10">
						<div className="grid md:grid-cols-2 gap-12 items-center">
							<div className="space-y-6 order-2 md:order-1">
								<h2 className="text-3xl md:text-4xl font-display font-light">
									Built to Last Forever
								</h2>
								<div className="space-y-4">
									<div className="flex items-start gap-3">
										<span className="text-primary text-lg">✓</span>
										<div>
											<p className="font-display font-medium">Hydrochloric Acid Resistant</p>
											<p className="text-sm text-muted-foreground font-display font-light">
												Zero limestone content - won't affect pH or hardness
											</p>
										</div>
									</div>
									<div className="flex items-start gap-3">
										<span className="text-primary text-lg">✓</span>
										<div>
											<p className="font-display font-medium">Heat & Flame Proof</p>
											<p className="text-sm text-muted-foreground font-display font-light">
												Safe to disinfect with boiling water
											</p>
										</div>
									</div>
									<div className="flex items-start gap-3">
										<span className="text-primary text-lg">✓</span>
										<div>
											<p className="font-display font-medium">Extreme Load Bearing</p>
											<p className="text-sm text-muted-foreground font-display font-light">
												Tested by driving a 1500kg car over it without damage
											</p>
										</div>
									</div>
									<div className="flex items-start gap-3">
										<span className="text-primary text-lg">✓</span>
										<div>
											<p className="font-display font-medium">Fully Custom Dimensions</p>
											<p className="text-sm text-muted-foreground font-display font-light">
												Made to your exact specifications, including weirs and overflows
											</p>
										</div>
									</div>
								</div>
							</div>
							<div className="relative aspect-square rounded-2xl overflow-hidden order-1 md:order-2 shadow-2xl">
								<Image
									src="/media/images/3d-backgrounds_500px.webp"
									alt="Material Testing"
									fill
									className="object-cover"
								/>
							</div>
						</div>
					</div>
				</section>

				{/* Complete Your Setup CTA - ALWAYS LOADS (no DB) */}
				<WaveContainer className="relative mt-16 py-12">
					<div className="max-w-7xl mx-auto px-4 pt-32 pb-24">
						<div className="text-center space-y-8 mb-12">
							<div className="max-w-2xl mx-auto space-y-4">
								<h2 className="text-3xl md:text-4xl font-display font-light text-white">
									Complete Your Setup with Decorations
								</h2>
								<p className="text-lg text-cyan-100/80 font-display font-light">
									Add realistic plants, rocks, and driftwood to create a truly immersive aquascape that complements your custom background
								</p>
							</div>

							<Button
								asChild
								size="lg"
								className="bg-white hover:bg-white/90 text-cyan-900 rounded-full font-display font-medium text-base px-8 py-6"
							>
								<Link href="/shop/aquarium-decorations" className="inline-flex items-center gap-2">
									Browse Decorations
									<ArrowRight className="h-4 w-4" />
								</Link>
							</Button>
						</div>

						<div className="flex flex-wrap items-center justify-center gap-8 text-sm font-display font-light text-white/90 pt-8 border-white/10">
							<div className="flex items-center gap-2">
								<span className="text-cyan-300 text-lg">✓</span>
								<span>Free Worldwide Shipping</span>
							</div>
							<div className="flex items-center gap-2">
								<span className="text-cyan-300 text-lg">✓</span>
								<span>10-12 Day Production</span>
							</div>
							<div className="flex items-center gap-2">
								<span className="text-cyan-300 text-lg">✓</span>
								<span>Lifetime Warranty</span>
							</div>
						</div>
					</div>
				</WaveContainer>
			</main>
		</HydrateClient>
	);
}