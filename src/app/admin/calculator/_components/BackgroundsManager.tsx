// src/app/admin/calculator/_components/BackgroundsManager.tsx
"use client";

import { useState, useEffect } from "react";
import { api } from "~/trpc/react";
import { Loader2, BadgeEuro, Scale, Eye, EyeOff, AlertTriangle } from "lucide-react";
import { DraggableGrid } from "../../_components/primitives/DraggableGrid";
import { EditDrawer } from "../../_components/primitives/EditDrawer";
import { Badge } from "~/components/ui/badge";
import { toast } from "sonner";
import Image from "next/image";

export function BackgroundsManager() {
	const { data: categories, isLoading, refetch } = api.admin.calculator.getBackgroundCategories.useQuery();
	const [localItems, setLocalItems] = useState<any[]>([]);
	const [editingItem, setEditingItem] = useState<any>(null);

	// Sync local state when data fetches
	useEffect(() => {
		if (categories) setLocalItems(categories);
	}, [categories]);

	// Unified update mutation
	const updateMutation = api.admin.calculator.updateCategorySettings.useMutation({
		onSuccess: () => {
			toast.success("Calculator settings updated");
			refetch();
			setEditingItem(null);
		},
		onError: () => toast.error("Failed to update settings")
	});

	const reorder = api.admin.calculator.reorderCategories.useMutation();

	const handleReorder = (newItems: any[]) => {
		setLocalItems(newItems);
		reorder.mutate({
			items: newItems.map((item, index) => ({ id: item.id, sortOrder: index }))
		});
	};

	if (isLoading) return <div className="py-20 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-muted-foreground" /></div>;

	return (
		<div className="space-y-6">
			<DraggableGrid
				items={localItems}
				keyExtractor={(item) => item.id}
				onReorder={handleReorder}
				onEdit={(item) => setEditingItem(item)}

				// Custom Card Design
				renderItem={(item) => (
					<div className="relative group flex flex-col h-full bg-card border rounded-lg overflow-hidden shadow-sm transition-shadow hover:shadow-md">
						{/* Image Header */}
						<div className="aspect-video w-full bg-muted relative">
							{item.image ? (
								<Image src={item.image} alt={item.name || ""} fill className="object-cover" />
							) : (
								<div className="flex items-center justify-center h-full text-xs text-muted-foreground">No Image</div>
							)}

							{/* Visibility Badge */}
							<div className="absolute top-2 right-2 flex gap-1">
								{!item.isActive && (
									<Badge variant="destructive" className="h-6 px-2 shadow-sm">
										<EyeOff className="w-3 h-3 mr-1" /> Hidden
									</Badge>
								)}
							</div>
						</div>

						{/* Content */}
						<div className="p-3 flex-1 flex flex-col gap-3">
							<div>
								<h3 className="font-medium text-sm truncate" title={item.name}>
									{item.name || item.slug}
								</h3>
								<p className="text-xs text-muted-foreground font-mono truncate">{item.slug}</p>
							</div>

							{/* LOGIC BADGES - The visual feedback for your math settings */}
							<div className="flex flex-wrap gap-1.5 mt-auto">
								{item.isPremium && (
									<Badge variant="secondary" className="text-[10px] h-5 gap-1 text-amber-700 bg-amber-50 hover:bg-amber-100 border-amber-200">
										<BadgeEuro className="w-3 h-3" /> +50% Rate
									</Badge>
								)}
								{item.hasLargePenalty && (
									<Badge variant="secondary" className="text-[10px] h-5 gap-1 text-blue-700 bg-blue-50 hover:bg-blue-100 border-blue-200">
										<Scale className="w-3 h-3" /> Large Tank Tax
									</Badge>
								)}
								{!item.isPremium && !item.hasLargePenalty && (
									<Badge variant="outline" className="text-[10px] h-5 text-muted-foreground">
										Standard Rate
									</Badge>
								)}
							</div>
						</div>
					</div>
				)}
			/>

			{/* The Logic Controller */}
			<EditDrawer
				open={!!editingItem}
				onOpenChange={(open) => !open && setEditingItem(null)}
				data={editingItem}
				title={`Configure: ${editingItem?.name || 'Category'}`}
				description="Adjust visibility and pricing logic for this model line."
				isLoading={updateMutation.isPending}
				onSave={(data) => updateMutation.mutate({
					id: data.id,
					isActive: data.isActive,
					isPremium: data.isPremium,
					hasLargePenalty: data.hasLargePenalty // Note: maps to 'hasLargePenalty' in router input
				})}
				fields={[
					{
						type: "header",
						label: "Visibility"
					},
					{
						key: "isActive",
						label: "Active in Calculator",
						type: "boolean",
						description: "If disabled, customers cannot select this model in Step 1."
					},
					{
						type: "header",
						label: "Pricing Logic"
					},
					{
						key: "isPremium",
						label: "Premium Markup (1.5x)",
						type: "boolean",
						description: "Applies a 50% increase to the base rate for ALL sizes. Use for complex rock structures."
					},
					{
						key: "hasLargePenalty",
						label: "Large Tank Tax (>2m²)",
						type: "boolean",
						description: "Applies a 50% increase ONLY if the total surface area exceeds 2 square meters."
					},
					{
						type: "info",
						label: "Pricing Note",
						value: "Base rates per m² are managed in the Product Catalog. These toggles apply multipliers on top of that base rate."
					}
				]}
			/>
		</div>
	);
}