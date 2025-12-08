// src/app/[locale]/shop/page.tsx
import Link from "next/link";
import { ProductLineSplitHero } from "~/components/shop/product/ProductLineSplitHero";
import { ProductCard } from "~/components/shop/product/ProductCard";
import { api, HydrateClient } from "~/trpc/server";
import { WaveDivider } from "~/components/ui/water/wave-divider";
import { AlertCircle } from "lucide-react";

export default async function ShopPage() {
	let featuredProducts: Awaited<ReturnType<typeof api.product.getFeatured>> = [];
	let error = false;

	try {
		featuredProducts = await api.product.getFeatured({
			locale: "en",
			limit: 6,
		});
	} catch (err) {
		console.error('Failed to load featured products:', err);
		error = true;
	}

	const backgroundProducts = featuredProducts.filter(
		p => p.productLineSlug === "3d-backgrounds"
	).slice(0, 3);

	const decorationProducts = featuredProducts.filter(
		p => p.productLineSlug === "aquarium-decorations"
	).slice(0, 3);

	return (
		<HydrateClient>
			<main className="min-h-screen">

				<section className="relative py-16 md:py-24 bg-black">
					<div className="px-14 max-w-5xl mx-auto text-center space-y-6">
						<h1 className="text-4xl text-white md:text-5xl lg:text-6xl font-display font-extralight tracking-tight">
							Shop Aquarium Products
						</h1>
						<p className="text-xl text-muted-foreground font-display font-light max-w-3xl mx-auto">
							Explore our complete range of 3D backgrounds and decorations. Handcrafted in Serbia, trusted by 50,000+ aquarists worldwide.
						</p>
					</div>
				</section>

				{/* 3D Backgrounds Section */}
				<section id="3d-backgrounds" className="relative py-24 md:py-32 bg-card">
					<WaveDivider position="top" color="black" className="text-muted/30" />
					<div className="px-4 max-w-7xl mx-auto space-y-12">
						<ProductLineSplitHero />

						{error && (
							<div className="py-12 text-center space-y-4">
								<AlertCircle className="h-12 w-12 text-muted-foreground/50 mx-auto" />
								<div className="space-y-2">
									<p className="text-lg font-display font-normal">
										Unable to load products
									</p>
								</div>
							</div>
						)}

						{!error && backgroundProducts.length > 0 && (
							<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
								{backgroundProducts.map((product) => (
									<ProductCard
										key={product.id}
										product={{
											...product,
											name: product.name ?? "Untitled Product",
											stockStatus: (product as any).stockStatus || 'made_to_order',
											// Fix missing props
											categorySlug: product.categorySlug ?? "",
											productLineSlug: product.productLineSlug ?? "3d-backgrounds",
										}}
									/>
								))}
							</div>
						)}
					</div>
				</section>

				{/* Aquarium Decorations Section */}
				<section id="aquarium-decorations" className="relative py-24 md:py-32 bg-muted/10">
					<div className="px-4 max-w-7xl mx-auto space-y-12">
						<div className="text-center space-y-4">
							<h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-extralight tracking-tight">
								Aquarium Decorations
							</h2>
							<p className="text-xl text-muted-foreground font-display font-light max-w-2xl mx-auto">
								Plants, rocks, and driftwood that last forever
							</p>
						</div>

						{!error && decorationProducts.length > 0 && (
							<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
								{decorationProducts.map((product) => (
									<ProductCard
										key={product.id}
										product={{
											...product,
											name: product.name ?? "Untitled Product",
											stockStatus: (product as any).stockStatus || 'made_to_order',
											// Fix missing props
											categorySlug: product.categorySlug ?? "",
											productLineSlug: product.productLineSlug ?? "aquarium-decorations",
										}}
									/>
								))}
							</div>
						)}
					</div>
				</section>
			</main>
		</HydrateClient>
	);
}