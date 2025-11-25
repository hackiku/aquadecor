// src/app/admin/catalog/products/page.tsx

"use client";

import { useState } from "react";
import { api } from "~/trpc/react";
import { AdminTable, type Column } from "~/app/admin/_components/primitives/AdminTable";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "~/components/ui/select";
import { Plus } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function ProductsListPage() {
	const [categoryFilter, setCategoryFilter] = useState<string | undefined>();
	const [stockFilter, setStockFilter] = useState<"in_stock" | "made_to_order" | "out_of_stock" | undefined>();
	const [activeFilter, setActiveFilter] = useState<boolean | undefined>();

	const { data: products, isLoading } = api.admin.product.getAll.useQuery({
		categoryId: categoryFilter,
		stockStatus: stockFilter,
		isActive: activeFilter,
	});

	const { data: categories } = api.admin.category.getAll.useQuery();

	const columns: Column<NonNullable<typeof products>[0]>[] = [
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
						<div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs font-display">
							No image
						</div>
					)}
				</div>
			),
		},
		{
			header: "SKU",
			accessorKey: "sku",
			cell: (row) => (
				<span className="font-display font-normal text-sm">
					{row.sku || "—"}
				</span>
			),
		},
		{
			header: "Name",
			accessorKey: "name",
			cell: (row) => (
				<div className="space-y-1">
					<p className="font-display font-normal">{row.name || "Untitled"}</p>
					<p className="text-xs text-muted-foreground font-display font-light">
						{row.categoryName || "No category"}
					</p>
				</div>
			),
		},
		{
			header: "Price",
			accessorKey: "basePriceEurCents",
			cell: (row) => {
				if (!row.basePriceEurCents) {
					return (
						<Badge variant="outline" className="font-display font-light">
							Custom Only
						</Badge>
					);
				}
				return (
					<span className="font-display font-normal">
						€{(row.basePriceEurCents / 100).toFixed(2)}
					</span>
				);
			},
		},
		{
			header: "Stock",
			accessorKey: "stockStatus",
			cell: (row) => {
				const variants = {
					in_stock: { label: "In Stock", variant: "default" as const },
					made_to_order: { label: "Made to Order", variant: "secondary" as const },
					out_of_stock: { label: "Out of Stock", variant: "destructive" as const },
				};
				const status = variants[row.stockStatus as keyof typeof variants];
				return (
					<Badge variant={status.variant} className="font-display font-light">
						{status.label}
					</Badge>
				);
			},
		},
		{
			header: "Status",
			accessorKey: "isActive",
			cell: (row) => (
				<Badge
					variant={row.isActive ? "default" : "secondary"}
					className="font-display font-light"
				>
					{row.isActive ? "Active" : "Inactive"}
				</Badge>
			),
		},
	];

	if (isLoading) {
		return (
			<div className="space-y-8">
				<h1 className="text-4xl font-display font-extralight">Products</h1>
				<p className="text-muted-foreground font-display font-light">Loading products...</p>
			</div>
		);
	}

	return (
		<div className="space-y-8">
			{/* Header */}
			<div className="flex items-start justify-between">
				<div className="space-y-2">
					<h1 className="text-4xl font-display font-extralight tracking-tight">Products</h1>
					<p className="text-muted-foreground font-display font-light text-lg">
						Manage your product catalog
					</p>
				</div>
				<Button asChild className="rounded-full">
					<Link href="/admin/catalog/products/new">
						<Plus className="mr-2 h-4 w-4" />
						Add Product
					</Link>
				</Button>
			</div>

			{/* Filters */}
			<div className="flex flex-wrap gap-4">
				<Select
					value={categoryFilter}
					onValueChange={(val) => setCategoryFilter(val === "all" ? undefined : val)}
				>
					<SelectTrigger className="w-[200px] font-display font-light">
						<SelectValue placeholder="All Categories" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all" className="font-display font-light">All Categories</SelectItem>
						{categories?.map((cat) => (
							<SelectItem key={cat.id} value={cat.id} className="font-display font-light">
								{cat.name}
							</SelectItem>
						))}
					</SelectContent>
				</Select>

				<Select
					value={stockFilter}
					onValueChange={(val) => setStockFilter(val === "all" ? undefined : val as any)}
				>
					<SelectTrigger className="w-[200px] font-display font-light">
						<SelectValue placeholder="All Stock Status" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all" className="font-display font-light">All Stock Status</SelectItem>
						<SelectItem value="in_stock" className="font-display font-light">In Stock</SelectItem>
						<SelectItem value="made_to_order" className="font-display font-light">Made to Order</SelectItem>
						<SelectItem value="out_of_stock" className="font-display font-light">Out of Stock</SelectItem>
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

			{/* Table */}
			<AdminTable
				columns={columns}
				data={products || []}
				onRowClick={(row) => `/admin/catalog/products/${row.id}`}
				searchPlaceholder="Search products..."
			/>
		</div>
	);
}