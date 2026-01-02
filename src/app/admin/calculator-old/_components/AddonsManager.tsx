// @ts-nocheck
// src/app/admin/calculator/_components/AddonsManager.tsx
"use client";

import { useState, useEffect } from "react";
import { api } from "~/trpc/react";
import { Button } from "~/components/ui/button";
import { Plus, Trash2, Search, Loader2 } from "lucide-react";
import { SortableList } from "../../_components/primitives/SortableList";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import Image from "next/image";
import { toast } from "sonner";

export function AddonsManager() {
	const { data: addons, isLoading, refetch } = api.admin.calculator.getCalculatorAddons.useQuery();
	const [localItems, setLocalItems] = useState<any[]>([]);
	const [isAddOpen, setIsAddOpen] = useState(false);

	useEffect(() => {
		if (addons) setLocalItems(addons);
	}, [addons]);

	const removeAddon = api.admin.calculator.removeAddon.useMutation({
		onSuccess: () => {
			toast.success("Removed from calculator");
			refetch();
		}
	});

	const reorder = api.admin.calculator.reorderAddons.useMutation();

	const handleReorder = (newItems: any[]) => {
		setLocalItems(newItems);
		reorder.mutate({
			items: newItems.map((item, index) => ({ id: item.id, sortOrder: index }))
		});
	};

	if (isLoading) return <div className="py-20 text-center"><Loader2 className="w-8 h-8 animate-spin mx-auto text-muted-foreground" /></div>;

	return (
		<div className="space-y-6">
			<div className="flex justify-between items-center">
				<p className="text-sm text-muted-foreground">
					These products will appear in the "Additional Items" step of the calculator.
				</p>
				<AddProductDialog
					open={isAddOpen}
					onOpenChange={setIsAddOpen}
					onSuccess={() => {
						refetch();
						setIsAddOpen(false);
					}}
				/>
			</div>

			{localItems.length === 0 ? (
				<div className="text-center py-12 border-2 border-dashed rounded-xl">
					<p className="text-muted-foreground">No additional items configured.</p>
					<Button variant="link" onClick={() => setIsAddOpen(true)}>Add your first item</Button>
				</div>
			) : (
				<SortableList
					items={localItems}
					keyExtractor={(item) => item.id}
					onReorder={handleReorder}
					renderItem={(product) => (
						<div className="flex items-center justify-between gap-4 w-full">
							<div className="flex items-center gap-4">
								<div className="w-10 h-10 bg-muted rounded overflow-hidden relative">
									{product.imageUrl && (
										<Image src={product.imageUrl} alt="" fill className="object-cover" />
									)}
								</div>
								<div>
									<p className="font-medium text-sm">{product.name || product.slug}</p>
									<p className="text-xs text-muted-foreground font-mono">{product.sku}</p>
								</div>
							</div>

							<Button
								variant="ghost"
								size="icon"
								className="text-muted-foreground hover:text-destructive"
								onClick={() => removeAddon.mutate({ productId: product.id })}
							>
								<Trash2 className="w-4 h-4" />
							</Button>
						</div>
					)}
				/>
			)}
		</div>
	);
}

function AddProductDialog({ open, onOpenChange, onSuccess }: { open: boolean, onOpenChange: (v: boolean) => void, onSuccess: () => void }) {
	const [query, setQuery] = useState("");
	// Debounce this in a real app, strict fetch here for simplicity
	const { data: searchResults } = api.admin.calculator.searchAddonCandidates.useQuery(
		{ query },
		{ enabled: query.length > 1 }
	);

	const addMutation = api.admin.calculator.addAddon.useMutation({
		onSuccess: () => {
			toast.success("Product added");
			onSuccess();
		}
	});

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogTrigger asChild>
				<Button className="rounded-full">
					<Plus className="w-4 h-4 mr-2" /> Add Item
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Add Calculator Item</DialogTitle>
				</DialogHeader>
				<div className="space-y-4 pt-4">
					<div className="relative">
						<Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
						<Input
							placeholder="Search aquarium decorations..."
							className="pl-9"
							value={query}
							onChange={(e) => setQuery(e.target.value)}
						/>
					</div>

					<div className="h-[300px] overflow-y-auto border rounded-md p-1 space-y-1">
						{query.length < 2 && (
							<p className="text-sm text-center text-muted-foreground py-8">Type to search...</p>
						)}
						{searchResults?.length === 0 && query.length >= 2 && (
							<p className="text-sm text-center text-muted-foreground py-8">No products found.</p>
						)}
						{searchResults?.map(product => (
							<div key={product.id} className="flex items-center justify-between p-2 hover:bg-muted rounded cursor-default group">
								<div className="flex items-center gap-3">
									<div className="w-8 h-8 bg-muted rounded overflow-hidden relative">
										{product.imageUrl && <Image src={product.imageUrl} alt="" fill className="object-cover" />}
									</div>
									<div className="text-sm">
										<p className="font-medium">{product.name || "Untitled"}</p>
										<p className="text-xs text-muted-foreground">{product.sku}</p>
									</div>
								</div>
								<Button
									size="sm"
									variant="ghost"
									className="opacity-0 group-hover:opacity-100"
									onClick={() => addMutation.mutate({ productId: product.id })}
									disabled={addMutation.isPending}
								>
									Select
								</Button>
							</div>
						))}
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}