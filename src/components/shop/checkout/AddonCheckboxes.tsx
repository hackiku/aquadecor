// src/components/shop/checkout/AddonCheckboxes.tsx
"use client";

import { Checkbox } from "~/components/ui/checkbox";
import { Label } from "~/components/ui/label";

type Addon = {
	id: string;
	name: string;
	description?: string;
	priceEurCents: number;
};

interface AddonCheckboxesProps {
	addons: Addon[];
	selectedIds: Set<string>;
	onToggle: (id: string) => void;
}

export function AddonCheckboxes({ addons, selectedIds, onToggle }: AddonCheckboxesProps) {
	if (!addons || addons.length === 0) return null;

	return (
		<div className="space-y-3 pb-4 border-b">
			<Label className="text-sm font-display font-medium">Add-ons</Label>
			{addons.map((addon) => (
				<div key={addon.id} className="flex items-start gap-3 p-3 rounded-lg border bg-card/50">
					<Checkbox
						id={addon.id}
						checked={selectedIds.has(addon.id)}
						onCheckedChange={() => onToggle(addon.id)}
						className="mt-1"
					/>
					<div className="flex-1">
						<Label
							htmlFor={addon.id}
							className="font-display font-medium cursor-pointer flex items-center justify-between"
						>
							<span>{addon.name}</span>
							<span className="text-primary">+€{(addon.priceEurCents / 100).toFixed(2)}</span>
						</Label>
						{addon.description && (
							<p className="text-xs text-muted-foreground font-display font-light mt-1">
								{addon.description}
							</p>
						)}
					</div>
				</div>
			))}
		</div>
	);
}