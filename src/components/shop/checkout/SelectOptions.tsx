// src/components/shop/checkout/SelectOptions.tsx
"use client";

import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import { Label } from "~/components/ui/label";

type SelectOption = {
	value: string;
	label: string;
	priceEurCents?: number;
	isDefault?: boolean;
};

type Select = {
	id: string;
	label: string;
	required: boolean;
	options: SelectOption[];
};

interface SelectOptionsProps {
	selects: Select[];
	selectedValues: Record<string, string>;
	onSelect: (id: string, value: string) => void;
}

export function SelectOptions({ selects, selectedValues, onSelect }: SelectOptionsProps) {
	if (!selects || selects.length === 0) return null;

	return (
		<div className="space-y-4 pb-4 border-b">
			{selects.map((select) => (
				<div key={select.id} className="space-y-2">
					<Label className="text-sm font-display font-medium">
						{select.label}
						{select.required && <span className="text-destructive ml-1">*</span>}
					</Label>
					<RadioGroup
						value={selectedValues[select.id] || ''}
						onValueChange={(value) => onSelect(select.id, value)}
						className="space-y-2"
					>
						{select.options.map((option) => (
							<div
								key={option.value}
								className="flex items-center gap-3 p-3 rounded-lg border hover:border-primary/50 cursor-pointer"
								onClick={() => onSelect(select.id, option.value)}
							>
								<RadioGroupItem
									value={option.value}
									id={`${select.id}-${option.value}`}
								/>
								<Label
									htmlFor={`${select.id}-${option.value}`}
									className="flex-1 cursor-pointer flex items-center justify-between font-display"
								>
									<span>{option.label}</span>
									{option.priceEurCents !== undefined && option.priceEurCents > 0 && (
										<span className="text-sm text-primary">
											+€{(option.priceEurCents / 100).toFixed(2)}
										</span>
									)}
								</Label>
							</div>
						))}
					</RadioGroup>
				</div>
			))}
		</div>
	);
}