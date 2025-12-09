// src/server/db/seed/data/productLines/aquarium-decorations/centerpiece-decorations/pricing.ts

// ============================================================================
// PRODUCT PRICING
// ============================================================================
export const pricing = [
	{
		"productSlug": "v1-tree-trunk-centerpiece",
		"slug": "v1-tree-trunk-centerpiece-pricing",
		"pricingType": "simple",
		"unitPriceEurCents": 4900,
		"allowQuantity": true,
		"maxQuantity": 100
	},
	{
		"productSlug": "v2-bamboo-centerpiece",
		"slug": "v2-bamboo-centerpiece-pricing",
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
		"productSlug": "v1-tree-trunk-centerpiece",
		"market": "US"
	},
	{
		"productSlug": "v2-bamboo-centerpiece",
		"market": "US"
	}
];
