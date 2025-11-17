// src/server/api/routers/product.ts

import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import {
	categories,
	products,
	productTranslations,
	productImages,
	categoryTranslations,
	reviews,
} from "~/server/db/schema";
import { eq, and, isNull } from "drizzle-orm";

export const productRouter = createTRPCRouter({

	// Get product lines (top-level categories with parentId = null)
	getProductLines: publicProcedure
		.input(z.object({
			locale: z.string().default("en"),
		}))
		.query(async ({ ctx, input }) => {
			const results = await ctx.db
				.select({
					id: categories.id,
					slug: categories.slug,
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
						isNull(categories.parentId),
						eq(categories.isActive, true)
					)
				)
				.orderBy(categories.sortOrder);

			return results;
		}),

	// Get categories for a product line
	getCategoriesForProductLine: publicProcedure
		.input(z.object({
			productLineSlug: z.string(),
			locale: z.string().default("en"),
		}))
		.query(async ({ ctx, input }) => {
			// First find the product line
			const [productLine] = await ctx.db
				.select()
				.from(categories)
				.where(
					and(
						eq(categories.slug, input.productLineSlug),
						isNull(categories.parentId)
					)
				)
				.limit(1);

			if (!productLine) {
				return [];
			}

			// Get child categories
			const results = await ctx.db
				.select({
					id: categories.id,
					slug: categories.slug,
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
						eq(categories.parentId, productLine.id),
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

			// Get products in this category
			const results = await ctx.db
				.select({
					id: products.id,
					slug: products.slug,
					sku: products.sku,
					priceNote: products.priceNote,
					basePriceEurCents: products.basePriceEurCents,
					stockStatus: products.stockStatus,
					categoryId: products.categoryId,
					featuredImageId: products.featuredImageId,
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
				.where(
					and(
						eq(products.categoryId, category.id),
						eq(products.isActive, true)
					)
				)
				.orderBy(products.sortOrder);

			return results;
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
					featuredImageId: products.featuredImageId,
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
					categoryId: products.categoryId,
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

	// Get featured reviews
	getFeaturedReviews: publicProcedure
		.input(z.object({
			limit: z.number().default(3),
		}))
		.query(async ({ ctx, input }) => {
			const results = await ctx.db
				.select()
				.from(reviews)
				.where(
					and(
						eq(reviews.isFeatured, true),
						eq(reviews.isApproved, true)
					)
				)
				.limit(input.limit);

			return results;
		}),

	// Get all approved reviews
	getAllReviews: publicProcedure
		.input(z.object({
			limit: z.number().optional(),
		}))
		.query(async ({ ctx, input }) => {
			const query = ctx.db
				.select()
				.from(reviews)
				.where(eq(reviews.isApproved, true))
				.orderBy(reviews.createdAt);

			if (input.limit) {
				return await query.limit(input.limit);
			}

			return await query;
		}),
});