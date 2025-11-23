// src/components/shop/wishlist/WishlistDrawer.tsx
"use client";

import { useState, useEffect } from "react";
import { X, Heart, ArrowRight } from "lucide-react";
import { Button } from "~/components/ui/button";
import { WishlistItem } from "./WishlistItem";

interface WishlistDrawerProps {
	isOpen: boolean;
	onClose: () => void;
}

interface WishlistItemData {
	id: string;
	name: string;
	slug: string;
	priceEurCents?: number | null;
	priceNote?: string;
	imageUrl?: string;
	categorySlug: string;
	productLineSlug: string;
}

export function WishlistDrawer({ isOpen, onClose }: WishlistDrawerProps) {
	const [items, setItems] = useState<WishlistItemData[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	// Load wishlist from localStorage
	useEffect(() => {
		if (!isOpen) return;

		const wishlist = localStorage.getItem("wishlist");
		if (wishlist) {
			const productIds = JSON.parse(wishlist) as string[];

			// TODO: Fetch actual product data from tRPC
			// For now, just mock data
			setIsLoading(false);
		} else {
			setIsLoading(false);
		}
	}, [isOpen]);

	// Listen for wishlist updates
	useEffect(() => {
		const handleWishlistUpdate = (e: CustomEvent) => {
			// TODO: Reload wishlist items
			console.log("Wishlist updated", e.detail);
		};

		window.addEventListener("wishlist-updated", handleWishlistUpdate as EventListener);
		return () => window.removeEventListener("wishlist-updated", handleWishlistUpdate as EventListener);
	}, []);

	const removeItem = (productId: string) => {
		const wishlist = localStorage.getItem("wishlist");
		if (wishlist) {
			const productIds = JSON.parse(wishlist) as string[];
			const updated = productIds.filter(id => id !== productId);
			localStorage.setItem("wishlist", JSON.stringify(updated));
			window.dispatchEvent(new CustomEvent("wishlist-updated", { detail: { items: updated } }));

			// Update local state
			setItems(items.filter(item => item.id !== productId));
		}
	};

	const isEmpty = items.length === 0;

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
							Wishlist ({items.length})
						</h2>
					</div>
					<Button variant="ghost" size="icon" onClick={onClose}>
						<X className="h-5 w-5" />
					</Button>
				</div>

				{/* Items */}
				<div className="flex-1 overflow-y-auto p-6">
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
									Start adding products you love
								</p>
							</div>
							<Button onClick={onClose} variant="outline" className="rounded-full">
								Browse Products
							</Button>
						</div>
					) : (
						<div className="space-y-4">
							{items.map((item) => (
								<WishlistItem
									key={item.id}
									item={item}
									onRemove={() => removeItem(item.id)}
								/>
							))}
						</div>
					)}
				</div>

				{/* Footer with Account CTA */}
				{!isEmpty && (
					<div className="border-t p-6 space-y-4 bg-gradient-to-t from-primary/5 to-transparent">
						<div className="space-y-2">
							<h3 className="font-display font-normal text-lg">
								Save your wishlist
							</h3>
							<p className="text-sm text-muted-foreground font-display font-light">
								Create an account to access your wishlist from anywhere
							</p>
						</div>

						<Button
							className="w-full rounded-full gap-2"
							size="lg"
							onClick={() => {
								// TODO: Navigate to signup
								console.log("Create account");
							}}
						>
							Create Account
							<ArrowRight className="h-4 w-4" />
						</Button>

						<p className="text-xs text-center text-muted-foreground font-display font-light">
							Already have an account? <button className="text-primary hover:underline">Sign in</button>
						</p>
					</div>
				)}
			</div>
		</>
	);
}