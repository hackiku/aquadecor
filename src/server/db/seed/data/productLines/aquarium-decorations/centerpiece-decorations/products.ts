
// src/server/db/seed/data/productLine/aquarium-decorations/centerpiece-decorations/products.ts

import type { ProductSeed } from "../../../../../schema"; 

export const products: ProductSeed[] = [

	{
		categorySlug: "centerpiece-decorations",
		slug: "v1-tree-trunk-centerpiece",
		sku: null,
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
		categorySlug: "centerpiece-decorations",
		slug: "v2-bamboo-centerpiece",
		sku: null,
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
		isFeatured: true,
		sortOrder: 2,
	},
];
