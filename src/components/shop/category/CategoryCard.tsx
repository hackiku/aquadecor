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
	productLineSlug: string;
	image?: string;
	productCount?: number;
}

// Extract model prefix like "A Models", "D Models" etc.
function extractModelPrefix(name: string | null): { prefix: string | null; cleanName: string } {
	if (!name) return { prefix: null, cleanName: name || "" };

	const modelPattern = /^([A-Z]\s+Models|Slim\s+Models)\s*-\s*/i;
	const match = name.match(modelPattern);

	if (match) {
		return {
			prefix: match[1]!.trim(),
			cleanName: name.replace(modelPattern, "").trim()
		};
	}

	return { prefix: null, cleanName: name };
}

export function CategoryCard({ id, slug, name, description, productLineSlug, image, productCount }: CategoryCardProps) {
	const { prefix, cleanName } = extractModelPrefix(name);

	// Fallback image based on product line
	const categoryImage = image || (productLineSlug === "3d-backgrounds"
		? "/media/images/3d-backgrounds_500px.webp"
		: "/media/images/additional-items_500px.webp");

	return (
		<Link
			href={`/shop/${productLineSlug}/${slug}`}
			className="group flex-shrink-0 w-[320px] md:w-[380px]"
		>
			<div className="h-full bg-neutral-950 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-[1.02]">
				{/* Image Container */}
				<div className="relative aspect-[4/3] overflow-hidden">
					<Image
						src={categoryImage}
						alt={cleanName || slug}
						fill
						className="object-cover transition-transform duration-500 group-hover:scale-110"
						sizes="(max-width: 768px) 100vw, 380px"
					/>

					{/* Gradient overlay */}
					<div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-neutral-950 transition-all duration-300" />

					{/* Top badges row */}
					<div className="absolute top-3 left-3 right-3 flex items-start justify-between gap-2">
						{/* Model prefix badge - left */}
						{prefix && (
							<div className="px-3 py-1.5 bg-neutral-950/90 backdrop-blur-sm rounded-lg border border-neutral-800">
								<span className="text-xs font-display font-medium text-white">
									{prefix}
								</span>
							</div>
						)}

						{/* Product count badge - center-left */}
						{productCount !== undefined && (
							<div className="px-3 py-1.5 bg-neutral-950/90 backdrop-blur-sm rounded-lg border border-neutral-800">
								<span className="text-xs font-display font-medium text-white/70">
									{productCount} {productCount === 1 ? 'product' : 'products'}
								</span>
							</div>
						)}

						{/* Spacer to push arrow right */}
						<div className="flex-1" />

						{/* Arrow indicator - right */}
						<motion.div
							whileHover={{ scale: 1.1 }}
							transition={{ duration: 0.2 }}
							className="w-8 h-8 rounded-full bg-neutral-950/90 backdrop-blur-sm border border-neutral-800 flex items-center justify-center transition-all duration-300 group-hover:border-primary group-hover:bg-primary"
						>
							<ArrowRight className="h-4 w-4 text-white" />
						</motion.div>
					</div>

					{/* Content overlay - bottom with slide-up animation */}
					<div className="absolute bottom-0 left-0 right-0 p-5 overflow-hidden">
						{/* Title - slides up on hover */}
						<h4 className="text-xl md:text-2xl font-display font-medium text-white transition-all duration-300 group-hover:text-primary group-hover:-translate-y-2">
							{cleanName || slug}
						</h4>

						{/* Description - revealed when title slides up */}
						{description && (
							<p className="text-sm text-neutral-400 font-display font-light line-clamp-2 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
								{description}
							</p>
						)}
					</div>
				</div>
			</div>
		</Link>
	);
}