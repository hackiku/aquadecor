#!/usr/bin/env bun
// src/server/db/seed/seed.ts
//
// Run with: bun db:seed
//

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { categories, categoryTranslations, products, productTranslations } from "../schema";

// Get connection string
const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
	throw new Error("DATABASE_URL not set");
}

const client = postgres(connectionString);
const db = drizzle(client);

// Category data
const categoryData = [
	{
		id: "3d-backgrounds",
		slug: "3d-backgrounds",
		parentId: null,
		sortOrder: 1,
		translations: {
			en: {
				name: "3D Backgrounds",
				description: "Natural look with our 3D aquarium backgrounds",
			},
			de: {
				name: "3D-Hintergründe",
				description: "Natürlicher Look mit unseren 3D-Aquarienhintergründen",
			},
		},
	},
	{
		id: "3d-backgrounds-a-models",
		slug: "a-models",
		parentId: "3d-backgrounds",
		sortOrder: 1,
		translations: {
			en: {
				name: "A Models - Classic Rocky Backgrounds",
				description: "Realistic 3D aquarium stone decor (24 products)",
			},
		},
	},
	{
		id: "3d-backgrounds-slim",
		slug: "slim-models",
		parentId: "3d-backgrounds",
		sortOrder: 2,
		translations: {
			en: {
				name: "A Slim Models - Thin Rocky Backgrounds",
				description: "Realistic 3D slim aquarium stone decor (11 products)",
			},
		},
	},
	{
		id: "aquarium-decorations",
		slug: "aquarium-decorations",
		parentId: null,
		sortOrder: 2,
		translations: {
			en: {
				name: "Aquarium Decorations",
				description: "Natural effect with aquarium decorations",
			},
		},
	},
	{
		id: "decorations-plants",
		slug: "aquarium-plants",
		parentId: "aquarium-decorations",
		sortOrder: 1,
		translations: {
			en: {
				name: "Aquarium Plants",
				description: "Realistic aquarium plants (13 products)",
			},
		},
	},
];

// Product data
const productData = [
	{
		id: "f1-3d-background",
		categoryId: "3d-backgrounds-a-models",
		slug: "f1-3d-background",
		sku: "F1",
		basePriceEurCents: null,
		priceNote: "Production takes 10-12 business days",
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
		priceNote: "From €199",
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
		basePriceEurCents: null,
		priceNote: "Made to order",
		specifications: {},
		stockStatus: "made_to_order",
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

async function seedCategories() {
	console.log("🌱 Seeding categories...");

	for (const cat of categoryData) {
		// Insert category
		await db.insert(categories).values({
			id: cat.id,
			slug: cat.slug,
			parentId: cat.parentId,
			sortOrder: cat.sortOrder,
			isActive: true,
		}).onConflictDoNothing();

		// Insert translations
		for (const [locale, translation] of Object.entries(cat.translations)) {
			await db.insert(categoryTranslations).values({
				categoryId: cat.id,
				locale,
				name: translation.name,
				description: translation.description,
			}).onConflictDoNothing();
		}

		console.log(`  ✓ ${cat.translations.en.name}`);
	}

	console.log(`✅ Seeded ${categoryData.length} categories\n`);
}

async function seedProducts() {
	console.log("🌱 Seeding products...");

	for (const prod of productData) {
		// Insert product
		await db.insert(products).values({
			id: prod.id,
			categoryId: prod.categoryId,
			slug: prod.slug,
			sku: prod.sku,
			basePriceEurCents: prod.basePriceEurCents,
			priceNote: prod.priceNote,
			specifications: prod.specifications,
			stockStatus: prod.stockStatus,
			isActive: prod.isActive,
			isFeatured: prod.isFeatured,
			sortOrder: prod.sortOrder,
		}).onConflictDoNothing();

		// Insert translations
		for (const [locale, translation] of Object.entries(prod.translations)) {
			await db.insert(productTranslations).values({
				productId: prod.id,
				locale,
				name: translation.name,
				shortDescription: translation.shortDescription,
				fullDescription: translation.fullDescription,
			}).onConflictDoNothing();
		}

		console.log(`  ✓ ${prod.translations.en.name}`);
	}

	console.log(`✅ Seeded ${productData.length} products\n`);
}

async function main() {
	try {
		console.log("🚀 Starting seed...\n");

		await seedCategories();
		await seedProducts();

		console.log("✨ Seed complete!");
		process.exit(0);
	} catch (error) {
		console.error("❌ Seed failed:", error);
		process.exit(1);
	} finally {
		await client.end();
	}
}

main();