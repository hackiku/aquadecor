
// @ts-nocheck
// src/app/shop/page.tsx

import { ProductLineSplitHero } from "~/components/shop/product/ProductLineSplitHero";
import { ProductCard } from "~/components/shop/product/ProductCard";
import { api, HydrateClient } from "~/trpc/server";
import { WaveDivider } from "~/components/ui/water/wave-divider";

export default async function ShopPage() {
	// Get all featured products
	const featuredProducts = await api.product.getFeatured({
		locale: "en",
		limit: 6,
	});

	// Split featured products by product line
	const backgroundProducts = featuredProducts.filter(
		p => p.productLineSlug === "3d-backgrounds"
	).slice(0, 3);

	const decorationProducts = featuredProducts.filter(
		p => p.productLineSlug === "aquarium-decorations"
	).slice(0, 3);

	return (
		<HydrateClient>
			<main className="min-h-screen">

				<section className="relative py-16 md:py-24 bg-black __border __border-red-600/30">
					<div className="px-14 max-w-5xl mx-auto text-center space-y-6 __border-red-600/30">
						<h1 className="text-4xl text-white md:text-5xl lg:text-6xl font-display font-extralight tracking-tight">
							Shop Aquarium Products
						</h1>
						<p className="text-xl text-muted-foreground font-display font-light max-w-3xl mx-auto">
							Explore our complete range of 3D backgrounds and decorations. Handcrafted in Serbia, trusted by 50,000+ aquarists worldwide.
						</p>
					</div>

				</section>

				{/* Split Hero - Full Viewport */}

				{/* 3D Backgrounds Section */}
				<section id="3d-backgrounds" className="relative py-24 md:py-32 bg-card">
					<WaveDivider position="top" color="black" className="text-muted/30" />
					<div className="px-4 max-w-7xl mx-auto space-y-12">
						{/* Section Header */}
						
						<ProductLineSplitHero />

						{/* Featured Products */}
						{backgroundProducts.length > 0 && (
							<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
								{backgroundProducts.map((product) => (
									<ProductCard
										key={product.id}
										product={{
											...product,
											name: product.name ?? "Untitled Product",
											stockStatus: (product as any).stockStatus || 'made_to_order'
										}}
									/>
								))}
							</div>
						)}

						{/* Key Features */}
						<div className="grid md:grid-cols-3 gap-8 mt-16 p-8 bg-muted/30 rounded-2xl">
							<div className="text-center space-y-3">
								<div className="text-4xl">🎨</div>
								<h4 className="font-display font-medium">Hand-Painted</h4>
								<p className="text-sm text-muted-foreground font-display font-light">
									Every background is individually hand-painted for realistic detail
								</p>
							</div>
							<div className="text-center space-y-3">
								<div className="text-4xl">📐</div>
								<h4 className="font-display font-medium">Custom Fit</h4>
								<p className="text-sm text-muted-foreground font-display font-light">
									Made to your exact dimensions, including weirs and overflows
								</p>
							</div>
							<div className="text-center space-y-3">
								<div className="text-4xl">🛡️</div>
								<h4 className="font-display font-medium">Lifetime Warranty</h4>
								<p className="text-sm text-muted-foreground font-display font-light">
									Chemical-resistant materials that never leach or affect pH
								</p>
							</div>
						</div>
					</div>
				</section>

				

				{/* Aquarium Decorations Section */}
				<section id="aquarium-decorations" className="relative py-24 md:py-32 bg-muted/10">
					<div className="px-4 max-w-7xl mx-auto space-y-12">
						{/* Section Header */}
						<div className="text-center space-y-4">
							<h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-extralight tracking-tight">
								Aquarium Decorations
							</h2>
							<p className="text-xl text-muted-foreground font-display font-light max-w-2xl mx-auto">
								Plants, rocks, and driftwood that last forever
							</p>
						</div>

						{/* Featured Products */}
						{decorationProducts.length > 0 && (
							<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
								{decorationProducts.map((product) => (
									<ProductCard
										key={product.id}
										product={{
											...product,
											name: product.name ?? "Untitled Product",
											stockStatus: (product as any).stockStatus || 'made_to_order'
										}}
									/>
								))}
							</div>
						)}

						{/* Key Features */}
						<div className="grid md:grid-cols-3 gap-8 mt-16 p-8 bg-background rounded-2xl">
							<div className="text-center space-y-3">
								<div className="text-4xl">🌿</div>
								<h4 className="font-display font-medium">100% Neutral</h4>
								<p className="text-sm text-muted-foreground font-display font-light">
									Won't affect water chemistry or leach minerals into your tank
								</p>
							</div>
							<div className="text-center space-y-3">
								<div className="text-4xl">♾️</div>
								<h4 className="font-display font-medium">Never Decays</h4>
								<p className="text-sm text-muted-foreground font-display font-light">
									Unlike natural materials, these never rot, float, or need replacement
								</p>
							</div>
							<div className="text-center space-y-3">
								<div className="text-4xl">🐟</div>
								<h4 className="font-display font-medium">Fish-Safe</h4>
								<p className="text-sm text-muted-foreground font-display font-light">
									Even aggressive cichlids can't damage our decorations
								</p>
							</div>
						</div>
					</div>
				</section>

				{/* Trust Bar */}
				<section className="py-12 md:py-16">
					<div className="px-4 max-w-7xl mx-auto">
						<div className="flex flex-wrap items-center justify-center gap-8 text-sm font-display font-light">
							<div className="flex items-center gap-2">
								<span className="text-primary text-lg">✓</span>
								<span>Free Worldwide Shipping</span>
							</div>
							<div className="flex items-center gap-2">
								<span className="text-primary text-lg">✓</span>
								<span>20+ Years in Business</span>
							</div>
							<div className="flex items-center gap-2">
								<span className="text-primary text-lg">✓</span>
								<span>50,000+ Products Shipped</span>
							</div>
							<div className="flex items-center gap-2">
								<span className="text-primary text-lg">✓</span>
								<span>Lifetime Warranty</span>
							</div>
						</div>
					</div>
				</section>
			</main>
		</HydrateClient>
	);
}