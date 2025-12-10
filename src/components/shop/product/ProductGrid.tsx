// src/components/shop/product/ProductGrid.tsx
"use client";

import { useState } from "react";
import { ProductCard } from "./ProductCard";
import { LayoutGrid, Grid2X2, RectangleHorizontal } from "lucide-react";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import type { Product } from "~/server/db/schema/shop";

// Reuse the type definition
type ProductForGrid = Pick<Product, 'id' | 'slug' | 'sku' | 'stockStatus'> & {
	// Fields retrieved from other tables or translations:
	name: string;
	shortDescription: string | null;
	heroImageUrl: string | null;
	heroImageAlt?: string | null;
	categorySlug: string;
	productLineSlug: string;

	// Pricing fields (mapped from productPricing.unitPriceEurCents)
	basePriceEurCents: number | null;
	priceNote: string | null;

	// Fields to satisfy the ProductCard which uses this type
	variantOptions?: any | null;
	addonOptions?: any | null;
};


interface ProductGridProps {
	products: ProductForGrid[];
	variant?: "default" | "compact";
	initialColumns?: "2" | "3" | "4";
	showControls?: boolean;
}

export function ProductGrid({
	products,
	variant = "default",
	initialColumns = "3",
	showControls = true
}: ProductGridProps) {
	const [columns, setColumns] = useState<"2" | "3" | "4">(initialColumns);

	if (!products || products.length === 0) {
		return (
			<div className="py-24 text-center border-2 border-dashed rounded-xl">
				<p className="text-lg text-muted-foreground font-display font-light">
					No products found in this category.
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
		<div className="space-y-6">
			{/* Grid Controls - Floating Top Right */}
			{showControls && (
				<div className="hidden md:flex justify-end mb-2 relative z-10 pointer-events-none">
					<div className="flex items-center gap-1 bg-background/80 backdrop-blur-sm border rounded-lg p-1 pointer-events-auto shadow-sm">
						<Button
							variant="ghost"
							size="icon"
							className={cn("h-8 w-8", columns === "2" && "bg-muted text-primary")}
							onClick={() => setColumns("2")}
							title="2 Columns"
						>
							<RectangleHorizontal className="h-4 w-4" />
						</Button>
						<Button
							variant="ghost"
							size="icon"
							className={cn("h-8 w-8", columns === "3" && "bg-muted text-primary")}
							onClick={() => setColumns("3")}
							title="3 Columns"
						>
							<Grid2X2 className="h-4 w-4" />
						</Button>
						<Button
							variant="ghost"
							size="icon"
							className={cn("h-8 w-8 hidden xl:flex", columns === "4" && "bg-muted text-primary")}
							onClick={() => setColumns("4")}
							title="4 Columns"
						>
							<LayoutGrid className="h-4 w-4" />
						</Button>
					</div>
				</div>
			)}

			<div className={`grid ${gridCols} gap-6`}>
				{products.map((product) => (
					<ProductCard
						key={product.id}
						product={product}
						variant={variant}
					/>
				))}
			</div>
		</div>
	);
}