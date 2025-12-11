// src/app/admin/catalog/products/[id]/_components/ProductDetailClient.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "~/trpc/react";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { Switch } from "~/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import {
	Pencil, ArrowLeft, Save, Trash2, Plus, Eye, Loader2, Package, Star,
	Globe, ChevronLeft, ChevronRight
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { MarketBadge } from "../../../_components/MarketBadge";
import { PricingEditorV2 } from "../../../_components/PricingEditorV2";
import { BundleTierEditor } from "../../../_components/BundleTierEditor";
import { AddPricingButton } from "./AddPricingButton"
import { CopyPricingButton } from "./CopyPricingButton"


interface ProductDetailClientProps {
	product: any;
	initialMarket: 'US' | 'ROW';
}

export function ProductDetailClient({ product, initialMarket }: ProductDetailClientProps) {
	const router = useRouter();
	const [selectedMarket, setSelectedMarket] = useState<'US' | 'ROW'>(initialMarket);
	const [currentImageIndex, setCurrentImageIndex] = useState(0);
	const [isEditingBasic, setIsEditingBasic] = useState(false);

	const [basicFormData, setBasicFormData] = useState({
		name: product.name || '',
		shortDescription: product.shortDescription || '',
		longDescription: product.longDescription || '',
		sku: product.sku || '',
		isActive: product.isActive,
		isFeatured: product.isFeatured,
		stockStatus: product.stockStatus,
	});

	const updateProduct = api.admin.product.update.useMutation({
		onSuccess: () => {
			toast.success('Product updated');
			setIsEditingBasic(false);
			router.refresh();
		},
		onError: (error: any) => {
			toast.error(`Failed to update: ${error.message}`);
		},
	});

	const softDelete = api.admin.product.softDelete.useMutation({
		onSuccess: () => {
			toast.success('Product moved to trash');
			router.push('/admin/catalog/products');
		},
		onError: (error: any) => {
			toast.error(`Failed to delete: ${error.message}`);
		},
	});

	const handleSaveBasic = () => {
		updateProduct.mutate({
			id: product.id,
			translation: {
				name: basicFormData.name,
				shortDescription: basicFormData.shortDescription,
				longDescription: basicFormData.longDescription,
			},
			sku: basicFormData.sku,
			isActive: basicFormData.isActive,
			isFeatured: basicFormData.isFeatured,
			stockStatus: basicFormData.stockStatus as any,
		});
	};

	const handleDelete = () => {
		if (confirm(`Move "${product.name}" to trash? This can be undone from the trash page.`)) {
			softDelete.mutate({ id: product.id });
		}
	};

	// Product images (hero + additional media)
	const productImages = product.media?.filter((m: any) => m.usageType === 'product') || [];
	const allImages = product.heroImageUrl
		? [{ url: product.heroImageUrl, alt: product.name }, ...productImages.map((m: any) => ({ url: m.storageUrl, alt: m.altText }))]
		: productImages.map((m: any) => ({ url: m.storageUrl, alt: m.altText }));

	// Stock status badge config
	const stockStatusConfig: Record<string, { label: string; variant: "default" | "secondary" | "outline" | "destructive" }> = {
		in_stock: { label: "In Stock", variant: "default" },
		made_to_order: { label: "Made to Order", variant: "secondary" },
		requires_quote: { label: "Custom Quote", variant: "outline" },
		out_of_stock: { label: "Out of Stock", variant: "destructive" },
		discontinued: { label: "Discontinued", variant: "destructive" },
	};

	const stockBadge = product.stockStatus ? stockStatusConfig[product.stockStatus] : undefined;

	// Get pricing for both markets
	const pricingConfigs = product.pricingConfigs || []
	const rowPricing = pricingConfigs.find((p: any) => p.market === "ROW")
	const usPricing = pricingConfigs.find((p: any) => p.market === "US")


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
								{product.name || product.slug}
							</h1>
							{product.isFeatured && (
								<Star className="h-6 w-6 text-primary fill-primary" />
							)}
						</div>
						<div className="flex items-center gap-2">
							<Badge variant="outline" className="font-mono font-light">
								{product.sku}
							</Badge>
							{stockBadge && (
								<Badge variant={stockBadge.variant} className="font-display font-light">
									{stockBadge.label}
								</Badge>
							)}
							<Badge variant={product.isActive ? "default" : "secondary"} className="font-display font-light">
								{product.isActive ? "Active" : "Inactive"}
							</Badge>
						</div>
					</div>
				</div>
				<div className="flex gap-2">
					<Button variant="outline" className="rounded-full" asChild>
						<Link href={`/shop/${product.productLine}/${product.categorySlug}/${product.slug}`} target="_blank">
							<Eye className="mr-2 h-4 w-4" />
							Preview
						</Link>
					</Button>
					<Button
						variant="destructive"
						className="rounded-full"
						onClick={handleDelete}
						disabled={softDelete.isPending}
					>
						<Trash2 className="mr-2 h-4 w-4" />
						Move to Trash
					</Button>
				</div>
			</div>

			{/* Main Content: 2-column layout */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
				{/* LEFT COLUMN: Product Images */}
				<div className="space-y-4">
					<Card className="border-2 overflow-hidden">
						<CardContent className="p-0">
							{/* Main Image */}
							<div className="relative aspect-square bg-muted">
								{allImages.length > 0 ? (
									<Image
										src={allImages[currentImageIndex]?.url || ''}
										alt={allImages[currentImageIndex]?.alt || product.name || 'Product image'}
										fill
										className="object-cover"
									/>
								) : (
									<div className="absolute inset-0 flex items-center justify-center">
										<Package className="h-24 w-24 text-muted-foreground/20" />
									</div>
								)}

								{/* Navigation arrows */}
								{allImages.length > 1 && (
									<>
										<Button
											variant="ghost"
											size="icon"
											className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background"
											onClick={() => setCurrentImageIndex(i => (i === 0 ? allImages.length - 1 : i - 1))}
										>
											<ChevronLeft className="h-5 w-5" />
										</Button>
										<Button
											variant="ghost"
											size="icon"
											className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background"
											onClick={() => setCurrentImageIndex(i => (i === allImages.length - 1 ? 0 : i + 1))}
										>
											<ChevronRight className="h-5 w-5" />
										</Button>
									</>
								)}
							</div>

							{/* Thumbnail Gallery */}
							{allImages.length > 1 && (
								<div className="p-4 border-t">
									<div className="flex gap-2 overflow-x-auto">
										{allImages.map((img: any, idx: number) => (
											<button
												key={idx}
												onClick={() => setCurrentImageIndex(idx)}
												className={`relative shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${idx === currentImageIndex
														? 'border-primary ring-2 ring-primary/20'
														: 'border-border hover:border-primary/50'
													}`}
											>
												<Image
													src={img.url}
													alt={img.alt || `Thumbnail ${idx + 1}`}
													fill
													className="object-cover"
												/>
											</button>
										))}
									</div>
								</div>
							)}

							{/* Image Upload Placeholder */}
							{allImages.length === 0 && (
								<div className="p-6 text-center text-muted-foreground font-display font-light">
									<p className="mb-2">No images yet</p>
									<Button variant="outline" size="sm" disabled className="rounded-full">
										<Plus className="mr-2 h-4 w-4" />
										Upload Images (Coming Soon)
									</Button>
								</div>
							)}
						</CardContent>
					</Card>
				</div>

				{/* RIGHT COLUMN: Product Details & Metadata */}
				<div className="space-y-6">
					{/* Basic Information */}
					<Card className="border-2">
						<CardHeader>
							<div className="flex items-center justify-between">
								<CardTitle className="font-display font-normal">Basic Information</CardTitle>
								{!isEditingBasic && (
									<Button
										variant="outline"
										size="sm"
										onClick={() => setIsEditingBasic(true)}
										className="rounded-full"
									>
										<Pencil className="mr-2 h-4 w-4" />
										Edit
									</Button>
								)}
							</div>
						</CardHeader>
						<CardContent className="space-y-4">
							{isEditingBasic ? (
								<>
									<div className="space-y-2">
										<Label>Product Name</Label>
										<Input
											value={basicFormData.name}
											onChange={(e) => setBasicFormData({ ...basicFormData, name: e.target.value })}
										/>
									</div>
									<div className="space-y-2">
										<Label>SKU</Label>
										<Input
											value={basicFormData.sku}
											onChange={(e) => setBasicFormData({ ...basicFormData, sku: e.target.value })}
											className="font-mono"
										/>
									</div>
									<div className="space-y-2">
										<Label>Short Description</Label>
										<Textarea
											value={basicFormData.shortDescription}
											onChange={(e) => setBasicFormData({ ...basicFormData, shortDescription: e.target.value })}
											rows={2}
										/>
									</div>
									<div className="space-y-2">
										<Label>Long Description</Label>
										<Textarea
											value={basicFormData.longDescription}
											onChange={(e) => setBasicFormData({ ...basicFormData, longDescription: e.target.value })}
											rows={4}
										/>
									</div>
									<div className="grid grid-cols-2 gap-4 pt-2">
										<div className="flex items-center justify-between">
											<Label>Active</Label>
											<Switch
												checked={basicFormData.isActive}
												onCheckedChange={(checked) => setBasicFormData({ ...basicFormData, isActive: checked })}
											/>
										</div>
										<div className="flex items-center justify-between">
											<Label>Featured</Label>
											<Switch
												checked={basicFormData.isFeatured}
												onCheckedChange={(checked) => setBasicFormData({ ...basicFormData, isFeatured: checked })}
											/>
										</div>
									</div>
									<div className="flex gap-2 pt-4">
										<Button
											onClick={handleSaveBasic}
											disabled={updateProduct.isPending}
											className="flex-1 rounded-full"
										>
											{updateProduct.isPending ? (
												<Loader2 className="h-4 w-4 animate-spin" />
											) : (
												<>
													<Save className="mr-2 h-4 w-4" />
													Save Changes
												</>
											)}
										</Button>
										<Button
											variant="ghost"
											onClick={() => setIsEditingBasic(false)}
											className="rounded-full"
										>
											Cancel
										</Button>
									</div>
								</>
							) : (
								<>
									<div>
										<p className="text-sm text-muted-foreground mb-1">Product Name</p>
										<p className="font-display font-normal text-lg">{product.name}</p>
									</div>
									{product.shortDescription && (
										<div>
											<p className="text-sm text-muted-foreground mb-1">Short Description</p>
											<p className="font-display font-light">{product.shortDescription}</p>
										</div>
									)}
									{product.longDescription && (
										<div>
											<p className="text-sm text-muted-foreground mb-1">Long Description</p>
											<p className="font-display font-light text-sm leading-relaxed">{product.longDescription}</p>
										</div>
									)}
								</>
							)}
						</CardContent>
					</Card>

					{/* Metadata Card */}
					<Card className="border-2">
						<CardHeader>
							<CardTitle className="font-display font-normal">Metadata</CardTitle>
						</CardHeader>
						<CardContent className="space-y-3 text-sm">
							<div className="flex justify-between">
								<span className="text-muted-foreground">Category</span>
								<span className="font-display font-normal">{product.categoryName || '—'}</span>
							</div>
							<div className="flex justify-between">
								<span className="text-muted-foreground">Product Line</span>
								<span className="font-display font-normal">{product.productLine}</span>
							</div>
							{product.material && (
								<div className="flex justify-between">
									<span className="text-muted-foreground">Material</span>
									<span className="font-display font-normal">{product.material}</span>
								</div>
							)}
							{(product.widthCm || product.heightCm || product.depthCm) && (
								<div className="flex justify-between">
									<span className="text-muted-foreground">Dimensions</span>
									<span className="font-display font-normal">
										{product.widthCm}cm × {product.heightCm}cm × {product.depthCm}cm
									</span>
								</div>
							)}
							<div className="flex justify-between">
								<span className="text-muted-foreground">Created</span>
								<span className="font-display font-light">
									{new Date(product.createdAt).toLocaleDateString()}
								</span>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>

			{/* FULL WIDTH: Pricing Section */}
			<Card className="border-2">
				<CardHeader>
					<div className="flex items-center justify-between">
						<CardTitle className="font-display font-normal">Pricing & Markets</CardTitle>
						<div className="flex gap-2">
							<Button
								variant={selectedMarket === "ROW" ? "default" : "outline"}
								size="sm"
								onClick={() => setSelectedMarket("ROW")}
								className="rounded-full"
							>
								<MarketBadge market="ROW" showIcon />
							</Button>
							<Button
								variant={selectedMarket === "US" ? "default" : "outline"}
								size="sm"
								onClick={() => setSelectedMarket("US")}
								className="rounded-full"
							>
								<MarketBadge market="US" showIcon />
							</Button>
						</div>
					</div>
				</CardHeader>
				<CardContent>
					<div className="space-y-6">
						{/* ROW Market Pricing */}
						{selectedMarket === "ROW" && (
							<>
								{rowPricing ? (
									<div className="space-y-6">
										<PricingEditorV2
											pricing={rowPricing}
											onSaved={() => router.refresh()}
											onDeleted={() => router.refresh()}
										/>

										{/* Bundle Tiers (only for bundle pricing type) */}
										{rowPricing.pricingType === "quantity_bundle" && (
											<BundleTierEditor
												pricingId={rowPricing.id}
												bundles={product.bundles?.filter((b: any) => b.pricingId === rowPricing.id) || []}
												onUpdate={() => router.refresh()}
											/>
										)}
									</div>
								) : (
									<div className="py-12 text-center">
										<p className="text-muted-foreground font-display font-light mb-4">
											No pricing configured for ROW market
										</p>
										<AddPricingButton
											productId={product.id}
											market="ROW"
											sourcePricing={usPricing}
											onSuccess={() => router.refresh()}
										/>
									</div>
								)}
							</>
						)}

						{/* US Market Pricing */}
						{selectedMarket === "US" && (
							<>
								{usPricing ? (
									<div className="space-y-6">
										<PricingEditorV2
											pricing={usPricing}
											onSaved={() => router.refresh()}
											onDeleted={() => router.refresh()}
										/>

										{/* Bundle Tiers (only for bundle pricing type) */}
										{usPricing.pricingType === "quantity_bundle" && (
											<BundleTierEditor
												pricingId={usPricing.id}
												bundles={product.bundles?.filter((b: any) => b.pricingId === usPricing.id) || []}
												onUpdate={() => router.refresh()}
											/>
										)}
									</div>
								) : (
									<div className="py-12 text-center">
										<p className="text-muted-foreground font-display font-light mb-4">
											No pricing configured for US market
										</p>
										{rowPricing ? (
											<CopyPricingButton
												sourcePricingId={rowPricing.id}
												targetMarket="US"
												onSuccess={() => router.refresh()}
											/>
										) : (
											<AddPricingButton
												productId={product.id}
												market="US"
												sourcePricing={undefined}
												onSuccess={() => router.refresh()}
											/>
										)}
									</div>
								)}
							</>
						)}
					</div>
				</CardContent>
			</Card>

			{/* Translations Section */}
			{product.translations && product.translations.length > 1 && (
				<Card className="border-2">
					<CardHeader>
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-2">
								<Globe className="h-5 w-5 text-primary" />
								<CardTitle className="font-display font-normal">Translations</CardTitle>
							</div>
							<Button variant="outline" size="sm" disabled className="rounded-full">
								<Plus className="mr-2 h-4 w-4" />
								Add Translation
							</Button>
						</div>
					</CardHeader>
					<CardContent>
						<div className="space-y-3">
							{product.translations.map((trans: any) => (
								<div key={trans.id} className="p-4 rounded-lg border space-y-2">
									<div className="flex items-center justify-between">
										<Badge variant="outline" className="uppercase">{trans.locale}</Badge>
									</div>
									<div>
										<p className="font-display font-normal">{trans.name}</p>
										{trans.shortDescription && (
											<p className="text-sm text-muted-foreground mt-1">{trans.shortDescription}</p>
										)}
									</div>
								</div>
							))}
						</div>
					</CardContent>
				</Card>
			)}
		</div>
	);
}