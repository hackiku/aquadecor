// src/app/(website)/calculator/_components/product/AdditionalItemsGrid.tsx
"use client";

import { useState } from "react";
import { api } from "~/trpc/react";
import { AdditionalItemCard } from "./AdditionalItemCard";
import { Loader2 } from "lucide-react";
import { cn } from "~/lib/utils";

interface AdditionalItem {
	id: string;
	name: string;
	description?: string | null;
	priceCents: number;
	image: string;
}

interface AdditionalItemsGridProps {
	onItemAdd?: (itemId: string, quantity: number) => void;
}

export function AdditionalItemsGrid({ onItemAdd }: AdditionalItemsGridProps) {
	// Track added items locally (could also be lifted to parent state)
	const [addedItems, setAddedItems] = useState<Record<string, number>>({});

	// Fetch additional items from calculator router
	const { data, isLoading, error } = api.calculator.getCalculatorAddons.useQuery({
		locale: "en",
	});

	const handleAdd = (itemId: string, quantity: number) => {
		setAddedItems(prev => ({
			...prev,
			[itemId]: (prev[itemId] || 0) + quantity
		}));

		onItemAdd?.(itemId, quantity);
	};

	if (isLoading) {
		return (
			<div className="flex justify-center items-center py-12">
				<Loader2 className="h-8 w-8 animate-spin text-primary" />
			</div>
		);
	}

	if (error) {
		return (
			<div className="text-center py-12">
				<p className="text-sm text-destructive">Failed to load additional items</p>
			</div>
		);
	}

	const items = data || [];

	if (items.length === 0) {
		return (
			<div className="text-center py-12 border-2 border-dashed rounded-xl">
				<p className="text-muted-foreground">No additional items available</p>
				<p className="text-xs text-muted-foreground mt-2">
					Ask your admin to mark some decorations as "Featured" to show them here
				</p>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			{/* Grid */}
			<div className={cn(
				"grid gap-4",
				"grid-cols-2 sm:grid-cols-3 lg:grid-cols-4"
			)}>
				{items.map((item) => (
					<AdditionalItemCard
						key={item.id}
						id={item.id}
						name={item.name}
						description={item.description || undefined}
						priceCents={item.priceCents}
						image={item.image}
						onAdd={(quantity) => handleAdd(item.id, quantity)}
					/>
				))}
			</div>

			{/* Summary of added items */}
			{Object.keys(addedItems).length > 0 && (
				<div className="p-4 bg-accent/5 rounded-xl border">
					<p className="text-sm font-medium mb-2">Added to configuration:</p>
					<ul className="text-xs text-muted-foreground space-y-1">
						{Object.entries(addedItems).map(([itemId, qty]) => {
							const item = items.find((i: AdditionalItem) => i.id === itemId);
							return (
								<li key={itemId}>
									{item?.name} × {qty}
								</li>
							);
						})}
					</ul>
				</div>
			)}
		</div>
	);
}