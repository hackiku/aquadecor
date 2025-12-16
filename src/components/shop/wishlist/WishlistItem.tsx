// src/components/shop/wishlist/WishlistItem.tsx
"use client";

import Image from "next/image";
import { X, ShoppingCart, Package } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Link } from "~/i18n/navigation";
import { useTranslations } from "next-intl";
import type { Product } from "~/server/db/schema/shop";

// Type matches what WishlistDrawer passes (ProductForWishlist)
type ProductForWishlist = Pick<Product, 'id' | 'slug'> & {
	name: string | null;
	shortDescription: string | null;
	heroImageUrl: string | null;
	categorySlug: string | null;
	productLineSlug: string | null;
	basePriceEurCents: number | null;
	priceNote: string | null;
};

interface WishlistItemProps {
	product: ProductForWishlist;
	onRemove: () => void;
}

export function WishlistItem({ product, onRemove }: WishlistItemProps) {
	const t = useTranslations("account.wishlist");

	const productUrl = `/shop/${product.productLineSlug ?? ''}/${product.categorySlug ?? ''}/${product.slug}`;
	const displayName = product.name ?? "Unknown Product";
	const hasPrice = product.basePriceEurCents !== null;

	const handleAddToCart = (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();

		if (hasPrice) {
			const cartItem = {
				id: crypto.randomUUID(),
				productId: product.id,
				quantity: 1,
				addedAt: new Date(),
			};

			const existingCart = localStorage.getItem("cart");
			const cart = existingCart ? JSON.parse(existingCart) : [];
			const existingItemIndex = cart.findIndex((item: any) => item.productId === product.id);

			if (existingItemIndex >= 0) {
				cart[existingItemIndex].quantity += 1;
			} else {
				cart.push(cartItem);
			}

			localStorage.setItem("cart", JSON.stringify(cart));
			window.dispatchEvent(new CustomEvent("cart-updated", { detail: { items: cart } }));
		} else {
			console.log("Request quote:", product.id);
		}
	};

	return (
		<div className="flex gap-4 group relative">
			{/* Image */}
			<Link href={productUrl} className="relative w-20 h-20 rounded-lg overflow-hidden bg-muted flex-shrink-0 border border-border">
				{product.heroImageUrl ? (
					<Image
						src={product.heroImageUrl}
						alt={displayName}
						fill
						className="object-cover"
						sizes="80px"
					/>
				) : (
					<div className="w-full h-full flex items-center justify-center">
						<Package className="h-8 w-8 text-muted-foreground/30" />
					</div>
				)}
			</Link>

			{/* Details */}
			<div className="flex-1 min-w-0 space-y-1.5">
				<div className="flex justify-between items-start gap-2">
					<Link href={productUrl} className="block">
						<h3 className="font-display font-medium text-sm leading-tight line-clamp-2 hover:text-primary transition-colors">
							{displayName}
						</h3>
					</Link>
					<Button
						variant="ghost"
						size="icon"
						className="h-6 w-6 -mr-2 -mt-1 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
						onClick={onRemove}
					>
						<X className="h-3.5 w-3.5" />
					</Button>
				</div>

				{product.shortDescription && (
					<p className="text-xs text-muted-foreground font-display font-light line-clamp-1">
						{product.shortDescription}
					</p>
				)}

				<div className="flex items-center justify-between pt-1">
					{hasPrice ? (
						<p className="text-sm font-display font-semibold">
							€{((product.basePriceEurCents ?? 0) / 100).toFixed(2)}
						</p>
					) : (
						<p className="text-xs text-muted-foreground font-display font-medium">
							{product.priceNote ?? t("outOfStock")}
						</p>
					)}

					<Button
						variant="secondary"
						size="sm"
						className="h-7 px-3 text-xs rounded-full gap-1.5"
						onClick={handleAddToCart}
					>
						<ShoppingCart className="h-3 w-3" />
						{hasPrice ? t("addToCart") : "Quote"}
					</Button>
				</div>
			</div>
		</div>
	);
}