// src/app/admin/catalog/categories/[id]/_components/CategoryDetailClient.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "~/trpc/react";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { Switch } from "~/components/ui/switch";
import { Pencil, Save, X, Loader2, Plus, Trash2, Globe } from "lucide-react";
import { toast } from "sonner";
import { CategoryProductsTable } from "./CategoryProductsTable";

interface CategoryDetailClientProps {
	category: any;
}

export function CategoryDetailClient({ category }: CategoryDetailClientProps) {
	const router = useRouter();
	const [isEditingBasic, setIsEditingBasic] = useState(false);
	const [editingTranslationId, setEditingTranslationId] = useState<string | null>(null);
	const [isAddingTranslation, setIsAddingTranslation] = useState(false);

	// Basic info form
	const [basicFormData, setBasicFormData] = useState({
		name: category.name || '',
		description: category.description || '',
		isActive: category.isActive,
		sortOrder: category.sortOrder,
	});

	// Translation form
	const [translationFormData, setTranslationFormData] = useState({
		locale: 'de',
		name: '',
		description: '',
		metaTitle: '',
		metaDescription: '',
	});

	const updateCategory = api.admin.category.update.useMutation({
		onSuccess: () => {
			toast.success('Category updated');
			setIsEditingBasic(false);
			router.refresh();
		},
		onError: (error) => {
			toast.error(`Failed to update: ${error.message}`);
		},
	});

	const addTranslation = api.admin.category.addTranslation.useMutation({
		onSuccess: () => {
			toast.success('Translation added');
			setIsAddingTranslation(false);
			setTranslationFormData({
				locale: 'de',
				name: '',
				description: '',
				metaTitle: '',
				metaDescription: '',
			});
			router.refresh();
		},
		onError: (error) => {
			toast.error(`Failed to add translation: ${error.message}`);
		},
	});

	const updateTranslation = api.admin.category.updateTranslation.useMutation({
		onSuccess: () => {
			toast.success('Translation updated');
			setEditingTranslationId(null);
			router.refresh();
		},
		onError: (error) => {
			toast.error(`Failed to update translation: ${error.message}`);
		},
	});

	const deleteTranslation = api.admin.category.deleteTranslation.useMutation({
		onSuccess: () => {
			toast.success('Translation deleted');
			router.refresh();
		},
		onError: (error) => {
			toast.error(`Failed to delete translation: ${error.message}`);
		},
	});

	const handleSaveBasic = () => {
		updateCategory.mutate({
			id: category.id,
			name: basicFormData.name,
			description: basicFormData.description,
			isActive: basicFormData.isActive,
			sortOrder: basicFormData.sortOrder,
		});
	};

	const handleCancelBasic = () => {
		setBasicFormData({
			name: category.name || '',
			description: category.description || '',
			isActive: category.isActive,
			sortOrder: category.sortOrder,
		});
		setIsEditingBasic(false);
	};

	const handleAddTranslation = () => {
		if (!translationFormData.locale || !translationFormData.name) {
			toast.error('Locale and name are required');
			return;
		}

		addTranslation.mutate({
			categoryId: category.id,
			locale: translationFormData.locale,
			name: translationFormData.name,
			description: translationFormData.description,
			metaTitle: translationFormData.metaTitle,
			metaDescription: translationFormData.metaDescription,
		});
	};

	const handleUpdateTranslation = (translationId: string, data: any) => {
		updateTranslation.mutate({
			translationId,
			...data,
		});
	};

	const handleDeleteTranslation = (translationId: string) => {
		if (confirm('Delete this translation?')) {
			deleteTranslation.mutate({ translationId });
		}
	};

	const productLineNames: Record<string, string> = {
		"3d-backgrounds": "3D Backgrounds",
		"aquarium-decorations": "Aquarium Decorations",
	};

	return (
		<div className="space-y-6">
			<div className="grid gap-6 lg:grid-cols-2">
				{/* Left Column - Basic Info */}
				<Card className="border-2">
					<CardHeader>
						<div className="flex items-center justify-between">
							<CardTitle className="font-display font-normal">Basic Information</CardTitle>
							{!isEditingBasic && (
								<Button
									variant="outline"
									size="sm"
									onClick={() => setIsEditingBasic(true)}
									className="rounded-full"
								>
									<Pencil className="mr-2 h-4 w-4" />
									Edit
								</Button>
							)}
						</div>
					</CardHeader>
					<CardContent className="space-y-4">
						{isEditingBasic ? (
							<>
								<div className="space-y-2">
									<Label htmlFor="name" className="font-display font-light">Category Name</Label>
									<Input
										id="name"
										value={basicFormData.name}
										onChange={(e) => setBasicFormData({ ...basicFormData, name: e.target.value })}
										className="font-display font-light"
									/>
								</div>

								<div className="space-y-2">
									<Label htmlFor="description" className="font-display font-light">Description</Label>
									<Textarea
										id="description"
										value={basicFormData.description}
										onChange={(e) => setBasicFormData({ ...basicFormData, description: e.target.value })}
										rows={4}
										className="font-display font-light"
									/>
								</div>

								<div className="space-y-2">
									<Label htmlFor="sortOrder" className="font-display font-light">Sort Order</Label>
									<Input
										id="sortOrder"
										type="number"
										value={basicFormData.sortOrder}
										onChange={(e) => setBasicFormData({ ...basicFormData, sortOrder: parseInt(e.target.value) || 0 })}
										className="font-display font-light"
									/>
								</div>

								<div className="flex items-center justify-between pt-2">
									<Label htmlFor="isActive" className="font-display font-light">Active</Label>
									<Switch
										id="isActive"
										checked={basicFormData.isActive}
										onCheckedChange={(checked) => setBasicFormData({ ...basicFormData, isActive: checked })}
									/>
								</div>

								<div className="flex gap-2 pt-4">
									<Button
										onClick={handleSaveBasic}
										disabled={updateCategory.isPending}
										className="flex-1 rounded-full"
									>
										{updateCategory.isPending ? (
											<Loader2 className="h-4 w-4 animate-spin" />
										) : (
											<>
												<Save className="mr-2 h-4 w-4" />
												Save
											</>
										)}
									</Button>
									<Button
										variant="ghost"
										onClick={handleCancelBasic}
										className="rounded-full"
									>
										<X className="h-4 w-4" />
									</Button>
								</div>
							</>
						) : (
							<>
								<div>
									<p className="text-sm text-muted-foreground font-display font-light mb-1">Category Name</p>
									<p className="font-display font-normal text-lg">{category.name}</p>
								</div>

								<div className="grid grid-cols-2 gap-4">
									<div>
										<p className="text-sm text-muted-foreground font-display font-light mb-1">Slug</p>
										<p className="font-display font-light text-sm font-mono">{category.slug}</p>
									</div>
									<div>
										<p className="text-sm text-muted-foreground font-display font-light mb-1">Sort Order</p>
										<p className="font-display font-normal">{category.sortOrder}</p>
									</div>
								</div>

								<div>
									<p className="text-sm text-muted-foreground font-display font-light mb-1">Product Line</p>
									<Badge variant="outline" className="font-display font-light">
										{productLineNames[category.productLine]}
									</Badge>
								</div>

								{category.description && (
									<div>
										<p className="text-sm text-muted-foreground font-display font-light mb-2">Description</p>
										<p className="font-display font-light leading-relaxed">{category.description}</p>
									</div>
								)}
							</>
						)}
					</CardContent>
				</Card>

				{/* Right Column - Translations & Metadata */}
				<div className="space-y-6">
					{/* Translations */}
					<Card className="border-2">
						<CardHeader>
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-2">
									<Globe className="h-5 w-5 text-primary" />
									<CardTitle className="font-display font-normal">Translations</CardTitle>
								</div>
								{!isAddingTranslation && (
									<Button
										variant="outline"
										size="sm"
										onClick={() => setIsAddingTranslation(true)}
										className="rounded-full"
									>
										<Plus className="mr-2 h-4 w-4" />
										Add
									</Button>
								)}
							</div>
						</CardHeader>
						<CardContent className="space-y-4">
							{/* Add New Translation Form */}
							{isAddingTranslation && (
								<div className="p-4 rounded-lg border-2 border-primary/20 bg-primary/5 space-y-3">
									<div className="space-y-2">
										<Label className="font-display font-light">Locale</Label>
										<Input
											value={translationFormData.locale}
											onChange={(e) => setTranslationFormData({ ...translationFormData, locale: e.target.value })}
											placeholder="de, fr, es, etc."
											className="font-display font-light"
										/>
									</div>
									<div className="space-y-2">
										<Label className="font-display font-light">Name</Label>
										<Input
											value={translationFormData.name}
											onChange={(e) => setTranslationFormData({ ...translationFormData, name: e.target.value })}
											className="font-display font-light"
										/>
									</div>
									<div className="space-y-2">
										<Label className="font-display font-light">Description</Label>
										<Textarea
											value={translationFormData.description}
											onChange={(e) => setTranslationFormData({ ...translationFormData, description: e.target.value })}
											rows={3}
											className="font-display font-light"
										/>
									</div>
									<div className="flex gap-2">
										<Button
											size="sm"
											onClick={handleAddTranslation}
											disabled={addTranslation.isPending}
											className="flex-1 rounded-full"
										>
											{addTranslation.isPending ? (
												<Loader2 className="h-4 w-4 animate-spin" />
											) : (
												<>
													<Save className="mr-2 h-4 w-4" />
													Save
												</>
											)}
										</Button>
										<Button
											variant="ghost"
											size="sm"
											onClick={() => setIsAddingTranslation(false)}
											className="rounded-full"
										>
											Cancel
										</Button>
									</div>
								</div>
							)}

							{/* Existing Translations */}
							{category.translations && category.translations.length > 0 ? (
								<div className="space-y-3">
									{category.translations.map((trans: any) => (
										<div
											key={trans.id}
											className="p-4 rounded-lg border-2 space-y-3"
										>
											{editingTranslationId === trans.id ? (
												<>
													<div className="space-y-2">
														<Label className="font-display font-light">Name</Label>
														<Input
															defaultValue={trans.name}
															id={`name-${trans.id}`}
															className="font-display font-light"
														/>
													</div>
													<div className="space-y-2">
														<Label className="font-display font-light">Description</Label>
														<Textarea
															defaultValue={trans.description || ''}
															id={`desc-${trans.id}`}
															rows={3}
															className="font-display font-light"
														/>
													</div>
													<div className="flex gap-2">
														<Button
															size="sm"
															onClick={() => {
																const name = (document.getElementById(`name-${trans.id}`) as HTMLInputElement).value;
																const description = (document.getElementById(`desc-${trans.id}`) as HTMLTextAreaElement).value;
																handleUpdateTranslation(trans.id, { name, description });
															}}
															disabled={updateTranslation.isPending}
															className="flex-1 rounded-full"
														>
															{updateTranslation.isPending ? (
																<Loader2 className="h-4 w-4 animate-spin" />
															) : (
																<>
																	<Save className="mr-2 h-4 w-4" />
																	Save
																</>
															)}
														</Button>
														<Button
															variant="ghost"
															size="sm"
															onClick={() => setEditingTranslationId(null)}
															className="rounded-full"
														>
															Cancel
														</Button>
													</div>
												</>
											) : (
												<>
													<div className="flex items-start justify-between">
														<Badge variant="outline" className="font-display font-light uppercase">
															{trans.locale}
														</Badge>
														<div className="flex gap-2">
															<Button
																variant="ghost"
																size="sm"
																onClick={() => setEditingTranslationId(trans.id)}
																className="h-7 rounded-full"
															>
																<Pencil className="h-3 w-3" />
															</Button>
															<Button
																variant="ghost"
																size="sm"
																onClick={() => handleDeleteTranslation(trans.id)}
																disabled={deleteTranslation.isPending}
																className="h-7 rounded-full text-destructive hover:text-destructive"
															>
																<Trash2 className="h-3 w-3" />
															</Button>
														</div>
													</div>
													<div>
														<p className="font-display font-normal">{trans.name}</p>
														{trans.description && (
															<p className="text-sm text-muted-foreground font-display font-light mt-1">
																{trans.description}
															</p>
														)}
													</div>
												</>
											)}
										</div>
									))}
								</div>
							) : (
								<p className="text-muted-foreground font-display font-light text-sm text-center py-4">
									No translations yet
								</p>
							)}
						</CardContent>
					</Card>

					{/* Metadata */}
					<Card className="border-2">
						<CardHeader>
							<CardTitle className="font-display font-normal">Metadata</CardTitle>
						</CardHeader>
						<CardContent className="space-y-3 text-sm">
							<div className="flex justify-between">
								<span className="text-muted-foreground font-display font-light">Category ID</span>
								<span className="font-display font-light font-mono text-xs">{category.id}</span>
							</div>
							<div className="flex justify-between">
								<span className="text-muted-foreground font-display font-light">Status</span>
								<Badge variant={category.isActive ? "default" : "secondary"} className="font-display font-light">
									{category.isActive ? "Active" : "Inactive"}
								</Badge>
							</div>
							<div className="flex justify-between">
								<span className="text-muted-foreground font-display font-light">Product Count</span>
								<span className="font-display font-normal">{category.productCount}</span>
							</div>
							<div className="flex justify-between">
								<span className="text-muted-foreground font-display font-light">Created</span>
								<span className="font-display font-light">
									{new Date(category.createdAt).toLocaleDateString()}
								</span>
							</div>
							{category.updatedAt && (
								<div className="flex justify-between">
									<span className="text-muted-foreground font-display font-light">Updated</span>
									<span className="font-display font-light">
										{new Date(category.updatedAt).toLocaleDateString()}
									</span>
								</div>
							)}
						</CardContent>
					</Card>
				</div>
			</div>

			{/* Products Table - Full Width */}
			<CategoryProductsTable
				categoryId={category.id}
				categoryName={category.name || "this category"}
				productCount={category.productCount}
			/>
		</div>
	);
}