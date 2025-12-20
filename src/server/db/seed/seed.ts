#!/usr/bin/env bun
// src/server/db/seed/seed.ts

import { drizzle } from "drizzle-orm/postgres-js";
import { eq } from "drizzle-orm";
import postgres from "postgres";
import {
	users, addresses,
	categories, categoryTranslations,

	// Core Product/Media/Content Tables
	productTranslations, media,
	reviews,
	shippingZones, countries,

	faqs, faqCategories, faqCategoryTranslations, faqTranslations,

	// Selling/Promo Tables
	orders, orderItems, orderStatusHistory,
	promoters, promoterCodes, sales,

	// 🎯 V2 Relational Tables
	products,
	productPricing, pricingBundles,
	productAddons,
	customizationOptions, selectOptions,
	productMarketExclusions,
	
	// email
	emailSubscribers,

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

// email
import { subscribersSeedData } from "./data/seed-subscribers";

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

		for (const [locale, trans] of Object.entries(translations)) {
			// Type assertion for translation object
			const translation = trans as {
				name: string;
				description?: string;
				metaTitle?: string;
				metaDescription?: string;
			};

			await db.insert(categoryTranslations).values({
				categoryId,
				locale,
				name: translation.name,
				description: translation.description,
				metaTitle: translation.metaTitle,
				metaDescription: translation.metaDescription,
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

	// --- 5. Insert Customization Options ---
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

		if (insertedOption) {
			customOptionIdMap.set(slug, insertedOption.id);
			customOptionCount++;
		}
	}
	console.log(`  ✅ Inserted ${customOptionCount} customization options`);

	// --- 6. Insert Select Options ---
	console.log(`  📋 Inserting select options...`);
	for (const selectOpt of allSelectOptions) {
		const customOptionId = customOptionIdMap.get(selectOpt.customizationOptionSlug);
		if (!customOptionId) continue;

		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { customizationOptionSlug, ...selectData } = selectOpt;
		await db.insert(selectOptions).values({
			...selectData,
			customizationOptionId: customOptionId
		});
		selectOptionCount++;
	}
	console.log(`  ✅ Inserted ${selectOptionCount} select options`);

	// --- 7. Insert Product Translations ---
	console.log(`  🌐 Inserting product translations...`);
	let translationCount = 0;
	for (const [slug, translations] of Object.entries(allTranslations)) {
		const productId = productIdMap.get(slug);
		if (!productId) {
			console.warn(`  ⚠ No product ID found for translation slug: ${slug}`);
			continue;
		}

		for (const [locale, trans] of Object.entries(translations)) {
			// Type assertion for translation object
			const translation = trans as {
				name: string;
				shortDescription?: string;
				fullDescription?: string;
				description?: string;
				metaTitle?: string;
				metaDescription?: string;
			};

			await db.insert(productTranslations).values({
				productId,
				locale,
				name: translation.name,
				shortDescription: translation.shortDescription,
				longDescription: translation.fullDescription || translation.description,
				metaTitle: translation.metaTitle,
				metaDescription: translation.metaDescription,
			});
			translationCount++;
		}
	}
	console.log(`  ✅ Inserted ${translationCount} product translations`);

	console.log(`\n✅ Product seeding complete!`);
	console.log(`   Products: ${productIdMap.size}`);
	console.log(`   Pricing: ${pricingCount}, Bundles: ${bundleCount}`);
	console.log(`   Addons: ${addonCount}`);
	console.log(`   Customization: ${customOptionCount} options, ${selectOptionCount} select options`);
	console.log(`   Market Exclusions: ${exclusionCount}`);
	console.log(`   Translations: ${translationCount}\n`);

	return productIdMap;
}

async function seedMedia(productIdMap: Map<string, string>, categoryIdMap: Map<string, string>) {
	console.log("🌱 Seeding media...");
	let count = 0;

	const allMedia = [
		...aquariumDecorations.media,
		...threeDBackgrounds.media,
	];

	for (const mediaItem of allMedia) {
		const productId = mediaItem.productSlug ? productIdMap.get(mediaItem.productSlug) : null;
		const categoryId = mediaItem.categorySlug ? categoryIdMap.get(mediaItem.categorySlug) : null;

		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { productSlug, categorySlug, ...mediaData } = mediaItem;

		await db.insert(media).values({
			...mediaData,
			productId,
			categoryId,
		});
		count++;
	}
	console.log(`✅ Seeded ${count} media items\n`);
}

async function seedReviews() {
	console.log("🌱 Seeding reviews...");

	for (const review of reviewData) {
		await db.insert(reviews).values(review);
	}

	console.log(`✅ Seeded ${reviewData.length} reviews\n`);
}


async function seedFAQs() {
	console.log("🌱 Seeding FAQs with Categories...");
	let totalCategories = 0;
	let totalFaqs = 0;

	for (const catData of faqsSeedData) {
		// 1. Create Category
		const [category] = await db.insert(faqCategories).values({
			slug: catData.slug,
			icon: catData.icon,
			sortOrder: catData.sortOrder,
			isActive: true,
		}).returning();

		if (!category) continue;
		totalCategories++;

		// 2. Create Category Translations
		for (const [locale, trans] of Object.entries(catData.translations)) {
			await db.insert(faqCategoryTranslations).values({
				categoryId: category.id,
				locale,
				name: trans.name,
			});
		}

		// 3. Create FAQs and Translations
		for (const item of catData.items) {
			const [faq] = await db.insert(faqs).values({
				categoryId: category.id,
				region: item.region,
				sortOrder: item.sortOrder,
				isActive: true,
			}).returning();

			if (!faq) continue;
			totalFaqs++;

			// Insert translations for this FAQ (en, de)
			for (const [locale, trans] of Object.entries(item.translations)) {
				await db.insert(faqTranslations).values({
					faqId: faq.id,
					locale,
					question: trans.question,
					answer: trans.answer,
				});
			}
		}
	}
	console.log(`✅ Seeded ${totalCategories} categories and ${totalFaqs} FAQs (with translations)\n`);
}

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
		// Type assertion for country data with zoneName
		const countryWithZone = country as typeof country & { zoneName?: string };
		const zoneId = countryWithZone.zoneName ? zoneIdMap.get(countryWithZone.zoneName) : null;

		if (!zoneId) {
			console.warn(`  ⚠ No zone found for country: ${country.name}`);
			continue;
		}

		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { zoneName, ...countryData } = countryWithZone;

		await db.insert(countries).values({
			...countryData,
			shippingZoneId: zoneId,
		});
	}

	console.log(`✅ Seeded ${shippingZonesSeedData.length} shipping zones and ${countriesSeedData.length} countries\n`);
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

async function seedSubscribers() {
	console.log("🌱 Seeding email subscribers...");

	for (const subscriber of subscribersSeedData) {
		const existing = await db
			.select()
			.from(emailSubscribers)
			.where(eq(emailSubscribers.email, subscriber.email))
			.limit(1);

		if (existing.length === 0) {
			await db.insert(emailSubscribers).values(subscriber);
		}
	}

	console.log(`✅ Seeded ${subscribersSeedData.length} email subscribers\n`);
}


async function main() {
	console.log("\n🚀 Starting database seed...\n");

	try {
		const userMap = await seedUsers();
		const categoryIdMap = await seedCategories();
		const productIdMap = await seedProducts(categoryIdMap);

		await seedMedia(productIdMap, categoryIdMap);
		await seedReviews();
		await seedFAQs();
		await seedShippingAndCountries();
		await seedOrders(productIdMap);
		await seedPromoters();
		
		await seedSubscribers();

		console.log("✨ Database seeding complete!\n");
	} catch (error) {
		console.error("❌ Seeding failed:", error);
		process.exit(1);
	} finally {
		await client.end();
	}
}

main();