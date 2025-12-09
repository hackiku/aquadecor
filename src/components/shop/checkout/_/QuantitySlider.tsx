// src/components/shop/checkout/QuantitySlider.tsx
"use client";

import { Slider } from "~/components/ui/slider";

interface QuantitySliderProps {
	quantity: number;
	min?: number;
	max?: number;
	onQuantityChange: (quantity: number) => void;
}

export function QuantitySlider({ quantity, min = 1, max = 10, onQuantityChange }: QuantitySliderProps) {
	return (
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
				onValueChange={(value) => onQuantityChange(value[0] ?? 1)}
				min={min}
				max={max}
				step={1}
				className="w-full"
			/>
			<div className="flex justify-between text-xs text-muted-foreground font-display">
				<span>{min} piece{min !== 1 ? 's' : ''}</span>
				<span>{max} pieces</span>
			</div>
		</div>
	);
}