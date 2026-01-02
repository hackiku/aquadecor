// src/app/admin/calculator/_components/AddonsManager.tsx
"use client";

import { useState } from "react";
import { api } from "~/trpc/react";
import { Button } from "~/components/ui/button";
import { Plus, Trash2, Search, Loader2, Check } from "lucide-react";
import { SortableList } from "../../_components/primitives/SortableList";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import Image from "next/image";
import { toast } from "sonner";
import { cn } from "~/lib/utils";

export function AddonsManager() {
	const { data: addons, isLoading, refetch } = api.admin.calculator.getCalculatorAddons.useQuery();

	const toggleStatus = api.admin.calculator.toggleAddonStatus.useMutation({
		onSuccess: () => {
			refetch();
			toast.success("Updated calculator items");
		},
		onError: () => toast.error("Failed to update item")
	});

	if (isLoading) return <div className="py-20 text-center"><Loader2 className="w-8 h-8 animate-spin mx-auto text-muted-foreground" /></div>;

	return (
		<div className="space-y-6">
			<div className="flex justify-between items-center bg-muted/30 p-4 rounded-lg border">
				<div className="space-y-1">
					<h3 className="font-medium text-sm">Step 7 Configuration</h3>
					<p className="text-sm text-muted-foreground">
						Select which products appear in the "Additional Items" grid.
					</p>
				</div>
				<AddProductDialog onAdd={(id) => toggleStatus.mutate({ productId: id, isFeatured: true })} />
			</div>

			<SortableList
				items={addons || []}
				keyExtractor={(item) => item.id}
				onReorder={() => { }} // We don't persist order yet, but UI supports it
				renderItem={(product) => (
					<div className="flex items-center justify-between gap-4 w-full group">
						<div className="flex items-center gap-4">
							<div className="w-12 h-12 bg-muted rounded-md relative overflow-hidden border">
								{product.imageUrl && <Image src={product.imageUrl} alt="" fill className="object-cover" />}
							</div>
							<div>
								<p className="font-medium text-sm">{product.name || product.slug}</p>
								<div className="flex items-center gap-2 text-xs text-muted-foreground">
									<span className="font-mono">{product.sku}</span>
									<span>•</span>
									<span className={product.isActive ? "text-green-600" : "text-amber-600"}>
										{product.isActive ? "Active" : "Draft (Hidden)"}
									</span>
								</div>
							</div>
						</div>

						<Button
							variant="ghost"
							size="sm"
							className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
							onClick={() => toggleStatus.mutate({ productId: product.id, isFeatured: false })}
						>
							<Trash2 className="w-4 h-4 mr-2" />
							Remove
						</Button>
					</div>
				)}
			/>

			{addons?.length === 0 && (
				<div className="text-center py-12 border-2 border-dashed rounded-xl">
					<p className="text-muted-foreground">No items configured.</p>
				</div>
			)}
		</div>
	);
}

function AddProductDialog({ onAdd }: { onAdd: (id: string) => void }) {
	const [open, setOpen] = useState(false);
	const [query, setQuery] = useState("");

	const { data: searchResults, isLoading } = api.admin.calculator.searchAddonCandidates.useQuery(
		{ query },
		{ enabled: query.length > 1 }
	);

	const handleAdd = (id: string) => {
		onAdd(id);
		// Don't close immediately, allows adding multiple
		toast.success("Added to list");
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button size="sm" className="gap-2">
					<Plus className="w-4 h-4" /> Add Item
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[500px]">
				<DialogHeader>
					<DialogTitle>Add Calculator Item</DialogTitle>
				</DialogHeader>

				<div className="space-y-4 pt-4">
					<div className="relative">
						<Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
						<Input
							placeholder="Search by name or SKU..."
							className="pl-9"
							value={query}
							onChange={(e) => setQuery(e.target.value)}
						/>
					</div>

					<div className="h-[300px] overflow-y-auto border rounded-md divide-y">
						{query.length < 2 && (
							<div className="h-full flex flex-col items-center justify-center text-muted-foreground text-sm">
								<Search className="w-8 h-8 mb-2 opacity-20" />
								Type at least 2 characters to search
							</div>
						)}

						{isLoading && query.length >= 2 && (
							<div className="h-full flex items-center justify-center">
								<Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
							</div>
						)}

						{searchResults?.length === 0 && query.length >= 2 && !isLoading && (
							<div className="h-full flex items-center justify-center text-muted-foreground text-sm">
								No matching decorations found
							</div>
						)}

						{searchResults?.map(product => (
							<div key={product.id} className="flex items-center justify-between p-3 hover:bg-muted/50 transition-colors">
								<div className="flex items-center gap-3">
									<div className="w-10 h-10 bg-muted rounded overflow-hidden relative border">
										{product.imageUrl && <Image src={product.imageUrl} alt="" fill className="object-cover" />}
									</div>
									<div className="text-sm">
										<p className="font-medium">{product.name || "Untitled"}</p>
										<p className="text-xs text-muted-foreground font-mono">{product.sku}</p>
									</div>
								</div>
								<Button
									size="sm"
									variant="secondary"
									onClick={() => handleAdd(product.id)}
								>
									Add
								</Button>
							</div>
						))}
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}