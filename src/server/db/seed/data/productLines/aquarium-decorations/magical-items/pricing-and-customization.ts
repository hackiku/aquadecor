// src/server/db/seed/data/productLine/aquarium-decorations/magical-items/pricing-and-customization.ts

import type { InferInsertModel } from "drizzle-orm";
import { productPricing, pricingBundles, productAddons, customizationOptions, selectOptions, productMarketExclusions } from "../../../../../schema";

// --- Custom Types to link relational data via SLUGS ---
export type PricingSeedV2 = Omit<InferInsertModel<typeof productPricing>, "id" | "productId"> & { productSlug: string; slug: string; };
export type BundleSeedV2 = Omit<InferInsertModel<typeof pricingBundles>, "id" | "pricingId"> & { pricingSlug: string; };
export type AddonSeedV2 = Omit<InferInsertModel<typeof productAddons>, "id" | "productId"> & { productSlug: string; };
export type CustomOptionSeedV2 = Omit<InferInsertModel<typeof customizationOptions>, "id" | "productId"> & { productSlug: string; slug: string; };
export type SelectOptionSeedV2 = Omit<InferInsertModel<typeof selectOptions>, "id" | "customizationOptionId"> & { optionSlug: string; };
export type ExclusionSeedV2 = Omit<InferInsertModel<typeof productMarketExclusions>, "id" | "productId"> & { productSlug: string; };


// --- Pricing & Market Exclusions ---

export const marketExclusionsData: ExclusionSeedV2[] = [
	{ productSlug: "enchanted-pebble", market: "US", reason: "Legacy Exclusion - Trump Tariffs" },
];

export const pricingData: PricingSeedV2[] = [
	// --- 1. Enchanted Pebble (Simple) ROW ---
	{
		productSlug: "enchanted-pebble",
		slug: "price-pebble-row",
		market: "ROW",
		currency: "EUR",
		pricingType: "simple",
		unitPriceEurCents: 999, // €9.99
		allowQuantity: true,
		maxQuantity: 50,
		stripePriceId: "stripe-price-pebble-eur",
		isActive: true,
	},
	// --- 2. Fairy Dust Bundle (Bundle) ROW ---
	{
		productSlug: "fairy-dust-bundle",
		slug: "price-dust-row",
		market: "ROW",
		currency: "EUR",
		pricingType: "bundle",
		isActive: true,
	},
	// --- 3. Wizard Wand Set (Bundle) ROW ---
	{
		productSlug: "wizard-wand-set",
		slug: "price-wand-row",
		market: "ROW",
		currency: "EUR",
		pricingType: "bundle",
		isActive: true,
	},
	// --- 4. Custom Potion Kit (Bundle) ROW ---
	{
		productSlug: "custom-potion-kit",
		slug: "price-potion-row",
		market: "ROW",
		currency: "EUR",
		pricingType: "bundle",
		isActive: true,
	},
	// --- 4.1 Custom Potion Kit (Simple) US ---
	{
		productSlug: "custom-potion-kit",
		slug: "price-potion-us",
		market: "US",
		currency: "USD",
		pricingType: "simple",
		unitPriceEurCents: 5999, // $59.99 USD
		fixedQuantity: 5,
		stripePriceId: "stripe-price-potion-us-5",
		isActive: true,
	},
];

export const bundlesData: BundleSeedV2[] = [
	// Fairy Dust Bundles (Linked to 'price-dust-row')
	{
		pricingSlug: "price-dust-row",
		quantity: 3,
		totalPriceEurCents: 1499,
		label: "Starter Pack",
		isDefault: true,
		sortOrder: 0,
		stripePriceId: "stripe-price-dust-3",
	},
	{
		pricingSlug: "price-dust-row",
		quantity: 5,
		totalPriceEurCents: 2299,
		label: "Value Pack (Save 15%)",
		sortOrder: 1,
		stripePriceId: "stripe-price-dust-5",
	},
	// ... (rest of bundles)
];

// --- Addons (linked by product slug) ---

export const addonsData: AddonSeedV2[] = [
	// Wizard Wand Set Addons
	{
		productSlug: "wizard-wand-set",
		name: "Extra Enchantment",
		description: "Add sparkle effect for 24 hours",
		priceEurCents: 1000,
		isDefault: false,
		isActive: true,
		sortOrder: 0,
	},
	// Custom Potion Kit Addons
	{
		productSlug: "custom-potion-kit",
		name: "Premium Cork Stoppers",
		description: "Hand-carved from ancient oak",
		priceEurCents: 800,
		isDefault: false,
		isActive: true,
		sortOrder: 0,
	},
];

// --- Customization Options (linked by product slug) ---

export const customOptionsData: CustomOptionSeedV2[] = [
	// Custom Potion Kit Inputs
	{
		productSlug: "custom-potion-kit",
		slug: "input-bottle-height",
		type: "input",
		inputType: "number",
		label: "Custom Bottle Height (cm)",
		required: true,
		placeholder: "Enter height between 10-30",
		minValue: 10,
		maxValue: 30,
		sortOrder: 0,
	},
	// Custom Potion Kit Select
	{
		productSlug: "custom-potion-kit",
		slug: "select-potion-color",
		type: "select",
		label: "Potion Color",
		required: true,
		sortOrder: 3,
	},
];

export const selectOptionsData: SelectOptionSeedV2[] = [
	// Potion Color Select Options (Linked to 'select-potion-color' slug)
	{ optionSlug: "select-potion-color", value: "emerald", label: "Emerald Green", isDefault: true, sortOrder: 0 },
	{ optionSlug: "select-potion-color", value: "sapphire", label: "Sapphire Blue", priceEurCents: 300, isDefault: false, sortOrder: 1 },
];