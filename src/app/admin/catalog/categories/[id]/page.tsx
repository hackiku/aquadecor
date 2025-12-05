// src/app/admin/catalog/categories/[id]/page.tsx

import { notFound } from "next/navigation";
import { api } from "~/trpc/server";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Pencil, ArrowLeft, Globe } from "lucide-react";
import Link from "next/link";
import { CategoryProductsTable } from "./_components/CategoryProductsTable";

interface PageProps {
	params: Promise<{
		id: string;
	}>;
}

export default async function CategoryDetailPage({ params }: PageProps) {
	const { id } = await params;
	const category = await api.admin.category.getById({ id });

	if (!category) {
		notFound();
	}

	const productLineNames: Record<string, string> = {
		"3d-backgrounds": "3D Backgrounds",
		"aquarium-decorations": "Aquarium Decorations",
	};

	return (
		<div className="space-y-8">
			{/* Header */}
			<div className="flex items-start justify-between">
				<div className="space-y-4">
					<Button variant="ghost" asChild className="font-display font-light -ml-4">
						<Link href="/admin/catalog/categories">
							<ArrowLeft className="mr-2 h-4 w-4" />
							Back to Categories
						</Link>
					</Button>
					<div className="space-y-2">
						<div className="flex items-center gap-3">
							<h1 className="text-4xl font-display font-extralight tracking-tight">
								{category.name || "Untitled Category"}
							</h1>
							<Badge
								variant={category.isActive ? "default" : "secondary"}
								className="font-display font-light"
							>
								{category.isActive ? "Active" : "Inactive"}
							</Badge>
						</div>
						<p className="text-muted-foreground font-display font-light text-lg">
							{productLineNames[category.productLine]} • {category.productCount} products
						</p>
					</div>
				</div>
				<Button asChild className="rounded-full">
					<Link href={`/admin/catalog/categories/${id}/edit`}>
						<Pencil className="mr-2 h-4 w-4" />
						Edit Category
					</Link>
				</Button>
			</div>

			<div className="grid gap-8 lg:grid-cols-2">
				{/* Left Column */}
				<div className="space-y-6">
					{/* Basic Info */}
					<Card className="border-2">
						<CardHeader>
							<CardTitle className="font-display font-normal">Basic Information</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<div>
								<p className="text-sm text-muted-foreground font-display font-light mb-1">
									Category Name
								</p>
								<p className="font-display font-normal text-lg">
									{category.name}
								</p>
							</div>

							<div className="grid grid-cols-2 gap-4">
								<div>
									<p className="text-sm text-muted-foreground font-display font-light mb-1">
										Slug
									</p>
									<p className="font-display font-light text-sm font-mono">
										{category.slug}
									</p>
								</div>
								<div>
									<p className="text-sm text-muted-foreground font-display font-light mb-1">
										Sort Order
									</p>
									<p className="font-display font-normal">
										{category.sortOrder}
									</p>
								</div>
							</div>

							<div>
								<p className="text-sm text-muted-foreground font-display font-light mb-1">
									Product Line
								</p>
								<Badge variant="outline" className="font-display font-light">
									{productLineNames[category.productLine]}
								</Badge>
							</div>

							{category.description && (
								<div>
									<p className="text-sm text-muted-foreground font-display font-light mb-2">
										Description
									</p>
									<p className="font-display font-light leading-relaxed">
										{category.description}
									</p>
								</div>
							)}
						</CardContent>
					</Card>
				</div>

				{/* Right Column */}
				<div className="space-y-6">
					{/* SEO & i18n */}
					<Card className="border-2">
						<CardHeader>
							<div className="flex items-center gap-2">
								<Globe className="h-5 w-5 text-primary" />
								<CardTitle className="font-display font-normal">SEO & Translations</CardTitle>
							</div>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="p-4 rounded-lg bg-muted/50 border border-border space-y-3">
								<div className="flex items-center justify-between">
									<h4 className="font-display font-normal text-sm">SEO Settings</h4>
									<Button
										variant="ghost"
										size="sm"
										asChild
										className="h-7 rounded-full"
									>
										<Link href={`/admin/catalog/categories/${id}/edit`}>
											<Pencil className="h-3 w-3 mr-1" />
											Edit
										</Link>
									</Button>
								</div>
								<div className="space-y-2 text-sm">
									<div>
										<p className="text-muted-foreground font-display font-light">Meta Title</p>
										<p className="font-display font-light">
											{category.name} - Aquadecor Aquarium Backgrounds
										</p>
									</div>
									<div>
										<p className="text-muted-foreground font-display font-light">Meta Description</p>
										<p className="font-display font-light text-muted-foreground">
											{category.description || "No meta description set"}
										</p>
									</div>
									<div>
										<p className="text-muted-foreground font-display font-light">URL Slug</p>
										<p className="font-display font-light font-mono text-xs">
											/shop/{category.productLine}/{category.slug}
										</p>
									</div>
								</div>
							</div>

							<div className="space-y-3">
								<h4 className="font-display font-normal text-sm">Available Translations</h4>
								{category.translations && category.translations.length > 0 ? (
									<div className="space-y-3">
										{category.translations.map((trans) => (
											<div
												key={trans.id}
												className="p-4 rounded-lg border border-border space-y-2"
											>
												<div className="flex items-center justify-between">
													<Badge variant="outline" className="font-display font-light uppercase">
														{trans.locale}
													</Badge>
													<Button
														variant="ghost"
														size="sm"
														asChild
														className="h-7 rounded-full"
													>
														<Link href={`/admin/catalog/categories/${id}/edit`}>
															<Pencil className="h-3 w-3 mr-1" />
															Edit
														</Link>
													</Button>
												</div>
												<div>
													<p className="font-display font-normal">{trans.name}</p>
													{trans.description && (
														<p className="text-sm text-muted-foreground font-display font-light mt-1">
															{trans.description}
														</p>
													)}
												</div>
											</div>
										))}
									</div>
								) : (
									<p className="text-muted-foreground font-display font-light text-sm">
										No translations available
									</p>
								)}
								<Button
									variant="outline"
									asChild
									className="w-full rounded-full font-display font-light"
								>
									<Link href={`/admin/catalog/categories/${id}/edit`}>
										Add Translation
									</Link>
								</Button>
							</div>
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
								<Badge
									variant={category.isActive ? "default" : "secondary"}
									className="font-display font-light"
								>
									{category.isActive ? "Active" : "Inactive"}
								</Badge>
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
				categoryId={id}
				categoryName={category.name || "this category"}
				productCount={category.productCount}
			/>
		</div>
	);
}