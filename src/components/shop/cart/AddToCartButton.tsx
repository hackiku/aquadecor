// src/components/shop/cart/AddToCartButton.tsx
"use client";

import { useState } from "react";
import Link from "next/link"; // Added for navigation
import { ShoppingCart, Calculator, ArrowRight } from "lucide-react";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import type { Product } from "~/server/db/schema/shop";

// Product info needed to add to cart (expanded)
type ProductForAddToCart = Pick<Product, 'id' | 'basePriceEurCents' | 'slug' | 'name' | 'sku'> & {
	quantity?: number; // Optional quantity/options included from PricingModule
	selectedOptions?: any[]; // Optional selected options from PricingModule
};

interface AddToCartButtonProps {
	product: ProductForAddToCart;
	variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
	size?: "default" | "sm" | "lg" | "icon";
	className?: string;

	// NEW PROPS for variant/option check (used by ProductCard)
	requiresSelection?: boolean; // If true, button should navigate to PDP
	productUrl?: string; // URL to navigate to if selection is required
}

export function AddToCartButton({
	product,
	variant = "default",
	size = "default",
	className,
	requiresSelection = false,
	productUrl
}: AddToCartButtonProps) {
	const [isLoading, setIsLoading] = useState(false);

	const hasPrice = product.basePriceEurCents !== null;
	const isQuoteProduct = !hasPrice;

	// If product requires selection (variants/addons) or is a quote product,
	// the button becomes a navigation button.
	if (requiresSelection && productUrl) {
		return (
			<Button asChild
				variant={isQuoteProduct ? "secondary" : "default"} // Use secondary for quotes/view
				size={size}
				className={cn("gap-2 shadow-sm transition-all", className)}
			>
				<Link href={productUrl}>
					{isQuoteProduct ? <Calculator className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
					{isQuoteProduct ? "View & Quote" : "View Product"}
				</Link>
			</Button>
		)
	}


	const handleClick = async (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();

		setIsLoading(true);

		if (isQuoteProduct) {
			// This path should ideally be handled by the 'requiresSelection' logic
			console.log("Redirecting to calculator/quote page for:", product.id);
			// For a dedicated Quote button, a direct link is best, but this component's new logic should handle navigation.
		} else {
			// --- ADD TO CART LOGIC ---
			const cart = localStorage.getItem("cart");
			const items = cart ? JSON.parse(cart) : [];
			const quantity = product.quantity || 1; // Use quantity from PricingModule or default to 1

			// Simplistic add to cart for demonstration (no variant/addon logic check)
			// In a real app, products with options should have an ID that includes the options hash.

			items.push({
				id: crypto.randomUUID(),
				productId: product.id,
				name: product.name,
				sku: product.sku,
				price: product.basePriceEurCents, // Use the final calculated price
				quantity: quantity,
				selectedOptions: product.selectedOptions, // Pass options
				addedAt: new Date().toISOString(),
			});

			localStorage.setItem("cart", JSON.stringify(items));
			window.dispatchEvent(new CustomEvent("cart-updated", { detail: { items } }));

			console.log("Added to cart:", product);
		}

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
					Add to Cart
				</>
			)}
		</Button>
	);
}