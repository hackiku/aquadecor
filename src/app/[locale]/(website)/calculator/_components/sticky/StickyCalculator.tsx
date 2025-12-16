// src/app/(website)/calculator/_components/sticky/StickyCalculator.tsx
"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AquariumScene } from "../../_world/AquariumScene";
import { PriceBreakdown } from "./PriceBreakdown";
import { UnitToggle } from "../dimensions/UnitToggle";
import { useCalculatorLayout } from "../../_context/CalculatorLayoutContext";
import { ChevronUp, ChevronDown, Minimize2, Maximize2, Cuboid } from "lucide-react";
import type { Dimensions, PriceEstimate, SidePanelsType } from "../../calculator-types";
import { cn } from "~/lib/utils";

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
	const [mobileDetailsOpen, setMobileDetailsOpen] = useState(false);

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
			height: "8rem", // Smaller, compact preview
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
		<motion.aside
			initial="minimized"
			animate={isCalculatorExpanded ? "expanded" : "minimized"}
			variants={containerVariants}
			transition={{ type: "spring", stiffness: 300, damping: 30 }}
			className={cn(
				"bg-card shadow-2xl overflow-hidden border border-primary/20 flex flex-col will-change-[width,height,transform]",
				// Mobile override: Bottom Sheet
				isCalculatorExpanded && "lg:block max-lg:!top-auto max-lg:!right-0 max-lg:!left-0 max-lg:!bottom-0 max-lg:!w-full max-lg:!h-[65vh] max-lg:!rounded-t-2xl max-lg:!rounded-b-none"
			)}
		>
			{/* 1. SCENE CONTAINER */}
			<div
				className={cn(
					"relative bg-linear-to-b from-background to-accent/5 transition-all duration-500",
					!isCalculatorExpanded && "h-full w-full bg-accent/10 hover:bg-accent/20 cursor-pointer", // Hover effect when minimized
					isCalculatorExpanded && "lg:h-[340px] w-full shrink-0",
					isCalculatorExpanded && "max-lg:flex-1 max-lg:min-h-0"
				)}
				onClick={() => !isCalculatorExpanded && setIsCalculatorExpanded(true)}
			>
				{/* CONTENT SWITCHER: Only render 3D when Expanded */}
				{isCalculatorExpanded ? (
					// --- EXPANDED STATE (3D SCENE) ---
					<>
						<div className="w-full h-full animate-in fade-in duration-700">
							<AquariumScene
								width={dimensions.width}
								height={dimensions.height}
								depth={dimensions.depth}
								showControls={true}
								backgroundTexture={backgroundTexture}
								subcategoryTexture={subcategoryTexture}
								sidePanels={sidePanels}
								sidePanelWidth={sidePanelWidth}
								isEmpty={!hasSubcategory}
							/>
						</div>

						{/* Expanded Controls */}
						<div className="absolute top-0 right-0 -mt-2 mr-4 z-10 hidden lg:block">
							<UnitToggle />
						</div>
						<button
							onClick={(e) => { e.stopPropagation(); setIsCalculatorExpanded(false); }}
							className="absolute bottom-3 right-3 p-2 rounded-lg bg-black/70 backdrop-blur-sm border border-white/10 hover:bg-black/80 transition-colors z-20 text-white"
						>
							<Minimize2 className="w-4 h-4" />
						</button>
					</>
				) : (
					// --- MINIMIZED STATE (STATIC PREVIEW) ---
					<div className="w-full h-full flex flex-col items-center justify-center p-4 text-center group">
						<div className="p-3 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors mb-2">
							<Cuboid className="w-6 h-6 text-primary" />
						</div>
						<div>
							<p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Estimate</p>
							<p className="text-xl font-bold font-display">€{estimate.total}</p>
						</div>

						{/* Hint Overlay */}
						<div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
							<div className="bg-background/90 backdrop-blur text-xs px-2 py-1 rounded shadow">
								Click to View 3D
							</div>
						</div>
					</div>
				)}
			</div>

			{/* 2. DETAILS PANEL (Expanded Only) */}
			{isCalculatorExpanded && (
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
									<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary"><path d="M20 6 9 17l-5-5" /></svg>
								</div>
								<div>
									<p className="text-xs font-medium">Free Shipping</p>
									<p className="text-[10px] text-muted-foreground">10-12 day production</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			)}
		</motion.aside>
	);
}