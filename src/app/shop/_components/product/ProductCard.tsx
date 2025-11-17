// src/app/shop/_components/product/ProductCard.tsx

"use client";

import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";

interface Product {
	id: string;
	name: string | null;
	slug: string;
	sku: string | null;
	priceNote?: string | null;
	basePriceEurCents?: number | null;
	stockStatus?: string | null;
	categorySlug?: string;
	productLineSlug?: string;
	shortDescription?: string | null;
}

export function ProductCard({ product }: { product: Product }) {
	// Build the product URL - needs both category and product slug
	const productUrl = product.productLineSlug && product.categorySlug
		? `/shop/${product.productLineSlug}/${product.categorySlug}/${product.slug}`
		: `/shop/product/${product.slug}`; // Fallback

	// Format price if available
	const formattedPrice = product.basePriceEurCents
		? `€${(product.basePriceEurCents / 100).toFixed(2)}`
		: null;

	// Stock status badge
	const stockBadge = product.stockStatus === "in_stock"
		? <Badge variant="secondary" className="text-xs">In Stock</Badge>
		: product.stockStatus === "made_to_order"
			? <Badge variant="outline" className="text-xs">Made to Order</Badge>
			: null;

	return (
		<Link href={productUrl} className="group block h-full">
			<Card className="h-full flex flex-col overflow-hidden border-2 hover:border-primary/50 hover:shadow-lg transition-all">
				<CardHeader className="p-0">
					{/* Product Image Placeholder */}
					<div className="relative aspect-[4/3] bg-muted overflow-hidden">
						<div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center p-4">
							<p className="text-muted-foreground font-display text-sm text-center line-clamp-3">
								{product.name}
							</p>
						</div>
						{product.sku && (
							<div className="absolute top-3 left-3">
								<Badge variant="secondary" className="font-display font-medium">
									{product.sku}
								</Badge>
							</div>
						)}
						{stockBadge && (
							<div className="absolute top-3 right-3">
								{stockBadge}
							</div>
						)}
					</div>
				</CardHeader>

				<CardContent className="flex-1 p-6 space-y-3">
					<h3 className="font-display font-normal text-lg line-clamp-2 group-hover:text-primary transition-colors">
						{product.name}
					</h3>

					{product.shortDescription && (
						<p className="text-sm text-muted-foreground font-display font-light line-clamp-2">
							{product.shortDescription}
						</p>
					)}

					{/* Price Display */}
					{formattedPrice && (
						<p className="text-xl font-display font-medium text-primary">
							{formattedPrice}
						</p>
					)}
				</CardContent>

				<CardFooter className="p-6 pt-0 flex flex-col gap-3">
					{product.priceNote && !formattedPrice && (
						<p className="text-sm font-display font-medium text-muted-foreground w-full text-center">
							{product.priceNote}
						</p>
					)}

					<Button
						variant="outline"
						className="w-full rounded-full"
						onClick={(e) => {
							e.preventDefault();
							console.log("Request quote:", product.id);
							// TODO: Open quote modal
						}}
					>
						{formattedPrice ? "Add to Cart" : "Request Quote"}
					</Button>
				</CardFooter>
			</Card>
		</Link>
	);
}