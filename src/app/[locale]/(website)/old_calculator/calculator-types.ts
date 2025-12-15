// src/app/(website)/calculator/calculator-types.ts

import type { InferSelectModel } from "drizzle-orm";
import type { categories, products } from "~/server/db/schema";

// --- Database Types Helpers ---
// We define the shape coming from the API (Calculator Models)
export interface CalculatorCategory {
	id: string;
	slug: string;
	name: string | null;
	description: string | null;
	image: string | null;
	baseRatePerM2: number; // calculated field from API
	hasSubcategories: boolean; // calculated field from API
}

// --- Configuration Types ---

export type FlexibilityType = "solid" | "flexible";
export type SidePanelsType = "none" | "single" | "both";
export type Unit = "cm" | "inch";

export type FiltrationType =
	| "none"
	| "eheim-classic"
	| "jbl-cristalprofi"
	| "juwel-bioflow"
	| "fluval"
	| "tetra-ex"
	| "custom";

export interface Dimensions {
	width: number;
	height: number;
	depth: number;
}

export interface QuoteConfig {
	// Product selection
	modelCategory: CalculatorCategory | null;
	subcategory: string | null; // Product ID
	flexibility: FlexibilityType;

	// Dimensions
	dimensions: Dimensions;
	unit: Unit;

	// Options
	sidePanels: SidePanelsType;
	sidePanelWidth?: number;

	// Filtration
	filtrationType: FiltrationType;
	filtrationCustomNotes?: string;

	// Shipping
	country: string;

	// Contact (filled in modal)
	name?: string;
	email?: string;
	notes?: string;
}

export interface PriceEstimate {
	base: number;
	flexibility: number;
	sidePanels: number;
	filtration: number;
	subtotal: number;
	discount: number;
	total: number;
	surfaceAreaM2: number;
}