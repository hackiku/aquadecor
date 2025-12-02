// src/app/(website)/calculator/_components/sticky/StickyCalculator.tsx
"use client";

import { useEffect } from "react";
import { AquariumScene } from "../../_world/AquariumScene";
import { PriceBreakdown } from "./PriceBreakdown";
import { UnitToggle } from "../dimensions/UnitToggle";
import { useCalculatorLayout } from "../../layout";
import type { Dimensions, PriceEstimate } from "../../calculator-types";

interface StickyCalculatorProps {
	dimensions: Dimensions;
	estimate: PriceEstimate;
	backgroundTexture?: string;
	subcategoryTexture?: string;
}

export function StickyCalculator({
	dimensions,
	estimate,
	backgroundTexture,
	subcategoryTexture,
}: StickyCalculatorProps) {
	const { isCalculatorExpanded, setIsCalculatorExpanded } = useCalculatorLayout();

	// Cleanup on unmount
	useEffect(() => {
		return () => setIsCalculatorExpanded(false);
	}, [setIsCalculatorExpanded]);

	return (
		<>
			{/* Mini state - small preview in bottom-right corner */}
			{!isCalculatorExpanded && (
				<div className="fixed bottom-0 right-4 lg:right-8 z-40 pointer-events-auto">
					<button
						onClick={() => setIsCalculatorExpanded(true)}
						className="group relative"
					>
						{/* Mini preview container */}
						<div className="w-40 h-40 lg:w-48 lg:h-48 rounded-2xl overflow-hidden border-2 border-primary/50 shadow-2xl bg-card transition-all duration-300 hover:scale-105 hover:border-primary">
							{/* 3D Scene - smaller but visible */}
							<div className="w-full h-[70%]">
								<AquariumScene
									width={dimensions.width}
									height={dimensions.height}
									depth={dimensions.depth}
									backgroundTexture={backgroundTexture}
									subcategoryTexture={subcategoryTexture}
								/>
							</div>

							{/* Price summary at bottom */}
							<div className="absolute bottom-0 left-0 right-0 p-2 bg-card/95 backdrop-blur-sm border-t">
								<p className="text-xs font-display font-light text-muted-foreground text-center">
									Estimated Total
								</p>
								<p className="text-lg font-display font-bold text-center">
									€{estimate.total}
								</p>
							</div>
						</div>

						{/* Expand hint - shows on hover */}
						<div className="absolute inset-0 bg-black/40 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
							<div className="text-white text-center space-y-1">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="24"
									height="24"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
									className="mx-auto"
								>
									<path d="M21 21H3V3h5.5M21 3h-7.5M21 3v7.5" />
									<path d="M21 3L9 15" />
								</svg>
								<p className="text-xs font-display font-medium">Expand</p>
							</div>
						</div>
					</button>
				</div>
			)}

			{/* Full state - takes right side */}
			{isCalculatorExpanded && (
				// clear navbar & bottom sticky bar
				<aside className="fixed top-16 right-0 bottom-2 z-40 w-[28rem] pointer-events-auto">
					<div className="h-full bg-card shadow-2xl border-l-2 border-primary/20 overflow-hidden flex flex-col">
						{/* Content - fully scrollable */}
						<div className="flex-1 overflow-y-auto">
							{/* 3D Scene */}
							<div className="relative border-b bg-linear-to-b from-background to-accent/5">
								<div className="h-[320px]">
									<AquariumScene
										width={dimensions.width}
										height={dimensions.height}
										depth={dimensions.depth}
										backgroundTexture={backgroundTexture}
										subcategoryTexture={subcategoryTexture}
									/>
								</div>

								{/* Unit toggle - overlays top-right corner with negative margin */}
								<div className="absolute top-0 right-0 -mt-2 mr-4 z-10">
									<UnitToggle />
								</div>

								{/* Collapse button - overlays bottom-right corner */}
								<button
									onClick={() => setIsCalculatorExpanded(false)}
									className="absolute bottom-3 right-3 p-2 rounded-lg bg-black/70 backdrop-blur-sm border border-white/10 hover:bg-black/80 transition-colors z-10"
									aria-label="Minimize calculator"
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="16"
										height="16"
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
							<div className="p-4">
								<PriceBreakdown estimate={estimate} />
							</div>

							{/* Trust Badge */}
							<div className="px-4 pb-4">
								<div className="p-3 bg-accent/5 rounded-xl border">
									<div className="flex items-center gap-3">
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
						</div>
					</div>
				</aside>
			)}
		</>
	);
}