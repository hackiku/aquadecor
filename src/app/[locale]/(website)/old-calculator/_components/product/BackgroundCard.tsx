// src/app/(website)/calculator/_components/product/BackgroundCard.tsx
"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { cn } from "~/lib/utils";
import { Badge } from "~/components/ui/badge";
import { Check } from "lucide-react";

interface BackgroundCardProps {
	id: string;
	name: string;
	description: string;
	image: string;
	modelCode?: string; // e.g. "A Models" or "E-3"
	pricePerM2?: number;
	isSelected?: boolean;
	onClick?: () => void;
}

export function BackgroundCard({
	id,
	name,
	description,
	image,
	modelCode,
	isSelected = false,
	onClick,
}: BackgroundCardProps) {
	return (
		<div
			onClick={onClick}
			className={cn(
				"group relative flex h-[300px] w-full cursor-pointer flex-col overflow-hidden rounded-2xl border-2 bg-black shadow-sm transition-all",
				isSelected
					? "border-primary ring-2 ring-primary/20 scale-[1.02]"
					: "border-border hover:border-primary/50 hover:shadow-xl"
			)}
		>
			{/* Image Layer */}
			<div className="absolute inset-0 z-0 h-full w-full">
				<Image
					src={image}
					alt={name}
					fill
					className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
					sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
				/>

				{/* Gradient: Bottom-up for text readability */}
				<div className="absolute bottom-0 left-0 right-0 h-3/4 bg-gradient-to-t from-black/95 via-black/60 to-transparent" />

				{/* Selected Overlay Tint */}
				{isSelected && <div className="absolute inset-0 bg-primary/10 _backdrop-blur-[1px]" />}
			</div>

			{/* Top Badges */}
			<div className="relative z-20 flex w-full items-start justify-between p-4">
				{/* Selection Indicator */}
				<div className={cn(
					"flex h-8 w-8 items-center justify-center rounded-full border transition-all duration-300",
					isSelected
						? "bg-primary border-primary text-white"
						: "bg-black/40 border-white/20 text-transparent group-hover:border-white/50"
				)}>
					<Check className="h-4 w-4" />
				</div>

				{/* Model Code / SKU Badge */}
				{modelCode && (
					<Badge className="bg-primary text-primary-foreground text-sm font-display font-medium shadow-lg border-none px-3 py-1">
						{modelCode}
					</Badge>
				)}
			</div>

			{/* Spacer */}
			<div className="flex-1" />

			{/* Content Layer */}
			<div className="relative z-20 p-6">
				<motion.div
					initial="idle"
					whileHover="hover"
					animate={isSelected ? "idle" : "idle"} // Keep expanded if selected
					className="space-y-2"
				>
					{/* Header Row */}
					<motion.div
						className="flex items-end justify-between gap-4"
						variants={{
							idle: { y: 0 },
							hover: { y: -5 }
						}}
						transition={{ duration: 0.3, ease: "easeOut" }}
					>
						<h3 className={cn(
							"font-display text-2xl leading-tight drop-shadow-md transition-colors",
							isSelected ? "text-primary font-normal" : "text-white font-thin group-hover:font-extralight"
						)}>
							{name}
						</h3>
					</motion.div>

					{/* Description Reveal */}
					<motion.div
						className="overflow-hidden"
						variants={{
							idle: { height: "0px", opacity: 0 },
							hover: { height: "auto", opacity: 1 }
						}}
						transition={{ duration: 0.3 }}
					>
						<p className="font-display text-sm font-light leading-relaxed text-gray-300 line-clamp-3">
							{description}
						</p>
					</motion.div>
				</motion.div>
			</div>
		</div>
	);
}