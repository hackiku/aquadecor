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

// Filtration types - expanded from boolean to specific filter models
export type FiltrationType =
	| "none"
	| "eheim-classic"
	| "jbl-cristalprofi"
	| "juwel-bioflow"
	| "fluval"
	| "tetra-ex"
	| "custom"; // For "other" with custom dimensions

export interface Dimensions {
	width: number;   // cm
	height: number;  // cm
	depth: number;   // cm
}

export interface QuoteConfig {
	// Product selection
	modelCategory: ModelCategory | null;
	subcategory?: string | null; // e.g., "e-3", "e-4" for E-models
	flexibility: FlexibilityType;

	// Dimensions
	dimensions: Dimensions;
	unit: Unit;

	// Options
	sidePanels: SidePanelsType;
	sidePanelWidth?: number; // cm (if single or both selected)

	// Filtration
	filtrationType: FiltrationType;
	filtrationCustomNotes?: string; // If type is "custom"

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
	image: string;             // CDN URL for card display
	textureUrl?: string;       // CDN URL for R3F texture (optional, smaller res)
	minDimensions: {
		widthCm: number;
		heightCm: number;
	};
	hasSubcategories?: boolean; // Flag for progressive disclosure
}