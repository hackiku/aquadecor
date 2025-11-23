// src/server/api/routers/product.ts

import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import {
	categories,
	products,
	productTranslations,
	productImages,
	categoryTranslations,
} from "~/server/db/schema";
import { eq, and, inArray } from "drizzle-orm";

export const productRouter = createTRPCRouter({

	// Get categories for a product line (now uses productLine tag instead of parentId)
	getCategoriesForProductLine: publicProcedure
		.input(z.object({
			productLineSlug: z.string(),
			locale: z.string().default("en"),
		}))
		.query(async ({ ctx, input }) => {
			// Direct query with productLine tag (no need to find parent!)
			const results = await ctx.db
				.select({
					id: categories.id,
					slug: categories.slug,
					productLine: categories.productLine,
					sortOrder: categories.sortOrder,
					name: categoryTranslations.name,
					description: categoryTranslations.description,
				})
				.from(categories)
				.leftJoin(
					categoryTranslations,
					and(
						eq(categoryTranslations.categoryId, categories.id),
						eq(categoryTranslations.locale, input.locale)
					)
				)
				.where(
					and(
						eq(categories.productLine, input.productLineSlug), // ✅ NEW: Direct productLine query
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
		}))
		.query(async ({ ctx, input }) => {
			// First find the category
			const [category] = await ctx.db
				.select()
				.from(categories)
				.where(eq(categories.slug, input.categorySlug))
				.limit(1);

			if (!category) {
				return [];
			}

			// Get products in this category with first image (sortOrder = 0)
			const results = await ctx.db
				.select({
					id: products.id,
					slug: products.slug,
					sku: products.sku,
					priceNote: products.priceNote,
					basePriceEurCents: products.basePriceEurCents,
					stockStatus: products.stockStatus,
					categoryId: products.categoryId,
					featuredImageUrl: productImages.storageUrl,
					name: productTranslations.name,
					shortDescription: productTranslations.shortDescription,
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
					productImages,
					and(
						eq(productImages.productId, products.id),
						eq(productImages.sortOrder, 0) // ✅ First image only
					)
				)
				.where(
					and(
						eq(products.categoryId, category.id),
						eq(products.isActive, true)
					)
				)
				.orderBy(products.sortOrder);

			// Add category metadata to response for breadcrumbs
			return {
				products: results,
				categorySlug: category.slug,
				productLineSlug: category.productLine, // ✅ NEW: For routing
			};
		}),

	// Get single product by slug with all details
	getBySlug: publicProcedure
		.input(z.object({
			slug: z.string(),
			locale: z.string().default("en"),
		}))
		.query(async ({ ctx, input }) => {
			// Get product with translation
			const [product] = await ctx.db
				.select({
					id: products.id,
					slug: products.slug,
					sku: products.sku,
					categoryId: products.categoryId,
					basePriceEurCents: products.basePriceEurCents,
					priceNote: products.priceNote,
					specifications: products.specifications,
					stockStatus: products.stockStatus,
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
				.where(eq(products.slug, input.slug))
				.limit(1);

			if (!product) {
				return null;
			}

			// Get all images for this product
			const images = await ctx.db
				.select()
				.from(productImages)
				.where(eq(productImages.productId, product.id))
				.orderBy(productImages.sortOrder);

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
					categoryId: products.categoryId,
					categorySlug: categories.slug, // ✅ For routing
					productLineSlug: categories.productLine, // ✅ For routing
					featuredImageUrl: productImages.storageUrl,
					name: productTranslations.name,
					shortDescription: productTranslations.shortDescription,
				})
				.from(products)
				.leftJoin(
					categories,
					eq(categories.id, products.categoryId) // ✅ Join category
				)
				.leftJoin(
					productTranslations,
					and(
						eq(productTranslations.productId, products.id),
						eq(productTranslations.locale, input.locale)
					)
				)
				.leftJoin(
					productImages,
					and(
						eq(productImages.productId, products.id),
						eq(productImages.sortOrder, 0) // ✅ First image only
					)
				)
				.where(
					and(
						eq(products.isActive, true),
						inArray(products.id, input.ids)
					)
				);

			return results;
		}),

	// Get featured products for homepage
	getFeatured: publicProcedure
		.input(z.object({
			locale: z.string().default("en"),
			limit: z.number().default(5),
		}))
		.query(async ({ ctx, input }) => {
			const results = await ctx.db
				.select({
					id: products.id,
					slug: products.slug,
					sku: products.sku,
					priceNote: products.priceNote,
					basePriceEurCents: products.basePriceEurCents,
					categoryId: products.categoryId,
					categorySlug: categories.slug, // ✅ For routing
					productLineSlug: categories.productLine, // ✅ For routing
					featuredImageUrl: productImages.storageUrl,
					name: productTranslations.name,
					shortDescription: productTranslations.shortDescription,
				})
				.from(products)
				.leftJoin(
					categories,
					eq(categories.id, products.categoryId) // ✅ Join category
				)
				.leftJoin(
					productTranslations,
					and(
						eq(productTranslations.productId, products.id),
						eq(productTranslations.locale, input.locale)
					)
				)
				.leftJoin(
					productImages,
					and(
						eq(productImages.productId, products.id),
						eq(productImages.sortOrder, 0) // ✅ First image only
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

			return results;
		}),
});