"use client";

import { useState } from "react";
import { api } from "~/trpc/react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Pencil, Trash, Plus, Save } from "lucide-react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
} from "~/components/ui/dialog";
import { toast } from "sonner";
import { SortableList } from "./SortableList";

interface CategoryManagerProps {
	open: boolean;
	onOpenChange: (v: boolean) => void;
	onUpdate: () => void;
}

export function CategoryManager({ open, onOpenChange, onUpdate }: CategoryManagerProps) {
	const { data: categories, refetch } = api.admin.faq.getAllCategories.useQuery({ locale: "en" });
	const [localCategories, setLocalCategories] = useState(categories || []);

	// Update local state when data loads
	if (categories && localCategories.length === 0 && categories.length > 0) {
		setLocalCategories(categories);
	}

	const upsertCat = api.admin.faq.upsertCategory.useMutation({
		onSuccess: () => {
			toast.success("Category saved");
			refetch();
			onUpdate();
		}
	});

	const deleteCat = api.admin.faq.deleteCategory.useMutation({
		onSuccess: () => {
			toast.success("Category deleted");
			refetch();
			onUpdate();
		}
	});

	const reorderCats = api.admin.faq.reorderCategories.useMutation({
		onSuccess: () => toast.success("Order saved")
	});

	const handleSave = (e: React.FormEvent<HTMLFormElement>, id?: string) => {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);
		upsertCat.mutate({
			id: id, // Explicitly passed, no stale state
			name: formData.get("name") as string,
			slug: formData.get("slug") as string,
			sortOrder: parseInt(formData.get("sortOrder") as string) || 0,
		});
	};

	const handleReorder = (newItems: typeof localCategories) => {
		setLocalCategories(newItems);
		// Debounce or save immediately? Saving immediately for admin is usually fine
		reorderCats.mutate({
			items: newItems.map((c, i) => ({ id: c.id, sortOrder: i }))
		});
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[700px] max-h-[85vh] flex flex-col">
				<DialogHeader>
					<DialogTitle>Manage Categories</DialogTitle>
					<DialogDescription>
						Drag to reorder. Changes to names appear immediately on the site.
					</DialogDescription>
				</DialogHeader>

				<div className="flex-1 overflow-y-auto pr-2 py-4 space-y-6">
					{/* Create New */}
					<div className="p-4 border-2 border-dashed rounded-xl bg-muted/30">
						<h4 className="text-sm font-medium mb-3 text-muted-foreground">Add New Category</h4>
						<form onSubmit={(e) => handleSave(e)} className="flex gap-4 items-end">
							<div className="grid grid-cols-2 gap-4 flex-1">
								<div className="space-y-1">
									<Label className="text-xs">Name (EN)</Label>
									<Input name="name" placeholder="e.g. Shipping" required className="bg-background" />
								</div>
								<div className="space-y-1">
									<Label className="text-xs">Slug (ID)</Label>
									<Input name="slug" placeholder="shipping" required className="bg-background" />
								</div>
							</div>
							<Button type="submit" size="sm" disabled={upsertCat.isPending}>
								<Plus className="w-4 h-4 mr-1" /> Add
							</Button>
						</form>
					</div>

					{/* Sortable List */}
					<div className="space-y-2">
						<Label>Existing Categories</Label>
						<SortableList
							items={categories || []}
							onReorder={handleReorder}
							keyExtractor={(item) => item.id}
							renderItem={(cat) => (
								<div className="flex items-center gap-3 p-3 border rounded-lg bg-card shadow-sm">
									<form
										onSubmit={(e) => handleSave(e, cat.id)}
										className="flex gap-3 items-center flex-1"
									>
										<div className="flex-1">
											<Input
												name="name"
												defaultValue={cat.name || ""}
												className="h-9 font-medium border-transparent hover:border-input focus:border-input transition-colors"
											/>
										</div>
										<div className="w-[150px]">
											<Input
												name="slug"
												defaultValue={cat.slug}
												className="h-9 font-mono text-xs text-muted-foreground border-transparent hover:border-input focus:border-input transition-colors"
											/>
										</div>
										<Button type="submit" size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:text-primary">
											<Save className="w-4 h-4" />
										</Button>
									</form>
									<Button
										size="icon"
										variant="ghost"
										className="h-8 w-8 text-muted-foreground hover:text-destructive transition-colors"
										onClick={() => {
											if (confirm("Delete category? FAQs inside will become uncategorized.")) {
												deleteCat.mutate({ id: cat.id });
											}
										}}
									>
										<Trash className="w-4 h-4" />
									</Button>
								</div>
							)}
						/>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}