// src/app/(website)/calculator/_components/product/ModelCard.tsx
"use client";

import Image from "next/image";
import { formatEUR } from "../../_hooks/useQuoteEstimate";
import { useUnitConverter } from "../../_context/UnitContext";

interface ModelCardProps {
	id: string;
	name: string;
	description: string;
	categoryName?: string; // e.g., "E Models"
	image: string;
	baseRatePerM2: number;
	isSelected?: boolean;
	onClick?: () => void;
}

export function ModelCard({
	id,
	name,
	description,
	categoryName,
	image,
	baseRatePerM2,
	isSelected = false,
	onClick,
}: ModelCardProps) {
	const { unit } = useUnitConverter();

	// Convert €/m² to $/ft² for US users
	const displayRate = unit === "inch"
		? Math.round(baseRatePerM2 * 0.0929 * 1.1) // Rough conversion + USD rate
		: baseRatePerM2;

	const currency = unit === "inch" ? "$" : "€";
	const areaUnit = unit === "inch" ? "ft²" : "m²";

	return (
		<button
			onClick={onClick}
			className={`group relative overflow-hidden rounded-xl border-2 transition-all duration-300 text-left w-full bg-neutral-950 ${isSelected
					? "border-primary ring-2 ring-primary/20 scale-[1.02]"
					: "border-neutral-800 hover:border-primary/50 hover:shadow-xl"
				}`}
		>
			{/* Image Container */}
			<div className="relative aspect-[4/3] overflow-hidden">
				<Image
					src={image}
					alt={name}
					fill
					className="object-cover transition-transform duration-500 group-hover:scale-110"
					sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
				/>

				{/* Gradient overlay - expands on hover */}
				<div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-neutral-950 transition-all duration-300 group-hover:via-neutral-950/50" />

				{/* Price badge - top left */}
				<div className="absolute top-3 left-3 px-3 py-1.5 bg-neutral-950/90 backdrop-blur-sm rounded-lg border border-neutral-800">
					<p className="text-xs font-display font-medium text-white">
						From {currency}{displayRate}/{areaUnit}
					</p>
				</div>

				{/* Selected indicator - top right */}
				{isSelected && (
					<div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center z-10 shadow-lg">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="16"
							height="16"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="3"
							strokeLinecap="round"
							strokeLinejoin="round"
						>
							<path d="M20 6 9 17l-5-5" />
						</svg>
					</div>
				)}

				{/* Content overlay - bottom */}
				<div className="absolute bottom-0 left-0 right-0 p-4 space-y-2">
					{/* Category pill */}
					{categoryName && (
						<div className="inline-flex items-center px-2 py-1 bg-neutral-950/80 backdrop-blur-sm rounded-full border border-neutral-800">
							<span className="text-xs font-display font-light text-neutral-400">
								{categoryName}
							</span>
						</div>
					)}

					{/* Title */}
					<h3 className={`text-lg font-display font-medium text-white transition-colors ${isSelected ? "text-primary" : "group-hover:text-primary"
						}`}>
						{name}
					</h3>

					{/* Description - hidden by default, shows on hover */}
					<p className="text-sm text-neutral-400 font-display font-light line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 max-h-0 group-hover:max-h-20">
						{description}
					</p>
				</div>
			</div>
		</button>
	);
}