
// src/server/db/seed/data/productLine/aquarium-decorations/artificial-reefs/media.ts

import type { MediaSeed } from "../../../../../schema";

export const media: MediaSeed[] = [

	{
		productSlug: "artificial-reefs", // Using productSlug field for cat slug in Seed Type
		categorySlug: "artificial-reefs", // Explicitly setting this too for MediaSeed type
		storageUrl: "https://cdn.aquadecorbackgrounds.com/aquadecor-blob/h-models-artificial-reefs.webp",
		legacyCdnUrl: "https://cdn.aquadecorbackgrounds.com/aquadecor-blob/h-models-artificial-reefs.webp",
		altText: "Artificial Reefs Hero",
		usageType: "category",
		sortOrder: 0,
		tags: ["category-hero"],
	},
	{
		productSlug: "h-1-reef",
		storageUrl: "https://cdn.aquadecorbackgrounds.com/aquadecor-blob/h-1-reef.webp",
		legacyCdnUrl: "https://cdn.aquadecorbackgrounds.com/aquadecor-blob/h-1-reef.webp",
		altText: "Reef",
		usageType: "product",
		sortOrder: 0,
		tags: ["hero-shot"],
	},
	{
		productSlug: "h-2-reef-with-artificial-corals",
		storageUrl: "https://cdn.aquadecorbackgrounds.com/aquadecor-blob/h-2-reef-with-artificial-corals.webp",
		legacyCdnUrl: "https://cdn.aquadecorbackgrounds.com/aquadecor-blob/h-2-reef-with-artificial-corals.webp",
		altText: "Reef with artificial corals",
		usageType: "product",
		sortOrder: 0,
		tags: ["hero-shot"],
	},
];
