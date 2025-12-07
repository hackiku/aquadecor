// src/app/admin/catalog/products/page.tsx
"use client";

import { useState } from "react";
import { api } from "~/trpc/react";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "~/components/ui/select";
import { AdminTable, type Column } from "~/app/admin/_components/primitives/AdminTable";
import { Plus, Package, Eye } from "lucide-react";
import Link from "next/link";
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
	stockStatus: string | null;
	isActive: boolean;
	isFeatured: boolean;
	heroImageUrl: string | null;
};

export default function ProductsListPage() {
	const [categoryFilter, setCategoryFilter] = useState<string | undefined>();
	const [stockFilter, setStockFilter] = useState<string | undefined>();
	const [activeFilter, setActiveFilter] = useState<boolean | undefined>();
	const [sortBy, setSortBy] = useState<"name" | "sku" | "price" | "created">("created");
	const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

	const { data: categories } = api.admin.category.getAll.useQuery();
	const { data: products, isLoading } = api.admin.product.getAll.useQuery({
		categoryId: categoryFilter,
		stockStatus: stockFilter as any,
		isActive: activeFilter,
		sortBy,
		sortOrder,
	});

	const formatPrice = (cents: number | null) => {
		if (!cents) return "Custom";
		return `€${(cents / 100).toFixed(2)}`;
	};

	const columns: Column<ProductRow>[] = [
		{
			header: "Image",
			accessorKey: "heroImageUrl",
			cell: (row) => (
				<div className="relative w-16 h-16 rounded-lg overflow-hidden bg-muted">
					{row.heroImageUrl ? (
						<Image
							src={row.heroImageUrl}
							alt={row.name || "Product"}
							fill
							className="object-cover"
						/>
					) : (
						<div className="flex items-center justify-center h-full">
							<Package className="h-6 w-6 text-muted-foreground" />
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
					<p className="font-display font-normal">
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
					made_to_order: { label: "Made to Order", variant: "secondary" as const },
					out_of_stock: { label: "Out of Stock", variant: "destructive" as const },
				};
				const status = row.stockStatus ? statusMap[row.stockStatus as keyof typeof statusMap] : null;
				return status ? (
					<Badge variant={status.variant} className="font-display font-light text-xs">
						{status.label}
					</Badge>
				) : (
					<span className="text-muted-foreground">—</span>
				);
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
							Featured
						</Badge>
					)}
				</div>
			),
		},
		{
			header: "Actions",
			accessorKey: "id",
			cell: (row) => (
				<div className="flex gap-2">
					<Button
						size="sm"
						variant="ghost"
						className="h-8 rounded-full"
						onClick={(e) => {
							e.stopPropagation();
							window.open(`/admin/catalog/products/${row.id}`, "_blank");
						}}
					>
						<Eye className="h-4 w-4" />
					</Button>
				</div>
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
					<SelectTrigger className="w-[250px] font-display font-light">
						<SelectValue placeholder="All Categories" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all" className="font-display font-light">
							All Categories
						</SelectItem>
						{categories?.map((cat) => (
							<SelectItem key={cat.id} value={cat.id} className="font-display font-light">
								{cat.name}
							</SelectItem>
						))}
					</SelectContent>
				</Select>

				<Select
					value={stockFilter}
					onValueChange={(val) => setStockFilter(val === "all" ? undefined : val)}
				>
					<SelectTrigger className="w-[200px] font-display font-light">
						<SelectValue placeholder="All Stock Status" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all" className="font-display font-light">
							All Stock Status
						</SelectItem>
						<SelectItem value="in_stock" className="font-display font-light">
							In Stock
						</SelectItem>
						<SelectItem value="made_to_order" className="font-display font-light">
							Made to Order
						</SelectItem>
						<SelectItem value="out_of_stock" className="font-display font-light">
							Out of Stock
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
						<SelectItem value="all" className="font-display font-light">
							All Status
						</SelectItem>
						<SelectItem value="active" className="font-display font-light">
							Active
						</SelectItem>
						<SelectItem value="inactive" className="font-display font-light">
							Inactive
						</SelectItem>
					</SelectContent>
				</Select>

				<Select
					value={sortBy}
					onValueChange={(val) => setSortBy(val as any)}
				>
					<SelectTrigger className="w-[200px] font-display font-light">
						<SelectValue placeholder="Sort By" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="created" className="font-display font-light">
							Created Date
						</SelectItem>
						<SelectItem value="name" className="font-display font-light">
							Name
						</SelectItem>
						<SelectItem value="sku" className="font-display font-light">
							SKU
						</SelectItem>
						<SelectItem value="price" className="font-display font-light">
							Price
						</SelectItem>
					</SelectContent>
				</Select>

				<Select
					value={sortOrder}
					onValueChange={(val) => setSortOrder(val as any)}
				>
					<SelectTrigger className="w-[150px] font-display font-light">
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="desc" className="font-display font-light">
							Descending
						</SelectItem>
						<SelectItem value="asc" className="font-display font-light">
							Ascending
						</SelectItem>
					</SelectContent>
				</Select>
			</div>

			{/* Products Table */}
			<AdminTable
				columns={columns}
				data={products || []}
				onRowClick={(row) => `/admin/catalog/products/${row.id}`}
				searchPlaceholder="Search products by name, SKU, or category..."
				pageSize={15}
			/>

			{(!products || products.length === 0) && (
				<div className="py-16 text-center space-y-4">
					<p className="text-lg text-muted-foreground font-display font-light">
						No products found
					</p>
					<Button asChild className="rounded-full">
						<Link href="/admin/catalog/products/new">
							<Plus className="mr-2 h-4 w-4" />
							Create First Product
						</Link>
					</Button>
				</div>
			)}
		</div>
	);
}