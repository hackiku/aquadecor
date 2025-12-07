// src/components/shop/cart/AddToCartButton.tsx
"use client";

import { useState } from "react";
import { ShoppingCart, Calculator } from "lucide-react";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import type { Product } from "~/server/db/schema/shop";

// Minimal product info needed to add to cart
type ProductForAddToCart = Pick<Product, 'id' | 'basePriceEurCents'>;

interface AddToCartButtonProps {
	product: ProductForAddToCart;
	// Expanded to support all standard shadcn button variants
	variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
	size?: "default" | "sm" | "lg" | "icon";
	className?: string;
}

export function AddToCartButton({
	product,
	variant = "default",
	size = "default",
	className
}: AddToCartButtonProps) {
	const [isLoading, setIsLoading] = useState(false);

	const hasPrice = product.basePriceEurCents !== null;
	const isQuoteProduct = !hasPrice;

	const handleClick = async (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();

		setIsLoading(true);

		if (isQuoteProduct) {
			// Open quote modal
			console.log("Open quote modal for:", product.id);
			// TODO: Implement quote modal
		} else {
			// Add to cart
			const cart = localStorage.getItem("cart");
			const items = cart ? JSON.parse(cart) : [];

			// Check if product already in cart
			const existingIndex = items.findIndex((item: any) => item.productId === product.id);

			if (existingIndex > -1) {
				// Increment quantity
				items[existingIndex].quantity += 1;
			} else {
				// Add new item
				items.push({
					id: crypto.randomUUID(),
					productId: product.id,
					quantity: 1,
					addedAt: new Date().toISOString(),
				});
			}

			localStorage.setItem("cart", JSON.stringify(items));
			window.dispatchEvent(new CustomEvent("cart-updated", { detail: { items } }));

			// TODO: Show toast notification
			console.log("Added to cart:", product.id);
		}

		// Fake loading delay for UX
		setTimeout(() => setIsLoading(false), 500);
	};

	return (
		<Button
			variant={variant}
			size={size}
			className={cn("gap-2 shadow-sm transition-all active:scale-95", className)}
			onClick={handleClick}
			disabled={isLoading}
		>
			{isLoading ? (
				<span className="animate-pulse">Processing...</span>
			) : isQuoteProduct ? (
				<>
					<Calculator className="h-4 w-4" />
					Request Quote
				</>
			) : (
				<>
					<ShoppingCart className="h-4 w-4" />
					Add
				</>
			)}
		</Button>
	);
}