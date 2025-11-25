// src/components/shop/product/ProductSlider.tsx
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardFooter, CardHeader } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { api } from "~/trpc/react";
import { Skeleton } from "~/components/ui/skeleton";

type ProductLineFilter = "3d-backgrounds" | "aquarium-decorations";

export function ProductSlider() {
	const [filter, setFilter] = useState<ProductLineFilter>("3d-backgrounds");

	// Auto-switch between product lines every 5 seconds
	useEffect(() => {
		const interval = setInterval(() => {
			setFilter((prev) =>
				prev === "3d-backgrounds" ? "aquarium-decorations" : "3d-backgrounds"
			);
		}, 5000);

		return () => clearInterval(interval);
	}, []);

	// Fetch featured products
	const { data: products, isLoading } = api.product.getFeatured.useQuery({
		locale: "en",
		limit: 8,
	});

	// Filter by current selection
	const filteredProducts = products?.filter(
		(p) => p.productLineSlug === filter
	).slice(0, 4) || [];

	return (
		<div className="relative w-full">
			{/* Desktop: Horizontal scroll */}
			<div className="hidden md:flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
				{isLoading ? (
					<>
						{[...Array(4)].map((_, i) => (
							<ProductCardSkeleton key={i} />
						))}
					</>
				) : (
					filteredProducts.map((product) => (
						<ProductCard key={product.id} product={product} />
					))
				)}
			</div>

			{/* Mobile: Grid */}
			<div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:hidden">
				{isLoading ? (
					<>
						{[...Array(4)].map((_, i) => (
							<ProductCardSkeleton key={i} />
						))}
					</>
				) : (
					filteredProducts.map((product) => (
						<ProductCard key={product.id} product={product} />
					))
				)}
			</div>

			{/* Bottom Row: Toggle + CTA */}
			<div className="flex items-center justify-between mt-8">
				{/* Category Toggle */}
				<div className="flex items-center gap-2">
					<button
						onClick={() => setFilter("3d-backgrounds")}
						className={`group relative px-4 py-2 text-sm font-display font-medium transition-colors ${filter === "3d-backgrounds"
								? "text-primary"
								: "text-muted-foreground hover:text-foreground"
							}`}
						title="3D Aquarium Backgrounds"
					>
						Backgrounds
						{filter === "3d-backgrounds" && (
							<motion.div
								layoutId="activeFilter"
								className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
								transition={{ type: "spring", stiffness: 380, damping: 30 }}
							/>
						)}
					</button>

					<span className="text-muted-foreground/50">|</span>

					<button
						onClick={() => setFilter("aquarium-decorations")}
						className={`group relative px-4 py-2 text-sm font-display font-medium transition-colors ${filter === "aquarium-decorations"
								? "text-primary"
								: "text-muted-foreground hover:text-foreground"
							}`}
						title="Aquarium Decorations"
					>
						Decorations
						{filter === "aquarium-decorations" && (
							<motion.div
								layoutId="activeFilter"
								className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
								transition={{ type: "spring", stiffness: 380, damping: 30 }}
							/>
						)}
					</button>
				</div>

				{/* View All Button */}
				<Button
					asChild
					variant="outline"
					size="default"
					className="rounded-full"
				>
					<Link href="/shop">Shop all products</Link>
				</Button>
			</div>
		</div>
	);
}

function ProductCard({ product }: { product: any }) {
	const hasPrice = product.basePriceEurCents !== null;

	return (
		<Link
			href={`/shop/${product.productLineSlug}/${product.categorySlug}/${product.slug}`}
			className="group block snap-start shrink-0 w-[280px] md:w-[320px]"
		>
			<Card className="h-full overflow-hidden border-2 hover:border-primary transition-all hover:shadow-lg">
				<CardHeader className="p-0">
					<div className="relative aspect-[4/3] bg-muted overflow-hidden">
						{product.featuredImageUrl ? (
							<Image
								src={product.featuredImageUrl}
								alt={product.name || "Product"}
								fill
								className="object-cover group-hover:scale-105 transition-transform duration-300"
								sizes="320px"
							/>
						) : (
							<div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
								<span className="text-muted-foreground font-display text-sm">
									{product.sku}
								</span>
							</div>
						)}
					</div>
				</CardHeader>
				<CardContent className="p-4 space-y-2">
					<h3 className="font-display font-normal text-lg line-clamp-1">
						{product.name || product.slug}
					</h3>
					{product.shortDescription && (
						<p className="text-sm text-muted-foreground font-display font-light line-clamp-2">
							{product.shortDescription}
						</p>
					)}
				</CardContent>
				<CardFooter className="p-4 pt-0">
					{hasPrice ? (
						<p className="text-lg font-display font-medium text-primary">
							€{(product.basePriceEurCents / 100).toFixed(0)}
						</p>
					) : (
						<p className="text-sm font-display font-medium text-muted-foreground">
							Custom Quote
						</p>
					)}
				</CardFooter>
			</Card>
		</Link>
	);
}

function ProductCardSkeleton() {
	return (
		<div className="snap-start shrink-0 w-[280px] md:w-[320px]">
			<Card className="h-full overflow-hidden">
				<CardHeader className="p-0">
					<Skeleton className="aspect-[4/3] w-full" />
				</CardHeader>
				<CardContent className="p-4 space-y-2">
					<Skeleton className="h-6 w-3/4" />
					<Skeleton className="h-4 w-full" />
					<Skeleton className="h-4 w-2/3" />
				</CardContent>
				<CardFooter className="p-4 pt-0">
					<Skeleton className="h-6 w-20" />
				</CardFooter>
			</Card>
		</div>
	);
}