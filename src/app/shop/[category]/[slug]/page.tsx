// src/app/shop/[category]/[slug]/page.tsx

import { notFound } from "next/navigation";
import { ProductGrid } from "~/components/shop/product/ProductGrid";
import { api } from "~/trpc/server";

interface PageProps {
	params: Promise<{
		category: string;
		slug: string;
	}>;
}

export default async function CategoryProductsPage({ params }: PageProps) {
	const { category, slug } = await params;

	const result = await api.product.getByCategory({
		categorySlug: slug,
		locale: "en",
	});

	if (!result || !("products" in result)) {
		notFound();
	}

	const { products, categorySlug, productLineSlug } = result;

	if (!products || products.length === 0) {
		notFound();
	}

	const categoryNames: Record<string, string> = {
		"a-models": "A Models - Classic Rocky Backgrounds",
		"slim-models": "A Slim Models - Thin Rocky Backgrounds",
		"b-models": "B Models - Amazonian Tree Trunks",
		"aquarium-plants": "Aquarium Plants",
		"aquarium-rocks": "Aquarium Rocks",
		"d-models": "D Models - Logs, Leaves, Driftwood, Rocks and Roots",
		"h-models": "H Models – Artificial Reefs",
		"j-models": "J Models - Protective Rubber Mats",
		"m-models": "M Models - Magnetic Rocks",
		"s-models": "S Models - Back Panel Roots",
		"starter-sets": "Starter Sets",
		"v-models": "V Models - Centerpiece Decorations",
	};

	const productLineNames: Record<string, string> = {
		"3d-backgrounds": "3D Backgrounds",
		"aquarium-decorations": "Aquarium Decorations",
	};

	const categoryName = categoryNames[slug] || slug;
	const productLineName = productLineNames[category] || category;

	// Transform data to match ProductGrid interface strictly
	const productsWithSlugs = products.map(product => ({
		id: product.id,
		slug: product.slug,
		name: product.name ?? "Untitled Product",
		sku: product.sku ?? null,
		shortDescription: product.shortDescription ?? null,
		basePriceEurCents: product.basePriceEurCents ?? null,
		priceNote: product.priceNote ?? null,
		stockStatus: product.stockStatus,
		featuredImageUrl: product.featuredImageUrl ?? null,
		categorySlug: categorySlug,
		productLineSlug: productLineSlug,
	}));

	return (
		<main className="min-h-screen">
			<section className="py-16 md:py-20 bg-linear-to-b from-muted/30 to-transparent">
				<div className="px-4 max-w-7xl mx-auto">
					<div className="max-w-4xl mx-auto text-center space-y-6">
						<div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 backdrop-blur-sm rounded-full border border-primary/20">
							<span className="text-sm text-primary font-display font-medium">
								{productLineName}
							</span>
						</div>
						<h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-extralight tracking-tight">
							{categoryName}
						</h1>
						<p className="text-lg md:text-xl text-muted-foreground font-display font-light">
							{products.length} {products.length === 1 ? "product" : "products"} available
						</p>
					</div>
				</div>
			</section>

			<section className="py-12 md:py-16">
				<div className="px-4 max-w-7xl mx-auto">
					<ProductGrid
						products={productsWithSlugs}
						columns="4"
					/>
				</div>
			</section>

			<section className="py-12 md:py-16 border-t bg-accent/5">
				<div className="px-4 max-w-7xl mx-auto">
					<div className="flex flex-wrap items-center justify-center gap-8 text-sm font-display font-light">
						<div className="flex items-center gap-2">
							<span className="text-primary text-lg">✓</span>
							<span>Free Worldwide Shipping</span>
						</div>
						<div className="flex items-center gap-2">
							<span className="text-primary text-lg">✓</span>
							<span>Made to Order</span>
						</div>
						<div className="flex items-center gap-2">
							<span className="text-primary text-lg">✓</span>
							<span>Custom Sizes Available</span>
						</div>
						<div className="flex items-center gap-2">
							<span className="text-primary text-lg">✓</span>
							<span>20+ Years Experience</span>
						</div>
					</div>
				</div>
			</section>
		</main>
	);
}