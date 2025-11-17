// src/app/shop/[category]/page.tsx

import { notFound } from "next/navigation";
import { ProductCard } from "~/components/shop/ProductCard";
import { api } from "~/trpc/server";

interface CategoryPageProps {
	params: {
		category: string;
	};
}

export default async function CategoryPage({ params }: CategoryPageProps) {
	// TODO: Replace with actual tRPC query
	// const products = await api.product.getByCategory({ categorySlug: params.category });

	// Mock data for now
	const mockProducts = [
		{
			id: "f1-3d-background",
			name: "F1 - 3D Background in Stone",
			slug: "f1-3d-background",
			priceNote: "From €199",
			categorySlug: params.category,
			image: "/placeholder.jpg", // Replace with actual Supabase Storage URL
			shortDescription: "3D Rocky aquarium background with natural stone appearance",
		},
		{
			id: "f2-3d-background",
			name: "F2 - Rocky Wood Background",
			slug: "f2-3d-background",
			priceNote: "Production takes 10-12 business days",
			categorySlug: params.category,
			image: "/placeholder.jpg",
			shortDescription: "3D Rocky aquarium background with petrified wood appearance",
		},
	];

	// Get category name from slug
	const categoryNames: Record<string, string> = {
		"3d-backgrounds": "3D Backgrounds",
		"a-models": "A Models - Classic Rocky Backgrounds",
		"slim-models": "A Slim Models - Thin Rocky Backgrounds",
		"b-models": "B Models - Amazonian Tree Trunks",
		"aquarium-decorations": "Aquarium Decorations",
		"aquarium-plants": "Aquarium Plants",
		"aquarium-rocks": "Aquarium Rocks",
		"d-models": "D Models - Logs, Leaves, Driftwood",
		"h-models": "H Models - Artificial Reefs",
	};

	const categoryName = categoryNames[params.category];
	if (!categoryName) {
		notFound();
	}

	return (
		<main className="min-h-screen">
			{/* Breadcrumbs */}
			<div className="border-b bg-muted/30">
				<div className="container px-4 py-4">
					<nav className="flex items-center space-x-2 text-sm text-muted-foreground">
						<a href="/" className="hover:text-foreground transition-colors">
							Home
						</a>
						<span>›</span>
						<a href="/shop" className="hover:text-foreground transition-colors">
							Shop
						</a>
						<span>›</span>
						<span className="text-foreground">{categoryName}</span>
					</nav>
				</div>
			</div>

			{/* Header */}
			<section className="border-b">
				<div className="container px-4 py-12 md:py-16">
					<h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-light tracking-tight">
						{categoryName}
					</h1>
					<p className="mt-3 text-muted-foreground font-display font-light">
						Choose one of our catalog items...
					</p>
				</div>
			</section>

			{/* Product Grid */}
			<section className="py-12">
				<div className="container px-4">
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
						{mockProducts.map((product) => (
							<ProductCard key={product.id} product={product} />
						))}
					</div>

					{/* Empty state if no products */}
					{mockProducts.length === 0 && (
						<div className="text-center py-16">
							<p className="text-lg text-muted-foreground font-display">
								No products available in this category yet.
							</p>
						</div>
					)}
				</div>
			</section>
		</main>
	);
}