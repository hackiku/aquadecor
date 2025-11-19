// src/app/(website)/calculator/_components/sticky/StickyPanel.tsx

"use client";

import { useState } from "react";
import { AquariumScene } from "../../_world/AquariumScene";
import { PriceBreakdown } from "./PriceBreakdown";
import type { Dimensions, PriceEstimate, Unit } from "../../calculator-types";

interface StickyPanelProps {
	dimensions: Dimensions;
	unit: Unit;
	estimate: PriceEstimate;
	onUnitToggle: (unit: Unit) => void;
	onDimensionsChange: (dimensions: Dimensions) => void;
}

export function StickyPanel({
	dimensions,
	unit,
	estimate,
	onUnitToggle,
}: StickyPanelProps) {
	const [isMinimized, setIsMinimized] = useState(false);

	// Minimized view - floating bottom-right
	if (isMinimized) {
		return (
			<button
				onClick={() => setIsMinimized(false)}
				className="fixed bottom-6 right-6 z-50 group"
			>
				{/* Minimized preview */}
				<div className="relative w-32 h-32 rounded-2xl overflow-hidden border-2 border-primary/50 shadow-2xl transition-all duration-300 hover:scale-110 hover:border-primary">
					{/* Tiny 3D scene */}
					<div className="w-full h-full">
						<AquariumScene {...dimensions} />
					</div>

					{/* Overlay with expand hint */}
					<div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="32"
							height="32"
							viewBox="0 0 24 24"
							fill="none"
							stroke="white"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
						>
							<path d="M21 21H3V3h5.5M21 3h-7.5M21 3v7.5" />
							<path d="M21 3L9 15" />
						</svg>
					</div>

					{/* Price badge */}
					<div className="absolute bottom-2 left-2 right-2 px-2 py-1 bg-black/80 backdrop-blur-sm rounded-lg">
						<p className="text-xs text-primary font-display font-bold text-center">
							€{estimate.total}
						</p>
					</div>
				</div>
			</button>
		);
	}

	// Full expanded view - sticky sidebar
	return (
		<aside className="space-y-4">
			<div className="sticky top-24 space-y-4 max-h-[calc(100vh-7rem)] overflow-y-auto">
				{/* Unit Toggle (compact) */}
				<div className="flex items-center justify-between px-3 py-2 bg-card/50 backdrop-blur-sm border rounded-lg">
					<span className="text-xs font-display font-light text-muted-foreground">
						Unit
					</span>
					<div className="flex items-center gap-1">
						<button
							onClick={() => onUnitToggle("cm")}
							className={`px-2 py-1 rounded text-xs font-display font-medium transition-all ${unit === "cm"
									? "bg-primary text-white"
									: "bg-muted/50 text-muted-foreground hover:bg-muted"
								}`}
						>
							cm
						</button>
						<button
							onClick={() => onUnitToggle("inch")}
							className={`px-2 py-1 rounded text-xs font-display font-medium transition-all ${unit === "inch"
									? "bg-primary text-white"
									: "bg-muted/50 text-muted-foreground hover:bg-muted"
								}`}
						>
							in
						</button>
					</div>
				</div>

				{/* 3D Aquarium Scene - Fixed height */}
				<div className="relative rounded-xl overflow-hidden border bg-gradient-to-b from-background to-accent/5">
					<div className="h-[350px]">
						<AquariumScene
							width={dimensions.width}
							height={dimensions.height}
							depth={dimensions.depth}
						/>
					</div>

					{/* Minimize button - bottom right */}
					<button
						onClick={() => setIsMinimized(true)}
						className="absolute bottom-3 right-3 p-1.5 rounded-lg bg-black/70 backdrop-blur-sm border border-white/10 hover:bg-black/80 transition-colors z-10"
						title="Minimize"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="14"
							height="14"
							viewBox="0 0 24 24"
							fill="none"
							stroke="white"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
						>
							<path d="M3 15h7.5M3 15v7.5M3 15L9 21" />
							<path d="M21 9h-7.5M21 9V1.5M21 9l-6-6" />
						</svg>
					</button>
				</div>

				{/* Price Breakdown */}
				<PriceBreakdown estimate={estimate} />

				{/* Trust Badge (compact) */}
				<div className="px-3 py-2 bg-accent/5 rounded-lg border">
					<div className="flex items-center gap-2">
						<div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="14"
								height="14"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
								className="text-primary"
							>
								<path d="M20 6 9 17l-5-5" />
							</svg>
						</div>
						<div className="space-y-0">
							<p className="text-xs font-display font-medium">Free Shipping</p>
							<p className="text-[10px] text-muted-foreground font-display font-light">
								10-12 day production
							</p>
						</div>
					</div>
				</div>
			</div>
		</aside>
	);
}