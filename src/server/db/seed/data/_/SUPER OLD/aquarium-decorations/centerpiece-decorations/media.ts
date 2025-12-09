
// src/server/db/seed/data/productLine/aquarium-decorations/centerpiece-decorations/media.ts

import type { MediaSeed } from "../../../../../schema";

export const media: MediaSeed[] = [

	{
		productSlug: "centerpiece-decorations", // Using productSlug field for cat slug in Seed Type
		categorySlug: "centerpiece-decorations", // Explicitly setting this too for MediaSeed type
		storageUrl: "https://cdn.aquadecorbackgrounds.com/aquadecor-blob/v-models-centerpiece-cat.png",
		legacyCdnUrl: "https://cdn.aquadecorbackgrounds.com/aquadecor-blob/v-models-centerpiece-cat.png",
		altText: "Centerpiece Decorations Hero",
		usageType: "category",
		sortOrder: 0,
		tags: ["category-hero"],
	},
	{
		productSlug: "v1-tree-trunk-centerpiece",
		storageUrl: "https://cdn.aquadecorbackgrounds.com/aquadecor-blob/v1-tree-trunk-centerpiece.webp",
		legacyCdnUrl: "https://cdn.aquadecorbackgrounds.com/aquadecor-blob/v1-tree-trunk-centerpiece.webp",
		altText: "Tree trunk centerpiece",
		usageType: "product",
		sortOrder: 0,
		tags: ["hero-shot"],
	},
	{
		productSlug: "v2-bamboo-centerpiece",
		storageUrl: "https://cdn.aquadecorbackgrounds.com/aquadecor-blob/v2-bamboo-centerpiece.webp",
		legacyCdnUrl: "https://cdn.aquadecorbackgrounds.com/aquadecor-blob/v2-bamboo-centerpiece.webp",
		altText: "Bamboo centerpiece",
		usageType: "product",
		sortOrder: 0,
		tags: ["hero-shot"],
	},
];
