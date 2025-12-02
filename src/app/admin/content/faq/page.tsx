// src/app/admin/content/faq/page.tsx

"use client";

import { useState } from "react";
import { api } from "~/trpc/react";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Plus, Pencil, Trash } from "lucide-react";
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
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { toast } from "sonner";

export default function FAQPage() {
	const [region, setRegion] = useState<"ROW" | "US">("ROW");
	const [editingFaq, setEditingFaq] = useState<any>(null);
	const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

	const { data: faqs, isLoading, refetch } = api.admin.faq.getAll.useQuery({
		region,
	});

	const createFaq = api.admin.faq.create.useMutation({
		onSuccess: () => {
			toast.success("FAQ created successfully!");
			setIsCreateModalOpen(false);
			refetch();
		},
		onError: (error) => {
			toast.error(error.message || "Failed to create FAQ");
		},
	});

	const updateFaq = api.admin.faq.update.useMutation({
		onSuccess: () => {
			toast.success("FAQ updated successfully!");
			setEditingFaq(null);
			refetch();
		},
		onError: (error) => {
			toast.error(error.message || "Failed to update FAQ");
		},
	});

	const deleteFaq = api.admin.faq.delete.useMutation({
		onSuccess: () => {
			toast.success("FAQ deleted successfully!");
			refetch();
		},
		onError: (error) => {
			toast.error(error.message || "Failed to delete FAQ");
		},
	});

	const handleCreate = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);
		createFaq.mutate({
			region,
			question: formData.get("question") as string,
			answer: formData.get("answer") as string,
			sortOrder: parseInt(formData.get("sortOrder") as string) || 0,
		});
	};

	const handleUpdate = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);
		updateFaq.mutate({
			id: editingFaq.id,
			question: formData.get("question") as string,
			answer: formData.get("answer") as string,
			sortOrder: parseInt(formData.get("sortOrder") as string),
		});
	};

	return (
		<div className="space-y-8">
			{/* Header */}
			<div className="flex items-start justify-between">
				<div className="space-y-2">
					<h1 className="text-4xl font-display font-extralight tracking-tight">
						FAQ Management
					</h1>
					<p className="text-muted-foreground font-display font-light text-lg">
						Manage frequently asked questions for different regions
					</p>
				</div>
				<Button onClick={() => setIsCreateModalOpen(true)} className="rounded-full">
					<Plus className="mr-2 h-4 w-4" />
					Add FAQ
				</Button>
			</div>

			{/* Region Filter */}
			<div className="flex items-center gap-4">
				<Label className="font-display font-normal">Region:</Label>
				<Select value={region} onValueChange={(val: any) => setRegion(val)}>
					<SelectTrigger className="w-[200px] font-display font-light">
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="ROW" className="font-display font-light">
							🌍 Rest of World
						</SelectItem>
						<SelectItem value="US" className="font-display font-light">
							🇺🇸 United States
						</SelectItem>
					</SelectContent>
				</Select>
				<span className="text-sm text-muted-foreground font-display font-light">
					{faqs?.length || 0} FAQs
				</span>
			</div>

			{/* FAQ List */}
			{isLoading ? (
				<p className="text-muted-foreground font-display font-light">Loading FAQs...</p>
			) : (
				<div className="space-y-4">
					{faqs?.map((faq) => (
						<div
							key={faq.id}
							className="p-6 rounded-xl border-2 border-border hover:border-primary/30 transition-colors"
						>
							<div className="flex items-start justify-between gap-4">
								<div className="flex-1 space-y-3">
									<div className="flex items-start gap-3">
										<Badge variant="outline" className="font-display font-light mt-1">
											#{faq.sortOrder}
										</Badge>
										<div className="flex-1">
											<h3 className="font-display font-normal text-lg mb-2">
												{faq.question || "Untitled"}
											</h3>
											<p className="text-sm text-muted-foreground font-display font-light">
												{faq.answer || "No answer"}
											</p>
										</div>
									</div>
								</div>
								<div className="flex items-center gap-2">
									<Button
										variant="ghost"
										size="icon"
										onClick={() => setEditingFaq(faq)}
										className="rounded-full"
									>
										<Pencil className="h-4 w-4" />
									</Button>
									<Button
										variant="ghost"
										size="icon"
										onClick={() => {
											if (confirm("Delete this FAQ?")) {
												deleteFaq.mutate({ id: faq.id });
											}
										}}
										className="rounded-full text-destructive"
									>
										<Trash className="h-4 w-4" />
									</Button>
								</div>
							</div>
						</div>
					))}

					{faqs?.length === 0 && (
						<div className="text-center py-12">
							<p className="text-muted-foreground font-display font-light">
								No FAQs found for this region. Add your first one!
							</p>
						</div>
					)}
				</div>
			)}

			{/* Create Modal */}
			<Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
				<DialogContent className="sm:max-w-[600px]">
					<DialogHeader>
						<DialogTitle className="font-display font-normal text-2xl">
							Add New FAQ
						</DialogTitle>
						<DialogDescription className="font-display font-light">
							Create a new frequently asked question for {region}
						</DialogDescription>
					</DialogHeader>
					<form onSubmit={handleCreate} className="space-y-6 pt-4">
						<div className="space-y-2">
							<Label htmlFor="question" className="font-display font-normal">
								Question
							</Label>
							<Input
								id="question"
								name="question"
								placeholder="How do I place an order?"
								required
								className="font-display font-light"
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="answer" className="font-display font-normal">
								Answer
							</Label>
							<Textarea
								id="answer"
								name="answer"
								placeholder="First make sure to take accurate measurements..."
								rows={6}
								required
								className="font-display font-light"
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="sortOrder" className="font-display font-normal">
								Sort Order
							</Label>
							<Input
								id="sortOrder"
								name="sortOrder"
								type="number"
								defaultValue={0}
								className="font-display font-light"
							/>
						</div>
						<div className="flex justify-end gap-3">
							<Button
								type="button"
								variant="outline"
								onClick={() => setIsCreateModalOpen(false)}
								className="rounded-full font-display font-light"
							>
								Cancel
							</Button>
							<Button type="submit" className="rounded-full font-display font-light">
								Create FAQ
							</Button>
						</div>
					</form>
				</DialogContent>
			</Dialog>

			{/* Edit Modal */}
			<Dialog open={!!editingFaq} onOpenChange={() => setEditingFaq(null)}>
				<DialogContent className="sm:max-w-[600px]">
					<DialogHeader>
						<DialogTitle className="font-display font-normal text-2xl">
							Edit FAQ
						</DialogTitle>
					</DialogHeader>
					{editingFaq && (
						<form onSubmit={handleUpdate} className="space-y-6 pt-4">
							<div className="space-y-2">
								<Label htmlFor="edit-question" className="font-display font-normal">
									Question
								</Label>
								<Input
									id="edit-question"
									name="question"
									defaultValue={editingFaq.question}
									required
									className="font-display font-light"
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="edit-answer" className="font-display font-normal">
									Answer
								</Label>
								<Textarea
									id="edit-answer"
									name="answer"
									defaultValue={editingFaq.answer}
									rows={6}
									required
									className="font-display font-light"
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="edit-sortOrder" className="font-display font-normal">
									Sort Order
								</Label>
								<Input
									id="edit-sortOrder"
									name="sortOrder"
									type="number"
									defaultValue={editingFaq.sortOrder}
									className="font-display font-light"
								/>
							</div>
							<div className="flex justify-end gap-3">
								<Button
									type="button"
									variant="outline"
									onClick={() => setEditingFaq(null)}
									className="rounded-full font-display font-light"
								>
									Cancel
								</Button>
								<Button type="submit" className="rounded-full font-display font-light">
									Update FAQ
								</Button>
							</div>
						</form>
					)}
				</DialogContent>
			</Dialog>
		</div>
	);
}