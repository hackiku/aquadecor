// src/app/(website)/calculator/_components/sticky/StickyPanel.tsx

// Sticky panel that wraps the R3F scene and control widgets

"use client";

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
	onDimensionsChange,
}: StickyPanelProps) {
	return (
		<aside className="space-y-6">
			<div className="sticky top-24 space-y-6">
				{/* Unit Toggle */}
				<div className="flex items-center justify-between px-4 py-3 bg-card/50 backdrop-blur-sm border rounded-xl">
					<span className="text-sm font-display font-light text-muted-foreground">
						Measurement Unit
					</span>
					<div className="flex items-center gap-2">
						<button
							onClick={() => onUnitToggle("cm")}
							className={`px-3 py-1.5 rounded-lg text-sm font-display font-medium transition-all ${unit === "cm"
									? "bg-primary text-white"
									: "bg-muted/50 text-muted-foreground hover:bg-muted"
								}`}
						>
							cm
						</button>
						<button
							onClick={() => onUnitToggle("inch")}
							className={`px-3 py-1.5 rounded-lg text-sm font-display font-medium transition-all ${unit === "inch"
									? "bg-primary text-white"
									: "bg-muted/50 text-muted-foreground hover:bg-muted"
								}`}
						>
							inch
						</button>
					</div>
				</div>

				{/* 3D Aquarium Scene */}
				<div className="rounded-xl overflow-hidden border bg-linear-to-b from-background to-accent/5">
					<AquariumScene
						width={dimensions.width}
						height={dimensions.height}
						depth={dimensions.depth}
					/>
				</div>

				{/* Price Breakdown */}
				<PriceBreakdown estimate={estimate} />

				{/* Trust Badge */}
				<div className="px-4 py-3 bg-accent/5 rounded-xl border">
					<div className="flex items-center gap-3">
						<div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="20"
								height="20"
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
						<div className="space-y-0.5">
							<p className="text-sm font-display font-medium">Free Worldwide Shipping</p>
							<p className="text-xs text-muted-foreground font-display font-light">
								10-12 day production + 5-6 day delivery
							</p>
						</div>
					</div>
				</div>
			</div>
		</aside>
	);
}