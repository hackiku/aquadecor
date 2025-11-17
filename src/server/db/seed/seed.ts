#!/usr/bin/env bun
// src/server/db/seed/seed.ts

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import {
	categories,
	categoryTranslations,
	products,
	productTranslations,
	reviews
} from "../schema";

// Import data
import { categoryData } from "./data/categories";
import { productData } from "./data/products";
import { reviewData } from "./data/reviews";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
	throw new Error("DATABASE_URL not set");
}

const client = postgres(connectionString);
const db = drizzle(client);

async function seedCategories() {
	console.log("🌱 Seeding categories...");

	for (const cat of categoryData) {
		await db.insert(categories).values({
			id: cat.id,
			slug: cat.slug,
			parentId: cat.parentId,
			sortOrder: cat.sortOrder,
			isActive: true,
		}).onConflictDoNothing();

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

async function seedReviews() {
	console.log("🌱 Seeding reviews...");

	for (const review of reviewData) {
		await db.insert(reviews).values(review).onConflictDoNothing();
		console.log(`  ✓ ${review.authorName}`);
	}

	console.log(`✅ Seeded ${reviewData.length} reviews\n`);
}

async function main() {
	try {
		console.log("🚀 Starting seed...\n");

		await seedCategories();
		await seedProducts();
		await seedReviews();

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