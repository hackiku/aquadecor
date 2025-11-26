// src/components/shop/product/ProductGrid.tsx
"use client";

import { ProductCard } from "./ProductCard";

interface Product {
	id: string;
	slug: string;
	name: string;
	sku?: string | null;
	shortDescription?: string | null;
	basePriceEurCents?: number | null;
	priceNote?: string | null;
	stockStatus: string;
	featuredImageUrl?: string | null;
	categorySlug: string;
	productLineSlug: string;
}

interface ProductGridProps {
	products: Product[];
	variant?: "default" | "compact" | "featured";
	columns?: "2" | "3" | "4";
	showQuickAdd?: boolean;
}

export function ProductGrid({
	products,
	variant = "default",
	columns = "3",
	showQuickAdd = true
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