// src/app/admin/catalog/_components/FeaturedProductsManager.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "~/trpc/react";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { AdminTable, type Column } from "~/app/admin/_components/primitives/AdminTable";
import { Star, StarOff, Package, Search } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";

interface FeaturedProductsManagerProps {
	initialProducts: any[];
}

export function FeaturedProductsManager({ initialProducts }: FeaturedProductsManagerProps) {
	const router = useRouter();
	const [searchQuery, setSearchQuery] = useState("");
	const [productLineFilter, setProductLineFilter] = useState<string | undefined>();

	// Get all products
	const { data: allProducts } = api.admin.product.getAll.useQuery();

	const toggleFeatured = api.admin.product.update.useMutation({
		onSuccess: (_, variables) => {
			toast.success(
				variables.isFeatured ? "Product added to featured" : "Product removed from featured"
			);
			router.refresh();
		},
		onError: (error: any) => {
			toast.error(`Failed to update: ${error.message}`);
		},
	});

	const handleToggleFeatured = (product: any) => {
		toggleFeatured.mutate({
			id: product.id,
			isFeatured: !product.isFeatured,
		});
	};

	// Use server data as fallback, but prefer fresh client data
	const currentProducts = allProducts || initialProducts;

	// Separate featured and non-featured
	const featuredProducts = currentProducts.filter((p: any) => p.isFeatured);
	const nonFeaturedProducts = currentProducts.filter((p: any) => !p.isFeatured);

	// Filter by product line
	const filteredFeatured = productLineFilter
		? featuredProducts.filter((p: any) => p.productLine === productLineFilter)
		: featuredProducts;

	const filteredNonFeatured = productLineFilter
		? nonFeaturedProducts.filter((p: any) => p.productLine === productLineFilter)
		: nonFeaturedProducts;

	// Search within non-featured
	const searchedNonFeatured = searchQuery
		? filteredNonFeatured.filter((p: any) =>
			p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
			p.sku?.toLowerCase().includes(searchQuery.toLowerCase())
		)
		: filteredNonFeatured;

	const columns: Column<any>[] = [
		{
			header: "Image",
			accessorKey: "heroImageUrl",
			cell: (row) => (
				<div className="relative w-12 h-12 rounded-lg overflow-hidden bg-muted">
					{row.heroImageUrl ? (
						<Image src={row.heroImageUrl} alt={row.name || ""} fill className="object-cover" />
					) : (
						<div className="flex items-center justify-center h-full">
							<Package className="h-4 w-4 text-muted-foreground" />
						</div>
					)}
				</div>
			),
		},
		{
			header: "SKU",
			accessorKey: "sku",
			cell: (row) => <span className="font-mono text-xs">{row.sku || "—"}</span>,
		},
		{
			header: "Product",
			accessorKey: "name",
			cell: (row) => (
				<div>
					<p className="font-display font-normal text-sm">{row.name || "Untitled"}</p>
					<p className="text-xs text-muted-foreground">{row.categoryName}</p>
				</div>
			),
		},
		{
			header: "Product Line",
			accessorKey: "productLine",
			cell: (row) => (
				<Badge variant="outline" className="text-xs">
					{row.productLine === "3d-backgrounds" ? "3D Backgrounds" : "Decorations"}
				</Badge>
			),
		},
		{
			header: "Status",
			accessorKey: "isActive",
			cell: (row) => (
				<Badge variant={row.isActive ? "default" : "secondary"} className="text-xs">
					{row.isActive ? "Active" : "Inactive"}
				</Badge>
			),
		},
		{
			header: "Action",
			accessorKey: "id",
			cell: (row) => (
				<Button
					variant={row.isFeatured ? "default" : "outline"}
					size="sm"
					onClick={(e) => {
						e.stopPropagation();
						handleToggleFeatured(row);
					}}
					disabled={toggleFeatured.isPending}
					className="rounded-full"
				>
					{row.isFeatured ? (
						<>
							<StarOff className="mr-1 h-3 w-3" />
							Unfeature
						</>
					) : (
						<>
							<Star className="mr-1 h-3 w-3" />
							Feature
						</>
					)}
				</Button>
			),
		},
	];

	return (
		<div className="space-y-8">
			{/* Stats */}
			<div className="grid gap-4 md:grid-cols-3">
				<Card>
					<CardHeader>
						<CardTitle className="text-sm font-display font-light text-muted-foreground">
							Total Featured
						</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-3xl font-display font-light">{featuredProducts.length}</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<CardTitle className="text-sm font-display font-light text-muted-foreground">
							3D Backgrounds
						</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-3xl font-display font-light">
							{featuredProducts.filter((p: any) => p.productLine === "3d-backgrounds").length}
						</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<CardTitle className="text-sm font-display font-light text-muted-foreground">
							Decorations
						</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-3xl font-display font-light">
							{featuredProducts.filter((p: any) => p.productLine === "aquarium-decorations")
								.length}
						</p>
					</CardContent>
				</Card>
			</div>

			{/* Filters */}
			<div className="flex gap-4">
				<div className="flex gap-2">
					<Button
						variant={!productLineFilter ? "default" : "outline"}
						size="sm"
						onClick={() => setProductLineFilter(undefined)}
						className="rounded-full"
					>
						All
					</Button>
					<Button
						variant={productLineFilter === "3d-backgrounds" ? "default" : "outline"}
						size="sm"
						onClick={() => setProductLineFilter("3d-backgrounds")}
						className="rounded-full"
					>
						3D Backgrounds
					</Button>
					<Button
						variant={productLineFilter === "aquarium-decorations" ? "default" : "outline"}
						size="sm"
						onClick={() => setProductLineFilter("aquarium-decorations")}
						className="rounded-full"
					>
						Decorations
					</Button>
				</div>
			</div>

			{/* Currently Featured */}
			<Card className="border-2">
				<CardHeader>
					<CardTitle className="font-display font-normal flex items-center gap-2">
						<Star className="h-5 w-5 text-primary" />
						Currently Featured ({filteredFeatured.length})
					</CardTitle>
				</CardHeader>
				<CardContent>
					{filteredFeatured.length > 0 ? (
						<AdminTable columns={columns} data={filteredFeatured} pageSize={10} />
					) : (
						<p className="text-center py-8 text-muted-foreground font-display font-light">
							No featured products
						</p>
					)}
				</CardContent>
			</Card>

			{/* Add More Products */}
			<Card className="border-2">
				<CardHeader>
					<div className="flex items-center justify-between">
						<CardTitle className="font-display font-normal">
							Add Products to Featured
						</CardTitle>
						<div className="relative w-64">
							<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
							<Input
								placeholder="Search products..."
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className="pl-10"
							/>
						</div>
					</div>
				</CardHeader>
				<CardContent>
					{searchedNonFeatured.length > 0 ? (
						<AdminTable
							columns={columns}
							data={searchedNonFeatured.slice(0, 20)}
							pageSize={10}
						/>
					) : (
						<p className="text-center py-8 text-muted-foreground font-display font-light">
							{searchQuery ? "No products found" : "All products are already featured"}
						</p>
					)}
				</CardContent>
			</Card>
		</div>
	);
}