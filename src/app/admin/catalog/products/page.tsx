// src/app/admin/catalog/products/page.tsx
"use client"

import { Suspense } from "react"
import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { api } from "~/trpc/react"
import { Badge } from "~/components/ui/badge"
import { Button } from "~/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select"
import { AdminTable, type Column } from "~/app/admin/_components/primitives/AdminTable"
import { Plus, Package, Eye, Trash2, Star } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { MarketSelector, useMarketPreference } from "../_components/MarketSelector"
import { MarketBadge } from "../_components/MarketBadge"
import { toast } from "sonner"

export const dynamic = "force-dynamic"

type ProductRow = {
	id: string
	slug: string
	sku: string | null
	name: string | null
	categoryName: string | null
	categorySlug: string | null
	productLine: string | null
	unitPriceEurCents: number | null
	pricingType: string | null
	pricingMarket: string | null
	stockStatus: string | null
	isActive: boolean
	isFeatured: boolean
	heroImageUrl: string | null
}

function ProductsListContent() {
	const router = useRouter()
	const searchParams = useSearchParams()
	const market = useMarketPreference()

	const [categoryFilter, setCategoryFilter] = useState<string | undefined>()
	const [productLineFilter, setProductLineFilter] = useState<string | undefined>(
		searchParams.get("productLine") || undefined,
	)
	const [stockFilter, setStockFilter] = useState<string | undefined>()
	const [activeFilter, setActiveFilter] = useState<boolean | undefined>()
	const [featuredFilter, setFeaturedFilter] = useState<boolean | undefined>(
		searchParams.get("featured") === "true" ? true : undefined,
	)
	const [sortBy, setSortBy] = useState<"name" | "sku" | "price" | "created">("created")
	const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")

	const { data: categories } = api.admin.category.getAll.useQuery()
	const { data: products, isLoading } = api.admin.product.getAllByMarket.useQuery({
		market,
		categoryId: categoryFilter,
		productLine: productLineFilter,
		isActive: activeFilter,
		sortBy,
		sortOrder,
	})

	const softDelete = api.admin.product.softDelete.useMutation({
		onSuccess: () => {
			toast.success("Product moved to trash")
			router.refresh()
		},
		onError: (error) => {
			toast.error(`Failed to delete: ${error.message}`)
		},
	})

	// Filter featured client-side (since it's not in getAllByMarket yet)
	const filteredProducts = products?.filter((p) => {
		if (featuredFilter !== undefined && p.isFeatured !== featuredFilter) return false
		return true
	})

	const formatPrice = (cents: number | null) => {
		if (!cents) return "Custom"
		return `€${(cents / 100).toFixed(2)}`
	}

	const columns: Column<ProductRow>[] = [
		{
			header: "Image",
			accessorKey: "heroImageUrl",
			cell: (row) => (
				<div className="relative w-16 h-16 rounded-lg overflow-hidden bg-muted">
					{row.heroImageUrl ? (
						<Image
							src={row.heroImageUrl || "/placeholder.svg"}
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
				<span className="font-mono text-sm">{row.sku || <span className="text-muted-foreground">—</span>}</span>
			),
		},
		{
			header: "Product",
			accessorKey: "name",
			cell: (row) => (
				<div className="space-y-1">
					<div className="flex items-center gap-2">
						<p className="font-display font-normal">{row.name || "Untitled"}</p>
						{row.isFeatured && <Star className="h-3.5 w-3.5 text-primary fill-primary" />}
					</div>
					<p className="text-xs text-muted-foreground font-display font-light">{row.categoryName}</p>
				</div>
			),
		},
		{
			header: "Price",
			accessorKey: "unitPriceEurCents",
			cell: (row) => (
				<div className="space-y-1">
					<span className="font-display font-normal">{formatPrice(row.unitPriceEurCents)}</span>
					{row.pricingType && (
						<Badge variant="outline" className="text-xs font-display font-light block w-fit">
							{row.pricingType}
						</Badge>
					)}
				</div>
			),
		},
		{
			header: "Stock",
			accessorKey: "stockStatus",
			cell: (row) => {
				const statusMap = {
					in_stock: { label: "In Stock", variant: "default" as const },
					made_to_order: { label: "Made to Order", variant: "secondary" as const },
					requires_quote: { label: "Custom Quote", variant: "outline" as const },
					out_of_stock: { label: "Out of Stock", variant: "destructive" as const },
				}
				const status = row.stockStatus ? statusMap[row.stockStatus as keyof typeof statusMap] : null
				return status ? (
					<Badge variant={status.variant} className="font-display font-light text-xs">
						{status.label}
					</Badge>
				) : (
					<span className="text-muted-foreground">—</span>
				)
			},
		},
		{
			header: "Status",
			accessorKey: "isActive",
			cell: (row) => (
				<Badge variant={row.isActive ? "default" : "secondary"} className="font-display font-light text-xs">
					{row.isActive ? "Active" : "Inactive"}
				</Badge>
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
							e.stopPropagation()
							window.open(`/admin/catalog/products/${row.id}`, "_blank")
						}}
					>
						<Eye className="h-4 w-4" />
					</Button>
					<Button
						size="sm"
						variant="ghost"
						className="h-8 rounded-full text-destructive hover:text-destructive"
						onClick={(e) => {
							e.stopPropagation()
							if (confirm(`Move "${row.name}" to trash?`)) {
								softDelete.mutate({ id: row.id })
							}
						}}
					>
						<Trash2 className="h-4 w-4" />
					</Button>
				</div>
			),
		},
	]

	if (isLoading) {
		return (
			<div className="space-y-8">
				<h1 className="text-4xl font-display font-extralight">Products</h1>
				<p className="text-muted-foreground font-display font-light">Loading products...</p>
			</div>
		)
	}

	return (
		<div className="space-y-8">
			{/* Header */}
			<div className="flex items-start justify-between">
				<div className="space-y-4 flex-1">
					<div className="flex items-center justify-between">
						<div className="space-y-2">
							<h1 className="text-4xl font-display font-extralight tracking-tight">Products</h1>
							<p className="text-muted-foreground font-display font-light text-lg">
								Manage your product catalog for {market} market
							</p>
						</div>
						<Button asChild className="rounded-full">
							<Link href="/admin/catalog/products/new">
								<Plus className="mr-2 h-4 w-4" />
								Add Product
							</Link>
						</Button>
					</div>

					{/* Market Selector */}
					<MarketSelector currentMarket={market} />
				</div>
			</div>

			{/* Filters */}
			<div className="flex flex-wrap gap-4">
				<Select value={categoryFilter} onValueChange={(val) => setCategoryFilter(val === "all" ? undefined : val)}>
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

				<Select value={stockFilter} onValueChange={(val) => setStockFilter(val === "all" ? undefined : val)}>
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
						<SelectItem value="requires_quote" className="font-display font-light">
							Custom Quote
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
					<SelectTrigger className="w-[150px] font-display font-light">
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
					value={featuredFilter === undefined ? "all" : featuredFilter ? "featured" : "non-featured"}
					onValueChange={(val) => setFeaturedFilter(val === "all" ? undefined : val === "featured")}
				>
					<SelectTrigger className="w-[150px] font-display font-light">
						<SelectValue placeholder="All Products" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all" className="font-display font-light">
							All Products
						</SelectItem>
						<SelectItem value="featured" className="font-display font-light">
							<div className="flex items-center gap-2">
								<Star className="h-3 w-3" />
								Featured
							</div>
						</SelectItem>
						<SelectItem value="non-featured" className="font-display font-light">
							Non-Featured
						</SelectItem>
					</SelectContent>
				</Select>

				<Select value={sortBy} onValueChange={(val) => setSortBy(val as any)}>
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

				<Select value={sortOrder} onValueChange={(val) => setSortOrder(val as any)}>
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

			{/* Stats Summary */}
			<div className="flex items-center gap-4 text-sm text-muted-foreground font-display font-light">
				<span>
					Showing {filteredProducts?.length || 0} products in{" "}
					<MarketBadge market={market} showIcon={false} className="inline-flex" />
				</span>
				{featuredFilter && (
					<Badge variant="outline" className="font-display font-light">
						<Star className="mr-1 h-3 w-3" />
						Featured only
					</Badge>
				)}
			</div>

			{/* Products Table */}
			<AdminTable
				columns={columns}
				data={filteredProducts || []}
				onRowClick={(row) => `/admin/catalog/products/${row.id}`}
				searchPlaceholder="Search products by name, SKU, or category..."
				pageSize={15}
			/>

			{(!filteredProducts || filteredProducts.length === 0) && (
				<div className="py-16 text-center space-y-4">
					<p className="text-lg text-muted-foreground font-display font-light">No products found in {market} market</p>
					<Button asChild className="rounded-full">
						<Link href="/admin/catalog/products/new">
							<Plus className="mr-2 h-4 w-4" />
							Create First Product
						</Link>
					</Button>
				</div>
			)}
		</div>
	)
}

export default function ProductsListPage() {
	return (
		<Suspense
			fallback={
				<div className="flex items-center justify-center py-20">
					<p className="text-lg text-muted-foreground font-display font-light">Loading products...</p>
				</div>
			}
		>
			<ProductsListContent />
		</Suspense>
	)
}
