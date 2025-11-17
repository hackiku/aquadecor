// src/app/shop/[category]/[slug]/page.tsx
// NOTE: This handles BOTH product detail pages AND category product listings
// We determine which by checking if params.slug matches a category or product

import { notFound } from "next/navigation";
import { Breadcrumbs } from "~/components/navigation/Breadcrumbs";
import { ProductCard } from "~/app/shop/_components/product/ProductCard";
import { api } from "~/trpc/server";

interface PageProps {
	params: {
		category: string;
		slug: string;
	};
}

export default async function CategoryProductsPage({ params }: PageProps) {
	// Try to load products for this category
	const products = await api.product.getByCategory({
		categorySlug: params.slug,
		locale: "en",
	});

	// If no products found, this might be a product detail page
	// That will be handled separately
	if (!products || products.length === 0) {
		notFound();
	}

	// Category name mapping (temporary until we add a proper query)
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

	const categoryName = categoryNames[params.slug] || params.slug;
	const productLineName = productLineNames[params.category] || params.category;

	return (
		<main className="min-h-screen">
			{/* Breadcrumbs */}
			<div className="border-b bg-muted/30">
				<div className="container px-4 py-4">
					<Breadcrumbs
						items={[
							{ label: "Home", href: "/" },
							{ label: "Shop", href: "/shop" },
							{ label: productLineName, href: `/shop/${params.category}` },
							{ label: categoryName, href: `/shop/${params.category}/${params.slug}` },
						]}
					/>
				</div>
			</div>

			{/* Header */}
			<section className="border-b bg-linear-to-b from-background to-muted/30">
				<div className="container px-4 py-12 md:py-16">
					<div className="max-w-3xl space-y-4">
						<h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-light tracking-tight">
							{categoryName}
						</h1>
						<p className="text-base md:text-lg text-muted-foreground font-display font-light">
							{products.length} {products.length === 1 ? "product" : "products"} available
						</p>
					</div>
				</div>
			</section>

			{/* Product Grid */}
			<section className="py-12 md:py-16">
				<div className="container px-4">
					{/* TODO: Add filters/search bar here */}
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
						{products.map((product) => (
							<ProductCard
								key={product.id}
								product={{
									...product,
									categorySlug: params.slug,
									productLineSlug: params.category,
								}}
							/>
						))}
					</div>
				</div>
			</section>
		</main>
	);
}