// src/app/admin/catalog/_components/ProductLineClient.tsx
"use client";

import { Badge } from "~/components/ui/badge";
import { AdminTable, type Column } from "~/app/admin/_components/primitives/AdminTable";
import { ShoppingBag } from "lucide-react";
import Image from "next/image";

type ProductRow = {
	id: string;
	slug: string;
	sku: string | null;
	name: string | null;
	categoryName: string | null;
	basePriceEurCents: number | null;
	stockStatus: string | null;
	isActive: boolean;
	isFeatured: boolean;
	featuredImageUrl: string | null;
};

interface ProductLineClientProps {
	products: ProductRow[];
}

export function ProductLineClient({ products }: ProductLineClientProps) {
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
							<ShoppingBag className="h-5 w-5 text-muted-foreground" />
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
			accessorKey: "isActive",
			cell: (row) => (
				<div className="flex gap-1">
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

	return (
		<AdminTable
			columns={columns}
			data={products}
			onRowClick={(row) => `/admin/catalog/products/${row.id}`}
			searchable={false}
			pageSize={10}
		/>
	);
}