// src/server/db/seed/data/productLine/aquarium-decorations/aquarium-plants/products.ts

import type { ProductSeed } from "../../../../../schema";

// Reusable bundle options structure
const PLANT_BUNDLE_OPTIONS = {
	quantity: {
		options: [
			{ value: 3, priceEurCents: 1299, label: "3 Pieces" },      // ~€4.33 per unit
			{ value: 5, priceEurCents: 1999, label: "5 Pieces (Save 10%)" },    // ~€4.00 per unit
			{ value: 10, priceEurCents: 3799, label: "10 Pieces (Save 20%)" },  // ~€3.80 per unit
			{ value: 15, priceEurCents: 5399, label: "15 Pieces (Save 25%)" },
			{ value: 20, priceEurCents: 6999, label: "20 Pieces (Best Value)" }, // ~€3.50 per unit
		],
	},
};

export const products: ProductSeed[] = [

	// --- PRODUCT 1: FULL TEST OF VARIANTS AND ADD-ONS ---
	{
		categorySlug: "aquarium-plants",
		slug: "z-1-model-aquarium-plant",
		sku: "Z1",
		productType: "variable", // Changed to variable because of bundles
		basePriceEurCents: null, // Price is now set by variantOptions
		priceNote: "Set price",
		variantType: "quantity",
		variantOptions: PLANT_BUNDLE_OPTIONS,

		// 🎯 ADDED ALL ADDON TYPES FOR TESTING
		addonOptions: {
			items: [
				{
					name: "Moss Add-on",
					description: "Pre-seed with live Java Moss (requires 7-day curing)",
					type: "checkbox",
					priceEurCents: 1000, // +€10.00
					default: false,
				},
				{
					name: "Color Customization",
					description: "Choose a specific color mix",
					type: "select",
					options: ["Natural Green", "Autumn Mix (+€5.00)", "Desert Yellow"],
					priceEurCents: 500, // The price for the paid option (will need frontend logic)
					required: false,
				},
				{
					name: "Custom Height (Max 30cm)",
					description: "Enter height in cm (10-30)",
					type: "input",
					required: true, // Must be filled out
				},
				{
					name: "Special Request Notes",
					description: "Add any special instructions for the production team",
					type: "textarea",
					required: false,
				}
			]
		},

		specifications: {
			material: "Safe aquarium decoration",
			productionTime: "Ready to ship",
		},
		customizationOptions: {
			allowsCustomDimensions: false,
		},
		excludedMarkets: ["US"],
		stockStatus: "in_stock",
		isActive: true,
		isFeatured: false,
		sortOrder: 1,
	},

	// --- REMAINING PRODUCTS: SIMPLE BUNDLE LOGIC APPLIED ---
	{
		categorySlug: "aquarium-plants",
		slug: "z-2-model-aquarium-plant",
		sku: "Z2",
		productType: "variable",
		basePriceEurCents: null,
		priceNote: "Set price",
		variantType: "quantity",
		variantOptions: PLANT_BUNDLE_OPTIONS,
		addonOptions: null, // No addons
		specifications: {
			material: "Safe aquarium decoration",
			productionTime: "Ready to ship",
		},
		customizationOptions: {
			allowsCustomDimensions: false,
		},
		excludedMarkets: ["US"],
		stockStatus: "in_stock",
		isActive: true,
		isFeatured: false,
		sortOrder: 2,
	},
	{
		categorySlug: "aquarium-plants",
		slug: "z-4-model-aquarium-plant",
		sku: "Z4",
		productType: "variable",
		basePriceEurCents: null,
		priceNote: "Set price",
		variantType: "quantity",
		variantOptions: PLANT_BUNDLE_OPTIONS,
		addonOptions: null,
		specifications: {
			material: "Safe aquarium decoration",
			productionTime: "Ready to ship",
		},
		customizationOptions: {
			allowsCustomDimensions: false,
		},
		excludedMarkets: ["US"],
		stockStatus: "in_stock",
		isActive: true,
		isFeatured: false,
		sortOrder: 3,
	},
	{
		categorySlug: "aquarium-plants",
		slug: "z-5-model-aquarium-plant",
		sku: "Z5",
		productType: "variable",
		basePriceEurCents: null,
		priceNote: "Set price",
		variantType: "quantity",
		variantOptions: PLANT_BUNDLE_OPTIONS,
		addonOptions: null,
		specifications: {
			material: "Safe aquarium decoration",
			productionTime: "Ready to ship",
		},
		customizationOptions: {
			allowsCustomDimensions: false,
		},
		excludedMarkets: ["US"],
		stockStatus: "in_stock",
		isActive: true,
		isFeatured: false,
		sortOrder: 4,
	},
	{
		categorySlug: "aquarium-plants",
		slug: "z-8-model-aquarium-plant",
		sku: "Z8",
		productType: "variable",
		basePriceEurCents: null,
		priceNote: "Set price",
		variantType: "quantity",
		variantOptions: PLANT_BUNDLE_OPTIONS,
		addonOptions: null,
		specifications: {
			material: "Safe aquarium decoration",
			productionTime: "Ready to ship",
		},
		customizationOptions: {
			allowsCustomDimensions: false,
		},
		excludedMarkets: ["US"],
		stockStatus: "in_stock",
		isActive: true,
		isFeatured: false,
		sortOrder: 5,
	},
	{
		categorySlug: "aquarium-plants",
		slug: "z-10-model-aquarium-moss",
		sku: "Z10",
		productType: "variable",
		basePriceEurCents: null,
		priceNote: "Set price",
		variantType: "quantity",
		variantOptions: PLANT_BUNDLE_OPTIONS,
		addonOptions: null,
		specifications: {
			material: "Safe aquarium decoration",
			productionTime: "Ready to ship",
		},
		customizationOptions: {
			allowsCustomDimensions: false,
		},
		excludedMarkets: ["US"],
		stockStatus: "in_stock",
		isActive: true,
		isFeatured: true,
		sortOrder: 6,
	},
	{
		categorySlug: "aquarium-plants",
		slug: "z-15-model-aquarium-plant",
		sku: "Z15",
		productType: "variable",
		basePriceEurCents: null,
		priceNote: "Set price",
		variantType: "quantity",
		variantOptions: PLANT_BUNDLE_OPTIONS,
		addonOptions: null,
		specifications: {
			material: "Safe aquarium decoration",
			productionTime: "Ready to ship",
		},
		customizationOptions: {
			allowsCustomDimensions: false,
		},
		excludedMarkets: ["US"],
		stockStatus: "in_stock",
		isActive: true,
		isFeatured: false,
		sortOrder: 7,
	},
	{
		categorySlug: "aquarium-plants",
		slug: "z-16-model-aquarium-plant",
		sku: "Z16",
		productType: "variable",
		basePriceEurCents: null,
		priceNote: "Set price",
		variantType: "quantity",
		variantOptions: PLANT_BUNDLE_OPTIONS,
		addonOptions: null,
		specifications: {
			material: "Safe aquarium decoration",
			productionTime: "Ready to ship",
		},
		customizationOptions: {
			allowsCustomDimensions: false,
		},
		excludedMarkets: ["US"],
		stockStatus: "in_stock",
		isActive: true,
		isFeatured: false,
		sortOrder: 8,
	},
	{
		categorySlug: "aquarium-plants",
		slug: "z-17-model-aquarium-plant",
		sku: "Z17",
		productType: "variable",
		basePriceEurCents: null,
		priceNote: "Set price",
		variantType: "quantity",
		variantOptions: PLANT_BUNDLE_OPTIONS,
		addonOptions: null,
		specifications: {
			material: "Safe aquarium decoration",
			productionTime: "Ready to ship",
		},
		customizationOptions: {
			allowsCustomDimensions: false,
		},
		excludedMarkets: ["US"],
		stockStatus: "in_stock",
		isActive: true,
		isFeatured: false,
		sortOrder: 9,
	},
	{
		categorySlug: "aquarium-plants",
		slug: "z-18-model-aquarium-plant",
		sku: "Z18",
		productType: "variable",
		basePriceEurCents: null,
		priceNote: "Set price",
		variantType: "quantity",
		variantOptions: PLANT_BUNDLE_OPTIONS,
		addonOptions: null,
		specifications: {
			material: "Safe aquarium decoration",
			productionTime: "Ready to ship",
		},
		customizationOptions: {
			allowsCustomDimensions: false,
		},
		excludedMarkets: ["US"],
		stockStatus: "in_stock",
		isActive: true,
		isFeatured: false,
		sortOrder: 10,
	},
	{
		categorySlug: "aquarium-plants",
		slug: "z-19-model-aquarium-plant",
		sku: "Z19",
		productType: "variable",
		basePriceEurCents: null,
		priceNote: "Set price",
		variantType: "quantity",
		variantOptions: PLANT_BUNDLE_OPTIONS,
		addonOptions: null,
		specifications: {
			material: "Safe aquarium decoration",
			productionTime: "Ready to ship",
		},
		customizationOptions: {
			allowsCustomDimensions: false,
		},
		excludedMarkets: ["US"],
		stockStatus: "in_stock",
		isActive: true,
		isFeatured: false,
		sortOrder: 11,
	},
	{
		categorySlug: "aquarium-plants",
		slug: "z-20-model-aquarium-plant",
		sku: "Z20",
		productType: "variable",
		basePriceEurCents: null,
		priceNote: "Set price",
		variantType: "quantity",
		variantOptions: PLANT_BUNDLE_OPTIONS,
		addonOptions: null,
		specifications: {
			material: "Safe aquarium decoration",
			productionTime: "Ready to ship",
		},
		customizationOptions: {
			allowsCustomDimensions: false,
		},
		excludedMarkets: ["US"],
		stockStatus: "in_stock",
		isActive: true,
		isFeatured: false,
		sortOrder: 12,
	},
	{
		categorySlug: "aquarium-plants",
		slug: "z-21-model-aquarium-plant",
		sku: "Z21",
		productType: "variable",
		basePriceEurCents: null,
		priceNote: "Set price",
		variantType: "quantity",
		variantOptions: PLANT_BUNDLE_OPTIONS,
		addonOptions: null,
		specifications: {
			material: "Safe aquarium decoration",
			productionTime: "Ready to ship",
		},
		customizationOptions: {
			allowsCustomDimensions: false,
		},
		excludedMarkets: ["US"],
		stockStatus: "in_stock",
		isActive: true,
		isFeatured: false,
		sortOrder: 13,
	},
];