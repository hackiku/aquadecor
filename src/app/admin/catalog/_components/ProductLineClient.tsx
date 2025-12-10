// src/app/admin/catalog/_components/ProductLineClient.tsx
"use client";

import { AdminTable, type Column } from "~/app/admin/_components/primitives/AdminTable";
import { Badge } from "~/components/ui/badge";
import { Package } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

// Updated interface
export type ProductRow = {
	id: string;
	slug: string;
	sku: string;
	name: string | null;
	basePriceEurCents: number | null;
	stockStatus: string | null;
	isActive: boolean;
	isFeatured: boolean;
	heroImageUrl: string | null; // UPDATED
	productLine: string | null;
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
			accessorKey: "heroImageUrl", // UPDATED
			cell: (row) => (
				<div className="relative w-12 h-12 rounded-lg overflow-hidden bg-muted border border-border">
					{row.heroImageUrl ? (
						<Image
							src={row.heroImageUrl}
							alt={row.name || "Product"}
							fill
							className="object-cover"
						/>
					) : (
						<div className="flex items-center justify-center h-full">
							<Package className="h-5 w-5 text-muted-foreground/30" />
						</div>
					)}
				</div>
			),
		},
		{
			header: "Name",
			accessorKey: "name",
			cell: (row) => (
				<div className="space-y-0.5">
					<p className="font-display font-medium">{row.name || "Untitled"}</p>
					<p className="font-mono text-xs text-muted-foreground">{row.sku}</p>
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
			accessorKey: "stockStatus",
			cell: (row) => {
				const statusMap = {
					in_stock: { label: "In Stock", variant: "default" as const },
					made_to_order: { label: "MTO", variant: "secondary" as const },
					requires_quote: { label: "Quote", variant: "outline" as const },
					out_of_stock: { label: "Out", variant: "destructive" as const },
				};
				const status = row.stockStatus ? statusMap[row.stockStatus as keyof typeof statusMap] : null;
				return (
					<div className="flex gap-2 items-center">
						{status && (
							<Badge variant={status.variant} className="font-display font-light text-xs">
								{status.label}
							</Badge>
						)}
						{row.isFeatured && (
							<Badge variant="outline" className="text-xs border-amber-500/50 text-amber-600 bg-amber-500/10">
								★
							</Badge>
						)}
					</div>
				);
			},
		},
	];

	return (
		<AdminTable
			columns={columns}
			data={products}
			searchPlaceholder="Search products..."
			onRowClick={(row) => `/admin/catalog/products/${row.id}`}
			pageSize={10}
		/>
	);
}