// src/app/admin/calculator/_components/BackgroundsManager.tsx
"use client";

import { useState, useEffect } from "react";
import { api } from "~/trpc/react";
import { Switch } from "~/components/ui/switch";
import { Badge } from "~/components/ui/badge";
import { Loader2 } from "lucide-react";
import { SortableList } from "../../_components/primitives/SortableList";
import { toast } from "sonner";

export function BackgroundsManager() {
	const { data: categories, isLoading, refetch } = api.admin.calculator.getBackgroundCategories.useQuery();
	const [localItems, setLocalItems] = useState<any[]>([]);

	useEffect(() => {
		if (categories) setLocalItems(categories);
	}, [categories]);

	const toggleStatus = api.admin.calculator.toggleCategoryStatus.useMutation({
		onSuccess: () => {
			toast.success("Updated visibility");
			refetch(); // Ensure server sync
		}
	});

	const reorder = api.admin.calculator.reorderCategories.useMutation({
		onSuccess: () => {
			// silent success for drag operations
		}
	});

	const handleReorder = (newItems: any[]) => {
		setLocalItems(newItems);
		reorder.mutate({
			items: newItems.map((item, index) => ({ id: item.id, sortOrder: index }))
		});
	};

	if (isLoading) return <div className="py-20 text-center"><Loader2 className="w-8 h-8 animate-spin mx-auto text-muted-foreground" /></div>;

	return (
		<div className="space-y-4">
			<div className="flex justify-between items-end mb-4">
				<p className="text-sm text-muted-foreground">
					Drag to reorder how model categories appear in Step 1 of the calculator.
				</p>
			</div>

			<SortableList
				items={localItems}
				keyExtractor={(item) => item.id}
				onReorder={handleReorder}
				renderItem={(cat) => (
					<div className="flex items-center justify-between gap-4">
						<div className="flex flex-col">
							<div className="flex items-center gap-2">
								<span className="font-medium">{cat.name || cat.slug}</span>
								{!cat.isActive && <Badge variant="secondary" className="text-[10px] h-5">Hidden</Badge>}
							</div>
							<span className="text-xs text-muted-foreground font-mono">{cat.slug}</span>
						</div>

						<div className="flex items-center gap-3">
							<div className="flex items-center gap-2 text-sm text-muted-foreground mr-4">
								<Switch
									checked={cat.isActive}
									onCheckedChange={(val) => toggleStatus.mutate({ id: cat.id, isActive: val })}
								/>
								<span className="w-12">{cat.isActive ? "Visible" : "Hidden"}</span>
							</div>
						</div>
					</div>
				)}
			/>
		</div>
	);
}