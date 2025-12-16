// src/app/admin/calculator/_components/BackgroundsManager.tsx
"use client";

import { useState, useEffect } from "react";
import { api } from "~/trpc/react";
import { Loader2 } from "lucide-react";
import { DraggableGrid } from "../../_components/primitives/DraggableGrid";
import { EditDrawer } from "../../_components/primitives/EditDrawer";
import { toast } from "sonner";

export function BackgroundsManager() {
	const { data: categories, isLoading, refetch } = api.admin.calculator.getBackgroundCategories.useQuery();
	const [localItems, setLocalItems] = useState<any[]>([]);
	const [editingItem, setEditingItem] = useState<any>(null);

	useEffect(() => {
		if (categories) setLocalItems(categories);
	}, [categories]);

	const updateCategory = api.admin.category.update.useMutation({
		onSuccess: () => {
			toast.success("Category updated");
			refetch();
		}
	});

	const reorder = api.admin.calculator.reorderCategories.useMutation();

	const handleReorder = (newItems: any[]) => {
		setLocalItems(newItems);
		reorder.mutate({
			items: newItems.map((item, index) => ({ id: item.id, sortOrder: index }))
		});
	};

	const handleSave = (data: any) => {
		updateCategory.mutate({
			id: data.id,
			slug: data.slug, // Required by schema but likely unchanged
			isActive: data.isActive,
			// Add any other editable fields here if you expand the schema
		});
	};

	if (isLoading) return <div className="py-20 text-center"><Loader2 className="w-8 h-8 animate-spin mx-auto text-muted-foreground" /></div>;

	return (
		<div className="space-y-6">
			<div className="flex justify-between items-end">
				<p className="text-sm text-muted-foreground">
					Drag to reorder model families. Use the edit button to toggle visibility or change details.
				</p>
			</div>

			<DraggableGrid
				items={localItems}
				keyExtractor={(item) => item.id}
				onReorder={handleReorder}
				getTitle={(item) => item.name || item.slug}
				getSubtitle={(item) => item.slug}
				getImage={(item) => item.image} // Assuming category has 'image' field from fetch
				getStatus={(item) => item.isActive}
				onEdit={(item) => setEditingItem(item)}
			/>

			<EditDrawer
				open={!!editingItem}
				onOpenChange={(open) => !open && setEditingItem(null)}
				data={editingItem}
				title="Edit Category"
				onSave={handleSave}
				fields={[
					{ key: "name", label: "Display Name", type: "readonly", description: "Manage translations in Catalog > Categories" },
					{ key: "slug", label: "Slug / ID", type: "readonly" },
					{ key: "isActive", label: "Visible in Calculator", type: "boolean" },
				]}
			/>
		</div>
	);
}