// src/app/(website)/calculator/_components/sticky/StickyCalculator.tsx
"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { AquariumScene } from "../../_world/AquariumScene";
import { PriceBreakdown } from "./PriceBreakdown";
import { UnitToggle } from "../dimensions/UnitToggle";
import { useCalculatorLayout } from "../../_context/CalculatorLayoutContext";
import { Minimize2, Maximize2, Cuboid } from "lucide-react";
import type { Dimensions, PriceEstimate, SidePanelsType } from "../../calculator-types";

interface StickyCalculatorProps {
	dimensions: Dimensions;
	estimate: PriceEstimate;
	backgroundTexture?: string;
	subcategoryTexture?: string;
	sidePanels?: SidePanelsType;
	sidePanelWidth?: number;
	hasSubcategory?: boolean;
}

export function StickyCalculator({
	dimensions,
	estimate,
	backgroundTexture,
	subcategoryTexture,
	sidePanels = "none",
	sidePanelWidth = 40,
	hasSubcategory = false,
}: StickyCalculatorProps) {
	const { isCalculatorExpanded, setIsCalculatorExpanded } = useCalculatorLayout();

	// Cleanup on unmount
	useEffect(() => {
		return () => setIsCalculatorExpanded(false);
	}, [setIsCalculatorExpanded]);

	const containerVariants = {
		minimized: {
			position: "fixed" as const,
			bottom: "1rem",
			right: "1rem",
			width: "12rem",
			height: "8rem",
			borderRadius: "1rem",
			zIndex: 40,
		},
		expanded: {
			position: "fixed" as const,
			top: "5rem",
			right: "0",
			bottom: "0",
			width: "28rem",
			height: "auto",
			borderRadius: "1rem 0 0 1rem",
			zIndex: 40,
		},
	};

	return (
		<>
			{/* DESKTOP EXPANDED SIDEBAR */}
			<motion.aside
				initial="minimized"
				animate={isCalculatorExpanded ? "expanded" : "minimized"}
				variants={containerVariants}
				transition={{ type: "spring", stiffness: 300, damping: 30 }}
				className="hidden lg:flex bg-card shadow-2xl overflow-hidden border border-primary/20 flex-col will-change-[width,height,transform]"
			>
				{isCalculatorExpanded ? (
					// EXPANDED STATE
					<>
						{/* 3D Scene Container */}
						<div className="relative h-[340px] w-full shrink-0 bg-gradient-to-b from-background to-accent/5">
							<div className="w-full h-full">
								<AquariumScene
									width={dimensions.width}
									height={dimensions.height}
									depth={dimensions.depth}
									showControls={false} // We handle controls externally now
									backgroundTexture={backgroundTexture}
									subcategoryTexture={subcategoryTexture}
									sidePanels={sidePanels}
									sidePanelWidth={sidePanelWidth}
									isEmpty={!hasSubcategory}
								/>
							</div>

							{/* Unit Toggle - Top Right */}
							<div className="absolute top-2 right-4 z-10">
								<UnitToggle />
							</div>

							{/* Minimize Button - Bottom Right */}
							<button
								onClick={() => setIsCalculatorExpanded(false)}
								className="absolute bottom-3 right-3 p-2 rounded-lg bg-black/70 backdrop-blur-sm border border-white/10 hover:bg-black/80 transition-colors z-20 text-white"
								aria-label="Minimize calculator"
							>
								<Minimize2 className="w-4 h-4" />
							</button>
						</div>

						{/* Scrollable Price Details */}
						<div className="flex-1 overflow-y-auto custom-scrollbar bg-card min-h-0">
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
					</>
				) : (
					// MINIMIZED STATE (Static Preview)
					<div
						className="w-full h-full flex flex-col items-center justify-center p-4 text-center group cursor-pointer hover:bg-accent/20 transition-colors"
						onClick={() => setIsCalculatorExpanded(true)}
					>
						<div className="p-3 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors mb-2">
							<Cuboid className="w-6 h-6 text-primary" />
						</div>
						<div>
							<p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Estimate</p>
							<p className="text-xl font-bold font-display">€{estimate.total}</p>
						</div>

						{/* Expand Hint */}
						<button
							className="absolute bottom-2 right-2 p-1.5 rounded bg-background/90 border border-primary/20 opacity-0 group-hover:opacity-100 transition-opacity"
							aria-label="Expand calculator"
						>
							<Maximize2 className="w-3 h-3 text-primary" />
						</button>
					</div>
				)}
			</motion.aside>

			{/* MOBILE BOTTOM SHEET */}
			{isCalculatorExpanded && (
				<motion.div
					initial={{ y: "100%" }}
					animate={{ y: 0 }}
					exit={{ y: "100%" }}
					transition={{ type: "spring", stiffness: 300, damping: 30 }}
					className="lg:hidden fixed inset-x-0 bottom-0 z-40 bg-card rounded-t-2xl shadow-2xl border-t border-primary/20 flex flex-col"
					style={{ height: "75vh", maxHeight: "75vh" }}
				>
					{/* 3D Scene - Top Half */}
					<div className="relative h-[45%] shrink-0 bg-gradient-to-b from-background to-accent/5">
						<AquariumScene
							width={dimensions.width}
							height={dimensions.height}
							depth={dimensions.depth}
							showControls={false}
							backgroundTexture={backgroundTexture}
							subcategoryTexture={subcategoryTexture}
							sidePanels={sidePanels}
							sidePanelWidth={sidePanelWidth}
							isEmpty={!hasSubcategory}
						/>

						{/* Close Button - Top Right */}
						<button
							onClick={() => setIsCalculatorExpanded(false)}
							className="absolute top-3 right-3 p-2 rounded-lg bg-black/70 backdrop-blur-sm border border-white/10 active:bg-black/80 transition-colors z-20 text-white"
							aria-label="Close calculator"
						>
							<Minimize2 className="w-4 h-4" />
						</button>
					</div>

					{/* Price Summary Header */}
					<div className="shrink-0 border-b bg-card px-4 py-3">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-xs text-muted-foreground">Total Estimate</p>
								<p className="text-2xl font-bold text-primary">€{estimate.total}</p>
							</div>
							<UnitToggle />
						</div>
					</div>

					{/* Scrollable Details - Bottom Half */}
					<div className="flex-1 overflow-y-auto custom-scrollbar bg-card min-h-0">
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
				</motion.div>
			)}
		</>
	);
}