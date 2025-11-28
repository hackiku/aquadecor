// src/components/shop/product/ProductSlider.tsx
"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "~/components/ui/card";
import { api } from "~/trpc/react";
import { Skeleton } from "~/components/ui/skeleton";
import { ArrowRight } from "lucide-react";
import type { Product, ProductCardData } from "~/server/db/schema/shop";

export function ProductSlider() {
	// Fetch featured products
	const { data: products, isLoading } = api.product.getFeatured.useQuery({
		locale: "en",
		limit: 12,
	});

	// Split by product line
	const backgroundProducts = products?.filter(
		(p) => p.productLineSlug === "3d-backgrounds"
	).slice(0, 6) || [];

	const decorationProducts = products?.filter(
		(p) => p.productLineSlug === "aquarium-decorations"
	).slice(0, 6) || [];

	return (
		<div className="space-y-12">
			{/* 3D Backgrounds Row */}
			<ProductRow
				title="3D Backgrounds"
				subtitle="Custom-made realistic rock formations"
				products={backgroundProducts}
				isLoading={isLoading}
				href="/shop/3d-backgrounds"
			/>

			{/* Aquarium Decorations Row */}
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

interface ProductRowProps {
	title: string;
	subtitle: string;
	products: ProductCardData[];
	isLoading: boolean;
	href: string;
}

function ProductRow({ title, subtitle, products, isLoading, href }: ProductRowProps) {
	return (
		<div className="space-y-6">
			{/* Header */}
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
					className="hidden md:flex items-center gap-2 text-sm text-primary hover:underline font-display font-medium group"
				>
					View all
					<ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
				</Link>
			</div>

			{/* Products Grid/Scroll */}
			<div className="relative -mx-4 px-4">
				<div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
					{isLoading ? (
						<>
							{[...Array(6)].map((_, i) => (
								<ProductCardSkeleton key={i} />
							))}
						</>
					) : (
						products.map((product) => (
							<ProductCard key={product.id} product={product} />
						))
					)}
				</div>
			</div>

			{/* Mobile View All Button */}
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

function ProductCard({ product }: { product: ProductCardData }) {
	const hasPrice = product.basePriceEurCents !== null;

	return (
		<Link
			href={`/shop/${product.productLineSlug}/${product.categorySlug}/${product.slug}`}
			className="group block snap-start shrink-0 w-[260px] md:w-[300px]"
		>
			<Card className="h-full overflow-hidden border-2 hover:border-primary/50 transition-all hover:shadow-xl bg-gradient-to-b from-transparent to-black/80">
				{/* Image */}
				<div className="relative aspect-4/3 bg-muted overflow-hidden">
					{product.featuredImageUrl ? (
						<Image
							src={product.featuredImageUrl}
							alt={product.name || "Product"}
							fill
							className="object-cover group-hover:scale-105 transition-transform duration-500"
							sizes="300px"
						/>
					) : (
						<div className="absolute inset-0 bg-linear-to-br from-primary/20 to-primary/5 flex items-center justify-center">
							<span className="text-muted-foreground font-display text-sm">
								{product.sku}
							</span>
						</div>
					)}

					{/* Gradient overlay for text readability */}
					<div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-black/90" />

					{/* Content overlay at bottom */}
					<div className="absolute -bottom-5 left-0 right-0 p-4 space-y-2">
						<h4 className="font-display font-normal text-base line-clamp-2 text-white">
							{product.name || product.slug}
						</h4>

						{hasPrice ? (
							<p className="text-lg font-display font-medium text-white">
								€{(product.basePriceEurCents / 100).toFixed(0)}
							</p>
						) : (
							<p className="text-sm font-display font-medium text-white/80">
								Custom Quote
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
		<div className="snap-start shrink-0 w-[260px] md:w-[300px]">
			<Card className="h-full overflow-hidden">
				<Skeleton className="aspect-4/3 w-full" />
			</Card>
		</div>
	);
}