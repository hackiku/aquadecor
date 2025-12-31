// src/app/(website)/calculator/_components/sticky/StickyCalculator.tsx
"use client";

import { useEffect, useState } from "react";
import { AquariumScene } from "../../_world/AquariumScene";
import { AquariumSceneCollapsed } from "../../_world/AquariumSceneCollapsed";
import { PriceBreakdown } from "./PriceBreakdown";
import { UnitToggle } from "../dimensions/UnitToggle";
import { useCalculatorLayout } from "../../_context/CalculatorLayoutContext";
import { ChevronUp, ChevronDown, Maximize2 } from "lucide-react";
import type { Dimensions, PriceEstimate, SidePanelsType } from "../../calculator-types";
import { cn } from "~/lib/utils";

interface StickyCalculatorProps {
	dimensions: Dimensions;
	estimate: PriceEstimate;
	sidePanels?: SidePanelsType;
	sidePanelWidth?: number;
	hasSubcategory?: boolean;
	isVisible?: boolean; // Controls whether calculator is shown at all
}

export function StickyCalculator({
	dimensions,
	estimate,
	sidePanels = "none",
	sidePanelWidth = 40,
	hasSubcategory = false,
	isVisible = true,
}: StickyCalculatorProps) {
	const { isCalculatorExpanded, setIsCalculatorExpanded } = useCalculatorLayout();
	const [mobileDetailsOpen, setMobileDetailsOpen] = useState(false);

	// Cleanup on unmount
	useEffect(() => {
		return () => setIsCalculatorExpanded(false);
	}, [setIsCalculatorExpanded]);

	// Don't render anything if not visible (but keep component mounted!)
	if (!isVisible) {
		return null;
	}

	return (
		<>
			{/* EXPANDED SIDEBAR */}
			{isCalculatorExpanded && (
				<aside
					className={cn(
						"fixed top-20 right-0 bottom-0 w-[400px] bg-card shadow-2xl border-l border-primary/20 flex flex-col z-40",
						"max-lg:top-auto max-lg:left-0 max-lg:w-full max-lg:h-[70vh] max-lg:rounded-t-2xl"
					)}
				>
					{/* SCENE CONTAINER */}
					<div
						className={cn(
							"relative bg-gradient-to-b from-background to-accent/5",
							"lg:h-[340px] w-full shrink-0",
							"max-lg:flex-1 max-lg:min-h-0"
						)}
					>
						<div className="w-full h-full animate-in fade-in duration-700">
							<AquariumScene
								width={dimensions.width}
								height={dimensions.height}
								depth={dimensions.depth}
								hasBackground={hasSubcategory}
								sidePanels={sidePanels}
								sidePanelWidth={sidePanelWidth}
								showControls={true}
								showDimensions={true}
								showStats={true}
								cameraPreset="default"
							/>
						</div>

						{/* Unit Toggle */}
						<div className="absolute top-2 left-2 z-10 hidden lg:block">
							<UnitToggle />
						</div>

						{/* Minimize Button - Always visible, outside canvas */}
						<button
							onClick={() => setIsCalculatorExpanded(false)}
							className="absolute top-2 right-2 p-2 rounded-lg bg-background/80 backdrop-blur-sm border hover:bg-background transition-colors z-20 shadow-lg"
							title="Minimize preview"
						>
							<ChevronDown className="w-4 h-4" />
						</button>
					</div>

					{/* DETAILS PANEL */}
					<div className="flex-1 bg-card flex flex-col min-h-0 relative z-10 animate-in slide-in-from-bottom-10 duration-500">
						{/* MOBILE HEADER */}
						<div className="lg:hidden shrink-0 border-t bg-card">
							<button
								onClick={() => setMobileDetailsOpen(!mobileDetailsOpen)}
								className="w-full px-4 py-3 flex items-center justify-between border-b active:bg-accent/5"
							>
								<div className="text-left">
									<p className="text-xs text-muted-foreground">Total Estimate</p>
									<p className="text-xl font-bold text-primary">€{estimate.total}</p>
								</div>
								<div className="flex items-center gap-2 text-sm text-muted-foreground">
									{mobileDetailsOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
								</div>
							</button>
						</div>

						{/* CONTENT */}
						<div
							className={cn(
								"overflow-y-auto custom-scrollbar",
								"lg:flex-1 lg:h-auto lg:block",
								mobileDetailsOpen ? "max-lg:h-64" : "max-lg:h-0"
							)}
						>
							<div className="p-4 space-y-4">
								<PriceBreakdown estimate={estimate} />

								<div className="p-3 bg-accent/5 rounded-xl border flex items-center gap-3">
									<div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
										<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary">
											<path d="M20 6 9 17l-5-5" />
										</svg>
									</div>
									<div>
										<p className="text-xs font-medium">Free Shipping</p>
										<p className="text-[10px] text-muted-foreground">10-12 day production</p>
									</div>
								</div>
							</div>
						</div>
					</div>
				</aside>
			)}

			{/* COLLAPSED BOTTOM-RIGHT PREVIEW */}
			{!isCalculatorExpanded && (
				<button
					onClick={() => setIsCalculatorExpanded(true)}
					className="fixed bottom-4 right-4 w-[160px] h-[160px] bg-card shadow-2xl rounded-xl border-2 border-primary/20 hover:border-primary/40 transition-all z-40 overflow-hidden group"
				>
					{/* 3D Scene Preview */}
					<div className="absolute inset-0">
						<AquariumSceneCollapsed
							width={dimensions.width}
							height={dimensions.height}
							depth={dimensions.depth}
							hasBackground={hasSubcategory}
							sidePanels={sidePanels}
							sidePanelWidth={sidePanelWidth}
						/>
					</div>

					{/* Price Badge Overlay */}
					<div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
						<p className="text-xl font-bold text-white text-center">€{estimate.total}</p>
					</div>

					{/* Expand Icon Hint */}
					<div className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity">
						<Maximize2 className="w-3 h-3 text-white" />
					</div>
				</button>
			)}
		</>
	);
}