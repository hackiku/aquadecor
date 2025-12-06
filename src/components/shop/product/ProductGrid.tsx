// src/components/shop/product/ProductGrid.tsx
"use client";

import { ProductCard } from "./ProductCard";
import type { Product } from "~/server/db/schema/shop";

// Type for products in grid - matches what ProductCard expects
type ProductForGrid = Pick<Product, 'id' | 'slug' | 'sku' | 'basePriceEurCents' | 'priceNote' | 'stockStatus'> & {
	name: string;
	shortDescription: string | null;
	heroImageUrl: string | null;
	heroImageAlt?: string | null;
	categorySlug: string;
	productLineSlug: string;
};

interface ProductGridProps {
	products: ProductForGrid[];
	variant?: "default" | "compact";
	columns?: "2" | "3" | "4";
	showQuickAdd?: boolean;
}

export function ProductGrid({
	products,
	variant = "default",
	columns = "3",
	showQuickAdd = false
}: ProductGridProps) {
	if (!products || products.length === 0) {
		return (
			<div className="py-12 text-center">
				<p className="text-lg text-muted-foreground font-display font-light">
					No products found
				</p>
			</div>
		);
	}

	const gridCols = {
		"2": "grid-cols-1 sm:grid-cols-2",
		"3": "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
		"4": "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
	}[columns];

	return (
		<div className={`grid ${gridCols} gap-6`}>
			{products.map((product) => (
				<ProductCard
					key={product.id}
					product={product}
					variant={variant}
					showQuickAdd={showQuickAdd}
				/>
			))}
		</div>
	);
}