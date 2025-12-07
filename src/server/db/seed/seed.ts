#!/usr/bin/env bun
// src/server/db/seed/seed.ts

import { drizzle } from "drizzle-orm/postgres-js";
import { eq } from "drizzle-orm";
import postgres from "postgres";
import {
	users, addresses,
	categories, categoryTranslations,
	products, productTranslations,
	media,
	reviews,
	orders,
	promoters, promoterCodes, sales,
	faqs, faqTranslations,
	shippingZones, countries,
} from "../schema";


// auth & admin
import { usersSeedData, addressesSeedData } from "./data/seed-users";

// ✅ NEW: Unified Inventory Import
import { seedData } from "./data/productLines";

// selling
import { ordersSeedData } from "./data/seed-orders";
import { promotersSeedData } from "./data/seed-promoters";
import { salesSeedData } from "./data/seed-sales";
// content
import { reviewData } from "./data/seed-reviews";
import { faqsSeedData } from "./data/seed-faqs";
import { shippingZonesSeedData, countriesSeedData } from "./data/seed-countries";


const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
	throw new Error("DATABASE_URL not set");
}

const client = postgres(connectionString);
const db = drizzle(client);


async function seedUsers() {
	console.log("🌱 Seeding users and addresses...");

	const userMap = new Map<string, string>(); // email -> id

	for (const userData of usersSeedData) {
		const existing = await db.select().from(users).where(eq(users.email, userData.email)).limit(1);
		let userId = "";

		if (existing.length > 0) {
			userId = existing[0]!.id;
			console.log(`  ✓ User exists: ${userData.email}`);
		} else {
			const [inserted] = await db.insert(users).values(userData).returning();
			userId = inserted!.id;
			console.log(`  ✓ Created user: ${userData.email}`);
		}

		userMap.set(userData.email, userId);
	}

	for (const addr of addressesSeedData) {
		const userId = userMap.get(addr.userEmail);
		if (!userId) continue;

		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { userEmail, ...addressData } = addr;

		await db.insert(addresses).values({
			...addressData,
			userId,
		});
	}
	console.log(`✅ Seeded users\n`);
}


async function seedCategories() {
	console.log("🌱 Seeding categories...");

	const categoryIdMap = new Map<string, string>();

	// 1. Insert Categories
	for (const cat of seedData.categories) {
		const [inserted] = await db.insert(categories).values({
			slug: cat.slug,
			productLine: cat.productLine,
			modelCode: cat.modelCode,
			sortOrder: cat.sortOrder,
			isActive: true,
			contentBlocks: cat.contentBlocks,
		}).returning();

		if (inserted) {
			categoryIdMap.set(cat.slug, inserted.id);
			console.log(`  ✓ ${cat.slug} (ID: ${inserted.id.substring(0, 8)}...)`);
		}
	}

	// 2. Insert Translations
	for (const [slug, translations] of Object.entries(seedData.categoryTranslations)) {
		const categoryId = categoryIdMap.get(slug);
		if (!categoryId) {
			console.warn(`  ⚠ No category ID found for translation slug: ${slug}`);
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

	console.log(`✅ Seeded ${seedData.categories.length} categories with translations\n`);
	return categoryIdMap;
}

async function seedProducts(categoryIdMap: Map<string, string>) {
	console.log("🌱 Seeding products...");

	const productIdMap = new Map<string, string>();

	// 1. Insert Products
	for (const prod of seedData.products) {
		const categoryId = categoryIdMap.get(prod.categorySlug);
		if (!categoryId) {
			console.warn(`  ⚠ No category found for product slug: ${prod.slug} (cat: ${prod.categorySlug})`);
			continue;
		}

		const [inserted] = await db.insert(products).values({
			categoryId,
			slug: prod.slug,
			sku: prod.sku,
			basePriceEurCents: prod.basePriceEurCents,
			priceNote: prod.priceNote,
			specifications: prod.specifications as any,
			customizationOptions: prod.customizationOptions as any,
			excludedMarkets: prod.excludedMarkets,
			stockStatus: prod.stockStatus,
			isActive: prod.isActive,
			isFeatured: prod.isFeatured,
			sortOrder: prod.sortOrder,
		}).returning();

		if (inserted) {
			productIdMap.set(prod.slug, inserted.id);
			const sku = prod.sku || "no-sku";
			console.log(`  ✓ ${sku} - ${prod.slug}`);
		}
	}

	// 2. Insert Translations
	for (const [slug, translations] of Object.entries(seedData.productTranslations)) {
		const productId = productIdMap.get(slug);
		if (!productId) {
			console.warn(`  ⚠ No product ID found for translation slug: ${slug}`);
			continue;
		}

		for (const [locale, trans] of Object.entries(translations)) {
			await db.insert(productTranslations).values({
				productId,
				locale,
				name: trans.name,
				shortDescription: trans.shortDescription,
				fullDescription: trans.fullDescription,
				specOverrides: trans.specOverrides as any,
			});
		}
	}

	console.log(`✅ Seeded ${seedData.products.length} products with translations\n`);
	return productIdMap;
}

async function seedMedia(productIdMap: Map<string, string>, categoryIdMap: Map<string, string>) {
	console.log("🌱 Seeding media...");

	let count = 0;
	for (const mediaItem of seedData.media) {
		let productId = null;
		let categoryId = null;

		// Try to resolve Product ID first
		if (mediaItem.productSlug && productIdMap.has(mediaItem.productSlug)) {
			productId = productIdMap.get(mediaItem.productSlug)!;
		}
		// Try to resolve Category ID (using productSlug field as it contains the slug)
		else if (mediaItem.productSlug && categoryIdMap.has(mediaItem.productSlug)) {
			categoryId = categoryIdMap.get(mediaItem.productSlug)!;
		}
		// Explicit categorySlug check if provided
		else if (mediaItem.categorySlug && categoryIdMap.has(mediaItem.categorySlug)) {
			categoryId = categoryIdMap.get(mediaItem.categorySlug)!;
		}

		if (!productId && !categoryId) {
			console.warn(`  ⚠ Orphan media: ${mediaItem.productSlug} (No parent found)`);
			continue;
		}

		await db.insert(media).values({
			productId,
			categoryId,
			storageUrl: mediaItem.storageUrl,
			legacyCdnUrl: mediaItem.legacyCdnUrl,
			storagePath: mediaItem.storagePath || null,
			altText: mediaItem.altText,
			usageType: mediaItem.usageType,
			sortOrder: mediaItem.sortOrder,
			tags: mediaItem.tags || [],
		});
		count++;
	}

	console.log(`✅ Seeded ${count} media items\n`);
}


async function seedReviews() {
	console.log("🌱 Seeding reviews...");
	for (const review of reviewData) {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { id, ...reviewWithoutId } = review;
		await db.insert(reviews).values(reviewWithoutId);
	}
	console.log(`✅ Seeded ${reviewData.length} reviews\n`);
}

async function seedOrders() {
	console.log("🌱 Seeding orders...");
	for (const order of ordersSeedData) {
		await db.insert(orders).values(order);
	}
	console.log(`✅ Seeded ${ordersSeedData.length} orders\n`);
}

async function seedSales() {
	console.log("🌱 Seeding sales...");
	for (const sale of salesSeedData) {
		await db.insert(sales).values(sale);
	}
	console.log(`✅ Seeded ${salesSeedData.length} sales\n`);
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
	}
	console.log(`✅ Seeded ${promotersSeedData.length} promoters\n`);
}

async function seedFAQs() {
	console.log("🌱 Seeding FAQs...");
	let totalFaqs = 0;
	for (const [region, faqList] of Object.entries(faqsSeedData)) {
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
			}
		}
	}
	console.log(`✅ Seeded ${totalFaqs} FAQs\n`);
}

export async function seedCountries() {
	console.log("🌱 Seeding shipping zones and countries...");
	const zoneMap = new Map<string, string>();

	for (const zoneData of shippingZonesSeedData) {
		const [zone] = await db.insert(shippingZones).values(zoneData).returning();
		if (zone) zoneMap.set(zoneData.code, zone.id);
	}

	let countryCount = 0;
	for (const countryData of countriesSeedData) {
		const shippingZoneId = zoneMap.get(countryData.zone);
		await db.insert(countries).values({
			iso2: countryData.iso2,
			iso3: countryData.iso3,
			name: countryData.name,
			localName: countryData.localName,
			flagEmoji: countryData.flagEmoji,
			shippingZoneId,
			postOperatorCode: countryData.postOperatorCode,
			postZone: countryData.postZone,
			isShippingEnabled: countryData.isShippingEnabled ?? true,
			isSuspended: countryData.isSuspended ?? false,
			suspensionReason: countryData.suspensionReason,
			requiresCustoms: countryData.requiresCustoms ?? false,
			requiresPhoneNumber: countryData.requiresPhoneNumber ?? false,
			notes: countryData.notes,
		});
		countryCount++;
	}
	console.log(`✅ Seeded ${countryCount} countries\n`);
}

async function main() {
	try {
		console.log("🚀 Starting seed...\n");

		await seedUsers();
		const categoryIdMap = await seedCategories();
		const productIdMap = await seedProducts(categoryIdMap);
		await seedMedia(productIdMap, categoryIdMap);

		await seedReviews();
		await seedOrders();
		await seedSales();
		await seedPromoters();
		await seedFAQs();
		await seedCountries();

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