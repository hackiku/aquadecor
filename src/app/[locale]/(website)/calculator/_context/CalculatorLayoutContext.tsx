// src/app/(website)/calculator/_context/CalculatorLayoutContext.tsx
"use client";

import { createContext, useContext } from "react";
import type { QuoteConfig, PriceEstimate } from "../calculator-types";

// Context to manage calculator state globally
interface CalculatorLayoutContextType {
	isCalculatorExpanded: boolean;
	setIsCalculatorExpanded: (expanded: boolean) => void;
	// Quote modal state
	isQuoteModalOpen: boolean;
	openQuoteModal: () => void;
	closeQuoteModal: () => void;
	// Calculator config for modal
	config: QuoteConfig | null;
	setConfig: (config: QuoteConfig) => void;
	estimate: PriceEstimate | null;
	setEstimate: (estimate: PriceEstimate) => void;
	// Completion percentage
	completionPercent: number;
	setCompletionPercent: (percent: number) => void;
}

export const CalculatorLayoutContext = createContext<CalculatorLayoutContextType | undefined>(undefined);

export function useCalculatorLayout() {
	const context = useContext(CalculatorLayoutContext);
	if (!context) {
		throw new Error("useCalculatorLayout must be used within CalculatorLayout");
	}
	return context;
}