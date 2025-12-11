// src/app/admin/catalog/page.tsx

import Link from "next/link";
import { api } from "~/trpc/server";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { ArrowRight, Package, Layers, Trash2, Star } from "lucide-react";
import { MarketSelector } from "./_components/MarketSelector";
import { MarketBadge } from "./_components/MarketBadge";
import { FeaturedProductsManager } from "./_components/FeaturedProductsManager";
import { Button } from "~/components/ui/button";

interface PageProps {
	searchParams: Promise<{
		market?: string;
	}>;
}

export default async function CatalogOverviewPage({ searchParams }: PageProps) {
	const params = await searchParams;
	const market = (params.market as 'US' | 'ROW') || 'ROW';

	// Get stats for selected market
	const [categories, marketStats, allProducts, trashedCount] = await Promise.all([
		api.admin.category.getAll(),
		api.admin.product.getStatsByMarket({ market }),
		api.admin.product.getAll(), // Get all products for featured manager
		api.admin.product.getTrash().then(t => t.length),
	]);

	const backgroundsCategories = categories.filter(
		(c) => c.productLine === "3d-backgrounds"
	);
	const decorationsCategories = categories.filter(
		(c) => c.productLine === "aquarium-decorations"
	);

	const productLines = [
		{
			slug: "3d-backgrounds",
			name: "3D Backgrounds",
			description: "Custom-made aquarium backgrounds in various styles",
			categories: backgroundsCategories.length,
			products: marketStats.total, // Market-specific count
			icon: "🎨",
		},
		{
			slug: "aquarium-decorations",
			name: "Aquarium Decorations",
			description: "Plants, rocks, driftwood, and accessories for aquascaping",
			categories: decorationsCategories.length,
			products: marketStats.total, // Market-specific count
			icon: "🌿",
		},
	];

	return (
		<div className="space-y-8">
			{/* Header */}
			<div className="space-y-4">
				<div className="flex items-start justify-between">
					<div className="space-y-2">
						<h1 className="text-4xl font-display font-extralight tracking-tight">
							Catalog Overview
						</h1>
						<p className="text-muted-foreground font-display font-light text-lg">
							Select a product line to manage categories and products
						</p>
					</div>
					<MarketBadge market={market} className="text-base px-4 py-2" />
				</div>

				{/* Market Selector */}
				<MarketSelector currentMarket={market} />
			</div>

			{/* Stats Overview - Market Specific */}
			<div className="grid gap-6 md:grid-cols-4">
				<Card className="border-2">
					<CardHeader>
						<CardTitle className="font-display font-normal text-sm text-muted-foreground">
							Products in {market}
						</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-3xl font-display font-light">{marketStats.total}</p>
					</CardContent>
				</Card>
				<Card className="border-2">
					<CardHeader>
						<CardTitle className="font-display font-normal text-sm text-muted-foreground">
							Active Products
						</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-3xl font-display font-light">{marketStats.active}</p>
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
							Featured Products
						</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-3xl font-display font-light">{marketStats.featured}</p>
					</CardContent>
				</Card>
			</div>

			{/* Stock Status Breakdown */}
			<Card className="border-2">
				<CardHeader>
					<CardTitle className="font-display font-normal">Stock Status ({market} Market)</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="grid gap-4 md:grid-cols-4">
						<div className="space-y-2">
							<div className="flex items-center gap-2">
								<div className="h-2 w-2 rounded-full bg-green-500"></div>
								<span className="text-sm font-display font-light text-muted-foreground">
									In Stock
								</span>
							</div>
							<p className="text-2xl font-display font-light">
								{marketStats.stockBreakdown.in_stock}
							</p>
						</div>
						<div className="space-y-2">
							<div className="flex items-center gap-2">
								<div className="h-2 w-2 rounded-full bg-blue-500"></div>
								<span className="text-sm font-display font-light text-muted-foreground">
									Made to Order
								</span>
							</div>
							<p className="text-2xl font-display font-light">
								{marketStats.stockBreakdown.made_to_order}
							</p>
						</div>
						<div className="space-y-2">
							<div className="flex items-center gap-2">
								<div className="h-2 w-2 rounded-full bg-yellow-500"></div>
								<span className="text-sm font-display font-light text-muted-foreground">
									Requires Quote
								</span>
							</div>
							<p className="text-2xl font-display font-light">
								{marketStats.stockBreakdown.requires_quote}
							</p>
						</div>
						<div className="space-y-2">
							<div className="flex items-center gap-2">
								<Trash2 className="h-4 w-4 text-muted-foreground" />
								<span className="text-sm font-display font-light text-muted-foreground">
									In Trash
								</span>
							</div>
							<p className="text-2xl font-display font-light">{trashedCount}</p>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Product Lines Grid */}
			<div className="grid gap-6 md:grid-cols-2">
				{productLines.map((line) => (
					<Link key={line.slug} href={`/admin/catalog/products?market=${market}&productLine=${line.slug}`}>
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
				<div className="grid gap-4 md:grid-cols-4">
					<Link href={`/admin/catalog/products?market=${market}`}>
						<Card className="border hover:border-primary/50 transition-colors group">
							<CardContent className="p-6 flex items-center justify-between">
								<div className="flex items-center gap-2">
									<Package className="h-4 w-4 text-primary" />
									<span className="font-display font-light">All Products</span>
								</div>
								<ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
							</CardContent>
						</Card>
					</Link>
					<Link href="/admin/catalog/categories">
						<Card className="border hover:border-primary/50 transition-colors group">
							<CardContent className="p-6 flex items-center justify-between">
								<div className="flex items-center gap-2">
									<Layers className="h-4 w-4 text-primary" />
									<span className="font-display font-light">Categories</span>
								</div>
								<ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
							</CardContent>
						</Card>
					</Link>
					<Link href="#featured-products">
						<Card className="border hover:border-primary/50 transition-colors group">
							<CardContent className="p-6 flex items-center justify-between">
								<div className="flex items-center gap-2">
									<Star className="h-4 w-4 text-primary" />
									<span className="font-display font-light">Manage Featured</span>
								</div>
								<ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
							</CardContent>
						</Card>
					</Link>
					<Link href="/admin/catalog/trash">
						<Card className="border hover:border-primary/50 transition-colors group">
							<CardContent className="p-6 flex items-center justify-between">
								<div className="flex items-center gap-2">
									<Trash2 className="h-4 w-4 text-muted-foreground" />
									<span className="font-display font-light">Trash ({trashedCount})</span>
								</div>
								<ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
							</CardContent>
						</Card>
					</Link>
				</div>
			</div>

			{/* Featured Products Management */}
			<div id="featured-products" className="pt-8 border-t space-y-6">
				<div className="flex items-center justify-between">
					<div>
						<h2 className="text-2xl font-display font-light flex items-center gap-2">
							<Star className="h-6 w-6 text-primary" />
							Featured Products Management
						</h2>
						<p className="text-muted-foreground font-display font-light text-sm mt-1">
							Products shown on homepage and category landing pages
						</p>
					</div>
				</div>
				<FeaturedProductsManager initialProducts={allProducts} />
			</div>
		</div>
	);
}