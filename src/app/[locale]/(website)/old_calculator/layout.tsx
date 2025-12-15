// src/app/(website)/calculator/layout.tsx
"use client";

import { motion } from "framer-motion";
import { useState, type ReactNode } from "react";
import { UnitProvider } from "./_context/UnitContext";
import { CalculatorLayoutContext } from "./_context/CalculatorLayoutContext";
import { ProgressBar } from "./_components/sticky/ProgressBar";
import { StickyCalculator } from "./_components/sticky/StickyCalculator";
import { QuoteModal } from "./_components/quote/QuoteModal";
import type { QuoteConfig, PriceEstimate } from "./calculator-types";

export default function CalculatorLayout({ children }: { children: ReactNode }) {
	const [isCalculatorExpanded, setIsCalculatorExpanded] = useState(false);
	const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
	const [config, setConfig] = useState<QuoteConfig | null>(null);
	const [estimate, setEstimate] = useState<PriceEstimate | null>(null);
	const [completionPercent, setCompletionPercent] = useState(0);

	const handleQuoteSubmit = async (data: { name: string; email: string; notes?: string }) => {
		console.log("Quote submission:", { config, estimate, ...data });
		// TODO: await api.calculator.createQuote.mutate({ ...config, ...data });
		setIsQuoteModalOpen(false);
		alert("Quote request submitted! We'll email you within 24 hours.");
	};

	const handleDepositPayment = async (data: { name: string; email: string; notes?: string }) => {
		console.log("Deposit payment:", { config, estimate, ...data });
		// TODO: Redirect to Stripe checkout with deposit amount
		// const depositAmount = Math.round(estimate.total * 0.3);
		// window.location.href = `/api/checkout?amount=${depositAmount}&...`;
		alert("Redirecting to payment...");
	};

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

				{/* Progress Bar - only shows when config exists */}
				{config?.modelCategory && (
					<ProgressBar completionPercent={completionPercent} />
				)}

				{/* Sticky Calculator - only shows when config exists */}
				{config?.modelCategory && estimate && (
					<StickyCalculator
						dimensions={config.dimensions}
						estimate={estimate}
						backgroundTexture={config.modelCategory} // Pass category for texture lookup
						subcategoryTexture={config.subcategory ?? undefined} // Convert null to undefined
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