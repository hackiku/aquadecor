// src/app/(website)/calculator/_components/product/ModelCard.tsx
"use client";

import Image from "next/image";
import { useUnitConverter } from "../../_context/UnitContext";

interface ModelCardProps {
	id: string;
	name: string;
	description: string;
	categoryName?: string;
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

	// Convert €/m² to $/ft² for US/Imperial display (approximate visual guide)
	// Note: Actual calculation happens in useQuoteEstimate
	const displayRate = unit === "inch"
		? Math.round(baseRatePerM2 * 0.0929 * 1.1)
		: baseRatePerM2;

	const currency = unit === "inch" ? "$" : "€";
	const areaUnit = unit === "inch" ? "ft²" : "m²";

	return (
		<button
			onClick={onClick}
			className={`group relative overflow-hidden rounded-xl border-2 transition-all duration-300 text-left w-full bg-neutral-950 h-full flex flex-col ${isSelected
				? "border-primary ring-2 ring-primary/20 scale-[1.02]"
				: "border-neutral-800 hover:border-primary/50 hover:shadow-xl"
				}`}
		>
			{/* Image Container */}
			<div className="relative aspect-[4/3] w-full overflow-hidden shrink-0">
				<Image
					src={image}
					alt={name}
					fill
					className="object-cover transition-transform duration-500 group-hover:scale-110"
					sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
				/>

				{/* Gradient overlay */}
				<div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-neutral-950/90 transition-all duration-300" />

				{/* Price badge */}
				<div className="absolute top-3 left-3 px-3 py-1.5 bg-neutral-950/90 backdrop-blur-sm rounded-lg border border-neutral-800">
					<p className="text-xs font-display font-medium text-white">
						From {currency}{displayRate}/{areaUnit}
					</p>
				</div>

				{/* Selected indicator */}
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
			</div>

			{/* Content */}
			<div className="p-4 flex flex-col flex-1 space-y-2 relative">
				{categoryName && (
					<div className="inline-flex self-start px-2 py-1 bg-neutral-900/50 rounded-full border border-neutral-800 mb-1">
						<span className="text-[10px] uppercase tracking-wider font-display font-medium text-neutral-400">
							{categoryName}
						</span>
					</div>
				)}

				<h3 className={`text-lg font-display font-medium text-white transition-colors ${isSelected ? "text-primary" : "group-hover:text-primary"
					}`}>
					{name}
				</h3>

				<p className="text-sm text-neutral-400 font-display font-light line-clamp-3">
					{description}
				</p>
			</div>
		</button>
	);
}