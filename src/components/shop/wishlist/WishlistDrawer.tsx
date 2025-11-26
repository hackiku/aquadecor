// src/components/shop/wishlist/WishlistDrawer.tsx
"use client";

import { useState, useEffect } from "react";
import { X, Heart } from "lucide-react";
import { Button } from "~/components/ui/button";
import { WishlistItem } from "./WishlistItem";
import { SignupIncentive } from "~/components/cta/SignupIncentive";
import { api } from "~/trpc/react";

interface WishlistDrawerProps {
	isOpen: boolean;
	onClose: () => void;
}

export function WishlistDrawer({ isOpen, onClose }: WishlistDrawerProps) {
	const [wishlistIds, setWishlistIds] = useState<string[]>([]);

	// Load wishlist from localStorage
	useEffect(() => {
		const loadWishlist = () => {
			const wishlist = localStorage.getItem("wishlist");
			if (wishlist) {
				setWishlistIds(JSON.parse(wishlist));
			}
		};

		if (isOpen) {
			loadWishlist();
		}
	}, [isOpen]);

	// Listen for wishlist updates
	useEffect(() => {
		const handleWishlistUpdate = (e: CustomEvent) => {
			setWishlistIds(e.detail.items);
		};

		window.addEventListener("wishlist-updated", handleWishlistUpdate as EventListener);
		return () => window.removeEventListener("wishlist-updated", handleWishlistUpdate as EventListener);
	}, []);

	// Fetch product details
	const { data: products, isLoading } = api.product.getByIds.useQuery(
		{ ids: wishlistIds },
		{ enabled: wishlistIds.length > 0 && isOpen }
	);

	const removeItem = (productId: string) => {
		const updated = wishlistIds.filter(id => id !== productId);
		setWishlistIds(updated);
		localStorage.setItem("wishlist", JSON.stringify(updated));
		window.dispatchEvent(new CustomEvent("wishlist-updated", { detail: { items: updated } }));
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
									Start adding products you love
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
										item={{
											...product,
											// Fix: Handle null name
											name: product.name ?? "Unknown Product",
											// Fix: Map basePrice to priceEurCents
											priceEurCents: product.basePriceEurCents,
											// Fix: Handle null image
											imageUrl: product.featuredImageUrl ?? undefined,
											priceNote: product.priceNote ?? undefined,
											categorySlug: product.categorySlug ?? "",
											productLineSlug: product.productLineSlug ?? ""
										}}
										onRemove={() => removeItem(product.id)}
									/>
								))}
							</div>

							{/* Signup Incentive */}
							<SignupIncentive trigger="wishlist" />
						</>
					)}
				</div>
			</div>
		</>
	);
}