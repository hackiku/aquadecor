// src/components/shop/cart/CartItem.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, X, Package } from "lucide-react";
import { Button } from "~/components/ui/button";

interface CartItemProps {
	item: {
		id: string;
		productId: string;
		name: string;
		slug: string;
		priceEurCents: number;
		quantity: number;
		imageUrl?: string;
		categorySlug: string;
		productLineSlug: string;
	};
	onUpdateQuantity: (quantity: number) => void;
	onRemove: () => void;
}

export function CartItem({ item, onUpdateQuantity, onRemove }: CartItemProps) {
	const productUrl = `/shop/${item.productLineSlug}/${item.categorySlug}/${item.slug}`;
	const itemTotal = (item.priceEurCents * item.quantity) / 100;

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

				<div className="flex items-center justify-between">
					{/* Quantity Controls */}
					<div className="flex items-center gap-2">
						<Button
							variant="outline"
							size="icon"
							className="h-7 w-7 rounded-full"
							onClick={() => onUpdateQuantity(Math.max(0, item.quantity - 1))}
						>
							<Minus className="h-3 w-3" />
						</Button>
						<span className="text-sm font-display font-medium w-8 text-center">
							{item.quantity}
						</span>
						<Button
							variant="outline"
							size="icon"
							className="h-7 w-7 rounded-full"
							onClick={() => onUpdateQuantity(item.quantity + 1)}
						>
							<Plus className="h-3 w-3" />
						</Button>
					</div>

					{/* Price */}
					<p className="text-sm font-display font-medium">
						€{itemTotal.toFixed(2)}
					</p>
				</div>
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