// src/app/(website)/calculator/calculator-types.ts

// --- Database Types Helpers ---
export interface CalculatorCategory {
	id: string;
	slug: string;
	name: string | null;
	description: string | null;
	image: string | null;
	textureUrl?: string | null; // Category-level texture
	baseRatePerM2: number;
	hasSubcategories: boolean;
}

export interface CalculatorSubcategory {
	id: string;
	slug: string;
	sku: string | null;
	name: string | null;
	shortDescription: string | null;
	baseRatePerM2: number;
	heroImageUrl: string;
	textureUrl: string; // Product-specific texture for 3D scene
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
	modelCategory: CalculatorCategory | null;
	subcategory: string | null;
	subcategoryTexture?: string | null; // NEW: Store texture URL when subcategory selected
	flexibility: FlexibilityType;
	dimensions: Dimensions;
	unit: Unit;
	sidePanels: SidePanelsType;
	sidePanelWidth?: number;
	filtrationType: FiltrationType;
	filtrationCustomNotes?: string;
	country: string;
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