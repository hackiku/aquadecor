// src/app/shop/[category]/page.tsx

import { notFound } from "next/navigation";
import { ProductCard } from "../_components/product/ProductCard";
import { Breadcrumbs } from "~/components/navigation/Breadcrumbs";
import { api } from "~/trpc/server";

export default async function CategoryPage({
	params
}: {
	params: { category: string }
}) {
	// Get products via tRPC
	const products = await api.product.getByCategory({
		categorySlug: params.category,
		locale: "en"
	});

	if (!products || products.length === 0) {
		notFound();
	}

	// Category name mapping (temp until we query it)
	const categoryNames: Record<string, string> = {
		"3d-backgrounds": "3D Backgrounds",
		"a-models": "A Models - Classic Rocky Backgrounds",
		"slim-models": "A Slim Models - Thin Rocky Backgrounds",
		"aquarium-decorations": "Aquarium Decorations",
		"aquarium-plants": "Aquarium Plants",
	};

	const categoryName = categoryNames[params.category] || params.category;

	return (
		<main className="min-h-screen">
			{/* Breadcrumbs */}
			<div className="border-b bg-muted/30">
				<div className="container px-4 py-4">
					<Breadcrumbs
						items={[
							{ label: "Home", href: "/" },
							{ label: "Shop", href: "/shop" },
							{ label: categoryName, href: `/shop/${params.category}` },
						]}
					/>
				</div>
			</div>

			{/* Header */}
			<section className="border-b">
				<div className="container px-4 py-12 md:py-16">
					<h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-light tracking-tight">
						{categoryName}
					</h1>
					<p className="mt-3 text-muted-foreground font-display font-light">
						{products.length} products available
					</p>
				</div>
			</section>

			{/* Product Grid */}
			<section className="py-12">
				<div className="container px-4">
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
						{products.map((product) => (
							<ProductCard
								key={product.id}
								product={{
									...product,
									categorySlug: params.category,
								}}
							/>
						))}
					</div>
				</div>
			</section>
		</main>
	);
}