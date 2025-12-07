// src/components/shop/product/ProductCard.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { Card } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Package } from "lucide-react";
import { WishlistButton } from "../wishlist/WishlistButton";
import { AddToCartButton } from "../cart/AddToCartButton";
import { cn } from "~/lib/utils";
import type { Product } from "~/server/db/schema/shop";

// Use the grid type from your setup
type ProductForCard = Pick<Product, 'id' | 'slug' | 'sku' | 'basePriceEurCents' | 'priceNote' | 'stockStatus'> & {
	name: string;
	shortDescription: string | null;
	heroImageUrl: string | null;
	heroImageAlt?: string | null;
	categorySlug: string;
	productLineSlug: string;
};

interface ProductCardProps {
	product: ProductForCard;
	variant?: "default" | "compact";
	className?: string;
}

export function ProductCard({ product, variant = "default", className }: ProductCardProps) {
	const productUrl = `/shop/${product.productLineSlug}/${product.categorySlug}/${product.slug}`;
	const hasPrice = product.basePriceEurCents !== null;

	// Price formatting
	const formattedPrice = hasPrice
		? new Intl.NumberFormat("en-DE", { style: "currency", currency: "EUR" }).format((product.basePriceEurCents ?? 0) / 100)
		: null;

	// Logic: If price note says "Custom Quote" and stock status is "requires_quote", 
	// we don't need to show the text "Custom Quote" twice.
	const showPriceNote = product.priceNote && product.stockStatus !== 'requires_quote';

	const stockBadgeConfig = {
		in_stock: { label: "In Stock", className: "bg-emerald-500/90 text-white" },
		made_to_order: { label: "Made to Order", className: "bg-blue-600/90 text-white" },
		requires_quote: { label: "Custom Only", className: "bg-slate-700/90 text-white" },
	};

	const badge = stockBadgeConfig[product.stockStatus as keyof typeof stockBadgeConfig];

	return (
		<Card className={cn("group relative flex flex-col h-full overflow-hidden border-2 border-border bg-card transition-all hover:border-primary/50 hover:shadow-xl", className)}>

			{/* CLICKABLE AREA WRAPPER (Excludes buttons) */}
			<Link href={productUrl} className="relative aspect-[4/3] w-full overflow-hidden bg-muted">

				{/* IMAGE */}
				{product.heroImageUrl ? (
					<Image
						src={product.heroImageUrl}
						alt={product.heroImageAlt || product.name}
						fill
						className="object-cover transition-transform duration-700 group-hover:scale-105"
						sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
					/>
				) : (
					<div className="flex h-full items-center justify-center bg-muted/50">
						<Package className="h-12 w-12 text-muted-foreground/30" />
					</div>
				)}

				{/* OVERLAY - Subtle gradient for text contrast if needed */}
				<div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

				{/* BADGES (Top Left) */}
				<div className="absolute top-3 left-3 flex flex-col gap-2">
					{product.sku && (
						<Badge variant="outline" className="bg-background/80 backdrop-blur font-mono text-xs shadow-xs">
							{product.sku}
						</Badge>
					)}
					{badge && (
						<Badge className={cn("shadow-sm backdrop-blur-sm border-none", badge.className)}>
							{badge.label}
						</Badge>
					)}
				</div>
			</Link>

			{/* WISHLIST BUTTON (Z-Index Fixed) */}
			{/* Placed outside Link so it doesn't trigger navigation */}
			<div className="absolute top-3 right-3 z-20">
				<WishlistButton
					productId={product.id}
					className="h-10 w-10 bg-white/80 dark:bg-black/50 hover:bg-white dark:hover:bg-black text-foreground shadow-sm cursor-pointer"
				/>
			</div>

			{/* CONTENT */}
			<div className="flex flex-1 flex-col p-5">
				<Link href={productUrl} className="block space-y-2 mb-4">
					<h3 className="font-display text-lg font-medium leading-tight group-hover:text-primary transition-colors">
						{product.name}
					</h3>
					{variant !== 'compact' && product.shortDescription && (
						<p className="text-sm text-muted-foreground line-clamp-2 font-light">
							{product.shortDescription}
						</p>
					)}
				</Link>

				<div className="mt-auto flex items-end justify-between gap-4 pt-4 border-t border-border/50">
					{/* PRICE BLOCK */}
					<div className="flex flex-col">
						{showPriceNote && (
							<span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
								{product.priceNote}
							</span>
						)}
						<span className="text-xl font-display font-semibold text-foreground">
							{formattedPrice || "Custom Quote"}
						</span>
					</div>

					{/* ACTION BUTTON */}
					<div className="shrink-0 z-20">
						<AddToCartButton
							product={{ id: product.id, basePriceEurCents: product.basePriceEurCents }}
							variant={hasPrice ? "default" : "secondary"}
							size="sm"
							className={cn("rounded-full", !hasPrice && "hover:bg-primary hover:text-primary-foreground")}
						/>
					</div>
				</div>
			</div>
		</Card>
	);
}