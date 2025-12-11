#!/usr/bin/env bun
// @ts-nocheck
// src/server/db/seed/seed.ts

import { drizzle } from "drizzle-orm/postgres-js";
import { eq } from "drizzle-orm";
import postgres from "postgres";
import {
	users, addresses,
	categories as categoriesTable,
	categoryTranslations as categoryTranslationsTable,
	productTranslations,
	media as mediaTable,
	reviews, faqs, faqTranslations,
	shippingZones, countries,
	orders, orderItems,
	promoters, promoterCodes, sales,
	products as productsTable,
	productPricing, pricingBundles,
	productAddons,
	customizationOptions as customizationOptionsTable,
	selectOptions as selectOptionsTable,
	productMarketExclusions,
} from "../schema";

// auth & admin
import { usersSeedData, addressesSeedData } from "./data/seed-users";

// NEW V2 Structure - Magical Items Test Data
import { productLine as aquariumDecorations } from "./data/productLines/aquarium-decorations";
import { productLine as threeDBackgrounds } from "./data/productLines/3d-backgrounds";

import { products as magicalProducts } from "./data/productLines/aquarium-decorations/magical-items/products";
import {
	pricing as magicalPricing,
	bundles as magicalBundles,
	addons as magicalAddons,
	customizationOptions as magicalCustomOptions,
	selectOptions as magicalSelectOptions,
	marketExclusions as magicalMarketExclusions,
} from "./data/productLines/aquarium-decorations/magical-items/pricing";
import { media as magicalMedia } from "./data/productLines/aquarium-decorations/magical-items/media";
import { translations as magicalTranslations } from "./data/productLines/aquarium-decorations/magical-items/translations";

// Categories (seed data, not schema)
import { categories as categoriesSeedData } from "./data/productLines/aquarium-decorations/categories";
import { categoryTranslations as categoryTranslationsSeedData } from "./data/productLines/aquarium-decorations/category-translations";

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

	// 1. Insert Categories
	for (const cat of categoriesSeedData) {
		const [inserted] = await db.insert(categoriesTable).values({
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
	for (const [slug, translations] of Object.entries(categoryTranslationsSeedData)) {
		const categoryId = categoryIdMap.get(slug);
		if (!categoryId) {
			console.warn(`  ⚠ No category ID found for translation slug: ${slug}`);
			continue;
		}

		for (const [locale, trans] of Object.entries(translations as Record<string, any>)) {
			await db.insert(categoryTranslationsTable).values({
				categoryId,
				locale,
				name: trans.name,
				description: trans.description,
				metaTitle: trans.metaTitle || null,
				metaDescription: trans.metaDescription || null,
			});
		}
	}

	console.log(`✅ Seeded ${categoriesSeedData.length} categories with translations\n`);
	return categoryIdMap;
}

async function seedProducts(categoryIdMap: Map<string, string>) {
	console.log("🌱 Seeding products (V2 Normalized Structure)...");

	const productIdMap = new Map<string, string>();
	const pricingIdMap = new Map<string, string>();
	const customOptionIdMap = new Map<string, string>();

	let pricingCount = 0;
	let bundleCount = 0;
	let addonCount = 0;
	let customOptionCount = 0;
	let selectOptionCount = 0;

	// --- 1. Insert Core Products ---
	for (const prod of magicalProducts) {
		const categoryId = categoryIdMap.get(prod.categorySlug);
		if (!categoryId) {
			console.warn(`  ⚠ No category found for product slug: ${prod.slug}`);
			continue;
		}

		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { categorySlug, ...coreProductData } = prod;
		const [insertedProduct] = await db.insert(productsTable).values({
			...coreProductData,
			categoryId,
		}).returning();

		if (!insertedProduct) continue;

		productIdMap.set(prod.slug, insertedProduct.id);
		console.log(`  ✓ ${prod.sku} - ${prod.slug}`);
	}

	// --- 2. Insert Pricing and Bundles ---
	for (const pricingItem of magicalPricing) {
		const productId = productIdMap.get(pricingItem.productSlug);
		if (!productId) continue;

		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { productSlug, slug, ...pricingDataInsert } = pricingItem;

		const [insertedPricing] = await db.insert(productPricing).values({
			...pricingDataInsert,
			productId,
		}).returning();

		if (!insertedPricing) continue;

		pricingIdMap.set(slug, insertedPricing.id);
		pricingCount++;

		// Insert Bundles (linked by pricing slug)
		const relatedBundles = magicalBundles.filter(b => b.pricingSlug === slug);
		for (const bundle of relatedBundles) {
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			const { pricingSlug, ...bundleData } = bundle;
			await db.insert(pricingBundles).values({
				...bundleData,
				pricingId: insertedPricing.id,
			});
			bundleCount++;
		}
	}

	// --- 3. Insert Market Exclusions ---
	for (const exclusion of magicalMarketExclusions) {
		const productId = productIdMap.get(exclusion.productSlug);
		if (!productId) continue;

		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { productSlug, ...exclusionData } = exclusion;
		await db.insert(productMarketExclusions).values({
			...exclusionData,
			productId,
		});
	}

	// --- 4. Insert Addons ---
	for (const addon of magicalAddons) {
		const productId = productIdMap.get(addon.productSlug);
		if (!productId) continue;

		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { productSlug, ...addonData } = addon;
		await db.insert(productAddons).values({
			...addonData,
			productId,
		});
		addonCount++;
	}

	// --- 5. Insert Customization Options and Select Options ---
	for (const option of magicalCustomOptions) {
		const productId = productIdMap.get(option.productSlug);
		if (!productId) continue;

		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { productSlug, slug, ...optionData } = option;

		const [insertedOption] = await db.insert(customizationOptionsTable).values({
			...optionData,
			productId,
		}).returning();

		if (!insertedOption) continue;

		customOptionIdMap.set(slug, insertedOption.id);
		customOptionCount++;

		// Insert Select Options (linked by option slug)
		const relatedSelects = magicalSelectOptions.filter(s => s.customizationOptionSlug === slug);
		for (const selectOption of relatedSelects) {
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			const { customizationOptionSlug, ...selectData } = selectOption;
			await db.insert(selectOptionsTable).values({
				...selectData,
				customizationOptionId: insertedOption.id,
			});
			selectOptionCount++;
		}
	}

	// --- 6. Insert Translations ---
	for (const [slug, translations] of Object.entries(magicalTranslations)) {
		const productId = productIdMap.get(slug);
		if (!productId) continue;

		for (const [locale, trans] of Object.entries(translations)) {
			await db.insert(productTranslations).values({
				productId,
				locale,
				name: trans.name,
				shortDescription: trans.shortDescription,
				longDescription: trans.fullDescription,
				metaTitle: trans.metaTitle,
				metaDescription: trans.metaDescription,
			});
		}
	}

	console.log(`✅ Seeded ${productIdMap.size} products with:`);
	console.log(`   - ${pricingCount} pricing configs`);
	console.log(`   - ${bundleCount} pricing bundles`);
	console.log(`   - ${addonCount} product addons`);
	console.log(`   - ${customOptionCount} customization options`);
	console.log(`   - ${selectOptionCount} select options`);
	console.log(`\n`);

	return productIdMap;
}

async function seedMedia(productIdMap: Map<string, string>, categoryIdMap: Map<string, string>) {
	console.log("🌱 Seeding media...");

	let count = 0;
	for (const mediaItem of magicalMedia) {
		let productId = null;
		let categoryId = null;

		// Try to resolve Product ID
		if (mediaItem.productSlug && productIdMap.has(mediaItem.productSlug)) {
			productId = productIdMap.get(mediaItem.productSlug)!;
		}
		// Try to resolve Category ID
		else if (mediaItem.categorySlug && categoryIdMap.has(mediaItem.categorySlug)) {
			categoryId = categoryIdMap.get(mediaItem.categorySlug)!;
		}

		if (!productId && !categoryId) {
			console.warn(`  ⚠ Orphan media: ${mediaItem.productSlug || mediaItem.categorySlug} (No parent found)`);
			continue;
		}

		await db.insert(mediaTable).values({
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

async function seedOrders(productIdMap: Map<string, string>) {
	console.log("🌱 Seeding orders...");

	for (const order of ordersSeedData) {
		const [insertedOrder] = await db.insert(orders).values({
			orderNumber: order.orderNumber,
			email: order.email,
			firstName: order.firstName,
			lastName: order.lastName,
			status: order.status,
			paymentStatus: order.paymentStatus,
			subtotal: order.subtotal,
			discount: order.discount,
			shipping: order.shipping,
			tax: order.tax,
			total: order.total,
			currency: order.currency,
			market: order.market,
			countryCode: order.countryCode,
			discountCode: order.discountCode || null,
			customerNotes: order.customerNotes || null,
			createdAt: order.createdAt,
			paidAt: order.paidAt || null,
			shippedAt: order.shippedAt || null,
		}).returning();

		if (insertedOrder && order.items?.length) {
			for (const item of order.items) {
				// Map productSlug to actual productId
				const actualProductId = productIdMap.get(item.productSlug);
				if (!actualProductId) {
					console.warn(`  ⚠ Product not found: ${item.productSlug}, skipping order item`);
					continue;
				}

				await db.insert(orderItems).values({
					orderId: insertedOrder.id,
					productId: actualProductId,
					productName: item.productName,
					sku: item.sku,
					productSlug: item.productSlug,
					quantity: item.quantity,
					pricePerUnit: item.pricePerUnit,
					subtotal: item.subtotal,
					addonsTotal: item.addonsTotal,
					customizationsTotal: item.customizationsTotal,
					total: item.total,
					isCustom: item.isCustom,
					productionStatus: item.productionStatus || null,
					pricingSnapshot: item.pricingSnapshot as any,
				});
			}
		}
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

		const userMap = await seedUsers();
		const categoryIdMap = await seedCategories();
		const productIdMap = await seedProducts(categoryIdMap);
		await seedMedia(productIdMap, categoryIdMap);

		await seedReviews();
		await seedOrders(productIdMap); // Pass productIdMap instead of userMap
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