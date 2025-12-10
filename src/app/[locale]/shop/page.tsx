// src/app/[locale]/shop/page.tsx
import Link from "next/link";
// import { ProductLineSplitHero } from "~/components/shop/product/ProductLineSplitHero"; // ❌ REMOVED
import { ProductCard } from "~/components/shop/product/ProductCard";
import { api, HydrateClient } from "~/trpc/server";
import { WaveDivider } from "~/components/ui/water/wave-divider";
import { AlertCircle, ArrowRight, Package } from "lucide-react"; // 🎯 Added ArrowRight, Package for new section
import Image from "next/image"; // 🎯 Added Image for new section

// Re-structuring the page to use static, stacked sections for performance

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

				{/* Global Hero Section - STAYS THE SAME */}
				<section className="relative py-16 md:py-24 bg-black">
					<div className="px-14 max-w-5xl mx-auto text-center space-y-6">
						<h1 className="text-4xl text-white md:text-5xl lg:text-6xl font-display font-extralight tracking-tight">
							Shop Aquarium Products
						</h1>
						<p className="text-xl text-muted-foreground font-display font-light max-w-3xl mx-auto">
							Explore our complete range of 3D backgrounds and decorations. Handcrafted by expert artisans, trusted by 50,000+ aquascapers worldwide.
						</p>
					</div>
				{/* </section> */}

				{/* 🎯 NEW: Product Line Teaser / Split Link Section (Static, CSS-only) */}
				{/* <section className="py-16 md:py-24 bg-card/50"> */}
					<div className="py-12 px-4 max-w-7xl mx-auto grid md:grid-cols-2 gap-8">
						{/* 3D Backgrounds Card */}
						<Link
							href="/shop/3d-backgrounds" 
							className="group border border-neutral-500/50 hover:border-neutral-500 relative block rounded-xl overflow-hidden shadow-xl hover:shadow-2xl transition-shadow aspect-video bg-black">
							<Image
								src="/media/images/3d-backgrounds_500px.webp"
								alt="3D Backgrounds"
								fill
								className="object-cover transition-transform duration-500 group-hover:scale-105 opacity-80"
							/>
							<div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-6 flex flex-col justify-end">
								<h2 className="text-3xl font-display font-light text-white mb-2">3D Backgrounds</h2>
								<p className="text-sm text-gray-300">Custom-made realism, built to your tank specs.</p>
								<div className="mt-4 inline-flex items-center gap-2 text-primary font-display font-medium">
									Browse Collection <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
								</div>
							</div>
						</Link>

						{/* Decorations Card */}
						<Link
							href="/shop/aquarium-decorations" 
							className="group relative border border-neutral-500/50 hover:border-neutral-500 block rounded-xl overflow-hidden shadow-xl hover:shadow-2xl transition-shadow aspect-video bg-black">
							<Image
								src="/media/images/additional-items_500px.webp"
								alt="Aquarium Decorations"
								fill
								className="object-cover transition-transform duration-500 group-hover:scale-105 opacity-80"
							/>
							<div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/50 to-transparent p-6 flex flex-col justify-end">
								<h2 className="text-3xl font-display font-light text-white mb-2">Aquarium Decorations</h2>
								<p className="text-sm text-gray-300">Plants, rocks, and driftwood that last forever.</p>
								<div className="mt-4 inline-flex items-center gap-2 text-primary font-display font-medium">
									Browse Collection <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
								</div>
							</div>
						</Link>
					</div>
				</section>


				{/* 3D Backgrounds Section - STACKED VIEW */}
				<section id="3d-backgrounds" className="relative py-24 md:py-32 bg-card">
					<WaveDivider position="top" color="black" className="text-muted/30" />
					<div className="px-4 max-w-7xl mx-auto space-y-12">
						{/* 🎯 New Header for this section */}
						<div className="text-center space-y-4">
							<div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/20 backdrop-blur-sm rounded-full border border-primary/30">
								<Package className="h-4 w-4 text-primary" />
								<span className="text-sm text-primary font-display font-medium">
									Featured
								</span>
							</div>
							<h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-extralight tracking-tight">
								3D Aquarium Backgrounds
							</h2>
							<p className="text-xl text-muted-foreground font-display font-light max-w-2xl mx-auto">
								See our most popular custom designs and get a quote.
							</p>
						</div>


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
											id: product.id,
											slug: product.slug,
											sku: product.sku ?? null,
											stockStatus: product.stockStatus,
											name: product.name ?? "Untitled Product",
											shortDescription: product.shortDescription ?? null,
											heroImageUrl: product.heroImageUrl ?? null,
											heroImageAlt: product.heroImageAlt ?? null,
											categorySlug: product.categorySlug ?? "",
											productLineSlug: product.productLineSlug ?? "3d-backgrounds",

											// FIX: Map new price field and assign required fields
											basePriceEurCents: product.unitPriceEurCents ?? null,
											priceNote: null,
											variantOptions: null,
											addonOptions: null,
										}}
									/>
								))}
							</div>
						)}

						{/* View All Button */}
						<div className="text-center pt-6">
							<Link href="/shop/3d-backgrounds" className="inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full font-display font-medium transition-all">
								View All Backgrounds
								<ArrowRight className="h-4 w-4" />
							</Link>
						</div>
					</div>
				</section>

				{/* Aquarium Decorations Section - STACKED VIEW */}
				<section id="aquarium-decorations" className="relative py-24 md:py-32 bg-linear-to-b from-muted/20 to-transparent">
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
											id: product.id,
											slug: product.slug,
											sku: product.sku ?? null,
											stockStatus: product.stockStatus,
											name: product.name ?? "Untitled Product",
											shortDescription: product.shortDescription ?? null,
											heroImageUrl: product.heroImageUrl ?? null,
											heroImageAlt: product.heroImageAlt ?? null,
											categorySlug: product.categorySlug ?? "",
											productLineSlug: product.productLineSlug ?? "aquarium-decorations",

											// FIX: Map new price field and assign required fields
											basePriceEurCents: product.unitPriceEurCents ?? null,
											priceNote: null,
											variantOptions: null,
											addonOptions: null,
										}}
									/>
								))}
							</div>
						)}

						{/* View All Button */}
						<div className="text-center pt-6">
							<Link href="/shop/aquarium-decorations" className="inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full font-display font-medium transition-all">
								View All Decorations
								<ArrowRight className="h-4 w-4" />
							</Link>
						</div>
					</div>
				</section>
			</main>
		</HydrateClient>
	);
}