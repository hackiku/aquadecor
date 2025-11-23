// src/app/shop/aquarium-decorations/page.tsx

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Package, Leaf, Mountain, Anchor } from "lucide-react";
import { api, HydrateClient } from "~/trpc/server";
import { CategorySlider } from "~/components/shop/category/CategorySlider";

export default async function AquariumDecorationsPage() {
	// Load categories for aquarium decorations
	const categories = await api.product.getCategoriesForProductLine({
		productLineSlug: "aquarium-decorations",
		locale: "en",
	});

	return (
		<HydrateClient>
			<main className="min-h-screen">
				{/* Hero Section */}
				<section className="relative overflow-hidden border-b">
					<div className="relative h-[500px] md:h-[600px]">
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
											className="inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full font-display font-medium transition-all hover:scale-105"
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

				{/* Product Categories Overview */}
				<section className="py-16 md:py-24 border-b bg-gradient-to-b from-muted/30 to-transparent">
					<div className="px-4 max-w-7xl mx-auto">
						<div className="text-center mb-12">
							<h2 className="text-3xl md:text-4xl font-display font-light mb-4">
								Everything You Need for a Natural Look
							</h2>
							<p className="text-lg text-muted-foreground font-display font-light max-w-2xl mx-auto">
								From lush plants to weathered driftwood, create stunning aquascapes that last forever
							</p>
						</div>

						<div className="grid md:grid-cols-3 gap-8">
							<div className="text-center space-y-4">
								<div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/10 border border-green-500/20">
									<Leaf className="h-8 w-8 text-green-600" />
								</div>
								<h3 className="text-xl font-display font-normal">Artificial Plants</h3>
								<p className="text-sm text-muted-foreground font-display font-light">
									Realistic aquatic plants that never die, require zero maintenance, and won't be eaten by herbivorous fish
								</p>
							</div>

							<div className="text-center space-y-4">
								<div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-500/10 border border-slate-500/20">
									<Mountain className="h-8 w-8 text-slate-600" />
								</div>
								<h3 className="text-xl font-display font-normal">Rocks & Formations</h3>
								<p className="text-sm text-muted-foreground font-display font-light">
									Natural-looking stones and rock formations that won't alter water parameters or leach minerals
								</p>
							</div>

							<div className="text-center space-y-4">
								<div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/20">
									<Anchor className="h-8 w-8 text-amber-600" />
								</div>
								<h3 className="text-xl font-display font-normal">Driftwood & Roots</h3>
								<p className="text-sm text-muted-foreground font-display font-light">
									Weathered wood pieces and root structures that sink immediately and never rot or decay
								</p>
							</div>
						</div>
					</div>
				</section>

				{/* Categories Slider */}
				<section id="categories" className="py-16 md:py-24">
					<div className="px-4 max-w-7xl mx-auto">
						<div className="mb-12">
							<h2 className="text-3xl md:text-4xl font-display font-light mb-4">
								Browse by Category
							</h2>
							<p className="text-lg text-muted-foreground font-display font-light">
								Select from our full range of aquarium decorations and accessories
							</p>
						</div>

						<CategorySlider
							categories={categories}
							productLineSlug="aquarium-decorations"
						/>
					</div>
				</section>

				{/* Why Choose These Materials */}
				<section className="py-16 md:py-20 bg-muted/30 border-t">
					<div className="px-4 max-w-7xl mx-auto">
						<div className="grid md:grid-cols-2 gap-12 items-center">
							<div className="relative aspect-square rounded-2xl overflow-hidden border-2 border-border order-2 md:order-1">
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

				{/* Mix & Match CTA */}
				<section className="py-16 md:py-20 border-t">
					<div className="px-4 max-w-7xl mx-auto text-center space-y-8">
						<div className="max-w-2xl mx-auto space-y-4">
							<h2 className="text-3xl md:text-4xl font-display font-light">
								Pair with Our 3D Backgrounds
							</h2>
							<p className="text-lg text-muted-foreground font-display font-light">
								Create a complete ecosystem by combining decorations with our custom 3D backgrounds for a truly immersive aquascape
							</p>
						</div>
						<Link
							href="/shop/3d-backgrounds"
							className="inline-flex items-center gap-2 px-8 py-4 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full font-display font-medium transition-all hover:scale-105"
						>
							Explore 3D Backgrounds
							<ArrowRight className="h-4 w-4" />
						</Link>
					</div>
				</section>

				{/* Trust Bar */}
				<section className="py-12 md:py-16 border-t">
					<div className="px-4 max-w-7xl mx-auto">
						<div className="flex flex-wrap items-center justify-center gap-8 text-sm font-display font-light">
							<div className="flex items-center gap-2">
								<span className="text-primary text-lg">✓</span>
								<span>Free Worldwide Shipping</span>
							</div>
							<div className="flex items-center gap-2">
								<span className="text-primary text-lg">✓</span>
								<span>In Stock & Ready to Ship</span>
							</div>
							<div className="flex items-center gap-2">
								<span className="text-primary text-lg">✓</span>
								<span>Lifetime Warranty</span>
							</div>
							<div className="flex items-center gap-2">
								<span className="text-primary text-lg">✓</span>
								<span>Made in Serbia</span>
							</div>
						</div>
					</div>
				</section>
			</main>
		</HydrateClient>
	);
}