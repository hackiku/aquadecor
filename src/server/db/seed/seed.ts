#!/usr/bin/env bun
// src/server/db/seed/seed.ts

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import {
	categories,
	categoryTranslations,
	products,
	productTranslations,
	productImages,
	reviews,
} from "../schema";

// Import seed data
import { categoryStructure } from "./data/seed-categories";
import { categoryTranslations as catTranslations } from "./data/translations/seed-translations-categories";
import { productStructure } from "./data/seed-products";
import { productTranslations as prodTranslations } from "./data/translations/seed-translations-products";
import { productImages as imageData } from "./data/seed-images";
import { reviewData } from "./data/seed-reviews"; // ✅ Updated import

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
	throw new Error("DATABASE_URL not set");
}

const client = postgres(connectionString);
const db = drizzle(client);

async function seedCategories() {
	console.log("🌱 Seeding categories...");

	// Step 1: Insert category records
	const categoryIdMap = new Map<string, string>();

	for (const cat of categoryStructure) {
		const [inserted] = await db.insert(categories).values({
			slug: cat.slug,
			productLine: cat.productLine,
			sortOrder: cat.sortOrder,
			isActive: true,
		}).returning();

		if (inserted) {
			categoryIdMap.set(cat.slug, inserted.id);
			console.log(`  ✓ ${cat.slug} (ID: ${inserted.id.substring(0, 8)}...)`);
		}
	}

	// Step 2: Insert translations
	for (const [slug, translations] of Object.entries(catTranslations)) {
		const categoryId = categoryIdMap.get(slug);
		if (!categoryId) {
			console.warn(`  ⚠ No category ID found for slug: ${slug}`);
			continue;
		}

		for (const [locale, trans] of Object.entries(translations)) {
			await db.insert(categoryTranslations).values({
				categoryId,
				locale,
				name: trans.name,
				description: trans.description,
			});
		}
	}

	console.log(`✅ Seeded ${categoryStructure.length} categories with translations\n`);
	return categoryIdMap;
}

async function seedProducts(categoryIdMap: Map<string, string>) {
	console.log("🌱 Seeding products...");

	// Step 1: Insert product records
	const productIdMap = new Map<string, string>();

	for (const prod of productStructure) {
		const categoryId = categoryIdMap.get(prod.categorySlug);
		if (!categoryId) {
			console.warn(`  ⚠ No category found for slug: ${prod.categorySlug}`);
			continue;
		}

		const [inserted] = await db.insert(products).values({
			categoryId,
			slug: prod.slug,
			sku: prod.sku,
			basePriceEurCents: prod.basePriceEurCents,
			priceNote: prod.priceNote,
			specifications: prod.specifications,
			stockStatus: prod.stockStatus,
			isActive: prod.isActive,
			isFeatured: prod.isFeatured,
			sortOrder: prod.sortOrder,
		}).returning();

		if (inserted) {
			productIdMap.set(prod.slug, inserted.id);
			const sku = prod.sku || "no-sku";
			console.log(`  ✓ ${sku} - ${prod.slug} (ID: ${inserted.id.substring(0, 8)}...)`);
		}
	}

	// Step 2: Insert translations
	for (const [slug, translations] of Object.entries(prodTranslations)) {
		const productId = productIdMap.get(slug);
		if (!productId) {
			console.warn(`  ⚠ No product ID found for slug: ${slug}`);
			continue;
		}

		for (const [locale, trans] of Object.entries(translations)) {
			await db.insert(productTranslations).values({
				productId,
				locale,
				name: trans.name,
				shortDescription: trans.shortDescription,
				fullDescription: trans.fullDescription,
			});
		}
	}

	console.log(`✅ Seeded ${productStructure.length} products with translations\n`);
	return productIdMap;
}

async function seedImages(productIdMap: Map<string, string>) {
	console.log("🌱 Seeding product images...");

	for (const img of imageData) {
		const productId = productIdMap.get(img.productSlug);
		if (!productId) {
			console.warn(`  ⚠ No product found for slug: ${img.productSlug}`);
			continue;
		}

		await db.insert(productImages).values({
			productId,
			storageUrl: img.storageUrl,
			storagePath: null, // Future: Supabase Storage path
			altText: img.altText,
			sortOrder: img.sortOrder,
			width: null, // Can add later if needed
			height: null,
			fileSize: null,
			mimeType: null,
		});

		console.log(`  ✓ ${img.productSlug} - ${img.altText}`);
	}

	console.log(`✅ Seeded ${imageData.length} product images\n`);
}

async function seedReviews() {
	console.log("🌱 Seeding reviews...");

	for (const review of reviewData) {
		// Remove the 'id' field - let DB generate UUID
		const { id, ...reviewWithoutId } = review;

		await db.insert(reviews).values(reviewWithoutId);
		console.log(`  ✓ ${review.authorName} (${review.rating}⭐)`);
	}

	console.log(`✅ Seeded ${reviewData.length} reviews\n`);
}

async function main() {
	try {
		console.log("🚀 Starting seed...\n");

		const categoryIdMap = await seedCategories();
		const productIdMap = await seedProducts(categoryIdMap);
		await seedImages(productIdMap);
		await seedReviews(); // ✅ Now enabled

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