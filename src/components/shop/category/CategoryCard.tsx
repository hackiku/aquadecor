// src/components/shop/category/CategoryCard.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { cn } from "~/lib/utils";
import { Badge } from "~/components/ui/badge";

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
	slug,
	name,
	description,
	modelCode,
	productLineSlug,
	heroImageUrl,
	productCount
}: CategoryCardProps) {
	// Fallback logic
	const categoryImage = heroImageUrl || (productLineSlug === "3d-backgrounds"
		? "/media/images/3d-backgrounds_500px.webp"
		: "/media/images/additional-items_500px.webp");

	return (
		<Link
			href={`/shop/${productLineSlug}/${slug}`}
			className="group relative flex h-[380px] w-full flex-col overflow-hidden rounded-2xl border-2 border-border bg-black shadow-sm transition-all hover:border-primary/50 hover:shadow-xl"
		>
			{/* Image Layer */}
			<div className="absolute inset-0  z-0 h-full w-full">
				<Image
					src={categoryImage}
					alt={name || slug}
					fill
					className="pb-24 h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-110"
					sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
					priority={false}
				/>
				
				{/* Refined Gradient: Bottom 2/3 only, allowing top image details to shine */}
				<div className="absolute bottom-0 left-0 right-0 h-2/3 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
			</div>

			{/* Top Badges - Higher contrast & Primary Color */}
			<div className="relative z-20 flex w-full items-start justify-between p-4">
				{modelCode && (
					<Badge className="bg-primary/70 text-foreground text-sm font-display font-medium backdrop-blur-xs shadow-lg border-white/10 px-3 py-1">
						{modelCode} Series
					</Badge>
				)}

				{productCount !== undefined && (
					<Badge variant="secondary" className="ml-auto bg-black/60 text-white backdrop-blur-md border-white/10">
						{productCount} {productCount === 1 ? 'Item' : 'Items'}
					</Badge>
				)}
			</div>

			{/* Spacer to push content down */}
			<div className="flex-1" />

			{/* Content Interaction Layer */}
			<div className="relative z-20 p-6">
				<motion.div
					initial="idle"
					whileHover="hover"
					className="space-y-2"
				>
					{/* Header Row: Title + Arrow */}
					<motion.div
						className="flex items-end justify-between gap-4"
						variants={{
							idle: { y: 0 },
							hover: { y: -5 }
						}}
						transition={{ duration: 0.3, ease: "easeOut" }}
					>
						<h3 className="font-display text-2xl font-thin group-hover:font-extralight leading-tight text-white drop-shadow-md">
							{name || slug}
						</h3>

						{/* Arrow Circle */}
						<motion.div
							className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white"
							variants={{
								idle: { x: 0, backgroundColor: "rgba(255,255,255,0.1)" },
								hover: { x: 5, backgroundColor: "hsl(var(--primary))", borderColor: "hsl(var(--primary))" }
							}}
						>
							<ArrowRight className="h-5 w-5" />
						</motion.div>
					</motion.div>

					{/* Description Reveal */}
					{description && (
						<motion.div
							className="overflow-hidden"
							variants={{
								idle: { height: "24px", opacity: 0.8 }, // Show 1 line approx
								hover: { height: "auto", opacity: 1 }
							}}
							transition={{ duration: 0.3 }}
						>
							<p className={cn(
								"font-display text-sm font-light leading-relaxed text-gray-200",
								"line-clamp-1 group-hover:line-clamp-none"
							)}>
								{description}
							</p>
						</motion.div>
					)}
				</motion.div>
			</div>
		</Link>
	);
}