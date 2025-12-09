// src/server/db/seed/data/productLines/aquarium-decorations/artificial-reefs/pricing.ts

// ============================================================================
// PRODUCT PRICING
// ============================================================================
export const pricing = [
	{
		"productSlug": "h-1-reef",
		"slug": "h-1-reef-pricing",
		"pricingType": "simple",
		"unitPriceEurCents": 4900,
		"allowQuantity": true,
		"maxQuantity": 100
	},
	{
		"productSlug": "h-2-reef-with-artificial-corals",
		"slug": "h-2-reef-with-artificial-corals-pricing",
		"pricingType": "simple",
		"unitPriceEurCents": 4900,
		"allowQuantity": true,
		"maxQuantity": 100
	}
];

// ============================================================================
// PRICING BUNDLES
// ============================================================================
export const bundles = [];

// ============================================================================
// PRODUCT ADDONS
// ============================================================================
export const addons = [];

// ============================================================================
// MARKET EXCLUSIONS
// ============================================================================
export const marketExclusions = [
	{
		"productSlug": "h-1-reef",
		"market": "US"
	},
	{
		"productSlug": "h-2-reef-with-artificial-corals",
		"market": "US"
	}
];
