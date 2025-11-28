// src/components/shop/wishlist/WishlistDrawer.tsx
"use client";

import { useState, useEffect } from "react";
import { X, Heart } from "lucide-react";
import { Button } from "~/components/ui/button";
import { WishlistItem } from "./WishlistItem";
import { SignupIncentive } from "~/components/cta/SignupIncentive";
import { api } from "~/trpc/react";
import type { Product } from "~/server/db/schema/shop";

// ============================================================================
// CLIENT-ONLY TYPES (localStorage wishlist state)
// ============================================================================

// Raw wishlist item stored in localStorage
interface WishlistItemData {
	productId: string;
	addedAt: Date;
}

// Product data from tRPC getByIds endpoint
type ProductForWishlist = Pick<Product, 'id' | 'slug' | 'basePriceEurCents' | 'priceNote'> & {
	name: string | null;
	shortDescription: string | null;
	featuredImageUrl: string | null;
	categorySlug: string | null;
	productLineSlug: string | null;
};

// ============================================================================
// COMPONENT
// ============================================================================

interface WishlistDrawerProps {
	isOpen: boolean;
	onClose: () => void;
}

export function WishlistDrawer({ isOpen, onClose }: WishlistDrawerProps) {
	const [wishlistIds, setWishlistIds] = useState<string[]>([]);

	// Load wishlist from localStorage on mount
	useEffect(() => {
		const loadWishlist = () => {
			const wishlist = localStorage.getItem("wishlist");
			if (wishlist) {
				try {
					const parsed = JSON.parse(wishlist);
					// Extract just the product IDs
					const ids = Array.isArray(parsed)
						? parsed.map((item: any) => typeof item === 'string' ? item : item.productId)
						: [];
					setWishlistIds(ids);
				} catch (error) {
					console.error("Failed to parse wishlist:", error);
					localStorage.removeItem("wishlist");
				}
			}
		};

		if (isOpen) {
			loadWishlist();
		}
	}, [isOpen]);

	// Listen for wishlist updates from other components
	useEffect(() => {
		const handleWishlistUpdate = (e: CustomEvent<{ items: string[] }>) => {
			setWishlistIds(e.detail.items);
		};

		window.addEventListener("wishlist-updated", handleWishlistUpdate as EventListener);
		return () => window.removeEventListener("wishlist-updated", handleWishlistUpdate as EventListener);
	}, []);

	// Fetch product details for all wishlist items
	const { data: products, isLoading } = api.product.getByIds.useQuery(
		{ ids: wishlistIds, locale: "en" },
		{ enabled: wishlistIds.length > 0 && isOpen }
	);

	// Remove item from wishlist
	const removeItem = (productId: string) => {
		const updated = wishlistIds.filter(id => id !== productId);
		setWishlistIds(updated);
		localStorage.setItem("wishlist", JSON.stringify(updated));
		window.dispatchEvent(new CustomEvent("wishlist-updated", { detail: { items: updated } }));
	};

	// Clear entire wishlist
	const clearWishlist = () => {
		setWishlistIds([]);
		localStorage.removeItem("wishlist");
		window.dispatchEvent(new CustomEvent("wishlist-updated", { detail: { items: [] } }));
	};

	const isEmpty = wishlistIds.length === 0;

	return (
		<>
			{/* Backdrop */}
			{isOpen && (
				<div
					className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity"
					onClick={onClose}
				/>
			)}

			{/* Drawer */}
			<div
				className={`fixed top-0 right-0 h-full w-full sm:w-[400px] bg-background border-l shadow-2xl z-50 transition-transform duration-300 flex flex-col ${isOpen ? "translate-x-0" : "translate-x-full"
					}`}
			>
				{/* Header */}
				<div className="flex items-center justify-between p-6 border-b">
					<div className="flex items-center gap-3">
						<Heart className="h-5 w-5 text-primary fill-primary" />
						<h2 className="text-xl font-display font-normal">
							Wishlist ({wishlistIds.length})
						</h2>
					</div>
					<Button variant="ghost" size="icon" onClick={onClose}>
						<X className="h-5 w-5" />
					</Button>
				</div>

				{/* Items */}
				<div className="flex-1 overflow-y-auto p-6 space-y-6">
					{isLoading ? (
						<div className="flex items-center justify-center h-full">
							<p className="text-muted-foreground font-display font-light">Loading...</p>
						</div>
					) : isEmpty ? (
						<div className="flex flex-col items-center justify-center h-full text-center space-y-4">
							<Heart className="h-16 w-16 text-muted-foreground/20" />
							<div className="space-y-2">
								<p className="text-lg text-muted-foreground font-display font-light">
									Your wishlist is empty
								</p>
								<p className="text-sm text-muted-foreground/70 font-display font-light">
									Start saving products you love
								</p>
							</div>
							<Button onClick={onClose} variant="outline" className="rounded-full">
								Browse Products
							</Button>
						</div>
					) : (
						<>
							{/* Wishlist Items */}
							<div className="space-y-4">
								{products?.map((product) => (
									<WishlistItem
										key={product.id}
										product={product as ProductForWishlist}
										onRemove={() => removeItem(product.id)}
									/>
								))}
							</div>

							{/* Signup Incentive */}
							<SignupIncentive trigger="wishlist" />

							{/* Clear All Button */}
							{wishlistIds.length > 1 && (
								<Button
									variant="outline"
									size="sm"
									className="w-full rounded-full"
									onClick={clearWishlist}
								>
									Clear All ({wishlistIds.length})
								</Button>
							)}
						</>
					)}
				</div>
			</div>
		</>
	);
}