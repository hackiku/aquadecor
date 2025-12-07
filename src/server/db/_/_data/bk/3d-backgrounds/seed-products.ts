// src/server/db/seed/data/seed-products.ts
// Product structure only - translations in separate file

export const productStructure = [
	// =========================================================
	// 3D BACKGROUNDS - A Models
	// =========================================================
	{
		categorySlug: "a-models",
		slug: "f1-3d-background",
		sku: "F1",
		basePriceEurCents: null,
		priceNote: "Custom made - Production takes 10-12 business days",
		specifications: {
			productionTime: "10-12 business days",
			material: "High-quality resin with natural stone appearance",
			modularity: "sectioned",
		},
		stockStatus: "made_to_order",
		isActive: true,
		isFeatured: true,
		sortOrder: 1,
	},
	{
		categorySlug: "a-models",
		slug: "f2-3d-background",
		sku: "F2",
		basePriceEurCents: null,
		priceNote: "Custom made - From €199",
		specifications: {
			productionTime: "10-12 business days",
			modularity: "sectioned",
		},
		stockStatus: "made_to_order",
		isActive: true,
		isFeatured: false,
		sortOrder: 2,
	},

	// =========================================================
	// DECORATIONS - Plants
	// =========================================================
	{
		categorySlug: "aquarium-plants",
		slug: "z1-aquarium-plant",
		sku: "Z1",
		basePriceEurCents: 4900,
		priceNote: "In stock - Ready to ship",
		specifications: {
			dimensions: { widthCm: 4, heightCm: 18, depthCm: 10 },
			plantType: "other",
			material: "Non-toxic, fish-safe synthetic",
		},
		stockStatus: "in_stock",
		isActive: true,
		isFeatured: true,
		sortOrder: 3,
	},
	{
		categorySlug: "aquarium-plants",
		slug: "z10-model-aquarium-moss",
		sku: "Z10",
		basePriceEurCents: 4900,
		priceNote: "In stock - Ready to ship",
		specifications: {
			dimensions: { widthCm: 12, heightCm: 10, depthCm: 15 },
			plantType: "moss",
			material: "Synthetic fibers with underwater adhesive",
		},
		stockStatus: "in_stock",
		isActive: true,
		isFeatured: false,
		sortOrder: 4,
	},
	{
		categorySlug: "aquarium-plants",
		slug: "z15-model-aquarium-plant",
		sku: "Z15",
		basePriceEurCents: 4900,
		priceNote: "In stock - Ready to ship",
		specifications: {
			dimensions: { heightCm: 70 },
			plantType: "eucalyptus",
			material: "Flexible synthetic with weighted base",
		},
		stockStatus: "in_stock",
		isActive: true,
		isFeatured: false,
		sortOrder: 5,
	},
	{
		categorySlug: "aquarium-plants",
		slug: "z19-model-aquarium-plant",
		sku: "Z19",
		basePriceEurCents: 4900,
		priceNote: "In stock - Ready to ship",
		specifications: {
			dimensions: { heightCm: 30 },
			plantType: "cabomba",
			material: "Fine synthetic fibers with natural appearance",
		},
		stockStatus: "in_stock",
		isActive: true,
		isFeatured: false,
		sortOrder: 6,
	},

	// =========================================================
	// DECORATIONS - D Models (Logs & Roots)
	// =========================================================
	{
		categorySlug: "d-models",
		slug: "d-1-standing-roots",
		sku: "D1",
		basePriceEurCents: 8900,
		priceNote: "Custom made set - Production takes 10-12 business days",
		specifications: {
			productionTime: "10-12 business days",
			material: "Non-floating resin composite",
			compatibility: ["Amazonian cichlids", "Tetras", "Corydoras"],
		},
		stockStatus: "made_to_order",
		isActive: true,
		isFeatured: true,
		sortOrder: 7,
	},
	{
		categorySlug: "d-models",
		slug: "d-10-slim-standing-logs",
		sku: "D10",
		basePriceEurCents: 8900,
		priceNote: "Custom made set - Production takes 10-12 business days",
		specifications: {
			productionTime: "10-12 business days",
			material: "Magnetic base resin (Silver Birch appearance)",
		},
		stockStatus: "made_to_order",
		isActive: true,
		isFeatured: false,
		sortOrder: 8,
	},
	{
		categorySlug: "d-models",
		slug: "d-50-artificial-vines",
		sku: "D50",
		basePriceEurCents: 8900,
		priceNote: "Custom made set - Production takes 10-12 business days",
		specifications: {
			productionTime: "10-12 business days",
			material: "Flexible liana resin (customizable colors)",
		},
		stockStatus: "made_to_order",
		isActive: true,
		isFeatured: true,
		sortOrder: 9,
	},

	// =========================================================
	// DECORATIONS - Rocks
	// =========================================================
	{
		categorySlug: "aquarium-rocks",
		slug: "d-5-model",
		sku: "D5",
		basePriceEurCents: 8900,
		priceNote: "Custom made set - Production takes 10-12 business days",
		specifications: {
			productionTime: "10-12 business days",
			rockFormation: "loose",
			material: "Non-floating resin stone composite",
		},
		stockStatus: "made_to_order",
		isActive: true,
		isFeatured: false,
		sortOrder: 10,
	},
	{
		categorySlug: "aquarium-rocks",
		slug: "d-27-model",
		sku: "D27",
		basePriceEurCents: 8900,
		priceNote: "Custom made set - Production takes 10-12 business days",
		specifications: {
			productionTime: "10-12 business days",
			rockFormation: "tanganyika",
			material: "Rounded bottom rocks with hiding spots",
			compatibility: ["Malawi cichlids", "Tanganyika cichlids"],
		},
		stockStatus: "made_to_order",
		isActive: true,
		isFeatured: true,
		sortOrder: 11,
	},
	{
		categorySlug: "aquarium-rocks",
		slug: "d-48-model",
		sku: "D48",
		basePriceEurCents: 8900,
		priceNote: "Custom made set - Production takes 10-12 business days",
		specifications: {
			productionTime: "10-12 business days",
			rockFormation: "cichlid-spawning",
			material: "Lake stone replica with spawning holes",
			compatibility: ["Malawi cichlids", "Tanganyika cichlids"],
		},
		stockStatus: "made_to_order",
		isActive: true,
		isFeatured: false,
		sortOrder: 12,
	},
];