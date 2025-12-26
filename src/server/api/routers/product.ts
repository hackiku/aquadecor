// src/server/api/routers/product.ts

import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import {
	categories,
	products,
	productTranslations,
	productPricing,
	pricingBundles,
	productAddons,
	customizationOptions,
	selectOptions,
	productMarketExclusions,
	media,
	categoryTranslations,
	sales, // Required for discount engine
} from "~/server/db/schema";
import { eq, and, inArray, lte, gte, desc } from "drizzle-orm";

// ============================================================================
// HELPER: DISCOUNT ENGINE
// ============================================================================

/**
 * Calculates the sale price for a single product based on active sales rules.
 */
function calculateSalePrice(
	basePriceCents: number | null | undefined,
	productId: string,
	categoryId: string,
	productLineSlug: string | null | undefined,
	activeSales: typeof sales.$inferSelect[],
	userMarket: string
) {
	// If no base price, we can't have a sale price
	if (!basePriceCents) return { salePrice: null, activeSale: null };

	// Find the first applicable sale
	// Priority: The first sale in the list that matches the criteria wins.
	const applicableSale = activeSales.find((sale) => {
		// 1. Check Market (Is this sale allowed in this region?)
		if (sale.targetMarkets && !sale.targetMarkets.includes(userMarket)) return false;

		// 2. Check Scope (Does it target this product?)
		if (sale.targetType === "all") return true;

		if (sale.targetType === "specific_products" && sale.targetProductIds?.includes(productId)) {
			return true;
		}

		if (sale.targetType === "category" && sale.targetCategoryIds?.includes(categoryId)) {
			return true;
		}

		// (Optional: Logic for Product Line targeting if needed)
		// if (sale.targetType === "product_line" && ...) return true;

		return false;
	});

	if (!applicableSale) return { salePrice: null, activeSale: null };

	// Calculate the new price
	let salePrice = basePriceCents;
	const discountType = applicableSale.type || 'percentage'; // Default to %

	if (discountType === "percentage") {
		const percent = applicableSale.discountPercent || 0;
		const discountAmount = Math.round(basePriceCents * (percent / 100));
		salePrice = Math.max(0, basePriceCents - discountAmount);
	} else if (discountType === "fixed_amount") {
		const amount = applicableSale.discountAmountCents || 0;
		salePrice = Math.max(0, basePriceCents - amount);
	}

	return {
		salePrice, // The calculated lower price in cents
		activeSale: {
			id: applicableSale.id,
			name: applicableSale.name,
			type: discountType,
			value: discountType === 'percentage' ? applicableSale.discountPercent : applicableSale.discountAmountCents,
			slug: applicableSale.slug,
		},
	};
}

// ============================================================================
// ROUTER
// ============================================================================

export const productRouter = createTRPCRouter({

	// ============================================================================
	// CATEGORIES
	// ============================================================================

	getCategoryMetadata: publicProcedure
		.input(z.object({
			categorySlug: z.string(),
		}))
		.query(async ({ ctx, input }) => {
			const [category] = await ctx.db
				.select({
					slug: categories.slug,
					productLine: categories.productLine,
					modelCode: categories.modelCode,
				})
				.from(categories)
				.where(eq(categories.slug, input.categorySlug))
				.limit(1);

			return category;
		}),

	getCategoriesForProductLine: publicProcedure
		.input(z.object({
			productLineSlug: z.string(),
			locale: z.string().default("en"),
		}))
		.query(async ({ ctx, input }) => {
			const results = await ctx.db
				.select({
					id: categories.id,
					slug: categories.slug,
					productLine: categories.productLine,
					modelCode: categories.modelCode,
					sortOrder: categories.sortOrder,
					contentBlocks: categories.contentBlocks,
					name: categoryTranslations.name,
					description: categoryTranslations.description,
					heroImageUrl: media.storageUrl,
				})
				.from(categories)
				.leftJoin(
					categoryTranslations,
					and(
						eq(categoryTranslations.categoryId, categories.id),
						eq(categoryTranslations.locale, input.locale)
					)
				)
				.leftJoin(
					media,
					and(
						eq(media.categoryId, categories.id),
						eq(media.usageType, "category"),
						eq(media.sortOrder, 0)
					)
				)
				.where(
					and(
						eq(categories.productLine, input.productLineSlug),
						eq(categories.isActive, true)
					)
				)
				.orderBy(categories.sortOrder);

			return results;
		}),

	// ============================================================================
	// PRODUCT LISTINGS (Catalog View)
	// ============================================================================

	getByCategory: publicProcedure
		.input(
			z.object({
				categorySlug: z.string(),
				locale: z.string().default("en"),
				userMarket: z.string().default("ROW"), // 'ROW' | 'US'
			}),
		)
		.query(async ({ ctx, input }) => {
			const resolvedMarket = input.userMarket === "US" ? "US" : "ROW";
			const now = new Date();

			// 1. Fetch Active Sales
			const activeSales = await ctx.db
				.select()
				.from(sales)
				.where(
					and(
						eq(sales.isActive, true),
						lte(sales.startsAt, now),
						gte(sales.endsAt, now)
					)
				);

			// 2. Fetch Category
			const [category] = await ctx.db.select().from(categories).where(eq(categories.slug, input.categorySlug)).limit(1);
			if (!category) {
				return { products: [], categorySlug: input.categorySlug, productLineSlug: null };
			}

			// 3. Fetch Products
			const rawProducts = await ctx.db
				.select({
					id: products.id,
					slug: products.slug,
					sku: products.sku,
					stockStatus: products.stockStatus,
					categoryId: products.categoryId,
					productLineSlug: categories.productLine,

					// Basic pricing
					pricingId: productPricing.id,
					pricingType: productPricing.pricingType,
					unitPriceEurCents: productPricing.unitPriceEurCents,

					// Media
					heroImageUrl: media.storageUrl,
					heroImageAlt: media.altText,

					// Translations
					name: productTranslations.name,
					shortDescription: productTranslations.shortDescription,
				})
				.from(products)
				.leftJoin(categories, eq(categories.id, products.categoryId))
				.leftJoin(
					productPricing,
					and(eq(productPricing.productId, products.id), eq(productPricing.market, resolvedMarket)),
				)
				.leftJoin(
					productTranslations,
					and(eq(productTranslations.productId, products.id), eq(productTranslations.locale, input.locale)),
				)
				.leftJoin(media, and(eq(media.productId, products.id), eq(media.usageType, "product"), eq(media.sortOrder, 0)))
				.where(and(eq(products.categoryId, category.id), eq(products.isActive, true)))
				.orderBy(products.sortOrder);

			// 4. Filter Exclusions
			const productIds = rawProducts.map((p) => p.id);
			let excludedIds = new Set<string>();

			if (productIds.length > 0) {
				const exclusions = await ctx.db
					.select()
					.from(productMarketExclusions)
					.where(
						and(
							inArray(productMarketExclusions.productId, productIds),
							eq(productMarketExclusions.market, resolvedMarket),
						),
					);
				excludedIds = new Set(exclusions.map((e) => e.productId));
			}

			// 5. Apply Sales Logic
			const processedProducts = rawProducts
				.filter((p) => !excludedIds.has(p.id))
				.map((p) => {
					const { salePrice, activeSale } = calculateSalePrice(
						p.unitPriceEurCents,
						p.id,
						p.categoryId,
						p.productLineSlug,
						activeSales,
						resolvedMarket
					);
					return { ...p, salePrice, activeSale };
				});

			return {
				products: processedProducts,
				categorySlug: category.slug,
				productLineSlug: category.productLine,
			};
		}),

	// ============================================================================
	// SINGLE PRODUCT (Full Details View)
	// ============================================================================

	getBySlug: publicProcedure
		.input(z.object({
			slug: z.string(),
			locale: z.string().default("en"),
			userMarket: z.string().default("ROW"),
		}))
		.query(async ({ ctx, input }) => {
			const resolvedMarket = input.userMarket === "US" ? "US" : "ROW";
			const now = new Date();

			// 1. Fetch Product
			const [product] = await ctx.db
				.select({
					id: products.id,
					slug: products.slug,
					sku: products.sku,
					categoryId: products.categoryId,
					categorySlug: categories.slug,
					productLineSlug: categories.productLine,
					stockStatus: products.stockStatus,

					material: products.material,
					widthCm: products.widthCm,
					heightCm: products.heightCm,
					depthCm: products.depthCm,
					weightGrams: products.weightGrams,
					productionTime: products.productionTime,
					technicalSpecs: products.technicalSpecs,

					name: productTranslations.name,
					shortDescription: productTranslations.shortDescription,
					longDescription: productTranslations.longDescription,
					metaTitle: productTranslations.metaTitle,
					metaDescription: productTranslations.metaDescription,
				})
				.from(products)
				.leftJoin(categories, eq(categories.id, products.categoryId))
				.leftJoin(
					productTranslations,
					and(
						eq(productTranslations.productId, products.id),
						eq(productTranslations.locale, input.locale)
					)
				)
				.where(eq(products.slug, input.slug))
				.limit(1);

			if (!product) return null;

			// 2. Check Exclusions
			const [exclusion] = await ctx.db
				.select()
				.from(productMarketExclusions)
				.where(
					and(
						eq(productMarketExclusions.productId, product.id),
						eq(productMarketExclusions.market, resolvedMarket)
					)
				)
				.limit(1);

			if (exclusion) return null;

			// 3. Get Pricing (Market Specific)
			const [pricing] = await ctx.db
				.select()
				.from(productPricing)
				.where(
					and(
						eq(productPricing.productId, product.id),
						eq(productPricing.market, resolvedMarket)
					)
				)
				.limit(1);

			// 4. Calculate Sale Price & Enhanced Pricing Object
			let enhancedPricing = null;
			if (pricing) {
				const activeSales = await ctx.db
					.select()
					.from(sales)
					.where(
						and(
							eq(sales.isActive, true),
							lte(sales.startsAt, now),
							gte(sales.endsAt, now)
						)
					);

				const { salePrice, activeSale } = calculateSalePrice(
					pricing.unitPriceEurCents,
					product.id,
					product.categoryId,
					product.productLineSlug,
					activeSales,
					resolvedMarket
				);

				enhancedPricing = {
					...pricing,
					salePrice, // Frontend can now show: {salePrice} <strike>{unitPrice}</strike>
					activeSale,
				};
			}

			// 5. Get Bundles
			let bundles = null;
			if (pricing && pricing.pricingType === "quantity_bundle") {
				bundles = await ctx.db
					.select()
					.from(pricingBundles)
					.where(eq(pricingBundles.pricingId, pricing.id))
					.orderBy(pricingBundles.quantity);
			}

			// 6. Get Addons
			const addons = await ctx.db
				.select()
				.from(productAddons)
				.where(eq(productAddons.productId, product.id))
				.orderBy(productAddons.sortOrder);

			// 7. Get Customization Options
			const customOptions = await ctx.db
				.select()
				.from(customizationOptions)
				.where(eq(customizationOptions.productId, product.id))
				.orderBy(customizationOptions.sortOrder);

			// 8. Get Select Options
			const selectOptionsByCustomOptionId: Record<string, any[]> = {};
			for (const option of customOptions) {
				if (option.type === "select") {
					const opts = await ctx.db
						.select()
						.from(selectOptions)
						.where(eq(selectOptions.customizationOptionId, option.id))
						.orderBy(selectOptions.sortOrder);
					selectOptionsByCustomOptionId[option.id] = opts;
				}
			}

			// 9. Get Images
			const images = await ctx.db
				.select({
					id: media.id,
					storageUrl: media.storageUrl,
					altText: media.altText,
					width: media.width,
					height: media.height,
					usageType: media.usageType,
					sortOrder: media.sortOrder,
				})
				.from(media)
				.where(
					and(
						eq(media.productId, product.id),
						inArray(media.usageType, ["product", "product-slider"])
					)
				)
				.orderBy(media.sortOrder);

			return {
				...product,
				pricing: enhancedPricing,
				bundles,
				addons,
				customizationOptions: customOptions.map(opt => ({
					...opt,
					selectOptions: opt.type === "select" ? selectOptionsByCustomOptionId[opt.id] || [] : undefined,
				})),
				images,
			};
		}),

	// ============================================================================
	// FEATURED PRODUCTS (Home Page)
	// ============================================================================

	getFeatured: publicProcedure
		.input(z.object({
			locale: z.string().default("en"),
			limit: z.number().default(5),
			userMarket: z.string().default("ROW"),
		}))
		.query(async ({ ctx, input }) => {
			const resolvedMarket = input.userMarket === "US" ? "US" : "ROW";
			const now = new Date();

			// 1. Fetch Active Sales
			const activeSales = await ctx.db
				.select()
				.from(sales)
				.where(
					and(
						eq(sales.isActive, true),
						lte(sales.startsAt, now),
						gte(sales.endsAt, now)
					)
				);

			// 2. Fetch Featured Products
			const rawProducts = await ctx.db
				.select({
					id: products.id,
					slug: products.slug,
					sku: products.sku,
					stockStatus: products.stockStatus,
					categoryId: products.categoryId,
					categorySlug: categories.slug,
					productLineSlug: categories.productLine,

					pricingType: productPricing.pricingType,
					unitPriceEurCents: productPricing.unitPriceEurCents,

					heroImageUrl: media.storageUrl,
					heroImageAlt: media.altText,
					name: productTranslations.name,
					shortDescription: productTranslations.shortDescription,
				})
				.from(products)
				.leftJoin(categories, eq(categories.id, products.categoryId))
				.leftJoin(
					productPricing,
					and(
						eq(productPricing.productId, products.id),
						eq(productPricing.market, resolvedMarket)
					)
				)
				.leftJoin(
					productTranslations,
					and(
						eq(productTranslations.productId, products.id),
						eq(productTranslations.locale, input.locale)
					)
				)
				.leftJoin(
					media,
					and(
						eq(media.productId, products.id),
						eq(media.usageType, "product"),
						eq(media.sortOrder, 0)
					)
				)
				.where(
					and(
						eq(products.isFeatured, true),
						eq(products.isActive, true)
					)
				)
				.orderBy(products.sortOrder)
				.limit(input.limit);

			// 3. Filter Exclusions & Apply Sales
			const productIds = rawProducts.map(p => p.id);
			if (productIds.length === 0) return [];

			const exclusions = await ctx.db
				.select()
				.from(productMarketExclusions)
				.where(
					and(
						inArray(productMarketExclusions.productId, productIds),
						eq(productMarketExclusions.market, resolvedMarket)
					)
				);

			const excludedIds = new Set(exclusions.map(e => e.productId));

			return rawProducts
				.filter(p => !excludedIds.has(p.id))
				.map(p => {
					const { salePrice, activeSale } = calculateSalePrice(
						p.unitPriceEurCents,
						p.id,
						p.categoryId,
						p.productLineSlug,
						activeSales,
						resolvedMarket
					);
					return { ...p, salePrice, activeSale };
				});
		}),
	
	// ============================================================================
	// CART & WISHLIST (Get by IDs)
	// ============================================================================


	getByIds: publicProcedure
		.input(z.object({
			ids: z.array(z.string()),
			locale: z.string().default("en"),
		}))
		.query(async ({ ctx, input }) => {
			if (!input.ids.length) return []

			return await ctx.db
				.select({
					// Core product fields
					id: products.id,
					slug: products.slug,
					sku: products.sku,
					stockStatus: products.stockStatus,
					categoryId: products.categoryId,

					// Category info
					categorySlug: categories.slug,
					productLineSlug: categories.productLine,

					// Pricing (ROW market only for now)
					pricingType: productPricing.pricingType,
					unitPriceEurCents: productPricing.unitPriceEurCents,

					// Media
					heroImageUrl: media.storageUrl,

					// Translations
					name: productTranslations.name,
					shortDescription: productTranslations.shortDescription,
				})
				.from(products)
				.leftJoin(categories, eq(categories.id, products.categoryId))
				.leftJoin(
					productPricing,
					and(
						eq(productPricing.productId, products.id),
						eq(productPricing.market, 'ROW'), // Always ROW for cart
						eq(productPricing.isActive, true)
					)
				)
				.leftJoin(
					productTranslations,
					and(
						eq(productTranslations.productId, products.id),
						eq(productTranslations.locale, input.locale)
					)
				)
				.leftJoin(
					media,
					and(
						eq(media.productId, products.id),
						eq(media.usageType, 'product'),
						eq(media.sortOrder, 0)
					)
				)
				.where(
					and(
						eq(products.isActive, true),
						inArray(products.id, input.ids)
					)
				)
		}),


	
	/*
	getByIds: publicProcedure
		.input(z.object({
			ids: z.array(z.string()),
			locale: z.string().default("en"),
			userMarket: z.string().default("ROW"),
		}))
		.query(async ({ ctx, input }) => {
			if (!input.ids || input.ids.length === 0) return [];

			const resolvedMarket = input.userMarket === "US" ? "US" : "ROW";
			const now = new Date();

			// 1. Fetch Active Sales
			const activeSales = await ctx.db
				.select()
				.from(sales)
				.where(
					and(
						eq(sales.isActive, true),
						lte(sales.startsAt, now),
						gte(sales.endsAt, now)
					)
				);

			// 2. Fetch Products
			const rawProducts = await ctx.db
				.select({
					id: products.id,
					slug: products.slug,
					sku: products.sku,
					stockStatus: products.stockStatus,
					categoryId: products.categoryId,
					categorySlug: categories.slug,
					productLineSlug: categories.productLine,

					pricingType: productPricing.pricingType,
					unitPriceEurCents: productPricing.unitPriceEurCents,

					heroImageUrl: media.storageUrl,
					heroImageAlt: media.altText,
					name: productTranslations.name,
					shortDescription: productTranslations.shortDescription,
				})
				.from(products)
				.leftJoin(categories, eq(categories.id, products.categoryId))
				.leftJoin(productPricing,
					and(
						eq(productPricing.productId, products.id),
						eq(productPricing.market, resolvedMarket)
					)
				)
				.leftJoin(
					productTranslations,
					and(
						eq(productTranslations.productId, products.id),
						eq(productTranslations.locale, input.locale)
					)
				)
				.leftJoin(
					media,
					and(
						eq(media.productId, products.id),
						eq(media.usageType, "product"),
						eq(media.sortOrder, 0)
					)
				)
				.where(
					and(
						eq(products.isActive, true),
						inArray(products.id, input.ids)
					)
				);

			// 3. Filter by market exclusions
			const exclusions = await ctx.db
				.select()
				.from(productMarketExclusions)
				.where(
					and(
						inArray(productMarketExclusions.productId, input.ids),
						eq(productMarketExclusions.market, resolvedMarket)
					)
				);

			const excludedIds = new Set(exclusions.map(e => e.productId));

			// 4. Apply Sales Logic
			return rawProducts
				.filter(p => !excludedIds.has(p.id))
				.map(p => {
					const { salePrice, activeSale } = calculateSalePrice(
						p.unitPriceEurCents,
						p.id,
						p.categoryId,
						p.productLineSlug,
						activeSales,
						resolvedMarket
					);
					return { ...p, salePrice, activeSale };
				});
		}),

	*/
	
	// ============================================================================
	// MARKET AVAILABILITY
	// ============================================================================

	getMarketAvailability: publicProcedure
		.input(z.object({ productId: z.string() }))
		.query(async ({ ctx, input }) => {
			const exclusions = await ctx.db
				.select()
				.from(productMarketExclusions)
				.where(eq(productMarketExclusions.productId, input.productId));

			const allMarkets = ['US', 'ROW'] as const;
			const excludedMarkets = exclusions.map(e => e.market);

			return {
				available: allMarkets.filter(m => !excludedMarkets.includes(m)),
				excluded: excludedMarkets,
			};
		}),

	// ============================================================================
	// SEO METADATA
	// ============================================================================

	getCategoryMetadataBySlug: publicProcedure
		.input(z.object({
			categorySlug: z.string(),
			locale: z.string().default("en"),
		}))
		.query(async ({ ctx, input }) => {
			const [result] = await ctx.db
				.select({
					id: categories.id,
					slug: categories.slug,
					productLine: categories.productLine,
					modelCode: categories.modelCode,
					name: categoryTranslations.name,
					description: categoryTranslations.description,
					metaTitle: categoryTranslations.metaTitle,
					metaDescription: categoryTranslations.metaDescription,
					heroImageUrl: media.storageUrl,
				})
				.from(categories)
				.leftJoin(
					categoryTranslations,
					and(
						eq(categoryTranslations.categoryId, categories.id),
						eq(categoryTranslations.locale, input.locale)
					)
				)
				.leftJoin(
					media,
					and(
						eq(media.categoryId, categories.id),
						eq(media.usageType, "category"),
						eq(media.sortOrder, 0)
					)
				)
				.where(eq(categories.slug, input.categorySlug))
				.limit(1);

			return result || null;
		}),

	getProductMetadataBySlug: publicProcedure
		.input(z.object({
			productSlug: z.string(),
			locale: z.string().default("en"),
		}))
		.query(async ({ ctx, input }) => {
			const [result] = await ctx.db
				.select({
					id: products.id,
					slug: products.slug,
					sku: products.sku,
					categorySlug: categories.slug,
					productLineSlug: categories.productLine,
					name: productTranslations.name,
					shortDescription: productTranslations.shortDescription,
					metaTitle: productTranslations.metaTitle,
					metaDescription: productTranslations.metaDescription,
					heroImageUrl: media.storageUrl,
				})
				.from(products)
				.leftJoin(categories, eq(categories.id, products.categoryId))
				.leftJoin(
					productTranslations,
					and(
						eq(productTranslations.productId, products.id),
						eq(productTranslations.locale, input.locale)
					)
				)
				.leftJoin(
					media,
					and(
						eq(media.productId, products.id),
						eq(media.usageType, "product"),
						eq(media.sortOrder, 0)
					)
				)
				.where(eq(products.slug, input.productSlug))
				.limit(1);

			return result || null;
		}),
});