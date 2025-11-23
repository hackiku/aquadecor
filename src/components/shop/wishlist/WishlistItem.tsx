// src/components/shop/wishlist/WishlistItem.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { X, ShoppingCart, Package } from "lucide-react";
import { Button } from "~/components/ui/button";

interface WishlistItemProps {
	item: {
		id: string;
		name: string;
		slug: string;
		priceEurCents?: number | null;
		priceNote?: string;
		imageUrl?: string;
		categorySlug: string;
		productLineSlug: string;
	};
	onRemove: () => void;
}

export function WishlistItem({ item, onRemove }: WishlistItemProps) {
	const productUrl = `/shop/${item.productLineSlug}/${item.categorySlug}/${item.slug}`;
	const hasPrice = item.priceEurCents !== null && item.priceEurCents !== undefined;

	const handleAddToCart = (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();

		if (hasPrice) {
			// TODO: Add to cart logic
			console.log("Add to cart:", item.id);
		} else {
			// TODO: Open quote modal
			console.log("Request quote:", item.id);
		}
	};

	return (
		<div className="flex gap-4 group">
			{/* Image */}
			<Link href={productUrl} className="relative w-20 h-20 rounded-lg overflow-hidden bg-muted flex-shrink-0">
				{item.imageUrl ? (
					<Image
						src={item.imageUrl}
						alt={item.name}
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
				<Link
					href={productUrl}
					className="block"
				>
					<h3 className="font-display font-normal text-sm leading-tight line-clamp-2 group-hover:text-primary transition-colors">
						{item.name}
					</h3>
				</Link>

				{/* Price */}
				<div className="flex items-center justify-between">
					{hasPrice ? (
						<p className="text-sm font-display font-medium">
							€{(item.priceEurCents / 100).toFixed(2)}
						</p>
					) : (
						<p className="text-xs text-muted-foreground font-display font-medium">
							{item.priceNote || "Custom Quote"}
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