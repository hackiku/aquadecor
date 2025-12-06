// src/components/shop/category/CategoryCard.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

interface CategoryCardProps {
	id: string;
	slug: string;
	name: string | null;
	description: string | null;
	modelCode?: string | null;
	productLineSlug: string;
	heroImageUrl?: string | null;
	productCount?: number;
}

export function CategoryCard({
	id,
	slug,
	name,
	description,
	modelCode,
	productLineSlug,
	heroImageUrl,
	productCount
}: CategoryCardProps) {
	// Fallback image based on product line
	const categoryImage = heroImageUrl || (productLineSlug === "3d-backgrounds"
		? "/media/images/3d-backgrounds_500px.webp"
		: "/media/images/additional-items_500px.webp");

	return (
		<Link
			href={`/shop/${productLineSlug}/${slug}`}
			className="group flex-shrink-0 w-full max-w-[380px]"
		>
			<div className="h-full bg-card dark:bg-neutral-950 rounded-xl overflow-hidden border-2 border-border hover:border-primary/50 transition-all duration-300 hover:shadow-2xl hover:scale-[1.02]">
				{/* Image Container */}
				<div className="relative aspect-[4/3] overflow-hidden">
					<Image
						src={categoryImage}
						alt={name || slug}
						fill
						className="object-cover transition-transform duration-500 group-hover:scale-110"
						sizes="(max-width: 768px) 100vw, 380px"
					/>

					{/* Gradient overlay */}
					<div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-background/95 dark:to-neutral-950 transition-all duration-300" />

					{/* Top badges row */}
					<div className="absolute top-3 left-3 right-3 flex items-start justify-between gap-2">
						{/* Model code badge */}
						{modelCode && (
							<div className="px-3 py-1.5 bg-background/90 dark:bg-neutral-950/90 backdrop-blur-sm rounded-lg border border-border">
								<span className="text-xs font-display font-medium text-foreground">
									{modelCode} Series
								</span>
							</div>
						)}

						{/* Product count badge */}
						{productCount !== undefined && (
							<div className="px-3 py-1.5 bg-background/90 dark:bg-neutral-950/90 backdrop-blur-sm rounded-lg border border-border">
								<span className="text-xs font-display font-medium text-muted-foreground">
									{productCount} {productCount === 1 ? 'product' : 'products'}
								</span>
							</div>
						)}

						{/* Spacer */}
						<div className="flex-1" />

						{/* Arrow indicator */}
						<motion.div
							whileHover={{ scale: 1.1 }}
							transition={{ duration: 0.2 }}
							className="w-8 h-8 rounded-full bg-background/90 dark:bg-neutral-950/90 backdrop-blur-sm border border-border flex items-center justify-center transition-all duration-300 group-hover:border-primary group-hover:bg-primary"
						>
							<ArrowRight className="h-4 w-4 text-foreground group-hover:text-primary-foreground" />
						</motion.div>
					</div>

					{/* Content overlay - bottom */}
					<div className="absolute bottom-0 left-0 right-0 p-5 overflow-hidden">
						{/* Title - slides up on hover */}
						<h4 className="text-xl md:text-2xl font-display font-medium text-foreground transition-all duration-300 group-hover:text-primary group-hover:-translate-y-2">
							{name || slug}
						</h4>

						{/* Description - revealed when title slides up */}
						{description && (
							<p className="text-sm text-muted-foreground font-display font-light line-clamp-2 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
								{description}
							</p>
						)}
					</div>
				</div>
			</div>
		</Link>
	);
}