// src/app/shop/_components/product/ProductCard.tsx

"use client";

import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader } from "~/components/ui/card";
import { Button } from "~/components/ui/button";

interface Product {
	id: string;
	name: string;
	slug: string;
	priceNote?: string | null;
	categorySlug: string;
	shortDescription?: string | null;
}

export function ProductCard({ product }: { product: Product }) {
	return (
		<Link href={`/shop/${product.categorySlug}/${product.slug}`} className="group block">
			<Card className="h-full overflow-hidden border-2 hover:border-primary/50 hover:shadow-lg transition-all">
				<CardHeader className="p-0">
					<div className="relative aspect-4/3 bg-muted overflow-hidden">
						<div className="absolute inset-0 bg-linear-to-br from-primary/20 to-primary/5 flex items-center justify-center">
							<p className="text-muted-foreground font-display text-sm px-4 text-center">
								{product.name}
							</p>
						</div>
					</div>
				</CardHeader>

				<CardContent className="p-6 space-y-3">
					<h3 className="font-display font-normal text-lg line-clamp-2 group-hover:text-primary transition-colors">
						{product.name}
					</h3>

					{product.shortDescription && (
						<p className="text-sm text-muted-foreground font-display font-light line-clamp-2">
							{product.shortDescription}
						</p>
					)}
				</CardContent>

				<CardFooter className="p-6 pt-0 flex flex-col gap-3">
					{product.priceNote && (
						<p className="text-sm font-display font-medium text-primary w-full">
							{product.priceNote}
						</p>
					)}

					<Button
						variant="outline"
						className="w-full rounded-full"
						onClick={(e) => {
							e.preventDefault();
							console.log("Request quote:", product.id);
						}}
					>
						Request Quote
					</Button>
				</CardFooter>
			</Card>
		</Link>
	);
}