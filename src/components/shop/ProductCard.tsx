// src/components/shop/ProductCard.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "~/components/ui/button";

interface ProductCardProps {
	product: {
		id: string;
		name: string;
		price: number;
		image: string;
		slug: string;
		category?: string;
	};
}

export function ProductCard({ product }: ProductCardProps) {
	return (
		<Link
			href={`/store/${product.category ?? "backgrounds"}/${product.slug}`}
			className="group"
		>
			<div className="overflow-hidden rounded-2xl border bg-card transition-all hover:shadow-lg hover:border-primary/20">
				{/* Product Image */}
				<div className="relative aspect-4/3 overflow-hidden bg-muted">
					<Image
						src={product.image}
						alt={product.name}
						fill
						className="object-cover transition-transform duration-300 group-hover:scale-105"
						sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
					/>
				</div>

				{/* Product Info */}
				<div className="p-6 space-y-4">
					<div className="space-y-2">
						<h3 className="font-semibold text-lg line-clamp-2 group-hover:text-primary transition-colors">
							{product.name}
						</h3>
						<p className="text-2xl font-bold">
							${product.price}
							<span className="text-sm font-normal text-muted-foreground ml-1">
								USD
							</span>
						</p>
					</div>

					<Button
						className="w-full rounded-full"
						variant="outline"
						onClick={(e) => {
							e.preventDefault();
							// TODO: Open inquiry modal or navigate to product page
							console.log("Inquire about:", product.id);
						}}
					>
						Request Quote
					</Button>
				</div>
			</div>
		</Link>
	);
}