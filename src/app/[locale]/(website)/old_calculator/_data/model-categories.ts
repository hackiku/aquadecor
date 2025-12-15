// src/app/(website)/calculator/_data/model-categories.ts
// Model category metadata with real CDN images

import type { ModelCategoryMeta } from "../calculator-types";

const CDN_BASE = "https://cdn.aquadecorbackgrounds.com/aquadecor-blob";

export const MODEL_CATEGORIES: ModelCategoryMeta[] = [
	{
		id: "a-models",
		name: "A Models - Classic Rocky",
		description: "Natural stone appearance with realistic rocky textures. Perfect for cichlid setups.",
		baseRatePerM2: 250,
		image: `${CDN_BASE}/thumbnails/a-models-classic-rocky-backgrounds_500px.webp`,
		textureUrl: `${CDN_BASE}/thumbnails/a-models-classic-rocky-backgrounds_300px.webp`, // For R3F
		minDimensions: { widthCm: 50, heightCm: 30 },
	},
	{
		id: "a-slim-models",
		name: "A Slim Models - Thin Rocky",
		description: "Slimmer profile with classic rocky appearance. Ideal for tanks with limited depth.",
		baseRatePerM2: 230,
		image: `${CDN_BASE}/thumbnails/a-slim-models-thin-rocky-backgrounds_500px.webp`,
		textureUrl: `${CDN_BASE}/thumbnails/a-slim-models-thin-rocky-backgrounds_300px.webp`,
		minDimensions: { widthCm: 50, heightCm: 30 },
	},
	{
		id: "b-models",
		name: "B Models - Amazonian Tree Trunks",
		description: "Authentic Amazonian tree trunk designs with natural bark textures and root systems.",
		baseRatePerM2: 280,
		image: `${CDN_BASE}/thumbnails/b-models-amazonian-tree-trunks_500px.webp`,
		textureUrl: `${CDN_BASE}/thumbnails/b-models-amazonian-tree-trunks_300px.webp`,
		minDimensions: { widthCm: 50, heightCm: 30 },
	},
	{
		id: "c-models",
		name: "C Models - Massive Rocky",
		description: "Extra-thick backgrounds with deep relief and dramatic shadows. Maximum 3D effect.",
		baseRatePerM2: 300,
		image: `${CDN_BASE}/thumbnails/c-models-massive-rocky-backgrounds_500px.webp`,
		textureUrl: `${CDN_BASE}/thumbnails/c-models-massive-rocky-backgrounds_300px.webp`,
		minDimensions: { widthCm: 100, heightCm: 40 },
	},
	{
		id: "e-models",
		name: "E Models - Slim Amazonian",
		description: "Thin Amazonian-style backgrounds with tree trunk and root motifs.",
		baseRatePerM2: 260,
		image: `${CDN_BASE}/thumbnails/e-models-slim-amazonian-backgrounds_500px.webp`,
		textureUrl: `${CDN_BASE}/thumbnails/e-models-slim-amazonian-backgrounds_300px.webp`,
		minDimensions: { widthCm: 50, heightCm: 30 },
		hasSubcategories: true, // Flag for progressive disclosure
	},
	{
		id: "f-models",
		name: "F Models - Room Dividers",
		description: "Double-sided backgrounds perfect for room dividers and freestanding displays.",
		baseRatePerM2: 350,
		image: `${CDN_BASE}/thumbnails/f-models-room-dividers_500px.webp`,
		textureUrl: `${CDN_BASE}/thumbnails/f-models-room-dividers_300px.webp`,
		minDimensions: { widthCm: 100, heightCm: 50 },
	},
	{
		id: "g-models",
		name: "G Models - Slim Rocky",
		description: "Streamlined rocky design with reduced depth. Excellent for smaller tanks.",
		baseRatePerM2: 240,
		image: `${CDN_BASE}/thumbnails/g-models-slim-rocky-backgrounds_500px.webp`,
		textureUrl: `${CDN_BASE}/thumbnails/g-models-slim-rocky-backgrounds_300px.webp`,
		minDimensions: { widthCm: 50, heightCm: 30 },
	},
	{
		id: "k-models",
		name: "K Models - Saltwater/Marine",
		description: "Coral reef designs with intricate marine textures. Perfect for saltwater setups.",
		baseRatePerM2: 320,
		image: `${CDN_BASE}/thumbnails/k-models-saltwater-marine-backgrounds_500px.webp`,
		textureUrl: `${CDN_BASE}/thumbnails/k-models-saltwater-marine-backgrounds_300px.webp`,
		minDimensions: { widthCm: 50, heightCm: 30 },
	},
	{
		id: "l-models",
		name: "L Models - Juwel 3D",
		description: "Precision-fit backgrounds designed specifically for Juwel aquariums.",
		baseRatePerM2: 270,
		image: `${CDN_BASE}/thumbnails/l-models-juwel-3d-aquarium-backgrounds_500px.webp`,
		textureUrl: `${CDN_BASE}/thumbnails/l-models-juwel-3d-aquarium-backgrounds_300px.webp`,
		minDimensions: { widthCm: 50, heightCm: 30 },
	},
	{
		id: "n-models",
		name: "N Models - Massive 3D Slim",
		description: "Slim profile with massive 3D depth illusion. Best of both worlds.",
		baseRatePerM2: 290,
		image: `${CDN_BASE}/thumbnails/n-models-massive-3d-slim-backgrounds_500px.webp`,
		textureUrl: `${CDN_BASE}/thumbnails/n-models-massive-3d-slim-backgrounds_300px.webp`,
		minDimensions: { widthCm: 80, heightCm: 40 },
	},
];

// Subcategory data - only for categories with hasSubcategories: true
export interface SubcategoryMeta {
	id: string; // e.g., "e-3", "e-4"
	categoryId: string; // parent category
	name: string;
	imageUrl: string;
	textureUrl?: string; // For R3F when subcategory is selected
}

export const MODEL_SUBCATEGORIES: SubcategoryMeta[] = [
	// E Models (21 products)
	{ id: "e-3", categoryId: "e-models", name: "E 3", imageUrl: `${CDN_BASE}/thumbnails/e-3-slim-amazonian-background_500px.webp`, textureUrl: `${CDN_BASE}/thumbnails/e-3-slim-amazonian-background_300px.webp` },
	{ id: "e-4", categoryId: "e-models", name: "E 4", imageUrl: `${CDN_BASE}/thumbnails/e-4-slim-amazonian-background_500px.webp`, textureUrl: `${CDN_BASE}/thumbnails/e-4-slim-amazonian-background_300px.webp` },
	{ id: "e-5", categoryId: "e-models", name: "E 5", imageUrl: `${CDN_BASE}/thumbnails/e-5-slim-amazonian-background_500px.webp`, textureUrl: `${CDN_BASE}/thumbnails/e-5-slim-amazonian-background_300px.webp` },
	{ id: "e-6", categoryId: "e-models", name: "E 6", imageUrl: `${CDN_BASE}/thumbnails/e-6-slim-amazonian-background_500px.webp`, textureUrl: `${CDN_BASE}/thumbnails/e-6-slim-amazonian-background_300px.webp` },
	{ id: "e-8", categoryId: "e-models", name: "E 8", imageUrl: `${CDN_BASE}/thumbnails/e-8-slim-amazonian-background_500px.webp`, textureUrl: `${CDN_BASE}/thumbnails/e-8-slim-amazonian-background_300px.webp` },
	{ id: "e-11", categoryId: "e-models", name: "E 11", imageUrl: `${CDN_BASE}/thumbnails/e-11-slim-amazonian-background_500px.webp`, textureUrl: `${CDN_BASE}/thumbnails/e-11-slim-amazonian-background_300px.webp` },
	{ id: "e-15", categoryId: "e-models", name: "E 15", imageUrl: `${CDN_BASE}/thumbnails/e-15-slim-amazonian-background_500px.webp`, textureUrl: `${CDN_BASE}/thumbnails/e-15-slim-amazonian-background_300px.webp` },
	{ id: "e-16", categoryId: "e-models", name: "E 16", imageUrl: `${CDN_BASE}/thumbnails/e-16-slim-amazonian-background_500px.webp`, textureUrl: `${CDN_BASE}/thumbnails/e-16-slim-amazonian-background_300px.webp` },
	{ id: "e-18", categoryId: "e-models", name: "E 18", imageUrl: `${CDN_BASE}/thumbnails/e-18-slim-amazonian-background_500px.webp`, textureUrl: `${CDN_BASE}/thumbnails/e-18-slim-amazonian-background_300px.webp` },
	{ id: "e-21", categoryId: "e-models", name: "E 21", imageUrl: `${CDN_BASE}/thumbnails/e-21-slim-amazonian-background_500px.webp`, textureUrl: `${CDN_BASE}/thumbnails/e-21-slim-amazonian-background_300px.webp` },
	{ id: "e-23", categoryId: "e-models", name: "E 23", imageUrl: `${CDN_BASE}/thumbnails/e-23-slim-amazonian-background_500px.webp`, textureUrl: `${CDN_BASE}/thumbnails/e-23-slim-amazonian-background_300px.webp` },
	{ id: "e-24", categoryId: "e-models", name: "E 24", imageUrl: `${CDN_BASE}/thumbnails/e-24-slim-amazonian-background_500px.webp`, textureUrl: `${CDN_BASE}/thumbnails/e-24-slim-amazonian-background_300px.webp` },
	{ id: "e-25", categoryId: "e-models", name: "E 25", imageUrl: `${CDN_BASE}/thumbnails/e-25-slim-amazonian-background_500px.webp`, textureUrl: `${CDN_BASE}/thumbnails/e-25-slim-amazonian-background_300px.webp` },
	{ id: "e-26", categoryId: "e-models", name: "E 26", imageUrl: `${CDN_BASE}/thumbnails/e-26-slim-amazonian-background_500px.webp`, textureUrl: `${CDN_BASE}/thumbnails/e-26-slim-amazonian-background_300px.webp` },
	{ id: "e-27", categoryId: "e-models", name: "E 27", imageUrl: `${CDN_BASE}/thumbnails/e-27-slim-amazonian-background_500px.webp`, textureUrl: `${CDN_BASE}/thumbnails/e-27-slim-amazonian-background_300px.webp` },
	{ id: "e-28", categoryId: "e-models", name: "E 28", imageUrl: `${CDN_BASE}/thumbnails/e-28-slim-amazonian-background_500px.webp`, textureUrl: `${CDN_BASE}/thumbnails/e-28-slim-amazonian-background_300px.webp` },
	{ id: "e-29", categoryId: "e-models", name: "E 29", imageUrl: `${CDN_BASE}/thumbnails/e-29-slim-amazonian-background_500px.webp`, textureUrl: `${CDN_BASE}/thumbnails/e-29-slim-amazonian-background_300px.webp` },
	{ id: "e-30", categoryId: "e-models", name: "E 30", imageUrl: `${CDN_BASE}/thumbnails/e-30-slim-amazonian-background_500px.webp`, textureUrl: `${CDN_BASE}/thumbnails/e-30-slim-amazonian-background_300px.webp` },
	{ id: "e-31", categoryId: "e-models", name: "E 31", imageUrl: `${CDN_BASE}/thumbnails/e-31-slim-amazonian-background_500px.webp`, textureUrl: `${CDN_BASE}/thumbnails/e-31-slim-amazonian-background_300px.webp` },
	{ id: "e-32", categoryId: "e-models", name: "E 32", imageUrl: `${CDN_BASE}/thumbnails/e-32-slim-amazonian-background_500px.webp`, textureUrl: `${CDN_BASE}/thumbnails/e-32-slim-amazonian-background_300px.webp` },
	{ id: "e-33", categoryId: "e-models", name: "E 33", imageUrl: `${CDN_BASE}/thumbnails/e-33-slim-amazonian-background_500px.webp`, textureUrl: `${CDN_BASE}/thumbnails/e-33-slim-amazonian-background_300px.webp` },
];

// Helper to get subcategories for a category
export function getSubcategories(categoryId: string): SubcategoryMeta[] {
	return MODEL_SUBCATEGORIES.filter(sub => sub.categoryId === categoryId);
}

// Helper to check if category has subcategories
export function hasSubcategories(categoryId: string): boolean {
	const category = MODEL_CATEGORIES.find(c => c.id === categoryId);
	return category?.hasSubcategories ?? false;
}