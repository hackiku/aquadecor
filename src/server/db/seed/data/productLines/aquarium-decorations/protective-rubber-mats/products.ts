
// src/server/db/seed/data/productLine/aquarium-decorations/protective-rubber-mats/products.ts

import type { ProductSeed } from "../../../../../schema"; 

export const products: ProductSeed[] = [

	{
		categorySlug: "protective-rubber-mats",
		slug: "j-1-rubber-mat-for-aquarium",
		sku: "J1",
		productType: "simple",
		basePriceEurCents: 4900,
		priceNote: "In stock",
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
	{
		categorySlug: "protective-rubber-mats",
		slug: "j-2-rubber-mat-for-aquarium",
		sku: "J2",
		productType: "simple",
		basePriceEurCents: 4900,
		priceNote: "In stock",
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
		categorySlug: "protective-rubber-mats",
		slug: "j-3-rubber-mat-for-aquarium",
		sku: "J3",
		productType: "simple",
		basePriceEurCents: 4900,
		priceNote: "In stock",
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
];
