// src/components/shop/product/ProductCard.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardFooter } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Package } from "lucide-react";
import { AddToCartButton } from "../cart/AddToCartButton";
import { WishlistButton } from "../wishlist/WishlistButton";
import type { Product } from "~/server/db/schema/shop";

interface ProductCardProps {
	product: Pick<Product, 'id' | 'slug' | 'sku' | 'basePriceEurCents' | 'priceNote' | 'stockStatus'> & {
		name: string;
		shortDescription: string | null;
		featuredImageUrl: string | null;
		categorySlug: string;
		productLineSlug: string;
	};
	variant?: "default" | "compact";
	showQuickAdd?: boolean;
}


// interface ProductCardProps {
// 	product: {
// 		id: string;
// 		slug: string;
// 		name: string;
// 		sku?: string | null;
// 		shortDescription?: string | null;
// 		basePriceEurCents?: number | null;
// 		priceNote?: string | null;
// 		stockStatus: string;
// 		featuredImageUrl?: string | null;
// 		categorySlug: string;
// 		productLineSlug: string;
// 	};
// 	variant?: "default" | "compact" | "featured";
// 	showQuickAdd?: boolean;
// }

export function ProductCard({ product, variant = "default", showQuickAdd = true }: ProductCardProps) {
	const productUrl = `/shop/${product.productLineSlug}/${product.categorySlug}/${product.slug}`;
	const hasPrice = product.basePriceEurCents !== null;

// export function ProductCard({
// 	product,
// 	variant = "default",
// 	showQuickAdd = true
// }: ProductCardProps) {
// 	const productUrl = `/shop/${product.productLineSlug}/${product.categorySlug}/${product.slug}`;
// 	const hasPrice = product.basePriceEurCents !== null && product.basePriceEurCents !== undefined;

	// Fix: Safely handle the division with fallback
	const formattedPrice = hasPrice
		? `€${((product.basePriceEurCents ?? 0) / 100).toFixed(2)}`
		: null;

	// Stock badge
	const stockBadge = product.stockStatus === "in_stock"
		? <Badge variant="secondary" className="text-xs font-display">In Stock</Badge>
		: product.stockStatus === "made_to_order"
			? <Badge variant="outline" className="text-xs font-display">Made to Order</Badge>
			: null;

	return (
		<div className="group relative h-full">
			{/* Wishlist Button - Top Right */}
			<div className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
				<WishlistButton productId={product.id} />
			</div>

			<Link href={productUrl} className="block h-full">
				<Card className="h-full flex flex-col overflow-hidden border-2 border-border hover:border-primary/50 hover:shadow-2xl transition-all duration-300">
					{/* Image */}
					<div className="relative aspect-[4/3] bg-muted overflow-hidden">
						{product.featuredImageUrl ? (
							<Image
								src={product.featuredImageUrl}
								alt={product.name}
								fill
								className="object-cover group-hover:scale-105 transition-transform duration-500"
								sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
							/>
						) : (
							<div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
								<Package className="h-16 w-16 text-muted-foreground/20" />
							</div>
						)}

						{/* SKU Badge */}
						{product.sku && (
							<div className="absolute top-3 left-3">
								<Badge variant="secondary" className="font-display font-medium backdrop-blur-sm">
									{product.sku}
								</Badge>
							</div>
						)}

						{/* Stock Badge */}
						{stockBadge && (
							<div className="absolute bottom-3 left-3">
								{stockBadge}
							</div>
						)}
					</div>

					{/* Content */}
					<CardContent className="flex-1 p-6 space-y-3">
						<h3 className="font-display font-normal text-lg leading-tight line-clamp-2 group-hover:text-primary transition-colors">
							{product.name}
						</h3>

						{product.shortDescription && variant !== "compact" && (
							<p className="text-sm text-muted-foreground font-display font-light line-clamp-2">
								{product.shortDescription}
							</p>
						)}

						{/* Price */}
						{formattedPrice ? (
							<p className="text-2xl font-display font-light text-primary">
								{formattedPrice}
							</p>
						) : product.priceNote ? (
							<p className="text-sm font-display font-medium text-muted-foreground">
								{product.priceNote}
							</p>
						) : null}
					</CardContent>

					{/* Footer with CTA */}
					{showQuickAdd && (
						<CardFooter className="p-6 pt-0">
							<AddToCartButton
								product={product}
								variant="outline"
								className="w-full rounded-full"
							/>
						</CardFooter>
					)}
				</Card>
			</Link>
		</div>
	);
}