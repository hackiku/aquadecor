// src/components/shop/product/ProductCard.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { Card } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Package } from "lucide-react";
import { WishlistButton } from "../wishlist/WishlistButton";
import type { Product } from "~/server/db/schema/shop";

interface ProductCardProps {
	product: Pick<Product, 'id' | 'slug' | 'sku' | 'basePriceEurCents' | 'priceNote' | 'stockStatus'> & {
		name: string;
		shortDescription: string | null;
		heroImageUrl: string | null;
		heroImageAlt?: string | null;
		categorySlug: string;
		productLineSlug: string;
	};
	variant?: "default" | "compact";
	showQuickAdd?: boolean;
}

export function ProductCard({ product, variant = "default", showQuickAdd = false }: ProductCardProps) {
	const productUrl = `/shop/${product.productLineSlug}/${product.categorySlug}/${product.slug}`;
	const hasPrice = product.basePriceEurCents !== null;

	const formattedPrice = hasPrice
		? `€${((product.basePriceEurCents ?? 0) / 100).toFixed(2)}`
		: null;

	// Stock badge configuration
	const stockBadgeConfig = {
		in_stock: { variant: "default" as const, label: "In Stock", className: "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20" },
		made_to_order: { variant: "outline" as const, label: "Made to Order", className: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20" },
		requires_quote: { variant: "outline" as const, label: "Custom Quote", className: "bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20" },
	};

	const stockBadge = stockBadgeConfig[product.stockStatus as keyof typeof stockBadgeConfig];

	return (
		<Link
			href={productUrl}
			className="group block h-full"
		>
			<Card className="h-full overflow-hidden border-2 border-border hover:border-primary/50 transition-all duration-300 hover:shadow-2xl bg-card">
				{/* Image Container with Gradient Overlay */}
				<div className="relative aspect-[4/3] overflow-hidden bg-muted">
					{product.heroImageUrl ? (
						<Image
							src={product.heroImageUrl}
							alt={product.heroImageAlt || product.name}
							fill
							className="object-cover transition-transform duration-500 group-hover:scale-110"
							sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
						/>
					) : (
						<div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
							<Package className="h-16 w-16 text-muted-foreground/20" />
						</div>
					)}

					{/* Gradient overlay for text readability */}
					<div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/95 dark:to-black/90" />

					{/* Wishlist Button - Top Right */}
					<div className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
						<WishlistButton productId={product.id} />
					</div>

					{/* Top Badges Row */}
					<div className="absolute top-3 left-3 flex items-center gap-2">
						{/* SKU Badge */}
						{product.sku && (
							<Badge
								variant="secondary"
								className="font-display font-medium backdrop-blur-sm bg-background/90 dark:bg-black/90"
							>
								{product.sku}
							</Badge>
						)}

						{/* Stock Badge */}
						{stockBadge && (
							<Badge
								variant={stockBadge.variant}
								className={`text-xs font-display backdrop-blur-sm ${stockBadge.className}`}
							>
								{stockBadge.label}
							</Badge>
						)}
					</div>

					{/* Content Overlay - Bottom */}
					<div className="absolute bottom-0 left-0 right-0 p-5 space-y-2">
						{/* Product Name */}
						<h3 className="font-display font-medium text-lg leading-tight line-clamp-2 text-foreground group-hover:text-primary transition-colors">
							{product.name}
						</h3>

						{/* Short Description - Hidden in compact mode */}
						{variant !== "compact" && product.shortDescription && (
							<p className="text-sm text-muted-foreground font-display font-light line-clamp-2 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
								{product.shortDescription}
							</p>
						)}

						{/* Price */}
						<div className="pt-1">
							{formattedPrice ? (
								<p className="text-2xl font-display font-light text-foreground">
									{formattedPrice}
								</p>
							) : product.priceNote ? (
								<p className="text-sm font-display font-medium text-muted-foreground">
									{product.priceNote}
								</p>
							) : null}
						</div>
					</div>
				</div>
			</Card>
		</Link>
	);
}