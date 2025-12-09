// src/server/db/seed/data/productLines/aquarium-decorations/magnetic-rocks/pricing.ts

// ============================================================================
// PRODUCT PRICING
// ============================================================================
export const pricing = [
	{
		"productSlug": "m-1-magnetic-rocks",
		"slug": "m-1-magnetic-rocks-pricing",
		"pricingType": "quantity_bundle"
	},
	{
		"productSlug": "m-2-magnetic-rocks",
		"slug": "m-2-magnetic-rocks-pricing",
		"pricingType": "quantity_bundle"
	},
	{
		"productSlug": "m-3-magnetic-rocks",
		"slug": "m-3-magnetic-rocks-pricing",
		"pricingType": "quantity_bundle"
	},
	{
		"productSlug": "m-4-magnetic-rocks",
		"slug": "m-4-magnetic-rocks-pricing",
		"pricingType": "quantity_bundle"
	}
];

// ============================================================================
// PRICING BUNDLES
// ============================================================================
export const bundles = [
	{
		"pricingSlug": "m-1-magnetic-rocks-pricing",
		"quantity": 1,
		"totalPriceEurCents": 9900,
		"label": "Small Set (for tanks ~120–150 cm)",
		"isDefault": true
	},
	{
		"pricingSlug": "m-1-magnetic-rocks-pricing",
		"quantity": 2,
		"totalPriceEurCents": 16900,
		"label": "Large Set (for tanks ~180–200 cm)",
		"isDefault": false
	},
	{
		"pricingSlug": "m-2-magnetic-rocks-pricing",
		"quantity": 1,
		"totalPriceEurCents": 9900,
		"label": "Small Set (for tanks ~120–150 cm)",
		"isDefault": true
	},
	{
		"pricingSlug": "m-2-magnetic-rocks-pricing",
		"quantity": 2,
		"totalPriceEurCents": 16900,
		"label": "Large Set (for tanks ~180–200 cm)",
		"isDefault": false
	},
	{
		"pricingSlug": "m-3-magnetic-rocks-pricing",
		"quantity": 1,
		"totalPriceEurCents": 9900,
		"label": "Small Set (for tanks ~120–150 cm)",
		"isDefault": true
	},
	{
		"pricingSlug": "m-3-magnetic-rocks-pricing",
		"quantity": 2,
		"totalPriceEurCents": 16900,
		"label": "Large Set (for tanks ~180–200 cm)",
		"isDefault": false
	},
	{
		"pricingSlug": "m-4-magnetic-rocks-pricing",
		"quantity": 1,
		"totalPriceEurCents": 10900,
		"label": "Small Set (for tanks ~120–150 cm)",
		"isDefault": true
	},
	{
		"pricingSlug": "m-4-magnetic-rocks-pricing",
		"quantity": 2,
		"totalPriceEurCents": 17900,
		"label": "Large Set (for tanks ~180–200 cm)",
		"isDefault": false
	}
];

// ============================================================================
// PRODUCT ADDONS
// ============================================================================
export const addons = [];

// ============================================================================
// MARKET EXCLUSIONS
// ============================================================================
export const marketExclusions = [
	{
		"productSlug": "m-1-magnetic-rocks",
		"market": "US"
	},
	{
		"productSlug": "m-2-magnetic-rocks",
		"market": "US"
	},
	{
		"productSlug": "m-3-magnetic-rocks",
		"market": "US"
	},
	{
		"productSlug": "m-4-magnetic-rocks",
		"market": "US"
	}
];
