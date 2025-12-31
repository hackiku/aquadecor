// src/app/(website)/calculator/_context/CalculatorLayoutContext.tsx
"use client";

import { createContext, useContext, useRef } from "react";
import type { QuoteConfig, PriceEstimate } from "../calculator-types";

interface CalculatorLayoutContextType {
	isCalculatorExpanded: boolean;
	setIsCalculatorExpanded: (expanded: boolean) => void;

	// NEW: A ref to track if we've already auto-expanded once
	hasAutoExpanded: React.MutableRefObject<boolean>;

	isQuoteModalOpen: boolean;
	openQuoteModal: () => void;
	closeQuoteModal: () => void;
	config: QuoteConfig | null;
	setConfig: (config: QuoteConfig) => void;
	estimate: PriceEstimate | null;
	setEstimate: (estimate: PriceEstimate) => void;
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