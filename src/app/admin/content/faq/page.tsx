// src/app/admin/content/faq/page.tsx
"use client";

import { useState } from "react";
import { api } from "~/trpc/react";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Plus, Pencil, Trash, Settings2, Folder, Loader2 } from "lucide-react";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "~/components/ui/select";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
} from "~/components/ui/dialog";
import {
	Card,
	CardContent,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { toast } from "sonner";
import { Separator } from "~/components/ui/separator";

// New Components
import { SortableList } from "./_components/SortableList";
import { CategoryManager } from "./_components/CategoryManager";

type Region = "ROW" | "US";

export default function FAQPage() {
	const [region, setRegion] = useState<Region>("ROW");
	const [editingFaq, setEditingFaq] = useState<any>(null);
	const [isFaqModalOpen, setIsFaqModalOpen] = useState(false);
	const [isCatModalOpen, setIsCatModalOpen] = useState(false);

	const { data: categories, isLoading, refetch } = api.admin.faq.getFullStructure.useQuery({
		region,
		locale: "en",
	});

	const upsertFaq = api.admin.faq.upsertFaq.useMutation({
		onSuccess: () => {
			toast.success("FAQ saved");
			setIsFaqModalOpen(false);
			setEditingFaq(null);
			refetch();
		},
		onError: (err) => toast.error(err.message),
	});

	const deleteFaq = api.admin.faq.deleteFaq.useMutation({
		onSuccess: () => {
			toast.success("Deleted successfully");
			refetch();
		},
	});

	const reorderFaqs = api.admin.faq.reorderFaqs.useMutation({
		onSuccess: () => toast.success("Order saved"),
		onError: () => toast.error("Failed to save order")
	});

	// Handlers
	const handleReorderFaqs = (newItems: any[]) => {
		// Optimistically update logic would go here if we had local state
		// For now, we just fire the mutation
		reorderFaqs.mutate({
			items: newItems.map((item, index) => ({ id: item.id, sortOrder: index }))
		});
	};

	const totalFaqs = categories?.reduce((acc, cat) => acc + cat.items.length, 0) || 0;

	return (
		<div className="space-y-8 pb-20">
			{/* Header */}
			<div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
				<div className="space-y-2">
					<h1 className="text-4xl font-display font-extralight tracking-tight">
						FAQ Management
					</h1>
					<p className="text-muted-foreground font-display font-light text-lg">
						Manage frequently asked questions
					</p>
				</div>
				<div className="flex items-center gap-2">
					<Button
						variant="outline"
						onClick={() => setIsCatModalOpen(true)}
						className="rounded-full font-display font-light"
					>
						<Settings2 className="mr-2 h-4 w-4" />
						Categories
					</Button>
					<Button onClick={() => { setEditingFaq(null); setIsFaqModalOpen(true); }} className="rounded-full">
						<Plus className="mr-2 h-4 w-4" />
						Add FAQ
					</Button>
				</div>
			</div>

			{/* Toolbar */}
			<div className="flex items-center gap-4 p-4 border rounded-xl bg-card shadow-sm">
				<div className="flex items-center gap-2">
					<Label className="font-display font-normal">Region:</Label>
					<Select value={region} onValueChange={(val: any) => setRegion(val)}>
						<SelectTrigger className="w-[180px]">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="ROW">🌍 Rest of World</SelectItem>
							<SelectItem value="US">🇺🇸 United States</SelectItem>
						</SelectContent>
					</Select>
				</div>
				<Separator orientation="vertical" className="h-6" />
				<span className="text-sm text-muted-foreground font-display font-light">
					{totalFaqs} Questions
				</span>
				{reorderFaqs.isPending && (
					<span className="flex items-center gap-2 text-xs text-muted-foreground animate-pulse ml-auto">
						<Loader2 className="w-3 h-3 animate-spin" /> Saving order...
					</span>
				)}
			</div>

			{/* Content */}
			{isLoading ? (
				<div className="text-center py-20">
					<Loader2 className="w-8 h-8 animate-spin mx-auto text-muted-foreground/30" />
				</div>
			) : (
				<div className="space-y-8">
					{categories?.map((category) => (
						<div key={category.id} className="space-y-4">
							<div className="flex items-center gap-3 border-b pb-2">
								<h2 className="text-xl font-display font-normal text-foreground/80">
									{category.name}
								</h2>
								<Badge variant="secondary" className="font-mono text-xs rounded-full px-2">
									{category.items.length}
								</Badge>
							</div>

							{category.items.length === 0 ? (
								<div className="p-8 border border-dashed rounded-xl text-center text-muted-foreground/50 text-sm">
									No FAQs in this category.
								</div>
							) : (
								<SortableList
									items={category.items}
									keyExtractor={(item) => item.id}
									onReorder={handleReorderFaqs}
									renderItem={(faq) => (
										<Card className="group hover:border-primary/20 transition-all duration-200">
											<CardContent className="p-4 flex gap-4 items-start">
												<div className="flex-1 space-y-1 pt-1">
													<h3 className="font-medium font-display text-base">
														{faq.question || "Untitled Question"}
													</h3>
													<p className="text-sm text-muted-foreground font-display font-light line-clamp-2">
														{faq.answer || "No answer provided."}
													</p>
												</div>
												<div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
													<Button
														variant="ghost"
														size="icon"
														className="h-8 w-8"
														onClick={() => {
															setEditingFaq(faq);
															setIsFaqModalOpen(true);
														}}
													>
														<Pencil className="h-4 w-4" />
													</Button>
													<Button
														variant="ghost"
														size="icon"
														className="h-8 w-8 text-destructive hover:text-destructive"
														onClick={() => {
															if (confirm("Delete this FAQ?")) deleteFaq.mutate({ id: faq.id });
														}}
													>
														<Trash className="h-4 w-4" />
													</Button>
												</div>
											</CardContent>
										</Card>
									)}
								/>
							)}
						</div>
					))}

					{categories?.length === 0 && (
						<div className="text-center py-20">
							<Folder className="w-12 h-12 text-muted-foreground/20 mx-auto mb-4" />
							<h3 className="text-xl font-display font-light mb-2">No Categories</h3>
							<Button onClick={() => setIsCatModalOpen(true)} variant="outline">
								Create Category
							</Button>
						</div>
					)}
				</div>
			)}

			{/* Modals */}
			<FaqDialog
				open={isFaqModalOpen}
				onOpenChange={setIsFaqModalOpen}
				faq={editingFaq}
				categories={categories || []}
				region={region}
				onSubmit={(data) => upsertFaq.mutate(data)}
				isSubmitting={upsertFaq.isPending}
			/>

			<CategoryManager
				open={isCatModalOpen}
				onOpenChange={setIsCatModalOpen}
				onUpdate={() => refetch()}
			/>
		</div>
	);
}

// Keeping the FaqDialog here for simplicity, or move to _components if you prefer
function FaqDialog({
	open,
	onOpenChange,
	faq,
	categories,
	region,
	onSubmit,
	isSubmitting
}: any) {
	// ... (Same implementation as before, just ensured types or `any` for quick fix) ...
	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);
		onSubmit({
			id: faq?.id,
			categoryId: formData.get("categoryId") as string,
			region,
			question: formData.get("question") as string,
			answer: formData.get("answer") as string,
			sortOrder: parseInt(formData.get("sortOrder") as string) || 0,
			locale: "en",
		});
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[600px]">
				<DialogHeader>
					<DialogTitle>{faq ? "Edit FAQ" : "New FAQ"}</DialogTitle>
					<DialogDescription>
						{region === "US" ? "United States" : "Rest of World"} Region
					</DialogDescription>
				</DialogHeader>
				<form onSubmit={handleSubmit} className="space-y-5 pt-2">
					<div className="grid grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label>Category</Label>
							<Select name="categoryId" defaultValue={faq?.categoryId || ""}>
								<SelectTrigger>
									<SelectValue placeholder="Select..." />
								</SelectTrigger>
								<SelectContent>
									{categories.filter((c: any) => c.id !== "uncategorized").map((c: any) => (
										<SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
						<div className="space-y-2">
							<Label>Order Priority</Label>
							<Input name="sortOrder" type="number" defaultValue={faq?.sortOrder ?? 0} />
						</div>
					</div>
					<div className="space-y-2">
						<Label>Question</Label>
						<Input name="question" defaultValue={faq?.question || ""} required />
					</div>
					<div className="space-y-2">
						<Label>Answer</Label>
						<Textarea name="answer" defaultValue={faq?.answer || ""} required rows={5} />
					</div>
					<div className="flex justify-end gap-3 pt-4">
						<Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
						<Button type="submit" disabled={isSubmitting}>{faq ? "Save Changes" : "Create FAQ"}</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
}