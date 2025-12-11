#!/usr/bin/env bun
// @ts-nocheck
// src/server/db/seed/seed.ts

import { drizzle } from "drizzle-orm/postgres-js";
import { eq } from "drizzle-orm";
import postgres from "postgres";
import {
	users, addresses,
	categories, categoryTranslations,

	// Core Product/Media/Content Tables
	productTranslations, media,
	reviews, faqs, faqTranslations,
	shippingZones, countries,

	// Selling/Promo Tables
	orders, orderItems, orderStatusHistory,
	promoters, promoterCodes, sales,

	// 🎯 V2 Relational Tables
	products,
	productPricing, pricingBundles,
	productAddons,
	customizationOptions, selectOptions,
	productMarketExclusions,

} from "../schema";

// Auth & Admin
import { usersSeedData, addressesSeedData } from "./data/seed-users";

// 🎯 V2 PRODUCT LINES (Complete Import)
import { productLine as aquariumDecorations } from "./data/productLines/aquarium-decorations";
import { productLine as threeDBackgrounds } from "./data/productLines/3d-backgrounds";

// Selling
import { ordersSeedData } from "./data/seed-orders";
import { promotersSeedData } from "./data/seed-promoters";
import { salesSeedData } from "./data/seed-sales";

// Content
import { reviewData } from "./data/seed-reviews";
import { faqsSeedData } from "./data/seed-faqs";
import { shippingZonesSeedData, countriesSeedData } from "./data/seed-countries";


const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
	throw new Error("DATABASE_URL not set");
}

const client = postgres(connectionString);
const db = drizzle(client);

// ============================================================================
// SEED FUNCTIONS
// ============================================================================

async function seedUsers() {
	console.log("🌱 Seeding users and addresses...");

	const userMap = new Map<string, string>(); // email -> id

	for (const userData of usersSeedData) {
		const existing = await db.select().from(users).where(eq(users.email, userData.email)).limit(1);
		let userId = "";

		if (existing.length > 0) {
			userId = existing[0]!.id;
		} else {
			const [inserted] = await db.insert(users).values(userData).returning();
			userId = inserted!.id;
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
	return userMap;
}

async function seedCategories() {
	console.log("🌱 Seeding categories...");

	const categoryIdMap = new Map<string, string>();

	// Combine both product lines
	const allCategories = [
		...aquariumDecorations.categories,
		...threeDBackgrounds.categories,
	];

	const allCategoryTranslations = {
		...aquariumDecorations.categoryTranslations,
		...threeDBackgrounds.categoryTranslations,
	};

	// 1. Insert Categories
	for (const cat of allCategories) {
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
		}
	}

	// 2. Insert Translations
	for (const [slug, translations] of Object.entries(allCategoryTranslations)) {
		const categoryId = categoryIdMap.get(slug);
		if (!categoryId) {
			console.warn(`  ⚠ No category ID found for translation slug: ${slug}`);
			continue;
		}

		for (const [locale, trans] of Object.entries(translations as any)) {
			await db.insert(categoryTranslations).values({
				categoryId,
				locale,
				name: trans.name,
				description: trans.description,
				metaTitle: trans.metaTitle,
				metaDescription: trans.metaDescription,
			});
		}
	}

	console.log(`✅ Seeded ${allCategories.length} categories with translations\n`);
	return categoryIdMap;
}

// 🎯 CLEAN V2 seedProducts FUNCTION
async function seedProducts(categoryIdMap: Map<string, string>) {
	console.log("🌱 Seeding products (V2 Normalized)...");

	const productIdMap = new Map<string, string>();
	const pricingIdMap = new Map<string, string>();
	const customOptionIdMap = new Map<string, string>();

	let pricingCount = 0;
	let bundleCount = 0;
	let addonCount = 0;
	let customOptionCount = 0;
	let selectOptionCount = 0;
	let exclusionCount = 0;

	// Combine both product lines
	const allProducts = [
		...aquariumDecorations.products,
		...threeDBackgrounds.products,
	];

	const allPricing = [
		...aquariumDecorations.pricing,
		...threeDBackgrounds.pricing,
	];

	const allBundles = [
		...aquariumDecorations.bundles,
		...threeDBackgrounds.bundles,
	];

	const allAddons = [
		...aquariumDecorations.addons,
		...threeDBackgrounds.addons,
	];

	const allCustomizationOptions = [
		...(aquariumDecorations.customizationOptions || []),
		// 3D backgrounds don't have customization yet
	];

	const allSelectOptions = [
		...(aquariumDecorations.selectOptions || []),
		// 3D backgrounds don't have select options yet
	];

	const allMarketExclusions = [
		...aquariumDecorations.marketExclusions,
		...threeDBackgrounds.marketExclusions,
	];

	const allTranslations = {
		...aquariumDecorations.translations,
		...threeDBackgrounds.translations,
	};

	// --- 1. Insert Core Products ---
	console.log(`  📦 Inserting ${allProducts.length} products...`);
	for (const prod of allProducts) {
		const categoryId = categoryIdMap.get(prod.categorySlug);
		if (!categoryId) {
			console.warn(`  ⚠ No category found for product: ${prod.slug} (cat: ${prod.categorySlug})`);
			continue;
		}

		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { categorySlug, ...coreProductData } = prod;
		const [insertedProduct] = await db.insert(products).values({
			...coreProductData,
			categoryId
		}).returning();

		if (!insertedProduct) continue;

		productIdMap.set(prod.slug, insertedProduct.id);
	}
	console.log(`  ✅ Inserted ${productIdMap.size} products`);

	// --- 2. Insert Pricing and Bundles ---
	console.log(`  💰 Inserting pricing...`);
	for (const pricing of allPricing) {
		const productId = productIdMap.get(pricing.productSlug);
		if (!productId) continue;

		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { productSlug, slug, ...pricingDataInsert } = pricing;

		const [insertedPricing] = await db.insert(productPricing).values({
			...pricingDataInsert,
			productId
		}).returning();
		if (!insertedPricing) continue;

		pricingIdMap.set(slug, insertedPricing.id);
		pricingCount++;

		// Insert Bundles (linked by pricing slug)
		const bundles = allBundles.filter(b => b.pricingSlug === pricing.slug);
		for (const bundle of bundles) {
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			const { pricingSlug, ...bundleData } = bundle;
			await db.insert(pricingBundles).values({
				...bundleData,
				pricingId: insertedPricing.id
			});
			bundleCount++;
		}
	}
	console.log(`  ✅ Inserted ${pricingCount} pricing configs, ${bundleCount} bundles`);

	// --- 3. Insert Market Exclusions ---
	console.log(`  🌍 Inserting market exclusions...`);
	for (const exclusion of allMarketExclusions) {
		const productId = productIdMap.get(exclusion.productSlug);
		if (!productId) continue;

		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { productSlug, ...exclusionData } = exclusion;
		await db.insert(productMarketExclusions).values({
			...exclusionData,
			productId
		});
		exclusionCount++;
	}
	console.log(`  ✅ Inserted ${exclusionCount} market exclusions`);

	// --- 4. Insert Addons ---
	console.log(`  🎁 Inserting addons...`);
	for (const addon of allAddons) {
		const productId = productIdMap.get(addon.productSlug);
		if (!productId) continue;

		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { productSlug, ...addonData } = addon;
		await db.insert(productAddons).values({
			...addonData,
			productId
		});
		addonCount++;
	}
	console.log(`  ✅ Inserted ${addonCount} addons`);

	// --- 5. Insert Customization Options and Select Options ---
	console.log(`  ⚙️  Inserting customization options...`);
	for (const option of allCustomizationOptions) {
		const productId = productIdMap.get(option.productSlug);
		if (!productId) continue;

		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { productSlug, slug, ...optionData } = option;

		const [insertedOption] = await db.insert(customizationOptions).values({
			...optionData,
			productId
		}).returning();
		if (!insertedOption) continue;

		customOptionIdMap.set(slug, insertedOption.id);
		customOptionCount++;

		// Insert Select Options (linked by option slug)
		const selects = allSelectOptions.filter(s => s.customizationOptionSlug === slug);
		for (const selectOption of selects) {
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			const { customizationOptionSlug, ...selectData } = selectOption;
			await db.insert(selectOptions).values({
				...selectData,
				customizationOptionId: insertedOption.id
			});
			selectOptionCount++;
		}
	}
	console.log(`  ✅ Inserted ${customOptionCount} customization options, ${selectOptionCount} select options`);

	// --- 6. Insert Translations ---
	console.log(`  🌐 Inserting translations...`);
	let translationCount = 0;
	for (const [slug, translations] of Object.entries(allTranslations)) {
		const productId = productIdMap.get(slug);
		if (!productId) continue;

		for (const [locale, trans] of Object.entries(translations as any)) {
			await db.insert(productTranslations).values({
				productId,
				locale,
				name: trans.name,
				shortDescription: trans.shortDescription,
				longDescription: trans.fullDescription || trans.description,
				metaTitle: trans.metaTitle,
				metaDescription: trans.metaDescription,
			});
			translationCount++;
		}
	}
	console.log(`  ✅ Inserted ${translationCount} translations`);

	console.log(`\n✅ Product seeding complete!\n`);
	return productIdMap;
}

async function seedMedia(productIdMap: Map<string, string>, categoryIdMap: Map<string, string>) {
	console.log("🌱 Seeding media...");

	// Combine both product lines
	const allMedia = [
		...aquariumDecorations.media,
		...threeDBackgrounds.media,
	];

	let count = 0;
	for (const mediaItem of allMedia) {
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

		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { productSlug, categorySlug, ...mediaData } = mediaItem;

		await db.insert(media).values({
			...mediaData,
			productId: productId || null,
			categoryId: categoryId || null,
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

// async function seedReviews(productIdMap: Map<string, string>, userMap: Map<string, string>) {
// 	console.log("🌱 Seeding reviews...");

// 	let count = 0;
// 	for (const review of reviewData) {
// 		const productId = productIdMap.get(review.productSlug);
// 		const userId = userMap.get(review.userEmail);
// 		if (!productId || !userId) continue;

// 		// eslint-disable-next-line @typescript-eslint/no-unused-vars
// 		const { productSlug, userEmail, ...reviewBody } = review;

// 		await db.insert(reviews).values({
// 			...reviewBody,
// 			productId,
// 			userId,
// 		});
// 		count++;
// 	}

// 	console.log(`✅ Seeded ${count} reviews\n`);
// }

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


// async function seedFAQs() {
// 	console.log("🌱 Seeding FAQs...");

// 	const faqIdMap = new Map<string, string>();

// 	for (const faq of faqsSeedData) {
// 		const [inserted] = await db.insert(faqs).values({
// 			category: faq.category,
// 			sortOrder: faq.sortOrder,
// 			isActive: faq.isActive,
// 		}).returning();

// 		if (inserted) {
// 			faqIdMap.set(`${faq.category}-${faq.sortOrder}`, inserted.id);
// 		}
// 	}

// 	for (const faq of faqsSeedData) {
// 		const faqId = faqIdMap.get(`${faq.category}-${faq.sortOrder}`);
// 		if (!faqId) continue;

// 		for (const [locale, trans] of Object.entries(faq.translations)) {
// 			await db.insert(faqTranslations).values({
// 				faqId,
// 				locale,
// 				question: trans.question,
// 				answer: trans.answer,
// 			});
// 		}
// 	}

// 	console.log(`✅ Seeded ${faqsSeedData.length} FAQs with translations\n`);
// }

async function seedShippingAndCountries() {
	console.log("🌱 Seeding shipping zones and countries...");

	const zoneIdMap = new Map<string, string>();

	for (const zone of shippingZonesSeedData) {
		const [inserted] = await db.insert(shippingZones).values(zone).returning();
		if (inserted) {
			zoneIdMap.set(zone.name, inserted.id);
		}
	}

	for (const country of countriesSeedData) {
		const zoneId = zoneIdMap.get(country.zoneName);
		if (!zoneId) continue;

		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { zoneName, ...countryData } = country;

		await db.insert(countries).values({
			...countryData,
			shippingZoneId: zoneId,
		});
	}

	console.log(`✅ Seeded ${shippingZonesSeedData.length} shipping zones and ${countriesSeedData.length} countries\n`);
}

async function seedPromotersAndSales() {
	console.log("🌱 Seeding promoters and sales...");

	const promoterIdMap = new Map<string, string>();

	for (const promoter of promotersSeedData) {
		const [inserted] = await db.insert(promoters).values({
			name: promoter.name,
			email: promoter.email,
			commissionRate: promoter.commissionRate,
			isActive: promoter.isActive,
		}).returning();

		if (inserted) {
			promoterIdMap.set(promoter.email, inserted.id);
		}
	}

	for (const promoter of promotersSeedData) {
		const promoterId = promoterIdMap.get(promoter.email);
		if (!promoterId) continue;

		for (const code of promoter.codes) {
			await db.insert(promoterCodes).values({
				...code,
				promoterId,
			});
		}
	}

	for (const sale of salesSeedData) {
		await db.insert(sales).values(sale);
	}

	console.log(`✅ Seeded ${promotersSeedData.length} promoters and ${salesSeedData.length} sales\n`);
}

async function seedOrders(productIdMap: Map<string, string>) {
	console.log("🌱 Seeding orders...");

	for (const order of ordersSeedData) {
		const [insertedOrder] = await db.insert(orders).values({
			email: order.email,
			firstName: order.firstName,
			lastName: order.lastName,
			phone: order.phone,
			totalAmountEurCents: order.totalAmountEurCents,
			status: order.status,
			paymentMethod: order.paymentMethod,
			shippingAddress: order.shippingAddress,
			billingAddress: order.billingAddress,
		}).returning();

		if (!insertedOrder) continue;

		// Insert order items
		for (const item of order.items) {
			const productId = productIdMap.get(item.productSlug);
			if (!productId) continue;

			await db.insert(orderItems).values({
				orderId: insertedOrder.id,
				productId,
				quantity: item.quantity,
				unitPriceEurCents: item.unitPriceEurCents,
				pricingSnapshot: item.pricingSnapshot,
			});
		}

		// Insert status history
		if (order.statusHistory) {
			for (const history of order.statusHistory) {
				await db.insert(orderStatusHistory).values({
					orderId: insertedOrder.id,
					status: history.status,
					notes: history.notes,
					createdAt: history.createdAt,
				});
			}
		}
	}

	console.log(`✅ Seeded ${ordersSeedData.length} orders\n`);
}

// ============================================================================
// MAIN SEED
// ============================================================================

async function main() {
	console.log("\n🚀 Starting database seed...\n");

	try {
		const userMap = await seedUsers();
		const categoryIdMap = await seedCategories();
		const productIdMap = await seedProducts(categoryIdMap);

		await seedMedia(productIdMap, categoryIdMap);
		await seedReviews(productIdMap, userMap);
		await seedFAQs();
		await seedShippingAndCountries();
		await seedPromotersAndSales();
		await seedOrders(productIdMap);

		console.log("✨ Database seeding complete!\n");
	} catch (error) {
		console.error("❌ Seeding failed:", error);
		process.exit(1);
	} finally {
		await client.end();
	}
}

main();