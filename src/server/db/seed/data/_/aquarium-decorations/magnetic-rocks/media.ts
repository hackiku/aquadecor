
// src/server/db/seed/data/productLine/aquarium-decorations/magnetic-rocks/media.ts

import type { MediaSeed } from "../../../../../schema";

export const media: MediaSeed[] = [

	{
		productSlug: "magnetic-rocks", // Using productSlug field for cat slug in Seed Type
		categorySlug: "magnetic-rocks", // Explicitly setting this too for MediaSeed type
		storageUrl: "https://cdn.aquadecorbackgrounds.com/aquadecor-blob/m-models-magnetic-rocks.webp",
		legacyCdnUrl: "https://cdn.aquadecorbackgrounds.com/aquadecor-blob/m-models-magnetic-rocks.webp",
		altText: "Magnetic Rocks Hero",
		usageType: "category",
		sortOrder: 0,
		tags: ["category-hero"],
	},
	{
		productSlug: "m-1-magnetic-rocks",
		storageUrl: "https://cdn.aquadecorbackgrounds.com/aquadecor-blob/m-1-magnetic-rocks.webp",
		legacyCdnUrl: "https://cdn.aquadecorbackgrounds.com/aquadecor-blob/m-1-magnetic-rocks.webp",
		altText: "Magnetic Rocks",
		usageType: "product",
		sortOrder: 0,
		tags: ["hero-shot"],
	},
	{
		productSlug: "m-2-magnetic-rocks",
		storageUrl: "https://cdn.aquadecorbackgrounds.com/aquadecor-blob/m-2-magnetic-rocks.webp",
		legacyCdnUrl: "https://cdn.aquadecorbackgrounds.com/aquadecor-blob/m-2-magnetic-rocks.webp",
		altText: "Magnetic Rocks",
		usageType: "product",
		sortOrder: 0,
		tags: ["hero-shot"],
	},
	{
		productSlug: "m-3-magnetic-rocks",
		storageUrl: "https://cdn.aquadecorbackgrounds.com/aquadecor-blob/m-3-magnetic-rocks.webp",
		legacyCdnUrl: "https://cdn.aquadecorbackgrounds.com/aquadecor-blob/m-3-magnetic-rocks.webp",
		altText: "Magnetic Rocks",
		usageType: "product",
		sortOrder: 0,
		tags: ["hero-shot"],
	},
	{
		productSlug: "m-4-magnetic-rocks",
		storageUrl: "https://cdn.aquadecorbackgrounds.com/aquadecor-blob/m-4-magnetic-rocks.webp",
		legacyCdnUrl: "https://cdn.aquadecorbackgrounds.com/aquadecor-blob/m-4-magnetic-rocks.webp",
		altText: "Magnetic Rocks",
		usageType: "product",
		sortOrder: 0,
		tags: ["hero-shot"],
	},
];
