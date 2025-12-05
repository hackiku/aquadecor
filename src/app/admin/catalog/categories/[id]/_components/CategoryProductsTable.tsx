// src/app/admin/catalog/categories/[id]/_components/CategoryProductsTable.tsx
"use client";

import { useState } from "react";
import { api } from "~/trpc/react";
import { AdminTable, type Column } from "~/app/admin/_components/primitives/AdminTable";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Package } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface CategoryProductsTableProps {
	categoryId: string;
	categoryName: string;
	productCount: number;
}

type ProductRow = {
	id: string;
	slug: string;
	sku: string | null;
	name: string | null;
	basePriceEurCents: number | null;
	stockStatus: string | null;
	isActive: boolean;
	isFeatured: boolean;
	featuredImageUrl: string | null;
};

export function CategoryProductsTable({
	categoryId,
	categoryName,
	productCount,
}: CategoryProductsTableProps) {
	const [showTable, setShowTable] = useState(false);

	const { data: products, isLoading } = api.admin.product.getAll.useQuery(
		{ categoryId },
		{ enabled: showTable }
	);

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
							<Package className="h-5 w-5 text-muted-foreground" />
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
				<p className="font-display font-normal">
					{row.name || "Untitled"}
				</p>
			),
		},
		{
			header: "Price",
			accessorKey: "basePriceEurCents",
			cell: (row) => (
				<span className="font-display font-normal">
					{formatPrice(row.basePriceEurCents)}
				</span>
			),
		},
		{
			header: "Stock",
			accessorKey: "stockStatus",
			cell: (row) => {
				const statusMap = {
					in_stock: { label: "In Stock", variant: "default" as const },
					made_to_order: { label: "MTO", variant: "secondary" as const },
					out_of_stock: { label: "Out", variant: "destructive" as const },
				};
				const status = row.stockStatus ? statusMap[row.stockStatus as keyof typeof statusMap] : null;
				return status ? (
					<Badge variant={status.variant} className="font-display font-light text-xs">
						{status.label}
					</Badge>
				) : null;
			},
		},
		{
			header: "Status",
			accessorKey: "isActive",
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
							★
						</Badge>
					)}
				</div>
			),
		},
	];

	if (!showTable) {
		return (
			<Card className="border-2">
				<CardHeader>
					<div className="flex items-center justify-between">
						<CardTitle className="font-display font-normal">Products in Category</CardTitle>
						<Button
							variant="outline"
							size="sm"
							onClick={() => setShowTable(true)}
							className="rounded-full font-display font-light"
						>
							Show Products ({productCount})
						</Button>
					</div>
				</CardHeader>
				<CardContent>
					<p className="text-muted-foreground font-display font-light">
						This category contains {productCount} product{productCount !== 1 ? "s" : ""}.
					</p>
				</CardContent>
			</Card>
		);
	}

	if (isLoading) {
		return (
			<Card className="border-2">
				<CardHeader>
					<CardTitle className="font-display font-normal">Products in Category</CardTitle>
				</CardHeader>
				<CardContent>
					<p className="text-muted-foreground font-display font-light">Loading products...</p>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card className="border-2">
			<CardHeader>
				<div className="flex items-center justify-between">
					<CardTitle className="font-display font-normal">
						Products in {categoryName}
					</CardTitle>
					<Button
						variant="outline"
						size="sm"
						asChild
						className="rounded-full font-display font-light"
					>
						<Link href={`/admin/catalog/products?category=${categoryId}`}>
							View in Products List
						</Link>
					</Button>
				</div>
			</CardHeader>
			<CardContent>
				<AdminTable
					columns={columns}
					data={products || []}
					onRowClick={(row) => `/admin/catalog/products/${row.id}`}
					searchPlaceholder="Search products..."
					pageSize={10}
				/>
			</CardContent>
		</Card>
	);
}