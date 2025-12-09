// src/components/shop/checkout/PricingCard.tsx
"use client";

import { WishlistButton } from "~/components/shop/wishlist/WishlistButton";
import type { Product } from "~/server/db/schema/shop";
import { ProductPricingModule } from "./ProductPricingModule";

interface PricingCardProps {
	productId: string;
	product: Product & { categorySlug: string; productLineSlug: string; name: string };
	isCustomOnly: boolean;
}

export function PricingCard({ productId, product, isCustomOnly }: PricingCardProps) {
	return (
		<div className="sticky top-24 space-y-6">
			<div className="p-6 rounded-2xl border-2 border-border bg-card/50 backdrop-blur space-y-6">
				<div className="flex justify-end">
					<WishlistButton productId={productId} />
				</div>

				<ProductPricingModule
					product={product}
					// isCustomOnly={isCustomOnly}
					isCustomOnly={false}
				/>
			</div>
		</div>
	);
}