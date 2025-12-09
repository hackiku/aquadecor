// src/server/db/seed/data/productLine/aquarium-decorations/aquarium-plants/products.ts

import type { ProductSeed } from "../../../../../schema";

export const products: ProductSeed[] = [

	// ============================================================================
	// EXAMPLE 1: FULL TEST PRODUCT - Z1 with bundles + all addon types
	// ============================================================================
	{
		categorySlug: "aquarium-plants",
		slug: "z-1-model-aquarium-plant",
		sku: "Z1",
		productType: "catalog",
		stockStatus: "in_stock",

		// ✅ NEW PRICING STRUCTURE
		pricing: {
			type: "quantity_bundle",
			bundles: [
				{
					quantity: 3,
					totalPriceEurCents: 1299,
					label: "3 Pieces",
					isDefault: true,
				},
				{
					quantity: 5,
					totalPriceEurCents: 1999,
					label: "5 Pieces (Save 10%)",
				},
				{
					quantity: 10,
					totalPriceEurCents: 3799,
					label: "10 Pieces (Save 20%)",
				},
				{
					quantity: 15,
					totalPriceEurCents: 5399,
					label: "15 Pieces (Save 25%)",
				},
				{
					quantity: 20,
					totalPriceEurCents: 6999,
					label: "20 Pieces (Best Value)",
				},
			],
		},

		// ✅ NEW CUSTOMIZATION STRUCTURE
		customization: {
			addons: [
				{
					id: "moss",
					name: "Moss Add-on",
					description: "Pre-seed with live Java Moss (requires 7-day curing)",
					priceEurCents: 1000,
					type: "checkbox",
					default: false,
				},
			],
			inputs: [
				{
					id: "custom_height",
					label: "Custom Height",
					type: "number",
					required: true,
					placeholder: "Enter height in cm",
					validation: {
						min: 10,
						max: 30,
					},
				},
				{
					id: "special_notes",
					label: "Special Request Notes",
					type: "textarea",
					required: false,
					placeholder: "Add any special instructions for the production team",
				},
			],
			selects: [
				{
					id: "color",
					label: "Color Customization",
					required: false,
					options: [
						{ value: "natural", label: "Natural Green", isDefault: true },
						{ value: "autumn", label: "Autumn Mix", priceEurCents: 500 },
						{ value: "desert", label: "Desert Yellow" },
					],
				},
			],
		},

		specifications: {
			material: "Safe aquarium decoration",
			productionTime: "Ready to ship",
		},

		customizationOptions: {
			allowsCustomDimensions: false,
		},

		excludedMarkets: ["US"],
		isActive: true,
		isFeatured: false,
		sortOrder: 1,

		// ✅ STRIPE IDS (to be filled after Stripe product creation)
		stripeProductId: null,
		stripePriceId: null,
		stripePrices: [
			// Will be populated after creating Stripe prices
			// { quantity: 3, stripePriceId: "price_xxx" },
			// { quantity: 5, stripePriceId: "price_yyy" },
			// etc.
		],

		// OLD FIELDS (keep null for backward compatibility, remove later)
		basePriceEurCents: null,
		priceNote: null,
		variantType: null,
		variantOptions: null,
		addonOptions: null,
	},

	// ============================================================================
	// EXAMPLE 2: SIMPLE BUNDLE WITHOUT ADDONS - Z2
	// ============================================================================
	{
		categorySlug: "aquarium-plants",
		slug: "z-2-model-aquarium-plant",
		sku: "Z2",
		productType: "catalog",
		stockStatus: "in_stock",

		pricing: {
			type: "quantity_bundle",
			bundles: [
				{ quantity: 3, totalPriceEurCents: 1299, label: "3 Pieces", isDefault: true },
				{ quantity: 5, totalPriceEurCents: 1999, label: "5 Pieces (Save 10%)" },
				{ quantity: 10, totalPriceEurCents: 3799, label: "10 Pieces (Save 20%)" },
				{ quantity: 15, totalPriceEurCents: 5399, label: "15 Pieces (Save 25%)" },
				{ quantity: 20, totalPriceEurCents: 6999, label: "20 Pieces (Best Value)" },
			],
		},

		customization: null, // No addons

		specifications: {
			material: "Safe aquarium decoration",
			productionTime: "Ready to ship",
		},

		customizationOptions: {
			allowsCustomDimensions: false,
		},

		excludedMarkets: ["US"],
		isActive: true,
		isFeatured: false,
		sortOrder: 2,

		stripeProductId: null,
		stripePriceId: null,
		stripePrices: null,

		// OLD FIELDS
		basePriceEurCents: null,
		priceNote: null,
		variantType: null,
		variantOptions: null,
		addonOptions: null,
	},

	// ============================================================================
	// EXAMPLE 3: 3D BACKGROUND (CONFIGURATION / QUOTE ONLY) - D6
	// ============================================================================
	{
		categorySlug: "classic-rocky-backgrounds",
		slug: "d-6-rocky-background",
		sku: "D6",
		productType: "catalog", // Still catalog type
		stockStatus: "requires_quote",

		pricing: {
			type: "configuration",
			baseRateEurPerSqM: 18000, // €180/m² as rough estimate
			calculatorUrl: "/calculator?model=d-6",
			requiresQuote: true,
		},

		customization: null, // All customization via calculator

		specifications: {
			material: "EPS foam with epoxy coating",
			productionTime: "10-12 business days",
			modularity: "Modular sections with numbered pieces",
		},

		customizationOptions: {
			allowsCustomDimensions: true,
			allowsColorCustomization: true,
		},

		excludedMarkets: [],
		isActive: true,
		isFeatured: true,
		sortOrder: 1,

		stripeProductId: null, // Created dynamically after quote
		stripePriceId: null,
		stripePrices: null,

		// OLD FIELDS
		basePriceEurCents: null,
		priceNote: "Custom quote required",
		variantType: null,
		variantOptions: null,
		addonOptions: null,
	},

	// ============================================================================
	// EXAMPLE 4: SIMPLE PRODUCT (NO BUNDLES) - Catappa Leaf
	// ============================================================================
	{
		categorySlug: "logs-leaves-driftwood-rocks",
		slug: "catappa-leaf-single",
		sku: "LEAF-01",
		productType: "catalog",
		stockStatus: "in_stock",

		pricing: {
			type: "simple",
			unitPriceEurCents: 299, // €2.99 per leaf
			allowQuantity: true,
			maxQuantity: 100,
		},

		customization: null,

		specifications: {
			material: "Artificial Catappa leaf",
			productionTime: "Ready to ship",
		},

		customizationOptions: {
			allowsCustomDimensions: false,
		},

		excludedMarkets: [],
		isActive: true,
		isFeatured: false,
		sortOrder: 10,

		stripeProductId: null,
		stripePriceId: null, // Single price for simple product
		stripePrices: null,

		// OLD FIELDS
		basePriceEurCents: 299, // Keep for backward compat
		priceNote: null,
		variantType: null,
		variantOptions: null,
		addonOptions: null,
	},

];