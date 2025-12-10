// @ts-nocheck
// src/app/admin/catalog/featured/page.tsx

import { api } from "~/trpc/server";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Star, ArrowLeft, Plus } from "lucide-react";
import Link from "next/link";
import { FeaturedProductsClient } from "../_components/FeaturedProductsClient";



export default async function FeaturedProductsPage() {
	// Get all products
	const allProducts = await api.admin.product.getAll();

	// Separate by featured status and product line
	const featuredProducts = allProducts.filter((p) => p.isFeatured);
	const featured3D = featuredProducts.filter((p) => p.productLine === "3d-backgrounds");
	const featuredDecorations = featuredProducts.filter((p) => p.productLine === "aquarium-decorations");

	// Get all categories for context
	const categories = await api.admin.category.getAll();
	const categories3D = categories.filter((c) => c.productLine === "3d-backgrounds");
	const categoriesDecorations = categories.filter((c) => c.productLine === "aquarium-decorations");

	// Stats
	const stats = {
		totalFeatured: featuredProducts.length,
		featured3D: featured3D.length,
		featuredDecorations: featuredDecorations.length,
		totalProducts: allProducts.length,
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
						<div className="flex items-center gap-3">
							<Star className="h-8 w-8 text-primary" />
							<h1 className="text-4xl font-display font-extralight tracking-tight">
								Featured Products
							</h1>
						</div>
						<p className="text-muted-foreground font-display font-light text-lg">
							Manage products shown on homepage and product line landing pages
						</p>
					</div>
					<Button asChild className="rounded-full">
						<Link href="/admin/catalog/products">
							<Plus className="mr-2 h-4 w-4" />
							View All Products
						</Link>
					</Button>
				</div>
			</div>

			{/* Stats */}
			<div className="grid gap-6 md:grid-cols-4">
				<Card className="border-2">
					<CardHeader>
						<CardTitle className="font-display font-normal text-sm text-muted-foreground">
							Total Featured
						</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-3xl font-display font-light">{stats.totalFeatured}</p>
					</CardContent>
				</Card>
				<Card className="border-2">
					<CardHeader>
						<CardTitle className="font-display font-normal text-sm text-muted-foreground">
							3D Backgrounds
						</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-3xl font-display font-light">{stats.featured3D}</p>
					</CardContent>
				</Card>
				<Card className="border-2">
					<CardHeader>
						<CardTitle className="font-display font-normal text-sm text-muted-foreground">
							Decorations
						</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-3xl font-display font-light">{stats.featuredDecorations}</p>
					</CardContent>
				</Card>
				<Card className="border-2">
					<CardHeader>
						<CardTitle className="font-display font-normal text-sm text-muted-foreground">
							Total Products
						</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-3xl font-display font-light">{stats.totalProducts}</p>
					</CardContent>
				</Card>
			</div>

			{/* Category Overview */}
			<Card className="border-2">
				<CardHeader>
					<CardTitle className="font-display font-normal">Categories Overview</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="grid gap-6 md:grid-cols-2">
						{/* 3D Backgrounds */}
						<div className="space-y-3">
							<h3 className="font-display font-normal text-lg">3D Backgrounds</h3>
							<div className="space-y-2">
								{categories3D.map((cat) => (
									<div key={cat.id} className="flex items-center justify-between p-3 rounded-lg border border-border">
										<div className="flex-1">
											<p className="font-display font-light text-sm">{cat.name}</p>
											<p className="text-xs text-muted-foreground">{cat.productCount} products</p>
										</div>
										<Badge variant={cat.isActive ? "default" : "secondary"} className="text-xs">
											{cat.isActive ? "Active" : "Inactive"}
										</Badge>
									</div>
								))}
							</div>
						</div>

						{/* Decorations */}
						<div className="space-y-3">
							<h3 className="font-display font-normal text-lg">Aquarium Decorations</h3>
							<div className="space-y-2">
								{categoriesDecorations.map((cat) => (
									<div key={cat.id} className="flex items-center justify-between p-3 rounded-lg border border-border">
										<div className="flex-1">
											<p className="font-display font-light text-sm">{cat.name}</p>
											<p className="text-xs text-muted-foreground">{cat.productCount} products</p>
										</div>
										<Badge variant={cat.isActive ? "default" : "secondary"} className="text-xs">
											{cat.isActive ? "Active" : "Inactive"}
										</Badge>
									</div>
								))}
							</div>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Featured Products by Product Line */}
			<FeaturedProductsClient
				featured3D={featured3D}
				featuredDecorations={featuredDecorations}
				allProducts={allProducts}
			/>
		</div>
	);
}