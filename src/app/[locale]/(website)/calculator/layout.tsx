// src/app/(website)/calculator/layout.tsx
"use client";

import { motion } from "framer-motion";
import { useState, type ReactNode } from "react";
import { UnitProvider } from "./_context/UnitContext";
import { CalculatorLayoutContext } from "./_context/CalculatorLayoutContext";
import { ProgressBar } from "./_components/sticky/ProgressBar";
import { StickyCalculator } from "./_components/sticky/StickyCalculator";
import { QuoteModal } from "./_components/quote/QuoteModal";
import { getBestTextureUrl } from "./_world/textureHelpers";
import type { QuoteConfig, PriceEstimate } from "./calculator-types";

export default function CalculatorLayout({ children }: { children: ReactNode }) {
	const [isCalculatorExpanded, setIsCalculatorExpanded] = useState(false);
	const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
	const [config, setConfig] = useState<QuoteConfig | null>(null);
	const [estimate, setEstimate] = useState<PriceEstimate | null>(null);
	const [completionPercent, setCompletionPercent] = useState(0);

	const handleQuoteSubmit = async (data: { name: string; email: string; notes?: string }) => {
		console.log("Quote submission:", { config, estimate, ...data });
		setIsQuoteModalOpen(false);
		alert("Quote request submitted! We'll email you within 24 hours.");
	};

	const handleDepositPayment = async (data: { name: string; email: string; notes?: string }) => {
		console.log("Deposit payment:", { config, estimate, ...data });
		alert("Redirecting to payment...");
	};

	// Sanitize texture URLs to prevent crashes
	const safeBackgroundTexture = config?.modelCategory
		? getBestTextureUrl(
			undefined, // No subcategory yet at category level
			config.modelCategory.textureUrl || config.modelCategory.image
		)
		: undefined;

	const safeSubcategoryTexture = config?.subcategoryTexture
		? getBestTextureUrl(config.subcategoryTexture)
		: undefined;

	return (
		<UnitProvider>
			<CalculatorLayoutContext.Provider
				value={{
					isCalculatorExpanded,
					setIsCalculatorExpanded,
					isQuoteModalOpen,
					openQuoteModal: () => setIsQuoteModalOpen(true),
					closeQuoteModal: () => setIsQuoteModalOpen(false),
					config,
					setConfig,
					estimate,
					setEstimate,
					completionPercent,
					setCompletionPercent,
				}}
			>
				{/* Animated content wrapper */}
				<motion.div
					animate={{
						marginRight: isCalculatorExpanded ? "28rem" : "0",
					}}
					transition={{
						type: "spring",
						stiffness: 300,
						damping: 30,
					}}
					className="will-change-[margin]"
				>
					{children}
				</motion.div>

				{/* Progress Bar */}
				{config?.modelCategory && (
					<ProgressBar completionPercent={completionPercent} />
				)}

				{/* Sticky Calculator */}
				{config?.modelCategory && estimate && (
					<StickyCalculator
						dimensions={config.dimensions}
						estimate={estimate}
						backgroundTexture={safeBackgroundTexture}
						subcategoryTexture={safeSubcategoryTexture}
						sidePanels={config.sidePanels}
						sidePanelWidth={config.sidePanelWidth}
						hasSubcategory={!!config.subcategory && config.subcategory !== "skip"}
					/>
				)}

				{/* Quote Modal */}
				{config && estimate && (
					<QuoteModal
						config={config}
						estimate={estimate}
						isOpen={isQuoteModalOpen}
						onClose={() => setIsQuoteModalOpen(false)}
						onSubmit={handleQuoteSubmit}
						onDepositPayment={handleDepositPayment}
					/>
				)}
			</CalculatorLayoutContext.Provider>
		</UnitProvider>
	);
}