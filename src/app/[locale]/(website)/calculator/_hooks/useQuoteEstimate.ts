// src/app/(website)/calculator/_hooks/useQuoteEstimate.ts

// Price calculation hook - pure client-side for instant updates

import { useMemo } from "react";
import type { QuoteConfig, PriceEstimate, ModelCategory } from "../calculator-types";

// Pricing tiers per model category (EUR per m²)
const MODEL_PRICING: Record<ModelCategory, number> = {
	"a-models": 250,      // Classic Rocky
	"a-slim-models": 230, // Thin Rocky (less material)
	"b-models": 280,      // Amazonian Tree Trunks (complex sculpting)
	"c-models": 300,      // Massive Rocky (extra thick)
	"e-models": 260,      // Slim Amazonian
	"f-models": 350,      // Room Dividers (double-sided)
	"g-models": 240,      // Slim Rocky
	"k-models": 320,      // Saltwater/Marine (coral details)
	"l-models": 270,      // Juwel 3D (precision fit)
	"n-models": 290,      // Massive 3D Slim
};

export function useQuoteEstimate(config: QuoteConfig): PriceEstimate {
	return useMemo(() => {
		// If no model selected, return zeros
		if (!config.modelCategory) {
			return {
				base: 0,
				flexibility: 0,
				sidePanels: 0,
				filtration: 0,
				subtotal: 0,
				discount: 0,
				total: 0,
				surfaceAreaM2: 0,
			};
		}

		// Calculate surface area (back wall)
		const surfaceAreaM2 = (config.dimensions.width * config.dimensions.height) / 10000;

		// Base price (model category rate × surface area)
		const baseRate = MODEL_PRICING[config.modelCategory] ?? 250;
		const basePrice = surfaceAreaM2 * baseRate;

		// Flexibility upcharge (20% more for flexible material)
		const flexibilityUpcharge = config.flexibility === "flexible" ? basePrice * 0.2 : 0;

		// Side panels cost
		let sidePanelsCost = 0;
		if (config.sidePanels === "single" && config.sidePanelWidth) {
			// Single panel: width × height (side wall)
			const sidePanelArea = (config.sidePanelWidth * config.dimensions.height) / 10000;
			sidePanelsCost = sidePanelArea * baseRate;
		} else if (config.sidePanels === "both" && config.sidePanelWidth) {
			// Both panels: 2× side walls
			const sidePanelArea = (config.sidePanelWidth * config.dimensions.height) / 10000;
			sidePanelsCost = sidePanelArea * baseRate * 2;
		}

		// Filtration cutout (fixed fee - €50 per cutout)
		const filtrationCost = config.filtrationType !== "none" ? 50 : 0;

		// Subtotal
		const subtotal = basePrice + flexibilityUpcharge + sidePanelsCost + filtrationCost;

		// Instant payment discount (5% if paying immediately)
		// For now, we'll calculate but not apply automatically
		const discount = 0; // Will be applied in checkout flow

		return {
			base: Math.round(basePrice),
			flexibility: Math.round(flexibilityUpcharge),
			sidePanels: Math.round(sidePanelsCost),
			filtration: filtrationCost,
			subtotal: Math.round(subtotal),
			discount: Math.round(subtotal * 0.05), // Show potential savings
			total: Math.round(subtotal - discount),
			surfaceAreaM2: parseFloat(surfaceAreaM2.toFixed(2)),
		};
	}, [config]);
}

// Helper: Convert cm to inches
export function cmToInch(cm: number): number {
	return parseFloat((cm / 2.54).toFixed(1));
}

// Helper: Convert inches to cm
export function inchToCm(inch: number): number {
	return parseFloat((inch * 2.54).toFixed(1));
}

// Helper: Format price as EUR
export function formatEUR(cents: number): string {
	return `€${(cents).toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}