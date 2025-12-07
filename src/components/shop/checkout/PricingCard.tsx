// src/components/shop/checkout/PricingCard.tsx
"use client";

import { useState } from "react";
import { WishlistButton } from "~/components/shop/wishlist/WishlistButton";
import { CustomOnlyBadge } from "~/components/shop/product/CustomOnlyBadge";
import { AddToCartButton } from "~/components/shop/cart/AddToCartButton";
import { Slider } from "~/components/ui/slider";
import { Truck, Clock, Package } from "lucide-react";

interface PricingCardProps {
	productId: string;
	product: any; // Product with all data
	isCustomOnly: boolean;
}

export function PricingCard({ productId, product, isCustomOnly }: PricingCardProps) {
	const [quantity, setQuantity] = useState(1);

	// Calculate price based on quantity
	const unitPrice = (product.basePriceEurCents ?? 0) / 100;
	const totalPrice = unitPrice * quantity;

	return (
		<div className="sticky top-24 space-y-6">
			{/* Main Pricing Card */}
			<div className="p-6 rounded-2xl border-2 border-border bg-card/50 backdrop-blur space-y-6">

				{/* Wishlist Button */}
				<div className="flex justify-end">
					<WishlistButton productId={productId} />
				</div>

				{/* Custom Only Banner */}
				{isCustomOnly && (
					<CustomOnlyBadge variant="banner" showCalculatorLink />
				)}

				{/* Price Section */}
				{!isCustomOnly && (
					<div className="space-y-4 pb-6 border-b">
						{/* Quantity Selector */}
						<div className="space-y-3">
							<div className="flex items-center justify-between">
								<label className="text-sm font-display font-medium">
									Quantity
								</label>
								<span className="text-sm font-display font-medium text-muted-foreground">
									{quantity}
								</span>
							</div>
							<Slider
								value={[quantity]}
								onValueChange={(value) => setQuantity(value[0] ?? 1)}
								min={1}
								max={10}
								step={1}
								className="w-full"
							/>
							<div className="flex justify-between text-xs text-muted-foreground font-display">
								<span>1 piece</span>
								<span>10 pieces</span>
							</div>
						</div>

						{/* Price Display */}
						<div className="space-y-2 pt-2">
							<div className="flex items-baseline justify-between">
								<div className="text-sm text-muted-foreground font-display">
									Unit price
								</div>
								<div className="text-lg font-display font-medium">
									€{unitPrice.toFixed(2)}
								</div>
							</div>
							<div className="flex items-baseline justify-between">
								<div className="text-base font-display font-medium">
									Total
								</div>
								<div className="text-4xl font-display font-light">
									€{totalPrice.toFixed(2)}
								</div>
							</div>
							{product.priceNote && (
								<p className="text-sm text-muted-foreground font-display font-light">
									{product.priceNote}
								</p>
							)}
						</div>
					</div>
				)}

				{/* Trust Signals */}
				<div className="space-y-3">
					<div className="flex items-center gap-3 text-sm">
						<div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
							<Truck className="h-4 w-4 text-primary" />
						</div>
						<span className="font-display font-light">Free worldwide shipping</span>
					</div>
					<div className="flex items-center gap-3 text-sm">
						<div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
							<Clock className="h-4 w-4 text-primary" />
						</div>
						<span className="font-display font-light">10-12 day production</span>
					</div>
					<div className="flex items-center gap-3 text-sm">
						<div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
							<Package className="h-4 w-4 text-primary" />
						</div>
						<span className="font-display font-light">Custom sizes available</span>
					</div>
				</div>

				{/* CTA */}
				<div className="space-y-3">
					{isCustomOnly ? (
						<a
							href="/calculator"
							className="block w-full px-6 py-4 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full font-display font-medium transition-all hover:scale-[1.02] text-center shadow-lg shadow-primary/20"
						>
							Get Custom Quote
						</a>
					) : (
						<AddToCartButton
							product={{ ...product, quantity }}
							size="lg"
							className="w-full rounded-full shadow-lg shadow-primary/20"
						/>
					)}
					<p className="text-center text-xs text-muted-foreground font-display font-light">
						Questions?{" "}
						<a href="/contact" className="text-primary hover:underline font-medium">
							Contact us
						</a>{" "}
						for custom sizing
					</p>
				</div>
			</div>

			{/* Trust Badge Card */}
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