// src/app/[locale]/shop/aquarium-decorations/page.tsx

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Package, AlertCircle } from "lucide-react";
import { api, HydrateClient } from "~/trpc/server";
import { CategoryGrid } from "~/components/shop/category/CategoryGrid";
import { WaveDivider } from "~/components/ui/water/wave-divider";
import { WaveContainer } from "~/components/ui/water/wave-container";
import { Button } from "~/components/ui/button";

export default async function AquariumDecorationsPage() {
	// Load categories for aquarium decorations
	let categories: Awaited<ReturnType<typeof api.product.getCategoriesForProductLine>> = [];
	let error = false;

	try {
		categories = await api.product.getCategoriesForProductLine({
			productLineSlug: "aquarium-decorations",
			locale: "en",
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
						<div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/60 to-black/30" />

						<div className="absolute inset-0 flex items-end">
							<div className="px-4 pb-16 md:pb-20 max-w-7xl mx-auto w-full">
								<div className="max-w-3xl space-y-6">
									<div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/20 backdrop-blur-sm rounded-full border border-primary/30">
										<Package className="h-4 w-4 text-primary" />
										<span className="text-sm text-primary font-display font-medium">
											Complete Your Aquascape
										</span>
									</div>
									<h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-extralight text-white tracking-tight">
										Aquarium Decorations
									</h1>
									<p className="text-lg md:text-xl text-white/90 font-display font-light leading-relaxed max-w-2xl">
										Realistic plants, rocks, driftwood, and accessories crafted from neutral materials for unlimited lifespan and zero water chemistry impact.
									</p>
									<div className="flex flex-wrap gap-3">
										<Link
											href="#categories"
											className="inline-flex text-white items-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 rounded-full font-display font-medium transition-all hover:scale-105"
										>
											Browse Collection
											<ArrowRight className="h-4 w-4" />
										</Link>
										<Link
											href="/shop/3d-backgrounds"
											className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white rounded-full font-display font-medium transition-colors border border-white/20"
										>
											View 3D Backgrounds
										</Link>
									</div>
								</div>
							</div>
						</div>
					</div>
				</section>

				{/* Categories Slider - Double Row */}
				<section id="categories" className="relative md:pt-6 pb-24 bg-linear-to-b from-muted/30 to-background">
					<WaveDivider position="top" color="black" className="" />
					<div className="px-4 max-w-7xl mx-auto">
						{/* <div className="mb-12">
							<h2 className="text-3xl md:text-4xl font-display font-light mb-4">
								Browse by Category
							</h2>
							<p className="text-lg text-muted-foreground font-display font-light">
								Select from our full range of aquarium decorations and accessories
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
								productLineSlug="aquarium-decorations"
								initialColumns="3"
							/>
						)}
					</div>
				</section>

				<div className="relative -mb-16 py-12 z-20 bg-transparent __rotate-180">
					<WaveDivider position="bottom" color="black" className="" />
				</div>

				{/* Safe for All Species - Enhanced with gradient background */}
				<section className="relative py-16 md:py-20 overflow-hidden">
					{/* Gradient orb background */}
					<div className="absolute inset-0 bg-linear-to-br from-cyan-500/5 via-blue-500/5 to-transparent" />
					<div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
					<div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />

					<div className="px-4 max-w-7xl mx-auto relative z-10">
						<div className="grid md:grid-cols-2 gap-12 items-center">
							<div className="relative aspect-square rounded-2xl overflow-hidden order-2 md:order-1 shadow-2xl">
								<Image
									src="/media/images/additional-items_500px.webp"
									alt="Neutral Materials"
									fill
									className="object-cover"
								/>
							</div>
							<div className="space-y-6 order-1 md:order-2">
								<h2 className="text-3xl md:text-4xl font-display font-light">
									Safe for All Species
								</h2>
								<div className="space-y-4">
									<div className="flex items-start gap-3">
										<span className="text-primary text-lg">✓</span>
										<div>
											<p className="font-display font-medium">Neutral Water Chemistry</p>
											<p className="text-sm text-muted-foreground font-display font-light">
												Won't affect pH, hardness, or release tannins into your water
											</p>
										</div>
									</div>
									<div className="flex items-start gap-3">
										<span className="text-primary text-lg">✓</span>
										<div>
											<p className="font-display font-medium">Fish-Safe Materials</p>
											<p className="text-sm text-muted-foreground font-display font-light">
												Non-toxic, won't be picked at or damaged by aggressive species
											</p>
										</div>
									</div>
									<div className="flex items-start gap-3">
										<span className="text-primary text-lg">✓</span>
										<div>
											<p className="font-display font-medium">Easy to Clean</p>
											<p className="text-sm text-muted-foreground font-display font-light">
												Algae scrubs off easily - safe to use plastic brushes
											</p>
										</div>
									</div>
									<div className="flex items-start gap-3">
										<span className="text-primary text-lg">✓</span>
										<div>
											<p className="font-display font-medium">Unlimited Lifespan</p>
											<p className="text-sm text-muted-foreground font-display font-light">
												Unlike natural materials, these never decay, rot, or need replacement
											</p>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</section>

				{/* Mix & Match CTA with Wave Container */}
				<WaveContainer className="relative mt-16 py-12">
					<div className="max-w-7xl mx-auto px-4 pt-32 pb-24">
						<div className="text-center space-y-8 mb-12">
							<div className="max-w-2xl mx-auto space-y-4">
								<h2 className="text-3xl md:text-4xl font-display font-light text-white">
									Pair with our legendary 3D Backgrounds
								</h2>
								<p className="text-lg text-cyan-100/80 font-display font-light">
									Create a complete ecosystem by combining decorations with our custom 3D backgrounds for a truly immersive aquascape
								</p>
							</div>

							<Button
								asChild
								size="lg"
								className="bg-white hover:bg-white/90 text-cyan-900 rounded-full font-display font-medium text-base px-8 py-6"
							>
								<Link href="/shop/3d-backgrounds" className="inline-flex items-center gap-2">
									Explore 3D Backgrounds
									<ArrowRight className="h-4 w-4" />
								</Link>
							</Button>
						</div>

						{/* Trust signals inside wave */}
						<div className="flex flex-wrap items-center justify-center gap-8 text-sm font-display font-light text-white/90 pt-8 border-white/10">
							<div className="flex items-center gap-2">
								<span className="text-cyan-300 text-lg">✓</span>
								<span>Free Worldwide Shipping</span>
							</div>
							<div className="flex items-center gap-2">
								<span className="text-cyan-300 text-lg">✓</span>
								<span>In Stock & Ready to Ship</span>
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