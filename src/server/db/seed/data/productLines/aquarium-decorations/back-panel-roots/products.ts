// src/server/db/seed/data/productLine/aquarium-decorations/back-panel-roots/products.ts

import type { ProductSeed } from "../../../../../schema";

export const products: ProductSeed[] = [

	{
		categorySlug: "back-panel-roots",
		slug: "s-1-back-panel-roots",
		sku: "S1",
		productType: "simple",
		basePriceEurCents: 4900,
		priceNote: "In stock",
		specifications: {
			material: "Safe aquarium decoration",
			productionTime: "Ready to ship",
			// ✅ ADDED DIMENSIONS
			dimensions: {
				widthCm: 10,
				heightCm: 20,
				depthCm: 5,
			},
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
	{
		categorySlug: "back-panel-roots",
		slug: "s-2-back-panel-roots",
		sku: "S2",
		productType: "simple",
		basePriceEurCents: 4900,
		priceNote: "In stock",
		specifications: {
			material: "Safe aquarium decoration",
			productionTime: "Ready to ship",
			// ✅ ADDED DIMENSIONS
			dimensions: {
				widthCm: 12,
				heightCm: 25,
				depthCm: 6,
			},
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
		categorySlug: "back-panel-roots",
		slug: "s-3-back-panel-roots",
		sku: "S3",
		productType: "simple",
		basePriceEurCents: 4900,
		priceNote: "In stock",
		specifications: {
			material: "Safe aquarium decoration",
			productionTime: "Ready to ship",
			// ✅ ADDED DIMENSIONS
			dimensions: {
				widthCm: 15,
				heightCm: 30,
				depthCm: 7,
			},
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
		categorySlug: "back-panel-roots",
		slug: "s-5-back-panel-roots",
		sku: "S5",
		productType: "simple",
		basePriceEurCents: 4900,
		priceNote: "In stock",
		specifications: {
			material: "Safe aquarium decoration",
			productionTime: "Ready to ship",
			// ✅ ADDED DIMENSIONS
			dimensions: {
				widthCm: 18,
				heightCm: 40,
				depthCm: 8,
			},
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
		categorySlug: "back-panel-roots",
		slug: "s-6-back-panel-roots",
		sku: "S6",
		productType: "simple",
		basePriceEurCents: 4900,
		priceNote: "In stock",
		specifications: {
			material: "Safe aquarium decoration",
			productionTime: "Ready to ship",
			// ✅ ADDED DIMENSIONS
			dimensions: {
				widthCm: 20,
				heightCm: 50,
				depthCm: 10,
			},
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
];