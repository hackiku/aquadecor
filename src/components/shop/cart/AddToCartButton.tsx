// src/components/shop/cart/AddToCartButton.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { ShoppingCart, Calculator, ArrowRight } from "lucide-react";
import { Button } from "~/components/ui/button";
import { GiftModal } from "~/components/shop/GiftModal";
import { cn } from "~/lib/utils";

// Product info needed to add to cart (simple type, not tied to schema)
type ProductForAddToCart = {
	id: string;
	slug: string;
	name: string;
	sku: string;
	basePriceEurCents: number | null;
	quantity?: number;
	selectedOptions?: any[];
};

interface AddToCartButtonProps {
	product: ProductForAddToCart;
	variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
	size?: "default" | "sm" | "lg" | "icon";
	className?: string;
	disabled?: boolean;
	requiresSelection?: boolean;
	productUrl?: string;
}

export function AddToCartButton({
	product,
	variant = "default",
	size = "default",
	className,
	disabled = false,
	requiresSelection = false,
	productUrl
}: AddToCartButtonProps) {
	const [isLoading, setIsLoading] = useState(false);
	const [showGiftModal, setShowGiftModal] = useState(false);
	const [cartTotal, setCartTotal] = useState(0);

	const hasPrice = product.basePriceEurCents !== null;
	const isQuoteProduct = !hasPrice;

	// If product requires selection (variants/addons) or is a quote product,
	// the button becomes a navigation button.
	if (requiresSelection && productUrl) {
		return (
			<Button asChild
				variant={isQuoteProduct ? "secondary" : "default"}
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

	const calculateCartTotal = (items: any[]) => {
		return items.reduce((sum, item) => {
			return sum + ((item.price ?? 0) * item.quantity)
		}, 0)
	}

	const handleClick = async (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();

		setIsLoading(true);

		if (isQuoteProduct) {
			console.log("Redirecting to calculator/quote page for:", product.id);
		} else {
			// --- ADD TO CART LOGIC ---
			const cart = localStorage.getItem("cart");
			const items = cart ? JSON.parse(cart) : [];
			const quantity = product.quantity || 1;

			items.push({
				id: crypto.randomUUID(),
				productId: product.id,
				name: product.name,
				sku: product.sku,
				price: product.basePriceEurCents,
				quantity: quantity,
				selectedOptions: product.selectedOptions,
				addedAt: new Date().toISOString(),
			});

			localStorage.setItem("cart", JSON.stringify(items));
			window.dispatchEvent(new CustomEvent("cart-updated", { detail: { items } }));

			// Calculate total and show gift modal
			const total = calculateCartTotal(items);
			setCartTotal(total);
			setShowGiftModal(true);

			console.log("Added to cart:", product);
		}

		setTimeout(() => setIsLoading(false), 500);
	};

	return (
		<>
			<Button
				variant={variant}
				size={size}
				className={cn("gap-2 shadow-sm transition-all active:scale-95", className)}
				onClick={handleClick}
				disabled={isLoading || disabled}
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

			{/* Gift Progress Modal */}
			<GiftModal
				isOpen={showGiftModal}
				onClose={() => setShowGiftModal(false)}
				cartTotal={cartTotal}
			/>
		</>
	);
}