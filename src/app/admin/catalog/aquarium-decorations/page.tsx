// src/app/admin/catalog/aquarium-decorations/page.tsx

import { api } from "~/trpc/server";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Plus, ArrowLeft, Layers } from "lucide-react";
import Link from "next/link";
import { ProductLineClient } from "../_components/ProductLineClient";

export default async function AquariumDecorationsPage() {
	const productLine = "aquarium-decorations";

	// Get all categories for this product line
	const categories = await api.admin.category.getAll({
		productLine,
	});

	// Get all products for this product line
	const allProducts = await api.admin.product.getAll();
	const products = allProducts.filter(
		(p) => p.productLine === productLine
	);

	// Stats
	const stats = {
		categories: categories.length,
		products: products.length,
		activeProducts: products.filter((p) => p.isActive).length,
		featuredProducts: products.filter((p) => p.isFeatured).length,
	};

	return (
		<div className="space-y-8">
			{/* Header */}
			<div className="space-y-4">
				<Button variant="ghost" asChild className="font-display font-light -ml-4">
					<Link href="/admin/catalog">
						<ArrowLeft className="mr-2 h-4 w-4" />
						Back to Catalog
					</Link>
				</Button>
				<div className="flex items-start justify-between">
					<div className="space-y-2">
						<h1 className="text-4xl font-display font-extralight tracking-tight">
							Aquarium Decorations
						</h1>
						<p className="text-muted-foreground font-display font-light text-lg">
							Plants, rocks, driftwood, and accessories
						</p>
					</div>
					<div className="flex gap-3">
						<Button variant="outline" asChild className="rounded-full">
							<Link href="/admin/catalog/categories/new">
								<Layers className="mr-2 h-4 w-4" />
								Add Category
							</Link>
						</Button>
						<Button asChild className="rounded-full">
							<Link href="/admin/catalog/products/new">
								<Plus className="mr-2 h-4 w-4" />
								Add Product
							</Link>
						</Button>
					</div>
				</div>
			</div>

			{/* Stats */}
			<div className="grid gap-6 md:grid-cols-4">
				<Card className="border-2">
					<CardHeader>
						<CardTitle className="font-display font-normal text-sm text-muted-foreground">
							Categories
						</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-3xl font-display font-light">{stats.categories}</p>
					</CardContent>
				</Card>
				<Card className="border-2">
					<CardHeader>
						<CardTitle className="font-display font-normal text-sm text-muted-foreground">
							Total Products
						</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-3xl font-display font-light">{stats.products}</p>
					</CardContent>
				</Card>
				<Card className="border-2">
					<CardHeader>
						<CardTitle className="font-display font-normal text-sm text-muted-foreground">
							Active Products
						</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-3xl font-display font-light">{stats.activeProducts}</p>
					</CardContent>
				</Card>
				<Card className="border-2">
					<CardHeader>
						<CardTitle className="font-display font-normal text-sm text-muted-foreground">
							Featured
						</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-3xl font-display font-light">{stats.featuredProducts}</p>
					</CardContent>
				</Card>
			</div>

			{/* Categories */}
			<div className="space-y-4">
				<div className="flex items-center justify-between">
					<h2 className="text-2xl font-display font-light">Categories</h2>
					<Button variant="outline" size="sm" asChild className="rounded-full">
						<Link href="/admin/catalog/categories?productLine=aquarium-decorations">
							View All
						</Link>
					</Button>
				</div>

				<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
					{categories
						.sort((a, b) => a.sortOrder - b.sortOrder)
						.map((category) => (
							<Link
								key={category.id}
								href={`/admin/catalog/categories/${category.id}`}
							>
								<Card className="border-2 hover:border-primary/50 hover:shadow-lg transition-all group">
									<CardHeader className="space-y-3">
										<div className="flex items-start justify-between">
											<div className="space-y-1 flex-1">
												<h3 className="font-display font-normal leading-tight group-hover:text-primary transition-colors">
													{category.name}
												</h3>
											</div>
											<Badge
												variant={category.isActive ? "default" : "secondary"}
												className="font-display font-light text-xs"
											>
												{category.isActive ? "Active" : "Inactive"}
											</Badge>
										</div>
									</CardHeader>
									<CardContent className="space-y-3">
										{category.description && (
											<p className="text-sm text-muted-foreground font-display font-light line-clamp-2">
												{category.description}
											</p>
										)}
										<div className="flex items-center justify-between text-sm">
											<span className="text-muted-foreground font-display font-light">
												Products
											</span>
											<span className="font-display font-normal">
												{category.productCount}
											</span>
										</div>
									</CardContent>
								</Card>
							</Link>
						))}
				</div>
			</div>

			{/* Recent Products */}
			<div className="space-y-4">
				<div className="flex items-center justify-between">
					<h2 className="text-2xl font-display font-light">Recent Products</h2>
					<Button variant="outline" size="sm" asChild className="rounded-full">
						<Link href="/admin/catalog/products">
							View All
						</Link>
					</Button>
				</div>

				<ProductLineClient products={products.slice(0, 10)} />
			</div>
		</div>
	);
}