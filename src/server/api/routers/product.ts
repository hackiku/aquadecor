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
} from "~/server/db/schema";
import { eq, and, inArray } from "drizzle-orm";

export const productRouter = createTRPCRouter({

	// ============================================================================
	// CATEGORIES
	// ============================================================================

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
	// PRODUCT LISTINGS
	// ============================================================================

	getByCategory: publicProcedure
		.input(z.object({
			categorySlug: z.string(),
			locale: z.string().default("en"),
			userMarket: z.string().default("ROW"), // 'ROW' | 'US' | 'CA' | 'UK'
		}))
		.query(async ({ ctx, input }) => {
			// Find category
			const [category] = await ctx.db
				.select()
				.from(categories)
				.where(eq(categories.slug, input.categorySlug))
				.limit(1);

			if (!category) {
				return { products: [], categorySlug: input.categorySlug, productLineSlug: null };
			}

			// Get products with basic pricing info
			const results = await ctx.db
				.select({
					id: products.id,
					slug: products.slug,
					sku: products.sku,
					stockStatus: products.stockStatus,
					categoryId: products.categoryId,

					// Basic pricing (will query separately for bundles)
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
				.leftJoin(
					productPricing,
					eq(productPricing.productId, products.id)
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
						eq(products.categoryId, category.id),
						eq(products.isActive, true)
					)
				)
				.orderBy(products.sortOrder);

			// Check market exclusions
			const productIds = results.map(p => p.id);
			const exclusions = await ctx.db
				.select()
				.from(productMarketExclusions)
				.where(
					and(
						inArray(productMarketExclusions.productId, productIds),
						eq(productMarketExclusions.market, input.userMarket)
					)
				);

			const excludedProductIds = new Set(exclusions.map(e => e.productId));

			const filteredProducts = results.filter(p => !excludedProductIds.has(p.id));

			return {
				products: filteredProducts,
				categorySlug: category.slug,
				productLineSlug: category.productLine,
			};
		}),

	// ============================================================================
	// SINGLE PRODUCT (Full Details)
	// ============================================================================

	getBySlug: publicProcedure
		.input(z.object({
			slug: z.string(),
			locale: z.string().default("en"),
			userMarket: z.string().default("ROW"),
		}))
		.query(async ({ ctx, input }) => {
			// Get product with translation and category
			const [product] = await ctx.db
				.select({
					id: products.id,
					slug: products.slug,
					sku: products.sku,
					categoryId: products.categoryId,
					categorySlug: categories.slug,
					productLineSlug: categories.productLine,
					stockStatus: products.stockStatus,
					// productType: products.productType, // LEGACY

					// Product details
					material: products.material,
					widthCm: products.widthCm,
					heightCm: products.heightCm,
					depthCm: products.depthCm,
					weightGrams: products.weightGrams,
					productionTime: products.productionTime,
					technicalSpecs: products.technicalSpecs,

					// Translations
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

			// Check market exclusion
			const [exclusion] = await ctx.db
				.select()
				.from(productMarketExclusions)
				.where(
					and(
						eq(productMarketExclusions.productId, product.id),
						eq(productMarketExclusions.market, input.userMarket)
					)
				)
				.limit(1);

			if (exclusion) return null;

			// Get pricing config
			const [pricing] = await ctx.db
				.select()
				.from(productPricing)
				.where(eq(productPricing.productId, product.id))
				.limit(1);

			// Get bundles if pricing type is quantity_bundle
			let bundles = null;
			if (pricing && pricing.pricingType === "quantity_bundle") {
				bundles = await ctx.db
					.select()
					.from(pricingBundles)
					.where(eq(pricingBundles.pricingId, pricing.id))
					.orderBy(pricingBundles.quantity);
			}

			// Get addons
			const addons = await ctx.db
				.select()
				.from(productAddons)
				.where(eq(productAddons.productId, product.id))
				.orderBy(productAddons.sortOrder);

			// Get customization options
			const customOptions = await ctx.db
				.select()
				.from(customizationOptions)
				.where(eq(customizationOptions.productId, product.id))
				.orderBy(customizationOptions.sortOrder);

			// Get select options for each customization option
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

			// Get all images
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
				pricing,
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
	// MULTI-PRODUCT QUERIES (Cart, Wishlist)
	// ============================================================================

	getByIds: publicProcedure
		.input(z.object({
			ids: z.array(z.string()),
			locale: z.string().default("en"),
			userMarket: z.string().default("ROW"),
		}))
		.query(async ({ ctx, input }) => {
			if (!input.ids || input.ids.length === 0) return [];

			const results = await ctx.db
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
				.leftJoin(productPricing, eq(productPricing.productId, products.id))
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

			// Filter by market
			const exclusions = await ctx.db
				.select()
				.from(productMarketExclusions)
				.where(
					and(
						inArray(productMarketExclusions.productId, input.ids),
						eq(productMarketExclusions.market, input.userMarket)
					)
				);

			const excludedIds = new Set(exclusions.map(e => e.productId));
			return results.filter(p => !excludedIds.has(p.id));
		}),

	// ============================================================================
	// FEATURED PRODUCTS
	// ============================================================================

	getFeatured: publicProcedure
		.input(z.object({
			locale: z.string().default("en"),
			limit: z.number().default(5),
			userMarket: z.string().default("ROW"),
		}))
		.query(async ({ ctx, input }) => {
			const results = await ctx.db
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
				.leftJoin(productPricing, eq(productPricing.productId, products.id))
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

			// Filter by market
			const productIds = results.map(p => p.id);
			const exclusions = await ctx.db
				.select()
				.from(productMarketExclusions)
				.where(
					and(
						inArray(productMarketExclusions.productId, productIds),
						eq(productMarketExclusions.market, input.userMarket)
					)
				);

			const excludedIds = new Set(exclusions.map(e => e.productId));
			return results.filter(p => !excludedIds.has(p.id));
		}),

	// ============================================================================
	// PRICING HELPERS (for calculator, cart)
	// ============================================================================

	getPricingForProduct: publicProcedure
		.input(z.object({
			productId: z.string(),
			userMarket: z.string().default("ROW"),
		}))
		.query(async ({ ctx, input }) => {
			const [pricing] = await ctx.db
				.select()
				.from(productPricing)
				.where(eq(productPricing.productId, input.productId))
				.limit(1);

			if (!pricing) return null;

			// Get bundles if applicable
			let bundles = null;
			if (pricing.pricingType === "quantity_bundle") {
				bundles = await ctx.db
					.select()
					.from(pricingBundles)
					.where(eq(pricingBundles.pricingId, pricing.id))
					.orderBy(pricingBundles.quantity);
			}

			return {
				...pricing,
				bundles,
			};
		}),
});