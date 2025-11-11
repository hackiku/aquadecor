// src/app/_components/ProductGallery.tsx

"use client";

import { ShopButton } from "~/components/cta/ShopButton";
import { ProductCard } from "~/components/store/ProductCard";

export function ProductGallery() {
	// TODO: Fetch products from tRPC
	const products = [
		{
			id: "1",
			name: "Rocky Cave Background",
			price: 199,
			image: "/images/products/rocky-cave.jpg",
			slug: "rocky-cave",
		},
		{
			id: "2",
			name: "Amazonian Roots",
			price: 249,
			image: "/images/products/amazonian.jpg",
			slug: "amazonian-roots",
		},
		{
			id: "3",
			name: "Coral Reef",
			price: 299,
			image: "/images/products/coral-reef.jpg",
			slug: "coral-reef",
		},
	];

	return (
		<section className="py-24 md:py-32 bg-accent/20">
			<div className="container px-4">
				<div className="text-center space-y-4 mb-16">
					<h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
						Featured Backgrounds
					</h2>
					<p className="mx-auto max-w-2xl text-lg text-muted-foreground">
						Browse our most popular 3D aquarium backgrounds, each handcrafted to perfection.
					</p>
				</div>

				<div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
					{products.map((product) => (
						<ProductCard key={product.id} product={product} />
					))}
				</div>

				<div className="mt-12 text-center">
					<ShopButton />
				</div>
			</div>
		</section>
	);
}