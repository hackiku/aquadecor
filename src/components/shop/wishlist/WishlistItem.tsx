// src/components/shop/wishlist/WishlistItem.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { X, ShoppingCart, Package } from "lucide-react";
import { Button } from "~/components/ui/button";
import type { Product } from "~/server/db/schema/shop";

// Type for wishlist product (matches what WishlistDrawer passes)
type ProductForWishlist = Pick<Product, 'id' | 'slug' | 'basePriceEurCents' | 'priceNote'> & {
	name: string | null;
	shortDescription: string | null;
	featuredImageUrl: string | null;
	categorySlug: string | null;
	productLineSlug: string | null;
};

interface WishlistItemProps {
	product: ProductForWishlist;
	onRemove: () => void;
}

export function WishlistItem({ product, onRemove }: WishlistItemProps) {
	// Safe handling of nullable fields
	const productUrl = `/shop/${product.productLineSlug ?? ''}/${product.categorySlug ?? ''}/${product.slug}`;
	const displayName = product.name ?? "Unknown Product";
	const hasPrice = product.basePriceEurCents !== null;

	const handleAddToCart = (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();

		if (hasPrice) {
			// Add to cart
			const cartItem = {
				id: crypto.randomUUID(),
				productId: product.id,
				quantity: 1,
				addedAt: new Date(),
			};

			// Get existing cart
			const existingCart = localStorage.getItem("cart");
			const cart = existingCart ? JSON.parse(existingCart) : [];

			// Check if product already in cart
			const existingItemIndex = cart.findIndex((item: any) => item.productId === product.id);

			if (existingItemIndex >= 0) {
				// Increment quantity
				cart[existingItemIndex].quantity += 1;
			} else {
				// Add new item
				cart.push(cartItem);
			}

			// Save and notify
			localStorage.setItem("cart", JSON.stringify(cart));
			window.dispatchEvent(new CustomEvent("cart-updated", { detail: { items: cart } }));

			// TODO: Show toast notification
			console.log("Added to cart:", product.id);
		} else {
			// Open quote modal for custom products
			// TODO: Implement quote modal
			console.log("Request quote:", product.id);
		}
	};

	return (
		<div className="flex gap-4 group">
			{/* Image */}
			<Link href={productUrl} className="relative w-20 h-20 rounded-lg overflow-hidden bg-muted flex-shrink-0">
				{product.featuredImageUrl ? (
					<Image
						src={product.featuredImageUrl}
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
			<div className="flex-1 min-w-0 space-y-2">
				<Link href={productUrl} className="block">
					<h3 className="font-display font-normal text-sm leading-tight line-clamp-2 group-hover:text-primary transition-colors">
						{displayName}
					</h3>
				</Link>

				{/* Description */}
				{product.shortDescription && (
					<p className="text-xs text-muted-foreground font-display font-light line-clamp-1">
						{product.shortDescription}
					</p>
				)}

				{/* Price */}
				<div className="flex items-center justify-between">
					{hasPrice ? (
						<p className="text-sm font-display font-medium">
							€{((product.basePriceEurCents ?? 0) / 100).toFixed(2)}
						</p>
					) : (
						<p className="text-xs text-muted-foreground font-display font-medium">
							{product.priceNote ?? "Custom Quote"}
						</p>
					)}
				</div>

				{/* Add to Cart Button */}
				<Button
					variant="outline"
					size="sm"
					className="w-full rounded-full text-xs gap-2"
					onClick={handleAddToCart}
				>
					<ShoppingCart className="h-3 w-3" />
					{hasPrice ? "Add to Cart" : "Request Quote"}
				</Button>
			</div>

			{/* Remove Button */}
			<Button
				variant="ghost"
				size="icon"
				className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
				onClick={onRemove}
			>
				<X className="h-4 w-4" />
			</Button>
		</div>
	);
}