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
				subtotal: 0,
				discount: 0,
				total: 0,
				surfaceAreaM2: 0,
			};
		}

		// Calculate surface area (back wall)
		const surfaceAreaM2 = (config.dimensions.width * config.dimensions.height) / 10000;

		// FIX: Use baseRatePerM2 directly from the object
		const baseRate = config.modelCategory.baseRatePerM2;
		const basePrice = surfaceAreaM2 * baseRate;

		// Flexibility upcharge (20%)
		const flexibilityUpcharge = config.flexibility === "flexible" ? basePrice * 0.2 : 0;

		// Side panels cost
		let sidePanelsCost = 0;
		if (config.sidePanelWidth) {
			const sidePanelArea = (config.sidePanelWidth * config.dimensions.height) / 10000;

			if (config.sidePanels === "single") {
				sidePanelsCost = sidePanelArea * baseRate;
			} else if (config.sidePanels === "both") {
				sidePanelsCost = sidePanelArea * baseRate * 2;
			}
		}

		// Filtration cutout (fixed fee - €50)
		const filtrationCost = config.filtrationType !== "none" ? 50 : 0;

		// Subtotal
		const subtotal = basePrice + flexibilityUpcharge + sidePanelsCost + filtrationCost;

		// Instant payment discount (5%)
		const discount = 0; // Calculated in modal for display only currently

		return {
			base: Math.round(basePrice),
			flexibility: Math.round(flexibilityUpcharge),
			sidePanels: Math.round(sidePanelsCost),
			filtration: filtrationCost,
			subtotal: Math.round(subtotal),
			discount: Math.round(subtotal * 0.05),
			total: Math.round(subtotal - discount),
			surfaceAreaM2: parseFloat(surfaceAreaM2.toFixed(2)),
		};
	}, [config]);
}

export function formatEUR(cents: number): string {
	return `€${(cents).toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}