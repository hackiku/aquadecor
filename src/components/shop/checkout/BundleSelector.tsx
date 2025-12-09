// src/components/shop/checkout/BundleSelector.tsx
"use client";

import { Label } from "~/components/ui/label";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import { Check } from "lucide-react";
import { cn } from "~/lib/utils";

type Bundle = {
	quantity: number;
	totalPriceEurCents: number;
	label?: string;
	isDefault?: boolean;
};

interface BundleSelectorProps {
	bundles: Bundle[];
	selectedIndex: number;
	onSelect: (index: number) => void;
}

export function BundleSelector({ bundles, selectedIndex, onSelect }: BundleSelectorProps) {
	return (
		<div className="space-y-3 pb-4 border-b">
			<Label className="text-sm font-display font-medium">Choose Bundle Size</Label>
			<RadioGroup
				value={selectedIndex.toString()}
				onValueChange={(val) => onSelect(parseInt(val))}
				className="space-y-2"
			>
				{bundles.map((bundle, index) => {
					const isSelected = selectedIndex === index;
					const savings = bundle.label?.match(/Save (\d+%)/)?.[1];

					return (
						<div
							key={index}
							className={cn(
								"relative flex items-center gap-3 p-4 rounded-xl border-2 transition-all cursor-pointer",
								isSelected
									? "border-primary bg-primary/5 shadow-sm"
									: "border-border hover:border-primary/50"
							)}
							onClick={() => onSelect(index)}
						>
							<RadioGroupItem value={index.toString()} id={`bundle-${index}`} />
							<Label
								htmlFor={`bundle-${index}`}
								className="flex-1 cursor-pointer flex items-center justify-between"
							>
								<div className="space-y-0.5">
									<div className="font-display font-medium">
										{bundle.label || `${bundle.quantity} pieces`}
									</div>
									{savings && (
										<div className="text-xs text-primary font-display">
											{savings}
										</div>
									)}
								</div>
								<div className="text-lg font-display font-semibold">
									€{(bundle.totalPriceEurCents / 100).toFixed(2)}
								</div>
							</Label>
							{isSelected && (
								<div className="absolute top-2 right-2 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
									<Check className="h-3 w-3 text-primary-foreground" />
								</div>
							)}
						</div>
					);
				})}
			</RadioGroup>
		</div>
	);
}