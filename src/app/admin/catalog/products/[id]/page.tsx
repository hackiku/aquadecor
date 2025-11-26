// src/app/admin/catalog/products/[id]/page.tsx

import { notFound } from "next/navigation";
import { api } from "~/trpc/server";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Pencil, ArrowLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface PageProps {
	params: Promise<{
		id: string;
	}>;
}

export default async function ProductDetailPage({ params }: PageProps) {
	const { id } = await params;
	const product = await api.admin.product.getById({ id });

	if (!product) {
		notFound();
	}

	const formatPrice = (cents: number | null) => {
		if (!cents) return null;
		return `€${(cents / 100).toFixed(2)}`;
	};

	const stockBadge = product.stockStatus ? {
		in_stock: { label: "In Stock", variant: "default" as const },
		made_to_order: { label: "Made to Order", variant: "secondary" as const },
		out_of_stock: { label: "Out of Stock", variant: "destructive" as const },
	}[product.stockStatus] : undefined;

	return (
		<div className="space-y-8">
			{/* Header */}
			<div className="flex items-start justify-between">
				<div className="space-y-4">
					<Button variant="ghost" asChild className="font-display font-light -ml-4">
						<Link href="/admin/catalog/products">
							<ArrowLeft className="mr-2 h-4 w-4" />
							Back to Products
						</Link>
					</Button>
					<div className="space-y-2">
						<div className="flex items-center gap-3">
							<h1 className="text-4xl font-display font-extralight tracking-tight">
								{product.name || "Untitled Product"}
							</h1>
							<Badge
								variant={product.isActive ? "default" : "secondary"}
								className="font-display font-light"
							>
								{product.isActive ? "Active" : "Inactive"}
							</Badge>
							{product.isFeatured && (
								<Badge variant="outline" className="font-display font-light">
									Featured
								</Badge>
							)}
						</div>
						<p className="text-muted-foreground font-display font-light text-lg">
							{product.categoryName} • {product.sku || "No SKU"}
						</p>
					</div>
				</div>
				<Button className="rounded-full">
					<Pencil className="mr-2 h-4 w-4" />
					Edit Product
				</Button>
			</div>

			<div className="grid gap-8 lg:grid-cols-2">
				{/* Left Column - Images */}
				<div className="space-y-6">
					<Card className="border-2">
						<CardHeader>
							<CardTitle className="font-display font-normal">Product Images</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							{product.images && product.images.length > 0 ? (
								<div className="grid gap-4">
									{product.images.map((image, idx) => (
										<div
											key={image.id}
											className="relative aspect-[4/3] rounded-xl overflow-hidden border-2 border-border bg-muted"
										>
											<Image
												src={image.storageUrl}
												alt={image.altText || `Product image ${idx + 1}`}
												fill
												className="object-cover"
											/>
											{idx === 0 && (
												<div className="absolute top-3 left-3">
													<Badge className="font-display font-light">Featured</Badge>
												</div>
											)}
										</div>
									))}
								</div>
							) : (
								<div className="aspect-[4/3] rounded-xl border-2 border-dashed border-muted-foreground/25 bg-muted flex items-center justify-center">
									<p className="text-muted-foreground font-display font-light">
										No images uploaded
									</p>
								</div>
							)}
						</CardContent>
					</Card>
				</div>

				{/* Right Column - Details */}
				<div className="space-y-6">
					{/* Basic Info */}
					<Card className="border-2">
						<CardHeader>
							<CardTitle className="font-display font-normal">Basic Information</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="grid grid-cols-2 gap-4">
								<div>
									<p className="text-sm text-muted-foreground font-display font-light mb-1">
										SKU
									</p>
									<p className="font-display font-normal">
										{product.sku || "—"}
									</p>
								</div>
								<div>
									<p className="text-sm text-muted-foreground font-display font-light mb-1">
										Slug
									</p>
									<p className="font-display font-normal text-sm">
										{product.slug}
									</p>
								</div>
								<div>
									<p className="text-sm text-muted-foreground font-display font-light mb-1">
										Base Price
									</p>
									<p className="font-display font-normal">
										{formatPrice(product.basePriceEurCents) || (
											<Badge variant="outline" className="font-display font-light">
												Custom Only
											</Badge>
										)}
									</p>
								</div>
								<div>
									<p className="text-sm text-muted-foreground font-display font-light mb-1">
										Stock Status
									</p>
									{stockBadge && (
										<Badge variant={stockBadge.variant} className="font-display font-light">
											{stockBadge.label}
										</Badge>
									)}
								</div>
							</div>

							{product.priceNote && (
								<div>
									<p className="text-sm text-muted-foreground font-display font-light mb-1">
										Price Note
									</p>
									<p className="font-display font-light text-sm">
										{product.priceNote}
									</p>
								</div>
							)}
						</CardContent>
					</Card>

					{/* Content */}
					<Card className="border-2">
						<CardHeader>
							<CardTitle className="font-display font-normal">Product Content</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<div>
								<p className="text-sm text-muted-foreground font-display font-light mb-2">
									Short Description
								</p>
								<p className="font-display font-light leading-relaxed">
									{product.shortDescription || "No description"}
								</p>
							</div>

							{product.fullDescription && (
								<div>
									<p className="text-sm text-muted-foreground font-display font-light mb-2">
										Full Description
									</p>
									<p className="font-display font-light leading-relaxed text-sm">
										{product.fullDescription}
									</p>
								</div>
							)}
						</CardContent>
					</Card>

					{/* Specifications */}
					{product.specifications && Object.keys(product.specifications).length > 0 && (
						<Card className="border-2">
							<CardHeader>
								<CardTitle className="font-display font-normal">Specifications</CardTitle>
							</CardHeader>
							<CardContent>
								<pre className="text-sm font-display font-light bg-muted p-4 rounded-lg overflow-x-auto">
									{JSON.stringify(product.specifications, null, 2)}
								</pre>
							</CardContent>
						</Card>
					)}

					{/* Translations */}
					{product.translations && product.translations.length > 0 && (
						<Card className="border-2">
							<CardHeader>
								<CardTitle className="font-display font-normal">Translations</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="space-y-4">
									{product.translations.map((trans) => (
										<div key={trans.id} className="space-y-2 pb-4 border-b last:border-0">
											<Badge variant="outline" className="font-display font-light uppercase">
												{trans.locale}
											</Badge>
											<p className="font-display font-normal">{trans.name}</p>
											<p className="text-sm text-muted-foreground font-display font-light">
												{trans.shortDescription}
											</p>
										</div>
									))}
								</div>
							</CardContent>
						</Card>
					)}

					{/* Metadata */}
					<Card className="border-2">
						<CardHeader>
							<CardTitle className="font-display font-normal">Metadata</CardTitle>
						</CardHeader>
						<CardContent className="space-y-3 text-sm">
							<div className="flex justify-between">
								<span className="text-muted-foreground font-display font-light">Product ID</span>
								<span className="font-display font-light font-mono text-xs">{product.id}</span>
							</div>
							<div className="flex justify-between">
								<span className="text-muted-foreground font-display font-light">Category</span>
								<Link
									href={`/admin/catalog/categories/${product.categoryId}`}
									className="font-display font-light text-primary hover:underline"
								>
									{product.categoryName}
								</Link>
							</div>
							<div className="flex justify-between">
								<span className="text-muted-foreground font-display font-light">Product Line</span>
								<span className="font-display font-light">{product.productLine}</span>
							</div>
							<div className="flex justify-between">
								<span className="text-muted-foreground font-display font-light">Sort Order</span>
								<span className="font-display font-light">{product.sortOrder}</span>
							</div>
							<div className="flex justify-between">
								<span className="text-muted-foreground font-display font-light">Created</span>
								<span className="font-display font-light">
									{new Date(product.createdAt).toLocaleDateString()}
								</span>
							</div>
							{product.updatedAt && (
								<div className="flex justify-between">
									<span className="text-muted-foreground font-display font-light">Updated</span>
									<span className="font-display font-light">
										{new Date(product.updatedAt).toLocaleDateString()}
									</span>
								</div>
							)}
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}