// src/app/admin/catalog/page.tsx

import Link from "next/link";
import { api } from "~/trpc/server";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Layers, ArrowRight } from "lucide-react";

export default async function CatalogOverviewPage() {
	// Get stats for each product line
	const [categories, productStats] = await Promise.all([
		api.admin.category.getAll(),
		api.admin.product.getStats(),
	]);

	const backgroundsCategories = categories.filter(
		(c) => c.productLine === "3d-backgrounds"
	);
	const decorationsCategories = categories.filter(
		(c) => c.productLine === "aquarium-decorations"
	);

	// Count products per product line
	const allProducts = await api.admin.product.getAll();
	const backgroundsProducts = allProducts.filter(
		(p) => p.productLineSlug === "3d-backgrounds"
	);
	const decorationsProducts = allProducts.filter(
		(p) => p.productLineSlug === "aquarium-decorations"
	);

	const productLines = [
		{
			slug: "3d-backgrounds",
			name: "3D Backgrounds",
			description: "Custom-made aquarium backgrounds in various styles",
			categories: backgroundsCategories.length,
			products: backgroundsProducts.length,
			icon: "🎨",
		},
		{
			slug: "aquarium-decorations",
			name: "Aquarium Decorations",
			description: "Plants, rocks, driftwood, and accessories for aquascaping",
			categories: decorationsCategories.length,
			products: decorationsProducts.length,
			icon: "🌿",
		},
	];

	return (
		<div className="space-y-8">
			{/* Header */}
			<div className="space-y-2">
				<h1 className="text-4xl font-display font-extralight tracking-tight">
					Catalog Overview
				</h1>
				<p className="text-muted-foreground font-display font-light text-lg">
					Select a product line to manage categories and products
				</p>
			</div>

			{/* Stats Overview */}
			<div className="grid gap-6 md:grid-cols-3">
				<Card className="border-2">
					<CardHeader>
						<CardTitle className="font-display font-normal text-sm text-muted-foreground">
							Total Products
						</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-3xl font-display font-light">{productStats.total}</p>
					</CardContent>
				</Card>
				<Card className="border-2">
					<CardHeader>
						<CardTitle className="font-display font-normal text-sm text-muted-foreground">
							Total Categories
						</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-3xl font-display font-light">{categories.length}</p>
					</CardContent>
				</Card>
				<Card className="border-2">
					<CardHeader>
						<CardTitle className="font-display font-normal text-sm text-muted-foreground">
							Active Products
						</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-3xl font-display font-light">{productStats.active}</p>
					</CardContent>
				</Card>
			</div>

			{/* Product Lines Grid */}
			<div className="grid gap-6 md:grid-cols-2">
				{productLines.map((line) => (
					<Link key={line.slug} href={`/admin/catalog/${line.slug}`}>
						<Card className="border-2 hover:border-primary/50 hover:shadow-lg transition-all group h-full">
							<CardHeader className="space-y-4">
								<div className="flex items-start justify-between">
									<div className="space-y-2">
										<div className="flex items-center gap-3">
											<span className="text-4xl">{line.icon}</span>
											<h3 className="text-2xl font-display font-light group-hover:text-primary transition-colors">
												{line.name}
											</h3>
										</div>
										<p className="text-muted-foreground font-display font-light">
											{line.description}
										</p>
									</div>
									<ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
								</div>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="grid grid-cols-2 gap-4">
									<div className="p-4 rounded-lg bg-muted/30 space-y-1">
										<p className="text-sm text-muted-foreground font-display font-light">
											Categories
										</p>
										<p className="text-2xl font-display font-light">{line.categories}</p>
									</div>
									<div className="p-4 rounded-lg bg-muted/30 space-y-1">
										<p className="text-sm text-muted-foreground font-display font-light">
											Products
										</p>
										<p className="text-2xl font-display font-light">{line.products}</p>
									</div>
								</div>
							</CardContent>
						</Card>
					</Link>
				))}
			</div>

			{/* Quick Actions */}
			<div className="pt-8 border-t">
				<h2 className="text-2xl font-display font-light mb-4">Quick Actions</h2>
				<div className="grid gap-4 md:grid-cols-3">
					<Link href="/admin/catalog/products">
						<Card className="border hover:border-primary/50 transition-colors group">
							<CardContent className="p-6 flex items-center justify-between">
								<span className="font-display font-light">View All Products</span>
								<ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
							</CardContent>
						</Card>
					</Link>
					<Link href="/admin/catalog/categories">
						<Card className="border hover:border-primary/50 transition-colors group">
							<CardContent className="p-6 flex items-center justify-between">
								<span className="font-display font-light">View All Categories</span>
								<ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
							</CardContent>
						</Card>
					</Link>
					<Link href="/admin/gallery">
						<Card className="border hover:border-primary/50 transition-colors group">
							<CardContent className="p-6 flex items-center justify-between">
								<span className="font-display font-light">Manage Images</span>
								<ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
							</CardContent>
						</Card>
					</Link>
				</div>
			</div>
		</div>
	);
}