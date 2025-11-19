// src/app/(website)/calculator/calculator-types.ts

// Types for calculator configuration

export type ModelCategory =
	| "a-models"      // Classic Rocky
	| "a-slim-models" // Thin Rocky
	| "b-models"      // Amazonian Tree Trunks
	| "c-models"      // Massive Rocky
	| "e-models"      // Slim Amazonian
	| "f-models"      // Room Dividers
	| "g-models"      // Slim Rocky
	| "k-models"      // Saltwater/Marine
	| "l-models"      // Juwel 3D
	| "n-models";     // Massive 3D Slim

export type FlexibilityType = "solid" | "flexible";
export type SidePanelsType = "none" | "single" | "both";
export type Unit = "cm" | "inch";

export interface Dimensions {
	width: number;   // cm
	height: number;  // cm
	depth: number;   // cm
}

export interface QuoteConfig {
	// Product selection
	modelCategory: ModelCategory | null;
	flexibility: FlexibilityType;

	// Dimensions
	dimensions: Dimensions;
	unit: Unit;

	// Options
	sidePanels: SidePanelsType;
	sidePanelWidth?: number; // cm (if single or both selected)

	// Future: filtration cutout
	filtrationCutout?: boolean;

	// Shipping
	country: string; // Country code or name

	// Contact (filled in modal)
	name?: string;
	email?: string;
	notes?: string;
}

export interface PriceEstimate {
	base: number;              // Base background price
	flexibility: number;       // Additional cost for flexible
	sidePanels: number;        // Side panels cost
	filtration: number;        // Filtration cutout cost
	subtotal: number;          // Sum before discount
	discount: number;          // Instant payment discount
	total: number;             // Final price
	surfaceAreaM2: number;     // For display
}

// Model category metadata
export interface ModelCategoryMeta {
	id: ModelCategory;
	name: string;
	description: string;
	baseRatePerM2: number;     // EUR per m²
	image: string;             // CDN URL
	minDimensions: {
		widthCm: number;
		heightCm: number;
	};
}