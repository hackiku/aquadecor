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
	orders,
	orderItems,
	promoters,
	promoterCodes,
	faqs,
	faqTranslations,
} from "../schema";

// Import seed data
import { categoryStructure } from "./data/seed-categories";
import { categoryTranslations as catTranslations } from "./data/translations/seed-translations-categories";
import { productStructure } from "./data/seed-products";
import { productTranslations as prodTranslations } from "./data/translations/seed-translations-products";
import { productImages as imageData } from "./data/seed-images";
import { reviewData } from "./data/seed-reviews";
import { ordersSeedData } from "./data/seed-orders";
import { promotersSeedData } from "./data/seed-promoters";
import { faqsSeedData } from "./data/seed-faqs";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
	throw new Error("DATABASE_URL not set");
}

const client = postgres(connectionString);
const db = drizzle(client);

async function seedCategories() {
	console.log("🌱 Seeding categories...");

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
			storagePath: null,
			altText: img.altText,
			sortOrder: img.sortOrder,
			width: null,
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
		const { id, ...reviewWithoutId } = review;
		await db.insert(reviews).values(reviewWithoutId);
		console.log(`  ✓ ${review.authorName} (${review.rating}⭐)`);
	}

	console.log(`✅ Seeded ${reviewData.length} reviews\n`);
}

async function seedOrders() {
	console.log("🌱 Seeding orders...");

	for (const order of ordersSeedData) {
		await db.insert(orders).values(order);
		console.log(`  ✓ ${order.orderNumber} - ${order.email} (${order.status})`);
	}

	console.log(`✅ Seeded ${ordersSeedData.length} orders\n`);
}

async function seedPromoters() {
	console.log("🌱 Seeding promoters...");

	for (const promoter of promotersSeedData) {
		const { codes, ...promoterData } = promoter;

		const [inserted] = await db.insert(promoters).values(promoterData).returning();

		if (inserted && codes.length > 0) {
			for (const code of codes) {
				await db.insert(promoterCodes).values({
					promoterId: inserted.id,
					code: code.code,
					discountPercent: code.discountPercent,
					commissionPercent: code.commissionPercent,
					isActive: code.isActive,
					usageCount: code.usageCount,
					createdAt: code.createdAt,
				});
			}
		}

		const codeCount = codes.length;
		console.log(`  ✓ ${promoter.firstName} ${promoter.lastName} (${codeCount} codes)`);
	}

	console.log(`✅ Seeded ${promotersSeedData.length} promoters\n`);
}

async function seedFAQs() {
	console.log("🌱 Seeding FAQs...");

	let totalFaqs = 0;

	for (const [region, faqList] of Object.entries(faqsSeedData)) {
		console.log(`  Seeding ${region} FAQs...`);

		for (const faqItem of faqList) {
			const [inserted] = await db.insert(faqs).values({
				region,
				sortOrder: faqItem.sortOrder,
				isActive: true,
			}).returning();

			if (inserted) {
				await db.insert(faqTranslations).values({
					faqId: inserted.id,
					locale: "en",
					question: faqItem.question,
					answer: faqItem.answer,
				});

				totalFaqs++;
				console.log(`    ✓ ${faqItem.question.substring(0, 50)}...`);
			}
		}
	}

	console.log(`✅ Seeded ${totalFaqs} FAQs\n`);
}

async function main() {
	try {
		console.log("🚀 Starting seed...\n");

		const categoryIdMap = await seedCategories();
		const productIdMap = await seedProducts(categoryIdMap);
		await seedImages(productIdMap);
		await seedReviews();
		await seedOrders();
		await seedPromoters();
		await seedFAQs();

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