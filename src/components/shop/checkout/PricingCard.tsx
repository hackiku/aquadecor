// src/components/shop/checkout/PricingCard.tsx
"use client";

import { WishlistButton } from "~/components/shop/wishlist/WishlistButton";
import type { Product } from "~/server/db/schema/shop";

// 🎯 Assuming this component exists in the new structure
import { ProductPricingModule } from "~/components/shop/checkout/ProductPricingModule";

interface PricingCardProps {
	productId: string;
	// Expanded Product type to include slugs for the cart payload
	product: Product & { categorySlug: string; productLineSlug: string; name: string };
	isCustomOnly: boolean;
}

export function PricingCard({ productId, product, isCustomOnly }: PricingCardProps) {

	return (
		<div className="sticky top-24 space-y-6">

			<div className="p-6 rounded-2xl border-2 border-border bg-card/50 backdrop-blur space-y-6">

				{/* Wishlist Button (Keep this outside the module) */}
				<div className="flex justify-end">
					<WishlistButton productId={productId} />
				</div>

				{/* 🎯 Modular Pricing Logic */}
				<ProductPricingModule
					product={product}
					isCustomOnly={isCustomOnly}
				/>

			</div>

			{/* Trust Badge Card (Kept outside for distinct styling) */}
			<div className="p-4 rounded-xl bg-muted/30 border space-y-2">
				<div className="flex items-center gap-2 text-xs text-muted-foreground font-display">
					<span className="text-primary">✓</span>
					<span>20+ years experience</span>
				</div>
				<div className="flex items-center gap-2 text-xs text-muted-foreground font-display">
					<span className="text-primary">✓</span>
					<span>50,000+ products shipped</span>
				</div>
				<div className="flex items-center gap-2 text-xs text-muted-foreground font-display">
					<span className="text-primary">✓</span>
					<span>Made in Serbia</span>
				</div>
			</div>
		</div>
	);
}