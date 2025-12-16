// src/app/(website)/calculator/layout.tsx
"use client";

import { motion } from "framer-motion";
import { useState, useRef } from "react";
import { UnitProvider } from "./_context/UnitContext";
import { CalculatorLayoutContext } from "./_context/CalculatorLayoutContext";
import { ProgressBar } from "./_components/sticky/ProgressBar";
import { StickyCalculator } from "./_components/sticky/StickyCalculator";
import { QuoteModal } from "./_components/quote/QuoteModal";
import type { QuoteConfig, PriceEstimate } from "./calculator-types";

export default function CalculatorLayout({ children }: { children: React.ReactNode }) {
	
	const [isCalculatorExpanded, setIsCalculatorExpanded] = useState(false);
	const hasAutoExpanded = useRef(false);

	const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
	const [config, setConfig] = useState<QuoteConfig | null>(null);
	const [estimate, setEstimate] = useState<PriceEstimate | null>(null);
	const [completionPercent, setCompletionPercent] = useState(0);

	const handleQuoteSubmit = async (data: any) => {
		console.log("Quote submission:", { config, estimate, ...data });
		setIsQuoteModalOpen(false);
		alert("Quote request submitted! We'll email you within 24 hours.");
	};

	const handleDepositPayment = async (data: any) => {
		console.log("Deposit payment:", { config, estimate, ...data });
		alert("Redirecting to payment...");
	};

	return (
		<UnitProvider>
			<CalculatorLayoutContext.Provider
				value={{
					isCalculatorExpanded,
					setIsCalculatorExpanded,
					hasAutoExpanded,
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
				{/* Main Content Area */}
				<motion.div
					animate={{
						marginRight: isCalculatorExpanded ? "28rem" : "0",
					}}
					transition={{
						duration: 0.5,
						ease: [0.32, 0.72, 0, 1],
					}}
					className="will-change-[margin-right] min-h-screen relative z-0"
				>
					{children}
				</motion.div>

				{/* Progress Bar */}
				{config?.modelCategory && (
					<ProgressBar completionPercent={completionPercent} />
				)}

				{/* The Calculator - NO TEXTURES */}
				{config?.modelCategory && estimate && (
					<StickyCalculator
						dimensions={config.dimensions}
						estimate={estimate}
						sidePanels={config.sidePanels}
						sidePanelWidth={config.sidePanelWidth}
						hasSubcategory={!!config.subcategory && config.subcategory !== "skip"}
					/>
				)}



				{/* Modal */}
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