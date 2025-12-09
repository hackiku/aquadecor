// TEST CATEGORY: Magical Aquarium Items
// Testing all pricing/customization patterns

import type { Product } from "../../../../../schema";

export const products = [
	{
		slug: "enchanted-pebble",
		categorySlug: "magical-items",
		sku: "MAGIC-01",
		productType: "catalog" as const,
		stockStatus: "in_stock" as const,
		isActive: true,
		isFeatured: true,
		sortOrder: 1,
		specifications: {
			material: "Mystical stone",
			productionTime: "Ready to ship",
		},
	},
	{
		slug: "fairy-dust-bundle",
		categorySlug: "magical-items",
		sku: "MAGIC-02",
		productType: "catalog" as const,
		stockStatus: "in_stock" as const,
		isActive: true,
		isFeatured: false,
		sortOrder: 2,
		specifications: {
			material: "Crystallized moonlight",
			productionTime: "2-3 days",
		},
	},
	{
		slug: "wizard-wand-set",
		categorySlug: "magical-items",
		sku: "MAGIC-03",
		productType: "catalog" as const,
		stockStatus: "in_stock" as const,
		isActive: true,
		isFeatured: true,
		sortOrder: 3,
		specifications: {
			material: "Elder wood with phoenix feather core",
			productionTime: "1 week",
		},
	},
	{
		slug: "custom-potion-kit",
		categorySlug: "magical-items",
		sku: "MAGIC-04",
		productType: "catalog" as const,
		stockStatus: "made_to_order" as const,
		isActive: true,
		isFeatured: true,
		sortOrder: 4,
		specifications: {
			material: "Enchanted glass and alchemical ingredients",
			productionTime: "7-10 business days",
		},
	},
];