// src/app/(website)/calculator/layout.tsx
"use client";

import { useState, useRef } from "react";
import { UnitProvider } from "./_context/UnitContext";
import { CalculatorLayoutContext } from "./_context/CalculatorLayoutContext";
import { ProgressBar } from "./_components/sticky/ProgressBar";
import { StickyCalculator } from "./_components/sticky/StickyCalculator";
import type { QuoteConfig, PriceEstimate } from "./calculator-types";
import { cn } from "~/lib/utils";

export default function CalculatorLayout({ children }: { children: React.ReactNode }) {

	const [isCalculatorExpanded, setIsCalculatorExpanded] = useState(false);
	const hasAutoExpanded = useRef(false);

	const [config, setConfig] = useState<QuoteConfig | null>(null);
	const [estimate, setEstimate] = useState<PriceEstimate | null>(null);
	const [completionPercent, setCompletionPercent] = useState(0);

	// Whether to show the calculator at all
	const hasModelSelected = !!config?.modelCategory && !!estimate;

	// Fallback estimate with all required fields
	const fallbackEstimate: PriceEstimate = {
		base: 0,
		flexibility: 0,
		sidePanels: 0,
		filtration: 0,
		additionalItems: 0, // Include additionalItems
		subtotal: 0,
		discount: 0,
		total: 0,
		surfaceAreaM2: 0.5,
	};

	return (
		<UnitProvider>
			<CalculatorLayoutContext.Provider
				value={{
					isCalculatorExpanded,
					setIsCalculatorExpanded,
					hasAutoExpanded,
					isQuoteModalOpen: false, // Not used anymore but keep for compatibility
					openQuoteModal: () => { }, // No-op
					closeQuoteModal: () => { }, // No-op
					config,
					setConfig,
					estimate,
					setEstimate,
					completionPercent,
					setCompletionPercent,
				}}
			>
				{/* Main Content Area */}
				<div
					className={cn(
						"min-h-screen relative z-0 transition-[margin-right] duration-500 ease-out",
						isCalculatorExpanded && hasModelSelected && "lg:mr-[400px]"
					)}
				>
					{children}
				</div>

				{/* Progress Bar */}
				{hasModelSelected && (
					<ProgressBar completionPercent={completionPercent} />
				)}

				{/* The Calculator - ALWAYS RENDERED (just hidden until model selected) */}
				<StickyCalculator
					dimensions={config?.dimensions ?? { width: 100, height: 50, depth: 40 }}
					estimate={estimate ?? fallbackEstimate}
					sidePanels={config?.sidePanels ?? "none"}
					sidePanelWidth={config?.sidePanelWidth}
					hasSubcategory={!!(config?.subcategory && config.subcategory !== "skip")}
					isVisible={hasModelSelected}
				/>
			</CalculatorLayoutContext.Provider>
		</UnitProvider>
	);
}