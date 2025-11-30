// src/app/(account)/account/wishlist/page.tsx
"use client";
import { useEffect, useState } from "react";
import { MobileAccountNav } from "../../_components/MobileAccountNav";
import { WishlistItem } from "~/components/shop/wishlist/WishlistItem";
import { api } from "~/trpc/react";
import { Loader2, Heart } from "lucide-react";
import Link from "next/link";
import { Button } from "~/components/ui/button";
export default function AccountWishlistPage() {
	const [wishlistIds, setWishlistIds] = useState<string[]>([]);
	const [isClient, setIsClient] = useState(false);
	useEffect(() => {
		setIsClient(true);
		const loadWishlist = () => {
			const stored = localStorage.getItem("wishlist");
			if (stored) {
				try {
					const parsed = JSON.parse(stored);
					setWishlistIds(parsed);
				} catch (e) {
					console.error(e);
				}
			}
		};
		loadWishlist();

		// Listen for updates from header/drawer interaction
		window.addEventListener("wishlist-updated", loadWishlist);
		return () => window.removeEventListener("wishlist-updated", loadWishlist);
	}, []);

	// Fetch data for IDs
	const { data: products, isLoading } = api.product.getByIds.useQuery(
		{ ids: wishlistIds, locale: "en" },
		{ enabled: wishlistIds.length > 0 }
	);

	const removeItem = (id: string) => {
		const newIds = wishlistIds.filter((item) => item !== id);
		setWishlistIds(newIds);
		localStorage.setItem("wishlist", JSON.stringify(newIds));
		window.dispatchEvent(new CustomEvent("wishlist-updated", { detail: { items: newIds } }));
	};

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl md:text-3xl font-display font-light">My Wishlist</h1>
					<p className="text-muted-foreground font-display font-light">
						Saved items for later.
					</p>
				</div>
				<MobileAccountNav />
			</div>

			{!isClient || isLoading ? (
				<div className="flex justify-center py-12">
					<Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
				</div>
			) : wishlistIds.length === 0 ? (
				<div className="text-center py-12 border-2 border-dashed rounded-xl">
					<div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
						<Heart className="h-6 w-6 text-muted-foreground" />
					</div>
					<h3 className="font-display font-medium text-lg">Your wishlist is empty</h3>
					<p className="text-muted-foreground font-display font-light mb-6">
						Browse the shop to find items you love.
					</p>
					<Button asChild className="rounded-full">
						<Link href="/shop">Start Shopping</Link>
					</Button>
				</div>
			) : (
				<div className="grid gap-4">
					{products?.map((product) => (
						<div key={product.id} className="p-4 rounded-xl border bg-card hover:border-primary/20 transition-colors">
							<WishlistItem
								product={product as any}
								onRemove={() => removeItem(product.id)}
							/>
						</div>
					))}
				</div>
			)}
		</div>
	);
}