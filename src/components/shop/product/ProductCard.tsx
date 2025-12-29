// src/components/shop/product/ProductCard.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Badge } from "~/components/ui/badge";
import { Package } from "lucide-react";
import { WishlistButton } from "../wishlist/WishlistButton";
import { AddToCartButton } from "../cart/AddToCartButton";
import { DiscountBadge } from "../DiscountBadge";
import { cn } from "~/lib/utils";
import type { Product } from "~/server/db/schema/shop";

// Extend the core ProductForCard type to include the necessary JSONB fields
type ProductForCard = Pick<Product, 'id' | 'slug' | 'sku' | 'stockStatus'> & {
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

	// Options logic fields (need to be fetched/joined by the tRPC call)
	variantOptions?: any | null;
	addonOptions?: any | null;

	// Optional discount field (from DB or promotion logic)
	discount?: {
		type: 'promoter' | 'sale' | 'signup' | 'percentage' | 'fixed';
		value: number;
		code?: string;
	} | null;
};

interface ProductCardProps {
	product: ProductForCard;
	variant?: "default" | "compact";
	className?: string;
}

export function ProductCard({ product, variant = "default", className }: ProductCardProps) {
	const t = useTranslations('shop.productCard');

	const productUrl = `/shop/${product.productLineSlug}/${product.categorySlug}/${product.slug}`;
	const hasPrice = product.basePriceEurCents !== null;

	// --- LOGIC CHECKS ---
	// 1. Does the product require the user to go to the PDP to select options?
	const requiresSelection =
		!!product.variantOptions?.quantity?.options?.length ||
		!!product.addonOptions?.items?.length;

	// 2. Is this a custom quote product?
	const isCustomQuote = product.stockStatus === 'requires_quote';

	// Price formatting
	const formattedPrice = hasPrice
		? new Intl.NumberFormat("en-DE", { style: "currency", currency: "EUR" }).format((product.basePriceEurCents ?? 0) / 100)
		: null;

	// Stock badge configuration with translations
	const stockBadgeConfig = {
		in_stock: {
			label: t('inStock'),
			className: "bg-emerald-500/70 text-white"
		},
		made_to_order: {
			label: t('madeToOrder'),
			className: "bg-blue-600/70 text-white"
		},
		requires_quote: {
			label: "Custom Only",
			className: "bg-slate-700/70 text-white"
		},
	};

	const badge = stockBadgeConfig[product.stockStatus as keyof typeof stockBadgeConfig];

	return (
		<motion.div
			initial="idle"
			whileHover="hover"
			className={cn(
				"group relative flex h-[420px] w-full flex-col overflow-hidden rounded-2xl border-2 border-border bg-card shadow-sm transition-all hover:border-primary/50 hover:shadow-xl",
				className
			)}
		>
			{/* IMAGE LAYER */}
			<Link href={productUrl} className="relative h-[280px] w-full overflow-hidden">
				{product.heroImageUrl ? (
					<Image
						src={product.heroImageUrl}
						alt={product.heroImageAlt || product.name}
						fill
						className="object-cover transition-transform duration-700 group-hover:scale-110"
						sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
					/>
				) : (
					<div className="flex h-full items-center justify-center bg-muted/50">
						<Package className="h-12 w-12 text-muted-foreground/30" />
					</div>
				)}

				{/* SUBTLE HOVER GRADIENT */}
				<div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

				{/* TOP BADGES - Single Row */}
				<div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 z-10">
					<div className="flex items-center gap-2 flex-wrap">
						{product.sku && (
							<Badge
								variant="secondary"
								className="bg-background/80 backdrop-blur-sm font-mono text-sm px-3 py-1 shadow-sm border-border"
							>
								{product.sku}
							</Badge>
						)}
						{badge && (
							<Badge className={cn("backdrop-blur-sm border-none text-sm px-3 py-1 shadow-sm", badge.className)}>
								{badge.label}
							</Badge>
						)}
						{/* DISCOUNT BADGE */}
						{product.discount && (
							<DiscountBadge
								type={product.discount.type}
								value={product.discount.value}
								code={product.discount.code}
								size="sm"
								variant="subtle"
							/>
						)}
					</div>

					{/* WISHLIST BUTTON */}
					<WishlistButton
						productId={product.id}
						className="h-9 w-9 bg-background/80 hover:bg-background backdrop-blur-sm text-foreground shadow-sm cursor-pointer"
					/>
				</div>
			</Link>

			{/* CONTENT SECTION */}
			<div className="relative flex flex-1 flex-col p-5">
				<motion.div
					variants={{
						idle: { y: 0 },
						hover: { y: -3 }
					}}
					transition={{ duration: 0.3, ease: "easeOut" }}
					className="space-y-3 flex-1"
				>
					<Link href={productUrl} className="block space-y-2">
						<h3 className="font-display text-xl font-medium leading-tight group-hover:text-primary transition-colors">
							{product.name}
						</h3>
						{variant !== 'compact' && product.shortDescription && (
							<motion.p
								className="text-sm text-muted-foreground line-clamp-2 font-light leading-relaxed"
								variants={{
									idle: { opacity: 0.8 },
									hover: { opacity: 1 }
								}}
							>
								{product.shortDescription}
							</motion.p>
						)}
					</Link>
				</motion.div>

				{/* PRICE & CTA ROW */}
				<div className="flex items-end justify-between gap-4 pt-4">
					<div className="flex flex-col">
						{formattedPrice && (
							<span className="text-2xl font-display font-semibold text-foreground">
								{formattedPrice}
							</span>
						)}
					</div>

					<div className="shrink-0 z-20">
						<AddToCartButton
							product={{
								id: product.id,
								slug: product.slug,
								name: product.name,
								sku: product.sku,
								basePriceEurCents: product.basePriceEurCents,
							}}
							variant={hasPrice ? "default" : "secondary"}
							size="lg"
							requiresSelection={requiresSelection || isCustomQuote}
							productUrl={productUrl}
							className="rounded-full"
						/>
					</div>
				</div>
			</div>
		</motion.div>
	);
}