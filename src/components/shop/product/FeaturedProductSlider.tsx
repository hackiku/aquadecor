// src/components/shop/product/ProductSlider.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { Card } from "~/components/ui/card";
import { api } from "~/trpc/react";
import { Skeleton } from "~/components/ui/skeleton";
import { ArrowRight, Package, AlertCircle } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";

export function FeaturedProductSlider() {
	const { data: products, isLoading, isError, refetch } = api.product.getFeatured.useQuery(
		{
			locale: "en",
			limit: 12,
			userMarket: "EU",
		},
		{
			staleTime: 5 * 60 * 1000,
			retry: 2,
			retryDelay: 1000,
		}
	);

	if (isError) {
		return (
			<div className="py-12 text-center space-y-4">
				<AlertCircle className="h-12 w-12 text-muted-foreground/50 mx-auto" />
				<div className="space-y-2">
					<p className="text-muted-foreground font-display font-light">
						Unable to load products right now
					</p>
					<Button
						variant="outline"
						size="sm"
						onClick={() => refetch()}
						className="rounded-full"
					>
						Try Again
					</Button>
				</div>
			</div>
		);
	}

	const mappedProducts: FeaturedProduct[] = products
		? products.map((product) => ({
			// Map all the shared fields
			...product,

			// FIX: Map the unitPriceEurCents to basePriceEurCents
			basePriceEurCents: product.unitPriceEurCents ?? null,

			// FIX: Set missing fields with defaults/placeholders
			priceNote: null, // Assuming no price note in featured for simplicity
			excludedMarkets: null, // Assuming this is not needed or fetched in this query

			// You may need to cast the tRPC result type to 'any' here 
			// to access unitPriceEurCents if you haven't fixed the tRPC return type yet.
		}))
		: [];

	const backgroundProducts = mappedProducts.filter(
		(p) => p.productLineSlug === "3d-backgrounds"
	).slice(0, 6) || [];

	const decorationProducts = mappedProducts.filter(
		(p) => p.productLineSlug === "aquarium-decorations"
	).slice(0, 6) || [];


	return (
		<div className="space-y-12">
			<ProductRow
				title="3D Backgrounds"
				subtitle="Custom-made realistic rock formations"
				products={backgroundProducts}
				isLoading={isLoading}
				href="/shop/3d-backgrounds"
			/>

			<ProductRow
				title="Aquarium Decorations"
				subtitle="Plants, rocks, and driftwood that last forever"
				products={decorationProducts}
				isLoading={isLoading}
				href="/shop/aquarium-decorations"
			/>
		</div>
	);
}

// Updated interface to match schema
interface FeaturedProduct {
	id: string;
	slug: string;
	sku: string | null;
	basePriceEurCents: number | null;
	priceNote: string | null;
	excludedMarkets: string[] | null; // UPDATED from availableMarkets
	name: string | null;
	shortDescription: string | null;
	heroImageUrl: string | null;
	heroImageAlt: string | null;
	categorySlug: string | null;
	productLineSlug: string | null;
}

interface ProductRowProps {
	title: string;
	subtitle: string;
	products: FeaturedProduct[];
	isLoading: boolean;
	href: string;
}

function ProductRow({ title, subtitle, products, isLoading, href }: ProductRowProps) {
	return (
		<div className="space-y-6">
			<div className="flex items-end justify-between">
				<div>
					<h3 className="text-2xl md:text-3xl font-display font-light mb-1">
						{title}
					</h3>
					<p className="text-muted-foreground font-display font-light text-sm">
						{subtitle}
					</p>
				</div>
				<Link
					href={href}
					className="hidden mr-8 md:flex items-center gap-2 text-sm text-primary hover:underline font-display font-medium group"
				>
					View all
					<ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
				</Link>
			</div>

			<div className="relative -mx-4 px-4">
				<div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
					{isLoading ? (
						<>
							{[...Array(6)].map((_, i) => (
								<ProductCardSkeleton key={i} />
							))}
						</>
					) : products.length === 0 ? (
						<div className="w-full py-12 text-center text-muted-foreground font-display font-light">
							No products available yet
						</div>
					) : (
						products.map((product) => (
							
							<FeaturedProductCard key={product.id} product={product} />
						))
					)}
				</div>
			</div>

			<Link
				href={href}
				className="md:hidden flex items-center justify-center gap-2 text-sm text-primary hover:underline font-display font-medium group"
			>
				View all {title}
				<ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
			</Link>
		</div>
	);
}

export function FeaturedProductCard({ product }: { product: FeaturedProduct }) {
	const hasPrice = product.basePriceEurCents !== null;
	const productUrl = `/shop/${product.productLineSlug ?? ''}/${product.categorySlug ?? ''}/${product.slug}`;
	const displayName = product.name ?? product.slug;

	return (
		<Link
			href={productUrl}
			className="group block snap-start shrink-0 w-64 md:w-72"
		>
			<Card className="h-full overflow-hidden border-2 hover:border-primary/50 transition-all hover:shadow-xl bg-card p-0">
				<div className="relative h-full min-h-[320px] bg-muted overflow-hidden">
					{/* IMAGE */}
					{product.heroImageUrl ? (
						<Image
							src={product.heroImageUrl}
							alt={product.heroImageAlt || displayName}
							fill
							className="object-cover object-top group-hover:scale-110 transition-transform duration-500"
							sizes="300px"
						/>
					) : (
						<div className="absolute inset-0 bg-linear-to-br from-primary/20 to-primary/5 flex items-center justify-center">
							<Package className="h-16 w-16 text-muted-foreground/20" />
						</div>
					)}

					{/* GRADIENT - Only bottom half */}
					<div className="absolute bottom-0 left-0 right-0 h-1/2 bg-linear-to-t from-background/95 via-background/60 to-transparent dark:from-black/95 dark:via-black/60" />

					{/* SKU BADGE */}
					{product.sku && (
						<div className="absolute top-3 left-3 z-10">
							<Badge className="bg-neutral-500/30 group-hover:bg-primary/70 text-muted-background border-0 backdrop-blur-[1px] font-display font-light text-sm px-3 py-1 shadow-sm">
								{product.sku}
							</Badge>
						</div>
					)}

					{/* TEXT CONTENT - Bottom overlay */}
					<div className="absolute bottom-0 left-0 right-0 p-4 space-y-1.5 z-10">
						<h4 className="font-display font-medium text-base line-clamp-2 text-foreground">
							{displayName}
						</h4>

						{hasPrice ? (
							<p className="text-lg font-display font-semibold text-foreground">
								€{((product.basePriceEurCents ?? 0) / 100).toFixed(0)}
							</p>
						) : (
							<p className="text-sm font-display font-medium text-muted-foreground">
								{product.priceNote ?? "Custom Quote"}
							</p>
						)}
					</div>
				</div>
			</Card>
		</Link>
	);
}

function ProductCardSkeleton() {
	return (
		<div className="snap-start shrink-0 w-64 md:w-72">
			<Card className="h-full overflow-hidden p-0">
				<Skeleton className="h-[320px] w-full" />
			</Card>
		</div>
	);
}