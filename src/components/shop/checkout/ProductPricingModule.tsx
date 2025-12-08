// src/components/shop/pricing/ProductPricingModule.tsx
"use client";

import { useState, useMemo, useEffect } from "react";
import { CustomOnlyBadge } from "~/components/shop/product/CustomOnlyBadge";
import { AddToCartButton } from "~/components/shop/cart/AddToCartButton";
import { Truck, Clock, Package } from "lucide-react";
import type { Product } from "~/server/db/schema/shop";
import { QuantityVariantSelector } from "./QuantityVariantSelector";
import { ProductAddons } from "./ProductAddons";
import { QuantitySlider } from "~/components/shop/checkout/QuantitySlider"; // Now imported

// Helper type for the add-ons state
type AddonState = {
	[name: string]: {
		value: string | boolean | number;
		price: number; // Price per piece (in cents)
		quantity: number;
	};
};

interface ProductPricingModuleProps {
	product: Product & { categorySlug: string; productLineSlug: string };
	isCustomOnly: boolean;
}

export function ProductPricingModule({ product, isCustomOnly }: ProductPricingModuleProps) {
	// State for core product/variant selection
	const [basePriceEurCents, setBasePriceEurCents] = useState(product.basePriceEurCents || 0);
	const [quantity, setQuantity] = useState(1);

	// State for add-ons/options
	const [selectedAddons, setSelectedAddons] = useState<AddonState>({});

	// Determine pricing mode flags
	const hasVariantOptions = !!product.variantOptions?.quantity?.options?.length;
	const hasAddons = !!product.addonOptions?.items?.length;

	// Effect to set the initial base price and quantity
	useEffect(() => {
		if (hasVariantOptions && product.variantOptions?.quantity?.options) {
			const defaultVariant = product.variantOptions.quantity.options[0];
			setBasePriceEurCents(defaultVariant.priceEurCents);
			setQuantity(defaultVariant.value);
		} else if (product.basePriceEurCents) {
			setBasePriceEurCents(product.basePriceEurCents);
			setQuantity(1);
		}
	}, [hasVariantOptions, product.basePriceEurCents, product.variantOptions?.quantity?.options]);


	// Calculate the final price
	const { totalProductPrice, totalAddonPrice, finalTotalPrice } = useMemo(() => {
		const totalProductPrice = basePriceEurCents * quantity;

		const totalAddonPrice = Object.values(selectedAddons).reduce((acc, addon) => {
			return acc + (addon.price * addon.quantity);
		}, 0);

		const finalTotalPrice = totalProductPrice + totalAddonPrice;

		return { totalProductPrice, totalAddonPrice, finalTotalPrice };
	}, [basePriceEurCents, quantity, selectedAddons]);

	// Price Formatting
	const formattedTotal = (finalTotalPrice / 100).toFixed(2);
	const formattedProductPrice = (totalProductPrice / 100).toFixed(2);

	// Cart Payload Construction
	const cartItemPayload = {
		...product,
		quantity,
		basePriceEurCents: finalTotalPrice,
		selectedOptions: Object.keys(selectedAddons).map(name => ({
			name,
			value: selectedAddons[name].value,
			price: selectedAddons[name].price,
			quantity: selectedAddons[name].quantity,
		})),
	};


	return (
		<div className="space-y-6">

			{/* Custom Only Banner - Mode 1 */}
			{isCustomOnly && <CustomOnlyBadge variant="banner" showCalculatorLink />}

			{/* Price and Options Section - Mode 2 & 3 */}
			{!isCustomOnly && (
				<div className="space-y-4 pb-6 border-b">

					{/* Variant Selector (Quantity Bundles) */}
					{hasVariantOptions ? (
						<QuantityVariantSelector
							variantOptions={product.variantOptions}
							onSelect={(newPrice, newQty) => {
								setBasePriceEurCents(newPrice);
								setQuantity(newQty);
							}}
						/>
					) : (
						/* Simple Quantity Slider */
						<QuantitySlider
							quantity={quantity}
							onQuantityChange={setQuantity}
						/>
					)}

					{/* Add-on/Custom Input Selectors */}
					{hasAddons && (
						<ProductAddons
							addonOptions={product.addonOptions}
							onChange={setSelectedAddons}
						/>
					)}

					{/* Price Display */}
					<div className="space-y-2 pt-4">
						<div className="flex items-baseline justify-between">
							<div className="text-sm text-muted-foreground font-display">
								{hasVariantOptions ? "Bundle Price" : "Unit Price"}
							</div>
							<div className="text-lg font-display font-medium">
								€{formattedProductPrice}
							</div>
						</div>
						{totalAddonPrice > 0 && (
							<div className="flex items-baseline justify-between">
								<div className="text-sm text-muted-foreground font-display">
									Options/Add-ons
								</div>
								<div className="text-lg font-display font-medium">
									+ €{(totalAddonPrice / 100).toFixed(2)}
								</div>
							</div>
						)}
						<div className="flex items-baseline justify-between pt-2 border-t border-dashed">
							<div className="text-base font-display font-medium">
								Total Price
							</div>
							<div className="text-4xl font-display font-light">
								€{formattedTotal}
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

			{/* Trust Signals (moved from parent) */}
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
						product={cartItemPayload}
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
	);
}