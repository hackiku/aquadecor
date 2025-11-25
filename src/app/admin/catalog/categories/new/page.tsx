// src/app/admin/catalog/categories/new/page.tsx

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "~/trpc/react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "~/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Checkbox } from "~/components/ui/checkbox";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function NewCategoryPage() {
	const router = useRouter();
	const [isSubmitting, setIsSubmitting] = useState(false);

	// Form state
	const [formData, setFormData] = useState({
		slug: "",
		name: "",
		description: "",
		productLine: "" as "3d-backgrounds" | "aquarium-decorations" | "",
		sortOrder: 0,
		isActive: true,
	});

	const createCategory = api.admin.category.create.useMutation({
		onSuccess: (data) => {
			toast.success("Category created successfully!");
			router.push(`/admin/catalog/categories/${data!.id}`);
		},
		onError: (error) => {
			toast.error(error.message || "Failed to create category");
			setIsSubmitting(false);
		},
	});

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);

		await createCategory.mutateAsync({
			slug: formData.slug,
			name: formData.name,
			description: formData.description || undefined,
			productLine: formData.productLine as "3d-backgrounds" | "aquarium-decorations",
			sortOrder: formData.sortOrder,
			isActive: formData.isActive,
		});
	};

	const generateSlug = () => {
		if (formData.name) {
			const slug = formData.name
				.toLowerCase()
				.replace(/[^a-z0-9]+/g, "-")
				.replace(/^-|-$/g, "");
			setFormData({ ...formData, slug });
		}
	};

	return (
		<div className="space-y-8">
			{/* Header */}
			<div className="space-y-4">
				<Button variant="ghost" asChild className="font-display font-light -ml-4">
					<Link href="/admin/catalog/categories">
						<ArrowLeft className="mr-2 h-4 w-4" />
						Back to Categories
					</Link>
				</Button>
				<div className="space-y-2">
					<h1 className="text-4xl font-display font-extralight tracking-tight">
						Create New Category
					</h1>
					<p className="text-muted-foreground font-display font-light text-lg">
						Add a new category to organize products
					</p>
				</div>
			</div>

			<form onSubmit={handleSubmit}>
				<div className="max-w-2xl space-y-6">
					{/* Basic Info */}
					<Card className="border-2">
						<CardHeader>
							<CardTitle className="font-display font-normal">Basic Information</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="space-y-2">
								<Label htmlFor="name" className="font-display font-normal">
									Category Name <span className="text-destructive">*</span>
								</Label>
								<Input
									id="name"
									value={formData.name}
									onChange={(e) => setFormData({ ...formData, name: e.target.value })}
									placeholder="A Models - Classic Rocky Backgrounds"
									required
									className="font-display font-light"
								/>
							</div>

							<div className="space-y-2">
								<div className="flex items-center justify-between">
									<Label htmlFor="slug" className="font-display font-normal">
										URL Slug <span className="text-destructive">*</span>
									</Label>
									<Button
										type="button"
										variant="ghost"
										size="sm"
										onClick={generateSlug}
										className="h-7 text-xs"
									>
										Generate
									</Button>
								</div>
								<Input
									id="slug"
									value={formData.slug}
									onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
									placeholder="a-models"
									required
									className="font-display font-light font-mono text-sm"
								/>
								<p className="text-xs text-muted-foreground font-display font-light">
									Will appear in URL: /shop/product-line/slug
								</p>
							</div>

							<div className="space-y-2">
								<Label htmlFor="productLine" className="font-display font-normal">
									Product Line <span className="text-destructive">*</span>
								</Label>
								<Select
									value={formData.productLine}
									onValueChange={(value: any) => setFormData({ ...formData, productLine: value })}
									required
								>
									<SelectTrigger className="font-display font-light">
										<SelectValue placeholder="Select product line" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="3d-backgrounds" className="font-display font-light">
											3D Backgrounds
										</SelectItem>
										<SelectItem value="aquarium-decorations" className="font-display font-light">
											Aquarium Decorations
										</SelectItem>
									</SelectContent>
								</Select>
							</div>

							<div className="space-y-2">
								<Label htmlFor="description" className="font-display font-normal">
									Description
								</Label>
								<Textarea
									id="description"
									value={formData.description}
									onChange={(e) => setFormData({ ...formData, description: e.target.value })}
									placeholder="Category description for SEO and navigation"
									rows={4}
									className="font-display font-light"
								/>
							</div>
						</CardContent>
					</Card>

					{/* Settings */}
					<Card className="border-2">
						<CardHeader>
							<CardTitle className="font-display font-normal">Settings</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="space-y-2">
								<Label htmlFor="sortOrder" className="font-display font-normal">
									Sort Order
								</Label>
								<Input
									id="sortOrder"
									type="number"
									value={formData.sortOrder}
									onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) || 0 })}
									placeholder="0"
									className="font-display font-light"
								/>
								<p className="text-xs text-muted-foreground font-display font-light">
									Lower numbers appear first in category lists
								</p>
							</div>

							<div className="flex items-center space-x-2">
								<Checkbox
									id="isActive"
									checked={formData.isActive}
									onCheckedChange={(checked) => setFormData({ ...formData, isActive: !!checked })}
								/>
								<Label htmlFor="isActive" className="font-display font-light cursor-pointer">
									Active (visible in shop)
								</Label>
							</div>
						</CardContent>
					</Card>

					{/* Submit */}
					<div className="flex justify-end gap-4">
						<Button
							type="button"
							variant="outline"
							onClick={() => router.back()}
							disabled={isSubmitting}
							className="rounded-full font-display font-light"
						>
							Cancel
						</Button>
						<Button
							type="submit"
							disabled={isSubmitting}
							className="rounded-full font-display font-light"
						>
							{isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
							Create Category
						</Button>
					</div>
				</div>
			</form>
		</div>
	);
}