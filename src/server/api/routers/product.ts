// src/server/api/routers/product.ts

import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import {
	categories,
	products,
	productTranslations,
	media,
	categoryTranslations,
} from "~/server/db/schema";
import { eq, and, inArray } from "drizzle-orm";

export const productRouter = createTRPCRouter({

	// Get categories for a product line
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

	// Get products by category slug
	getByCategory: publicProcedure
		.input(z.object({
			categorySlug: z.string(),
			locale: z.string().default("en"),
			userMarket: z.string().default("EU"), // For market filtering
		}))
		.query(async ({ ctx, input }) => {
			// First find the category
			const [category] = await ctx.db
				.select()
				.from(categories)
				.where(eq(categories.slug, input.categorySlug))
				.limit(1);

			if (!category) {
				return { products: [], categorySlug: input.categorySlug, productLineSlug: null };
			}

			// Get products in this category with hero image
			const results = await ctx.db
				.select({
					id: products.id,
					slug: products.slug,
					sku: products.sku,
					priceNote: products.priceNote,
					basePriceEurCents: products.basePriceEurCents,
					stockStatus: products.stockStatus,
					excludedMarkets: products.excludedMarkets,
					categoryId: products.categoryId,
					specifications: products.specifications,
					variantOptions: products.variantOptions,
					heroImageUrl: media.storageUrl,
					heroImageAlt: media.altText,
					name: productTranslations.name,
					shortDescription: productTranslations.shortDescription,
					fullDescription: productTranslations.fullDescription,
				})
				.from(products)
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

			// Filter by market availability
			const filteredProducts = results.filter(p =>
				!p.excludedMarkets?.includes(input.userMarket)
			);

			return {
				products: filteredProducts,
				categorySlug: category.slug,
				productLineSlug: category.productLine,
			};
		}),

	// Get single product by slug with all details
	getBySlug: publicProcedure
		.input(z.object({
			slug: z.string(),
			locale: z.string().default("en"),
			userMarket: z.string().default("EU"),
		}))
		.query(async ({ ctx, input }) => {
			// Get product with translation and category info
			const [product] = await ctx.db
				.select({
					id: products.id,
					slug: products.slug,
					sku: products.sku,
					categoryId: products.categoryId,
					categorySlug: categories.slug,
					productLineSlug: categories.productLine,
					basePriceEurCents: products.basePriceEurCents,
					priceNote: products.priceNote,
					specifications: products.specifications,
					variantOptions: products.variantOptions,
					customizationOptions: products.customizationOptions,
					excludedMarkets: products.excludedMarkets,
					stockStatus: products.stockStatus,
					productType: products.productType,
					variantType: products.variantType,
					name: productTranslations.name,
					shortDescription: productTranslations.shortDescription,
					fullDescription: productTranslations.fullDescription,
					metaTitle: productTranslations.metaTitle,
					metaDescription: productTranslations.metaDescription,
					specOverrides: productTranslations.specOverrides, // ✅ NEW
				})
				.from(products)
				.leftJoin(
					categories,
					eq(categories.id, products.categoryId)
				)
				.leftJoin(
					productTranslations,
					and(
						eq(productTranslations.productId, products.id),
						eq(productTranslations.locale, input.locale)
					)
				)
				.where(eq(products.slug, input.slug))
				.limit(1);

			if (!product) {
				return null;
			}

			// Check market availability
			if (product.excludedMarkets?.includes(input.userMarket)) {
				return null;
			}

			// Get all images for this product (hero + gallery)
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
				images,
			};
		}),

	// Get multiple products by IDs (for cart/wishlist)
	getByIds: publicProcedure
		.input(z.object({
			ids: z.array(z.string()),
			locale: z.string().default("en"),
			userMarket: z.string().default("EU"),
		}))
		.query(async ({ ctx, input }) => {
			if (!input.ids || input.ids.length === 0) {
				return [];
			}

			// Get products with category info for routing
			const results = await ctx.db
				.select({
					id: products.id,
					slug: products.slug,
					sku: products.sku,
					basePriceEurCents: products.basePriceEurCents,
					priceNote: products.priceNote,
					stockStatus: products.stockStatus,
					excludedMarkets: products.excludedMarkets,
					categoryId: products.categoryId,
					categorySlug: categories.slug,
					productLineSlug: categories.productLine,
					heroImageUrl: media.storageUrl,
					heroImageAlt: media.altText,
					name: productTranslations.name,
					shortDescription: productTranslations.shortDescription,
					fullDescription: productTranslations.fullDescription,
				})
				.from(products)
				.leftJoin(
					categories,
					eq(categories.id, products.categoryId)
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

			// Filter by market availability
			return results.filter(p =>
				!p.excludedMarkets?.includes(input.userMarket)
			);
		}),

	// Get featured products for homepage
	getFeatured: publicProcedure
		.input(z.object({
			locale: z.string().default("en"),
			limit: z.number().default(5),
			userMarket: z.string().default("EU"),
		}))
		.query(async ({ ctx, input }) => {
			const results = await ctx.db
				.select({
					id: products.id,
					slug: products.slug,
					sku: products.sku,
					priceNote: products.priceNote,
					basePriceEurCents: products.basePriceEurCents,
					excludedMarkets: products.excludedMarkets,
					categoryId: products.categoryId,
					categorySlug: categories.slug,
					productLineSlug: categories.productLine,
					heroImageUrl: media.storageUrl,
					heroImageAlt: media.altText,
					name: productTranslations.name,
					fullDescription: productTranslations.fullDescription,
				})
				.from(products)
				.leftJoin(
					categories,
					eq(categories.id, products.categoryId)
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

			// Filter by market availability
			return results.filter(p =>
				!p.excludedMarkets?.includes(input.userMarket)
			);
		}),
});