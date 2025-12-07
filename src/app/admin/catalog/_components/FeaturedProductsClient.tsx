// src/app/admin/catalog/_components/FeaturedProductsClient.tsx
"use client";

import { useState } from "react";
import { ProductCard } from "~/components/shop/product/ProductCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Plus } from "lucide-react";
import type { ProductRow } from "./ProductLineClient";

interface FeaturedProductsClientProps {
	featured3D: ProductRow[];
	featuredDecorations: ProductRow[];
	allProducts: ProductRow[];
}

export function FeaturedProductsClient({
	featured3D,
	featuredDecorations,
	allProducts,
}: FeaturedProductsClientProps) {
	// Mapper to convert Admin ProductRow to Shop ProductCard format
	const toProductCardFormat = (row: ProductRow) => ({
		id: row.id,
		slug: row.slug,
		sku: row.sku,
		name: row.name || "Untitled",
		shortDescription: null, // Admin view doesn't need this populated perfectly
		basePriceEurCents: row.basePriceEurCents,
		priceNote: null,
		stockStatus: row.stockStatus || "in_stock",
		// FIX: Map heroImageUrl
		heroImageUrl: row.heroImageUrl,
		heroImageAlt: row.name,
		categorySlug: "admin-preview",
		productLineSlug: row.productLine || "unknown",
	});

	return (
		<Tabs defaultValue="3d-backgrounds" className="space-y-6">
			<div className="flex items-center justify-between">
				<TabsList className="bg-muted/50 border border-border">
					<TabsTrigger value="3d-backgrounds" className="font-display">3D Backgrounds</TabsTrigger>
					<TabsTrigger value="aquarium-decorations" className="font-display">Decorations</TabsTrigger>
				</TabsList>
			</div>

			<TabsContent value="3d-backgrounds" className="space-y-6">
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
					{featured3D.map((product) => (
						<div key={product.id} className="relative group">
							{/* Overlay for admin actions could go here */}
							<ProductCard product={toProductCardFormat(product)} />
						</div>
					))}

					{/* Add New Placeholder */}
					<Button variant="outline" className="h-full min-h-[300px] flex flex-col gap-4 border-dashed border-2 hover:border-primary/50 hover:bg-muted/50">
						<Plus className="h-8 w-8 text-muted-foreground" />
						<span className="font-display text-muted-foreground">Add Featured Product</span>
					</Button>
				</div>
			</TabsContent>

			<TabsContent value="aquarium-decorations" className="space-y-6">
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
					{featuredDecorations.map((product) => (
						<ProductCard key={product.id} product={toProductCardFormat(product)} />
					))}
					<Button variant="outline" className="h-full min-h-[300px] flex flex-col gap-4 border-dashed border-2 hover:border-primary/50 hover:bg-muted/50">
						<Plus className="h-8 w-8 text-muted-foreground" />
						<span className="font-display text-muted-foreground">Add Featured Product</span>
					</Button>
				</div>
			</TabsContent>
		</Tabs>
	);
}