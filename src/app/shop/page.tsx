// src/app/shop/page.tsx

import { ProductLineCard } from "~/components/shop/category/ProductLineCard";
import { ProductCard } from "~/components/shop/product/ProductCard";
import { api, HydrateClient } from "~/trpc/server";

// Static product line data (not in DB - these are marketing pages)
const productLines = [
	{
		slug: "3d-backgrounds",
		name: "3D Backgrounds",
		description: "Transform your aquarium with custom-made 3D backgrounds so realistic that even experts can't tell the difference from natural rock formations.",
		image: "/media/images/3d-backgrounds_500px.webp",
		label: "Handcrafted Since 2004",
	},
	{
		slug: "aquarium-decorations",
		name: "Aquarium Decorations",
		description: "Realistic plants, rocks, driftwood, and accessories crafted from neutral materials for unlimited lifespan and zero water chemistry impact.",
		image: "/media/images/additional-items_500px.webp",
		label: "Complete Your Aquascape",
	},
];

export default async function ShopPage() {
	// Get category counts
	const backgroundsCategories = await api.product.getCategoriesForProductLine({
		productLineSlug: "3d-backgrounds",
		locale: "en",
	});

	const decorationsCategories = await api.product.getCategoriesForProductLine({
		productLineSlug: "aquarium-decorations",
		locale: "en",
	});

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
				{/* Hero Section */}
				<section className="py-16 md:py-24 border-b">
					<div className="px-4 max-w-7xl mx-auto text-center space-y-6">
						<h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-extralight tracking-tight">
							Shop Aquarium Products
						</h1>
						<p className="text-xl text-muted-foreground font-display font-light max-w-3xl mx-auto">
							Explore our complete range of 3D backgrounds and decorations. Handcrafted in Serbia, trusted by 50,000+ aquarists worldwide.
						</p>
					</div>
				</section>

				{/* 3D Backgrounds Section */}
				<section className="py-16 md:py-24">
					<div className="px-4 max-w-7xl mx-auto space-y-12">
						{/* Product Line Card */}
						<ProductLineCard
							slug={productLines[0].slug}
							name={productLines[0].name}
							description={productLines[0].description}
							image={productLines[0].image}
							label={productLines[0].label}
							position="left"
							categoryCount={backgroundsCategories.length}
						/>

						{/* Featured Products */}
						{backgroundProducts.length > 0 && (
							<div className="space-y-6">
								<div className="text-center">
									<h3 className="text-2xl md:text-3xl font-display font-light">
										Featured 3D Backgrounds
									</h3>
									<p className="mt-2 text-muted-foreground font-display font-light">
										Custom-made to fit any aquarium size
									</p>
								</div>
								<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
									{backgroundProducts.map((product) => (
										<ProductCard
											key={product.id}
											product={product}
										/>
									))}
								</div>
							</div>
						)}

						{/* Key Features */}
						<div className="grid md:grid-cols-3 gap-8 mt-12 p-8 bg-muted/30 rounded-2xl">
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
				<section className="py-16 md:py-24 bg-muted/10">
					<div className="px-4 max-w-7xl mx-auto space-y-12">
						{/* Product Line Card */}
						<ProductLineCard
							slug={productLines[1].slug}
							name={productLines[1].name}
							description={productLines[1].description}
							image={productLines[1].image}
							label={productLines[1].label}
							position="right"
							categoryCount={decorationsCategories.length}
						/>

						{/* Featured Products */}
						{decorationProducts.length > 0 && (
							<div className="space-y-6">
								<div className="text-center">
									<h3 className="text-2xl md:text-3xl font-display font-light">
										Featured Decorations
									</h3>
									<p className="mt-2 text-muted-foreground font-display font-light">
										Plants, rocks, and driftwood that last forever
									</p>
								</div>
								<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
									{decorationProducts.map((product) => (
										<ProductCard
											key={product.id}
											product={product}
										/>
									))}
								</div>
							</div>
						)}

						{/* Key Features */}
						<div className="grid md:grid-cols-3 gap-8 mt-12 p-8 bg-background rounded-2xl border">
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
				<section className="py-12 md:py-16 border-t">
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