// src/app/(website)/calculator/_hooks/useQuoteEstimate.ts

import { useMemo } from "react";
import type { QuoteConfig, PriceEstimate } from "../calculator-types";

export function useQuoteEstimate(config: QuoteConfig): PriceEstimate {
	return useMemo(() => {
		// If no model selected, return zeros
		if (!config.modelCategory) {
			return {
				base: 0,
				flexibility: 0,
				sidePanels: 0,
				filtration: 0,
				additionalItems: 0,
				subtotal: 0,
				discount: 0,
				total: 0,
				surfaceAreaM2: 0,
			};
		}

		// Calculate surface area (back wall)
		const surfaceAreaM2 = (config.dimensions.width * config.dimensions.height) / 10000;

		// Use baseRatePerM2 directly from the category
		const baseRate = config.modelCategory.baseRatePerM2;
		const basePrice = surfaceAreaM2 * baseRate;

		// Flexibility upcharge (20%)
		const flexibilityUpcharge = config.flexibility === "flexible" ? basePrice * 0.2 : 0;

		// Side panels cost - UPDATED for left/right/both
		let sidePanelsCost = 0;
		if (config.sidePanelWidth && config.sidePanels !== "none") {
			const sidePanelArea = (config.sidePanelWidth * config.dimensions.height) / 10000;
			const panelCount = config.sidePanels === "both" ? 2 : 1; // both = 2, left or right = 1
			sidePanelsCost = sidePanelArea * baseRate * panelCount;
		}

		// Filtration cutout (fixed fee - €50)
		const filtrationCost = config.filtrationType !== "none" ? 50 : 0;

		// Additional items cost - NEW
		const additionalItemsCost = 0; // TODO: Need to fetch prices from items
		// Note: This would require passing item data or fetching from API
		// For now, keeping at 0 until we implement proper item price lookup

		// Subtotal
		const subtotal = basePrice + flexibilityUpcharge + sidePanelsCost + filtrationCost + additionalItemsCost;

		return {
			base: Math.round(basePrice),
			flexibility: Math.round(flexibilityUpcharge),
			sidePanels: Math.round(sidePanelsCost),
			filtration: filtrationCost,
			additionalItems: additionalItemsCost,
			subtotal: Math.round(subtotal),
			discount: 0, // No discount for now
			total: Math.round(subtotal),
			surfaceAreaM2: parseFloat(surfaceAreaM2.toFixed(2)),
		};
	}, [config]);
}

export function formatEUR(cents: number): string {
	return `€${(cents).toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}