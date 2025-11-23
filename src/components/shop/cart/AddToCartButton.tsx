// src/components/shop/cart/AddToCartButton.tsx
"use client";

import { useState } from "react";
import { ShoppingCart, Calculator } from "lucide-react";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

interface AddToCartButtonProps {
	product: {
		id: string;
		basePriceEurCents?: number | null;
		stockStatus: string;
	};
	variant?: "default" | "outline" | "ghost";
	size?: "default" | "sm" | "lg";
	className?: string;
}

export function AddToCartButton({
	product,
	variant = "default",
	size = "default",
	className
}: AddToCartButtonProps) {
	const [isLoading, setIsLoading] = useState(false);

	const hasPrice = product.basePriceEurCents !== null && product.basePriceEurCents !== undefined;
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
			console.log("Add to cart:", product.id);
			// TODO: Implement cart logic
		}

		setTimeout(() => setIsLoading(false), 500);
	};

	return (
		<Button
			variant={variant}
			size={size}
			className={cn("gap-2", className)}
			onClick={handleClick}
			disabled={isLoading}
		>
			{isLoading ? (
				<>Processing...</>
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