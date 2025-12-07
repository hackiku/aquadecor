// src/components/shop/cart/CartItem.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, X, Package } from "lucide-react";
import { Button } from "~/components/ui/button";
import type { Product } from "~/server/db/schema/shop";

// Type matches what CartDrawer passes (ProductForCart)
type ProductForCart = Pick<Product, 'id' | 'slug' | 'sku' | 'basePriceEurCents' | 'priceNote' | 'stockStatus'> & {
	categoryId: string;
	name: string | null;
	shortDescription: string | null;
	heroImageUrl: string | null; // UPDATED from featuredImageUrl
	categorySlug: string | null;
	productLineSlug: string | null;
};

interface CartItemProps {
	item: {
		id: string;
		productId: string;
		quantity: number;
		addedAt: Date;
		product: ProductForCart;
	};
	onUpdateQuantity: (quantity: number) => void;
	onRemove: () => void;
}

export function CartItem({ item, onUpdateQuantity, onRemove }: CartItemProps) {
	const { product, quantity } = item;

	const productUrl = `/shop/${product.productLineSlug ?? ''}/${product.categorySlug ?? ''}/${product.slug}`;
	const displayName = product.name ?? "Unknown Product";
	const pricePerUnit = product.basePriceEurCents ?? 0;
	const itemTotal = (pricePerUnit * quantity) / 100;

	return (
		<div className="flex gap-4 group">
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
			<div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
				<div>
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

					{quantity > 1 && (
						<p className="text-xs text-muted-foreground font-display font-light mt-1">
							€{(pricePerUnit / 100).toFixed(2)} each
						</p>
					)}
				</div>

				<div className="flex items-center justify-between mt-2">
					{/* Quantity Controls */}
					<div className="flex items-center border rounded-full h-7">
						<Button
							variant="ghost"
							size="icon"
							className="h-7 w-7 rounded-l-full hover:bg-muted"
							onClick={() => onUpdateQuantity(Math.max(0, quantity - 1))}
							disabled={quantity <= 1}
						>
							<Minus className="h-3 w-3" />
						</Button>
						<span className="text-xs font-display font-medium w-6 text-center">
							{quantity}
						</span>
						<Button
							variant="ghost"
							size="icon"
							className="h-7 w-7 rounded-r-full hover:bg-muted"
							onClick={() => onUpdateQuantity(quantity + 1)}
						>
							<Plus className="h-3 w-3" />
						</Button>
					</div>

					{/* Total Price */}
					<p className="text-sm font-display font-semibold">
						€{itemTotal.toFixed(2)}
					</p>
				</div>
			</div>
		</div>
	);
}