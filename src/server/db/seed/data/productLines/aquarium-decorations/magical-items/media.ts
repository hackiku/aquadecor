// media.ts for magical-items test category

import type { MediaSeed } from "../../../../../schema";

export const media: MediaSeed[] = [
	{
		productSlug: "magical-items",
		categorySlug: "magical-items",
		storageUrl: "https://cdn.aquadecorbackgrounds.com/aquadecor-blob/z-models-aquadecor.png", // Reuse existing
		legacyCdnUrl: "https://cdn.aquadecorbackgrounds.com/aquadecor-blob/z-models-aquadecor.png",
		altText: "Magical Items Category",
		usageType: "category",
		sortOrder: 0,
		tags: ["category-hero"],
	},
	{
		productSlug: "enchanted-pebble",
		storageUrl: "https://cdn.aquadecorbackgrounds.com/aquadecor-blob/z-1-model-aquarium-plant.webp", // Reuse
		legacyCdnUrl: "https://cdn.aquadecorbackgrounds.com/aquadecor-blob/z-1-model-aquarium-plant.webp",
		altText: "Enchanted Pebble",
		usageType: "product",
		sortOrder: 0,
		tags: ["hero-shot"],
	},
	{
		productSlug: "fairy-dust-bundle",
		storageUrl: "https://cdn.aquadecorbackgrounds.com/aquadecor-blob/z-2-model-aquarium-plant.webp",
		legacyCdnUrl: "https://cdn.aquadecorbackgrounds.com/aquadecor-blob/z-2-model-aquarium-plant.webp",
		altText: "Fairy Dust Bundle",
		usageType: "product",
		sortOrder: 0,
		tags: ["hero-shot"],
	},
	{
		productSlug: "wizard-wand-set",
		storageUrl: "https://cdn.aquadecorbackgrounds.com/aquadecor-blob/z-4-model-aquarium-plant.webp",
		legacyCdnUrl: "https://cdn.aquadecorbackgrounds.com/aquadecor-blob/z-4-model-aquarium-plant.webp",
		altText: "Wizard Wand Set",
		usageType: "product",
		sortOrder: 0,
		tags: ["hero-shot"],
	},
	{
		productSlug: "custom-potion-kit",
		storageUrl: "https://cdn.aquadecorbackgrounds.com/aquadecor-blob/z-5-model-aquarium-plant.webp",
		legacyCdnUrl: "https://cdn.aquadecorbackgrounds.com/aquadecor-blob/z-5-model-aquarium-plant.webp",
		altText: "Custom Potion Kit",
		usageType: "product",
		sortOrder: 0,
		tags: ["hero-shot"],
	},
];