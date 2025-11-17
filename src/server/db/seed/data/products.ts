// src/server/db/seed/data/products.ts

export const productData = [
	{
		id: "f1-3d-background",
		categoryId: "3d-backgrounds-a-models",
		slug: "f1-3d-background",
		sku: "F1",
		basePriceEurCents: null,
		priceNote: "Custom made - Production takes 10-12 business days",
		specifications: {
			productionTime: "10-12 business days",
			material: "High-quality resin with natural stone appearance",
		},
		stockStatus: "made_to_order",
		isActive: true,
		isFeatured: true,
		sortOrder: 1,
		translations: {
			en: {
				name: "F1 - 3D Background in Stone",
				shortDescription: "3D Rocky aquarium background with natural stone appearance",
				fullDescription: "3D Rocky aquarium background with stone appearance. Top-notch, free shipping. Production takes 10-12 business days, and delivery takes 5-6 business days. The design imitates a rocky riverbed with stones in a singular tone.",
			},
		},
	},
	{
		id: "f2-3d-background",
		categoryId: "3d-backgrounds-a-models",
		slug: "f2-3d-background",
		sku: "F2",
		basePriceEurCents: null,
		priceNote: "Custom made - From €199",
		specifications: {
			productionTime: "10-12 business days",
		},
		stockStatus: "made_to_order",
		isActive: true,
		isFeatured: false,
		sortOrder: 2,
		translations: {
			en: {
				name: "F2 - Rocky Wood Background",
				shortDescription: "3D Rocky aquarium background with petrified wood appearance",
				fullDescription: "3D Rocky Wood Aquarium Background with petrified wood appearance in shades of white, gray, yellow, and brown.",
			},
		},
	},
	{
		id: "z1-aquarium-plant",
		categoryId: "decorations-plants",
		slug: "z1-aquarium-plant",
		sku: "Z1",
		basePriceEurCents: 4900, // €49
		priceNote: "In stock - Ready to ship",
		specifications: {},
		stockStatus: "in_stock",
		isActive: true,
		isFeatured: true,
		sortOrder: 1,
		translations: {
			en: {
				name: "Z 1 Model - Aquarium Plant",
				shortDescription: "Realistic 3D aquarium plant decoration",
				fullDescription: "Z 1 Model - Aquarium Plant. Made to order.",
			},
		},
	},
];