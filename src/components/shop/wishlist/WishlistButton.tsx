// src/components/shop/wishlist/WishlistButton.tsx
"use client";

import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

interface WishlistButtonProps {
	productId: string;
	variant?: "default" | "ghost";
	size?: "default" | "sm" | "icon";
	className?: string;
}

export function WishlistButton({
	productId,
	variant = "ghost",
	size = "icon",
	className
}: WishlistButtonProps) {
	const [isInWishlist, setIsInWishlist] = useState(false);
	const [isAnimating, setIsAnimating] = useState(false);

	// Load wishlist from localStorage
	useEffect(() => {
		const wishlist = localStorage.getItem("wishlist");
		if (wishlist) {
			const items = JSON.parse(wishlist) as string[];
			setIsInWishlist(items.includes(productId));
		}
	}, [productId]);

	const toggleWishlist = (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();

		// Trigger animation
		setIsAnimating(true);
		setTimeout(() => setIsAnimating(false), 300);

		// Get current wishlist
		const wishlist = localStorage.getItem("wishlist");
		let items: string[] = wishlist ? JSON.parse(wishlist) : [];

		if (isInWishlist) {
			// Remove from wishlist
			items = items.filter(id => id !== productId);
			setIsInWishlist(false);
		} else {
			// Add to wishlist
			items.push(productId);
			setIsInWishlist(true);
		}

		// Save to localStorage
		localStorage.setItem("wishlist", JSON.stringify(items));

		// Dispatch event for other components to listen
		window.dispatchEvent(new CustomEvent("wishlist-updated", {
			detail: { items }
		}));
	};

	return (
		<Button
			variant={variant}
			size={size}
			className={cn(
				"rounded-full backdrop-blur-sm",
				isInWishlist && "bg-primary/10 hover:bg-primary/20",
				className
			)}
			onClick={toggleWishlist}
			aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
		>
			<Heart
				className={cn(
					"h-4 w-4 transition-all duration-300",
					isInWishlist && "fill-primary text-primary",
					isAnimating && "scale-125"
				)}
			/>
		</Button>
	);
}