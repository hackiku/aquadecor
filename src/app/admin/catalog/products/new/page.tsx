// @ts-nocheck
// src/app/admin/catalog/products/new/page.tsx

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

export default function NewProductPage() {
	const router = useRouter();
	const [isSubmitting, setIsSubmitting] = useState(false);

	// Form state
	const [formData, setFormData] = useState({
		categoryId: "",
		slug: "",
		sku: "",
		name: "",
		shortDescription: "",
		fullDescription: "",
		basePriceEurCents: "",
		priceNote: "",
		stockStatus: "made_to_order" as const,
		isActive: true,
		isFeatured: false,
		sortOrder: 0,
	});

	const { data: categories } = api.admin.category.getAll.useQuery();
	const createProduct = api.admin.product.create.useMutation({
		onSuccess: (data) => {
			toast.success("Product created successfully!");
			router.push(`/admin/catalog/products/${data!.id}`);
		},
		onError: (error) => {
			toast.error(error.message || "Failed to create product");
			setIsSubmitting(false);
		},
	});

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);

		// Convert price from euros to cents
		const priceInCents = formData.basePriceEurCents
			? Math.round(parseFloat(formData.basePriceEurCents) * 100)
			: undefined;

		await createProduct.mutateAsync({
			categoryId: formData.categoryId,
			slug: formData.slug,
			sku: formData.sku || undefined,
			name: formData.name,
			shortDescription: formData.shortDescription || undefined,
			fullDescription: formData.fullDescription || undefined,
			basePriceEurCents: priceInCents,
			priceNote: formData.priceNote || undefined,
			stockStatus: formData.stockStatus,
			isActive: formData.isActive,
			isFeatured: formData.isFeatured,
			sortOrder: formData.sortOrder,
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
					<Link href="/admin/catalog/products">
						<ArrowLeft className="mr-2 h-4 w-4" />
						Back to Products
					</Link>
				</Button>
				<div className="space-y-2">
					<h1 className="text-4xl font-display font-extralight tracking-tight">
						Create New Product
					</h1>
					<p className="text-muted-foreground font-display font-light text-lg">
						Add a new product to your catalog
					</p>
				</div>
			</div>

			<form onSubmit={handleSubmit}>
				<div className="grid gap-8 lg:grid-cols-2">
					{/* Left Column */}
					<div className="space-y-6">
						{/* Basic Info */}
						<Card className="border-2">
							<CardHeader>
								<CardTitle className="font-display font-normal">Basic Information</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="space-y-2">
									<Label htmlFor="name" className="font-display font-normal">
										Product Name <span className="text-destructive">*</span>
									</Label>
									<Input
										id="name"
										value={formData.name}
										onChange={(e) => setFormData({ ...formData, name: e.target.value })}
										placeholder="3D Rocky Background F1"
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
										placeholder="3d-rocky-background-f1"
										required
										className="font-display font-light font-mono text-sm"
									/>
								</div>

								<div className="space-y-2">
									<Label htmlFor="sku" className="font-display font-normal">
										SKU
									</Label>
									<Input
										id="sku"
										value={formData.sku}
										onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
										placeholder="F1"
										className="font-display font-light"
									/>
								</div>

								<div className="space-y-2">
									<Label htmlFor="category" className="font-display font-normal">
										Category <span className="text-destructive">*</span>
									</Label>
									<Select
										value={formData.categoryId}
										onValueChange={(value) => setFormData({ ...formData, categoryId: value })}
										required
									>
										<SelectTrigger className="font-display font-light">
											<SelectValue placeholder="Select category" />
										</SelectTrigger>
										<SelectContent>
											{categories?.map((cat) => (
												<SelectItem key={cat.id} value={cat.id} className="font-display font-light">
													{cat.name}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>
							</CardContent>
						</Card>

						{/* Content */}
						<Card className="border-2">
							<CardHeader>
								<CardTitle className="font-display font-normal">Product Content</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="space-y-2">
									<Label htmlFor="shortDescription" className="font-display font-normal">
										Short Description
									</Label>
									<Textarea
										id="shortDescription"
										value={formData.shortDescription}
										onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
										placeholder="Brief product description for cards and listings"
										rows={3}
										className="font-display font-light"
									/>
								</div>

								<div className="space-y-2">
									<Label htmlFor="fullDescription" className="font-display font-normal">
										Full Description
									</Label>
									<Textarea
										id="fullDescription"
										value={formData.fullDescription}
										onChange={(e) => setFormData({ ...formData, fullDescription: e.target.value })}
										placeholder="Detailed product description for product page"
										rows={6}
										className="font-display font-light"
									/>
								</div>
							</CardContent>
						</Card>
					</div>

					{/* Right Column */}
					<div className="space-y-6">
						{/* Pricing */}
						<Card className="border-2">
							<CardHeader>
								<CardTitle className="font-display font-normal">Pricing</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="space-y-2">
									<Label htmlFor="price" className="font-display font-normal">
										Base Price (EUR)
									</Label>
									<Input
										id="price"
										type="number"
										step="0.01"
										min="0"
										value={formData.basePriceEurCents}
										onChange={(e) => setFormData({ ...formData, basePriceEurCents: e.target.value })}
										placeholder="49.99"
										className="font-display font-light"
									/>
									<p className="text-xs text-muted-foreground font-display font-light">
										Leave empty for custom-only products
									</p>
								</div>

								<div className="space-y-2">
									<Label htmlFor="priceNote" className="font-display font-normal">
										Price Note
									</Label>
									<Input
										id="priceNote"
										value={formData.priceNote}
										onChange={(e) => setFormData({ ...formData, priceNote: e.target.value })}
										placeholder="From €199"
										className="font-display font-light"
									/>
								</div>
							</CardContent>
						</Card>

						{/* Inventory */}
						<Card className="border-2">
							<CardHeader>
								<CardTitle className="font-display font-normal">Inventory</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="space-y-2">
									<Label htmlFor="stockStatus" className="font-display font-normal">
										Stock Status
									</Label>
									<Select
										value={formData.stockStatus}
										onValueChange={(value: any) => setFormData({ ...formData, stockStatus: value })}
									>
										<SelectTrigger className="font-display font-light">
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="in_stock" className="font-display font-light">
												In Stock
											</SelectItem>
											<SelectItem value="made_to_order" className="font-display font-light">
												Made to Order
											</SelectItem>
											<SelectItem value="out_of_stock" className="font-display font-light">
												Out of Stock
											</SelectItem>
										</SelectContent>
									</Select>
								</div>

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
								</div>
							</CardContent>
						</Card>

						{/* Settings */}
						<Card className="border-2">
							<CardHeader>
								<CardTitle className="font-display font-normal">Settings</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
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

								<div className="flex items-center space-x-2">
									<Checkbox
										id="isFeatured"
										checked={formData.isFeatured}
										onCheckedChange={(checked) => setFormData({ ...formData, isFeatured: !!checked })}
									/>
									<Label htmlFor="isFeatured" className="font-display font-light cursor-pointer">
										Featured (show on homepage)
									</Label>
								</div>
							</CardContent>
						</Card>
					</div>
				</div>

				{/* Submit */}
				<div className="flex justify-end gap-4 pt-8">
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
						Create Product
					</Button>
				</div>
			</form>
		</div>
	);
}