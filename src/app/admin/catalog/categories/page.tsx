// src/app/admin/catalog/categories/page.tsx
"use client";

import { useState } from "react";
import { api } from "~/trpc/react";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "~/components/ui/select";
import { Plus, Layers } from "lucide-react";
import Link from "next/link";

export default function CategoriesListPage() {
	const [productLineFilter, setProductLineFilter] = useState<string | undefined>();
	const [activeFilter, setActiveFilter] = useState<boolean | undefined>();

	const { data: categories, isLoading } = api.admin.category.getAll.useQuery({
		productLine: productLineFilter,
		isActive: activeFilter,
	});

	if (isLoading) {
		return (
			<div className="space-y-8">
				<h1 className="text-4xl font-display font-extralight">Categories</h1>
				<p className="text-muted-foreground font-display font-light">Loading categories...</p>
			</div>
		);
	}

	// Group by product line
	const grouped = categories?.reduce((acc, cat) => {
		if (!acc[cat.productLine]) {
			acc[cat.productLine] = [];
		}
		// Fix: Use non-null assertion or optional chaining if TS complains about index signature
		acc[cat.productLine]!.push(cat);
		return acc;
	}, {} as Record<string, typeof categories>) || {};

	const productLineNames: Record<string, string> = {
		"3d-backgrounds": "3D Backgrounds",
		"aquarium-decorations": "Aquarium Decorations",
	};

	return (
		<div className="space-y-8">
			{/* Header */}
			<div className="flex items-start justify-between">
				<div className="space-y-2">
					<h1 className="text-4xl font-display font-extralight tracking-tight">Categories</h1>
					<p className="text-muted-foreground font-display font-light text-lg">
						Manage product categories and organization
					</p>
				</div>
				<Button asChild className="rounded-full">
					<Link href="/admin/catalog/categories/new">
						<Plus className="mr-2 h-4 w-4" />
						Add Category
					</Link>
				</Button>
			</div>

			{/* Filters */}
			<div className="flex flex-wrap gap-4">
				<Select
					value={productLineFilter}
					onValueChange={(val) => setProductLineFilter(val === "all" ? undefined : val)}
				>
					<SelectTrigger className="w-[250px] font-display font-light">
						<SelectValue placeholder="All Product Lines" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all" className="font-display font-light">
							All Product Lines
						</SelectItem>
						<SelectItem value="3d-backgrounds" className="font-display font-light">
							3D Backgrounds
						</SelectItem>
						<SelectItem value="aquarium-decorations" className="font-display font-light">
							Aquarium Decorations
						</SelectItem>
					</SelectContent>
				</Select>

				<Select
					value={activeFilter === undefined ? "all" : activeFilter ? "active" : "inactive"}
					onValueChange={(val) => setActiveFilter(val === "all" ? undefined : val === "active")}
				>
					<SelectTrigger className="w-[200px] font-display font-light">
						<SelectValue placeholder="All Status" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all" className="font-display font-light">All Status</SelectItem>
						<SelectItem value="active" className="font-display font-light">Active</SelectItem>
						<SelectItem value="inactive" className="font-display font-light">Inactive</SelectItem>
					</SelectContent>
				</Select>
			</div>

			{/* Grouped Categories */}
			<div className="space-y-8">
				{Object.entries(grouped).map(([productLine, cats]) => (
					<div key={productLine} className="space-y-4">
						<div className="flex items-center gap-3">
							<Layers className="h-5 w-5 text-primary" />
							<h2 className="text-2xl font-display font-light">
								{productLineNames[productLine] || productLine}
							</h2>
							<Badge variant="secondary" className="font-display font-light">
								{cats.length} {cats.length === 1 ? "category" : "categories"}
							</Badge>
						</div>

						<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
							{cats
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
														<p className="text-xs text-muted-foreground font-display font-light">
															{category.slug}
														</p>
													</div>
													<Badge
														variant={category.isActive ? "default" : "secondary"}
														className="font-display font-light"
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
				))}
			</div>

			{(!categories || categories.length === 0) && (
				<div className="py-16 text-center space-y-4">
					<p className="text-lg text-muted-foreground font-display font-light">
						No categories found
					</p>
					<Button asChild className="rounded-full">
						<Link href="/admin/catalog/categories/new">
							<Plus className="mr-2 h-4 w-4" />
							Create First Category
						</Link>
					</Button>
				</div>
			)}
		</div>
	);
}