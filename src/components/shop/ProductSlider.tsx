// src/components/shop/ProductSlider.tsx

"use client";

import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader } from "~/components/ui/card";
import { Button } from "~/components/ui/button";

// Mock data - replace with tRPC call later
const FEATURED_PRODUCTS = [
	{
		id: "1",
		name: "Rocky Cave Background",
		slug: "rocky-cave-background",
		price: "From €199",
		category: "3d-backgrounds",
		image: "/images/products/rocky-cave.jpg",
		description: "Natural rock formations with cave structures"
	},
	{
		id: "2",
		name: "Amazonian Roots",
		slug: "amazonian-roots",
		price: "From €249",
		category: "3d-backgrounds",
		image: "/images/products/amazonian.jpg",
		description: "Authentic Amazon riverbed aesthetic"
	},
	{
		id: "3",
		name: "Slim Model - Stone",
		slug: "slim-model-stone",
		price: "From €149",
		category: "slim-models",
		image: "/images/products/slim-stone.jpg",
		description: "Space-saving thin design"
	},
	{
		id: "4",
		name: "Coral Reef Decoration",
		slug: "coral-reef-decoration",
		price: "From €89",
		category: "additional-items",
		image: "/images/products/coral.jpg",
		description: "Realistic coral structures"
	},
	{
		id: "5",
		name: "Driftwood Decoration",
		slug: "driftwood-decoration",
		price: "From €69",
		category: "additional-items",
		image: "/images/products/driftwood.jpg",
		description: "Natural aged wood appearance"
	},
];

export function ProductSlider() {
	return (
		<div className="relative">
			{/* Desktop: Horizontal scroll */}
			<div className="hidden md:flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
				{FEATURED_PRODUCTS.map((product) => (
					<ProductCard key={product.id} product={product} />
				))}
			</div>

			{/* Mobile: Grid */}
			<div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:hidden">
				{FEATURED_PRODUCTS.slice(0, 4).map((product) => (
					<ProductCard key={product.id} product={product} />
				))}
			</div>

			{/* View All Button */}
			<div className="text-center mt-8">
				<Button
					asChild
					variant="outline"
					size="lg"
					className="rounded-full"
				>
					<Link href="/shop">Shop all products</Link>
				</Button>
			</div>
		</div>
	);
}

function ProductCard({ product }: { product: typeof FEATURED_PRODUCTS[0] }) {
	return (
		<Link
			href={`/store/${product.category}/${product.slug}`}
			className="group block snap-start shrink-0 w-[280px] md:w-[320px]"
		>
			<Card className="h-full overflow-hidden border-2 hover:border-primary transition-all hover:shadow-lg">
				<CardHeader className="p-0">
					<div className="relative aspect-[4/3] bg-muted overflow-hidden">
						{/* Placeholder - replace with actual images */}
						<div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5" />
						<div className="absolute inset-0 flex items-center justify-center text-muted-foreground font-display">
							{product.name}
						</div>
						{/* 
						<Image
							src={product.image}
							alt={product.name}
							fill
							className="object-cover group-hover:scale-105 transition-transform duration-300"
							sizes="320px"
						/>
						*/}
					</div>
				</CardHeader>
				<CardContent className="p-4 space-y-2">
					<h3 className="font-display font-normal text-lg line-clamp-1">
						{product.name}
					</h3>
					<p className="text-sm text-muted-foreground font-display font-light line-clamp-2">
						{product.description}
					</p>
				</CardContent>
				<CardFooter className="p-4 pt-0">
					<p className="text-lg font-display font-medium text-primary">
						{product.price}
					</p>
				</CardFooter>
			</Card>
		</Link>
	);
}