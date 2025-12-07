
// src/server/db/seed/data/productLine/aquarium-decorations/artificial-reefs/products.ts

import type { ProductSeed } from "../../../../../schema"; 

export const products: ProductSeed[] = [

	{
		categorySlug: "artificial-reefs",
		slug: "h-1-reef",
		sku: "H1",
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
		categorySlug: "artificial-reefs",
		slug: "h-2-reef-with-artificial-corals",
		sku: "H2",
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
];
