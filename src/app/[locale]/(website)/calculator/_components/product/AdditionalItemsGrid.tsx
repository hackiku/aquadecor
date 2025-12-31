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

	// Fetch additional items from tRPC
	// TODO: Update this query when you add the endpoint to your calculator router
	const { data, isLoading, error } = api.product.getByIds.useQuery({
		productIds: [], // Replace with actual IDs or create new endpoint
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

	// Mock data until you wire up the real endpoint
	const mockItems: AdditionalItem[] = [
		{
			id: "item-1",
			name: "Aquatic Plant Bundle",
			description: "Realistic artificial plants for natural look",
			priceCents: 2500,
			image: "/media/images/plant-placeholder.jpg"
		},
		{
			id: "item-2",
			name: "Rock Formation Set",
			description: "Hand-painted decorative rocks",
			priceCents: 3500,
			image: "/media/images/rock-placeholder.jpg"
		},
		{
			id: "item-3",
			name: "Coral Decoration",
			description: "Lifelike coral pieces",
			priceCents: 4000,
			image: "/media/images/coral-placeholder.jpg"
		},
		{
			id: "item-4",
			name: "Driftwood Piece",
			description: "Natural-looking driftwood accent",
			priceCents: 2000,
			image: "/media/images/driftwood-placeholder.jpg"
		}
	];

	const items = data?.products || mockItems;

	if (items.length === 0) {
		return (
			<div className="text-center py-12 border-2 border-dashed rounded-xl">
				<p className="text-muted-foreground">No additional items available</p>
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
							const item = items.find(i => i.id === itemId);
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