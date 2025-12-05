// src/app/admin/catalog/_components/FeaturedProductsClient.tsx
"use client";

import { useState } from "react";
import { api } from "~/trpc/react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { ProductCard } from "~/components/shop/product/ProductCard";
import { AdminTable, type Column } from "~/app/admin/_components/primitives/AdminTable";
import { Star, ChevronDown, ChevronUp, StarOff } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";

type ProductRow = {
	id: string;
	slug: string;
	sku: string | null;
	name: string | null;
	categoryName: string | null;
	categorySlug: string | null;
	productLine: string | null;
	basePriceEurCents: number | null;
	priceNote: string | null;
	stockStatus: string | null;
	isActive: boolean;
	isFeatured: boolean;
	featuredImageUrl: string | null;
	shortDescription: string | null;
};

interface FeaturedProductsClientProps {
	featured3D: ProductRow[];
	featuredDecorations: ProductRow[];
	allProducts: ProductRow[];
}

export function FeaturedProductsClient({
	featured3D,
	featuredDecorations,
	allProducts,
}: FeaturedProductsClientProps) {
	const [showAllProducts, setShowAllProducts] = useState(false);
	const utils = api.useUtils();

	const updateProduct = api.admin.product.update.useMutation({
		onSuccess: () => {
			toast.success("Product updated successfully!");
			utils.admin.product.getAll.invalidate();
		},
		onError: (error) => {
			toast.error(error.message || "Failed to update product");
		},
	});

	const toggleFeatured = async (productId: string, currentStatus: boolean) => {
		await updateProduct.mutateAsync({
			id: productId,
			isFeatured: !currentStatus,
		});
	};

	// Convert to ProductCard format
	const toProductCardFormat = (product: ProductRow) => ({
		id: product.id,
		slug: product.slug,
		sku: product.sku,
		name: product.name || "Untitled",
		shortDescription: product.shortDescription,
		basePriceEurCents: product.basePriceEurCents,
		priceNote: product.priceNote,
		stockStatus: product.stockStatus || "made_to_order",
		featuredImageUrl: product.featuredImageUrl,
		categorySlug: product.categorySlug || "",
		productLineSlug: product.productLine || "",
	});

	const formatPrice = (cents: number | null) => {
		if (!cents) return "Custom";
		return `€${(cents / 100).toFixed(2)}`;
	};

	const columns: Column<ProductRow>[] = [
		{
			header: "Image",
			accessorKey: "featuredImageUrl",
			cell: (row) => (
				<div className="relative w-12 h-12 rounded-lg overflow-hidden bg-muted">
					{row.featuredImageUrl ? (
						<Image
							src={row.featuredImageUrl}
							alt={row.name || "Product"}
							fill
							className="object-cover"
						/>
					) : (
						<div className="flex items-center justify-center h-full">
							<Star className="h-5 w-5 text-muted-foreground" />
						</div>
					)}
				</div>
			),
		},
		{
			header: "SKU",
			accessorKey: "sku",
			cell: (row) => (
				<span className="font-mono text-sm">
					{row.sku || <span className="text-muted-foreground">—</span>}
				</span>
			),
		},
		{
			header: "Product",
			accessorKey: "name",
			cell: (row) => (
				<div className="space-y-1">
					<p className="font-display font-normal text-sm">
						{row.name || "Untitled"}
					</p>
					<p className="text-xs text-muted-foreground font-display font-light">
						{row.categoryName}
					</p>
				</div>
			),
		},
		{
			header: "Price",
			accessorKey: "basePriceEurCents",
			cell: (row) => (
				<span className="font-display font-normal text-sm">
					{formatPrice(row.basePriceEurCents)}
				</span>
			),
		},
		{
			header: "Status",
			accessorKey: "isFeatured",
			cell: (row) => (
				<div className="flex gap-2">
					<Badge
						variant={row.isActive ? "default" : "secondary"}
						className="font-display font-light text-xs"
					>
						{row.isActive ? "Active" : "Inactive"}
					</Badge>
					{row.isFeatured && (
						<Badge variant="outline" className="font-display font-light text-xs">
							★ Featured
						</Badge>
					)}
				</div>
			),
		},
		{
			header: "Actions",
			accessorKey: "id",
			cell: (row) => (
				<Button
					size="sm"
					variant={row.isFeatured ? "destructive" : "default"}
					onClick={(e) => {
						e.stopPropagation();
						toggleFeatured(row.id, row.isFeatured);
					}}
					className="rounded-full h-8"
					disabled={updateProduct.isPending}
				>
					{row.isFeatured ? (
						<>
							<StarOff className="h-3 w-3 mr-1" />
							Unfeature
						</>
					) : (
						<>
							<Star className="h-3 w-3 mr-1" />
							Feature
						</>
					)}
				</Button>
			),
		},
	];

	return (
		<div className="space-y-8">
			{/* 3D Backgrounds Featured */}
			<Card className="border-2">
				<CardHeader>
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-3">
							<Star className="h-5 w-5 text-primary" />
							<CardTitle className="font-display font-normal">
								Featured 3D Backgrounds
							</CardTitle>
							<Badge variant="secondary" className="font-display font-light">
								{featured3D.length} products
							</Badge>
						</div>
					</div>
				</CardHeader>
				<CardContent>
					{featured3D.length > 0 ? (
						<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
							{featured3D.map((product) => (
								<ProductCard
									key={product.id}
									product={toProductCardFormat(product)}
									showQuickAdd={false}
								/>
							))}
						</div>
					) : (
						<div className="py-12 text-center">
							<Star className="h-12 w-12 text-muted-foreground/20 mx-auto mb-4" />
							<p className="text-muted-foreground font-display font-light">
								No featured 3D backgrounds yet
							</p>
							<Button
								variant="outline"
								size="sm"
								onClick={() => setShowAllProducts(true)}
								className="mt-4 rounded-full"
							>
								Add Products
							</Button>
						</div>
					)}
				</CardContent>
			</Card>

			{/* Aquarium Decorations Featured */}
			<Card className="border-2">
				<CardHeader>
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-3">
							<Star className="h-5 w-5 text-primary" />
							<CardTitle className="font-display font-normal">
								Featured Aquarium Decorations
							</CardTitle>
							<Badge variant="secondary" className="font-display font-light">
								{featuredDecorations.length} products
							</Badge>
						</div>
					</div>
				</CardHeader>
				<CardContent>
					{featuredDecorations.length > 0 ? (
						<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
							{featuredDecorations.map((product) => (
								<ProductCard
									key={product.id}
									product={toProductCardFormat(product)}
									showQuickAdd={false}
								/>
							))}
						</div>
					) : (
						<div className="py-12 text-center">
							<Star className="h-12 w-12 text-muted-foreground/20 mx-auto mb-4" />
							<p className="text-muted-foreground font-display font-light">
								No featured decorations yet
							</p>
							<Button
								variant="outline"
								size="sm"
								onClick={() => setShowAllProducts(true)}
								className="mt-4 rounded-full"
							>
								Add Products
							</Button>
						</div>
					)}
				</CardContent>
			</Card>

			{/* All Products Table - Collapsible */}
			<Card className="border-2">
				<CardHeader>
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-3">
							<CardTitle className="font-display font-normal">
								All Products
							</CardTitle>
							<Badge variant="outline" className="font-display font-light">
								{allProducts.length} total
							</Badge>
						</div>
						<Button
							variant="ghost"
							size="sm"
							onClick={() => setShowAllProducts(!showAllProducts)}
							className="rounded-full"
						>
							{showAllProducts ? (
								<>
									<ChevronUp className="h-4 w-4 mr-2" />
									Hide Products
								</>
							) : (
								<>
									<ChevronDown className="h-4 w-4 mr-2" />
									Show All Products
								</>
							)}
						</Button>
					</div>
				</CardHeader>
				{showAllProducts && (
					<CardContent>
						<AdminTable
							columns={columns}
							data={allProducts}
							onRowClick={(row) => `/admin/catalog/products/${row.id}`}
							searchPlaceholder="Search all products..."
							pageSize={15}
						/>
					</CardContent>
				)}
			</Card>
		</div>
	);
}