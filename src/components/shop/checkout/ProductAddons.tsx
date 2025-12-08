// src/components/shop/pricing/ProductAddons.tsx
"use client";

import { useState } from "react";
import { Checkbox } from "~/components/ui/checkbox";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import type { Product } from "~/server/db/schema/shop";

// Helper type for the options state
type AddonState = {
	[name: string]: {
		value: string | boolean | number;
		price: number;
		quantity: number;
	};
};

interface ProductAddonsProps {
	addonOptions: Product['addonOptions'];
	onChange: (addons: AddonState) => void;
}

export function ProductAddons({ addonOptions, onChange }: ProductAddonsProps) {
	const [selectedAddons, setSelectedAddons] = useState<AddonState>({});
	const items = addonOptions?.items || [];

	// Inform parent component whenever state changes
	const updateAddon = (name: string, value: string | boolean | number, price: number, quantity: number = 1) => {
		setSelectedAddons(prev => {
			const newState = { ...prev };
			if (value === false) {
				delete newState[name];
			} else {
				newState[name] = { value, price, quantity };
			}
			onChange(newState);
			return newState;
		});
	};

	return (
		<div className="space-y-4 pt-4 border-t">
			<h3 className="text-lg font-display font-medium">Add-ons & Options</h3>
			{items.map((item, index) => (
				<div key={index} className="space-y-2">
					<label className="text-sm font-display font-medium block">
						{item.name}
						{item.priceEurCents !== undefined && item.priceEurCents > 0
							? ` (+€${(item.priceEurCents / 100).toFixed(2)})`
							: ""}
					</label>

					{/* Checkbox Type */}
					{item.type === "checkbox" && (
						<div className="flex items-center space-x-2">
							<Checkbox
								id={item.name}
								onCheckedChange={(checked) =>
									updateAddon(item.name, checked as boolean, item.priceEurCents || 0)
								}
							/>
							<label
								htmlFor={item.name}
								className="text-sm font-display font-light leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
							>
								{item.description || `Add ${item.name}`}
							</label>
						</div>
					)}

					{/* Input Type */}
					{item.type === "input" && (
						<Input
							placeholder={item.description || `Enter value for ${item.name}`}
							type="text"
							required={item.required}
							onChange={(e) =>
								updateAddon(item.name, e.target.value, item.priceEurCents || 0)
							}
							className="font-display font-light"
						/>
					)}

					{/* Textarea Type (for long notes) */}
					{item.type === "textarea" && (
						<Textarea
							placeholder={item.description || `Enter notes for ${item.name}`}
							onChange={(e) =>
								updateAddon(item.name, e.target.value, item.priceEurCents || 0)
							}
							className="font-display font-light"
						/>
					)}
				</div>
			))}
		</div>
	);
}