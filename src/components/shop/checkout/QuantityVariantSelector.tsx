// src/components/shop/pricing/QuantityVariantSelector.tsx
"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import type { Product } from "~/server/db/schema/shop";

interface QuantityVariantSelectorProps {
	variantOptions: Product['variantOptions'];
	onSelect: (priceEurCents: number, quantity: number) => void;
}

export function QuantityVariantSelector({ variantOptions, onSelect }: QuantityVariantSelectorProps) {
	const quantityOptions = variantOptions?.quantity?.options || [];

	if (quantityOptions.length === 0) return null;

	const handleSelect = (selectedValue: string) => {
		const [price, quantity] = selectedValue.split('|').map(Number);
		if (price !== undefined && quantity !== undefined) {
			onSelect(price, quantity);
		}
	};

	// 🎯 FIX: Ensure the defaultValue is correctly pulled from the first option
	// It's the price of the variant/bundle, not the unit price * quantity
	const firstOption = quantityOptions[0];
	const defaultValue = `${firstOption.priceEurCents}|${firstOption.value}`;

	return (
		<div className="space-y-3">
			<label className="text-sm font-display font-medium block">
				Choose the set size
			</label>
			<Select defaultValue={defaultValue} onValueChange={handleSelect}>
				<SelectTrigger className="w-full">
					<SelectValue placeholder="Select bundle size" />
				</SelectTrigger>
				<SelectContent>
					{quantityOptions.map((option, index) => (
						<SelectItem
							key={index}
							value={`${option.priceEurCents}|${option.value}`}
						>
							{option.label || `${option.value} pieces`}
							{` - €${(option.priceEurCents / 100).toFixed(2)}`}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
			<p className="text-xs text-muted-foreground font-display font-light">
				Select a predetermined quantity bundle.
			</p>
		</div>
	);
}