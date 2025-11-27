// src/lib/types/schema.ts
// Type exports from Drizzle schema for cleaner imports across the app

import type { products, productTranslations, productImages } from "~/server/db/schema/shop";
import type { InferSelectModel } from "drizzle-orm";

// Base schema types
export type Product = InferSelectModel<typeof products>;
export type ProductTranslation = InferSelectModel<typeof productTranslations>;
export type ProductImage = InferSelectModel<typeof productImages>;

// Joined/enriched types commonly used in components
export type ProductWithTranslation = Product & {
	name: string;
	shortDescription: string | null;
	fullDescription: string | null;
	featuredImageUrl: string | null;
	categorySlug: string;
	productLineSlug: string;
};

// For product cards/sliders
export type ProductCardData = {
	id: string;
	slug: string;
	name: string;
	sku: string | null;
	shortDescription: string | null;
	basePriceEurCents: number | null;
	priceNote: string | null;
	stockStatus: string;
	featuredImageUrl: string | null;
	categorySlug: string;
	productLineSlug: string;
	isFeatured: boolean;
};

// Product line type
export type ProductLine = "3d-backgrounds" | "aquarium-decorations";