// src/server/db/seed/data/productLine/aquarium-decorations/magnetic-rocks/products.ts

import type { ProductSeed } from "../../../../../schema";

export const products: ProductSeed[] = [
	{
		categorySlug: "magnetic-rocks",
		slug: "m-1-magnetic-rocks",
		sku: "M1",
		productType: "variable",
		basePriceEurCents: 9900,
		priceNote: "From €99 – Ready to ship",
		specifications: {
			material: "Aquarium-safe resin with embedded neodymium magnets",
			productionTime: "Ready to ship",
			maxProjectionCm: 15,
			attachmentTypes: ["magnets", "vacuum-suction-cups"],
			recommendedBackground: "Black or dark blue foil",
		},
		customizationOptions: {
			allowsCustomDimensions: false,
			allowsColorCustomization: false,
		},
		variantType: "quantity",
		variantOptions: {
			quantity: {
				options: [
					{ value: 1, priceEurCents: 9900, label: "Small Set (for tanks ~120–150 cm)" },
					{ value: 2, priceEurCents: 16900, label: "Large Set (for tanks ~180–200 cm)" },
				],
			},
		},
		excludedMarkets: ["US"],
		stockStatus: "in_stock",
		isActive: true,
		isFeatured: true,
		sortOrder: 1,
	},
	{
		categorySlug: "magnetic-rocks",
		slug: "m-2-magnetic-rocks",
		sku: "M2",
		productType: "variable",
		basePriceEurCents: 9900,
		priceNote: "From €99 – Ready to ship",
		specifications: {
			material: "Aquarium-safe resin with embedded neodymium magnets",
			productionTime: "Ready to ship",
			maxProjectionCm: 15,
			attachmentTypes: ["magnets", "vacuum-suction-cups"],
			colorProfile: "Natural earth tones (gray, brown, beige)",
			recommendedBackground: "Black or dark blue foil",
		},
		customizationOptions: {
			allowsCustomDimensions: false,
			allowsColorCustomization: false,
		},
		variantType: "quantity",
		variantOptions: {
			quantity: {
				options: [
					{ value: 1, priceEurCents: 9900, label: "Small Set (for tanks ~120–150 cm)" },
					{ value: 2, priceEurCents: 16900, label: "Large Set (for tanks ~180–200 cm)" },
				],
			},
		},
		excludedMarkets: ["US"],
		stockStatus: "in_stock",
		isActive: true,
		isFeatured: false,
		sortOrder: 2,
	},
	{
		categorySlug: "magnetic-rocks",
		slug: "m-3-magnetic-rocks",
		sku: "M3",
		productType: "variable",
		basePriceEurCents: 9900,
		priceNote: "From €99 – Ready to ship",
		specifications: {
			material: "Aquarium-safe resin with embedded neodymium magnets",
			productionTime: "Ready to ship",
			maxProjectionCm: 15,
			attachmentTypes: ["magnets", "vacuum-suction-cups"],
			texture: "Highly fractured and cracked surface",
			recommendedBackground: "Black or dark blue foil",
		},
		customizationOptions: {
			allowsCustomDimensions: false,
			allowsColorCustomization: false,
		},
		variantType: "quantity",
		variantOptions: {
			quantity: {
				options: [
					{ value: 1, priceEurCents: 9900, label: "Small Set (for tanks ~120–150 cm)" },
					{ value: 2, priceEurCents: 16900, label: "Large Set (for tanks ~180–200 cm)" },
				],
			},
		},
		excludedMarkets: ["US"],
		stockStatus: "in_stock",
		isActive: true,
		isFeatured: true,
		sortOrder: 3,
	},
	{
		categorySlug: "magnetic-rocks",
		slug: "m-4-magnetic-rocks",
		sku: "M4",
		productType: "variable",
		basePriceEurCents: 10900,
		priceNote: "From €109 – Ready to ship",
		specifications: {
			material: "Aquarium-safe resin with embedded neodymium magnets",
			productionTime: "Ready to ship",
			maxProjectionCm: 15,
			attachmentTypes: ["magnets", "vacuum-suction-cups"],
			finish: "Moss-covered effect with natural green algae tones",
			recommendedBackground: "Black or dark blue foil",
		},
		customizationOptions: {
			allowsCustomDimensions: false,
			allowsColorCustomization: false,
		},
		variantType: "quantity",
		variantOptions: {
			quantity: {
				options: [
					{ value: 1, priceEurCents: 10900, label: "Small Set (for tanks ~120–150 cm)" },
					{ value: 2, priceEurCents: 17900, label: "Large Set (for tanks ~180–200 cm)" },
				],
			},
		},
		excludedMarkets: ["US"],
		stockStatus: "in_stock",
		isActive: true,
		isFeatured: true,
		sortOrder: 4,
	},
];