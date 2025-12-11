// @ts-nocheck
// src/server/api/routers/admin/product.ts

import { z } from "zod";
import { createTRPCRouter, adminProcedure } from "~/server/api/trpc";
import {
	categories,
	products,
	productTranslations,
	media,
	categoryTranslations,
} from "~/server/db/schema";
import { eq, and, inArray, desc, asc, sql } from "drizzle-orm";

export const adminProductRouter = createTRPCRouter({
	// Get all products with category info and translations (for admin table)
	getAll: adminProcedure
		.input(z.object({
			locale: z.string().default("en"),
			categoryId: z.string().optional(),
			productLine: z.string().optional(),
			stockStatus: z.enum(["in_stock", "made_to_order", "requires_quote"]).optional(),
			isActive: z.boolean().optional(),
			sortBy: z.enum(["name", "sku", "price", "created"]).default("created"),
			sortOrder: z.enum(["asc", "desc"]).default("desc"),
		}).optional())
		.query(async ({ ctx, input }) => {
			const conditions = [];

			if (input?.categoryId) {
				conditions.push(eq(products.categoryId, input.categoryId));
			}

			if (input?.stockStatus) {
				conditions.push(eq(products.stockStatus, input.stockStatus));
			}

			if (input?.isActive !== undefined) {
				conditions.push(eq(products.isActive, input.isActive));
			}

			if (input?.productLine) {
				conditions.push(eq(categories.productLine, input.productLine));
			}

			let query = ctx.db
				.select({
					id: products.id,
					slug: products.slug,
					sku: products.sku,
					categoryId: products.categoryId,
					categoryName: categoryTranslations.name,
					categorySlug: categories.slug,
					productLine: categories.productLine,
					basePriceEurCents: products.basePriceEurCents,
					priceNote: products.priceNote,
					stockStatus: products.stockStatus,
					excludedMarkets: products.excludedMarkets,
					isActive: products.isActive,
					isFeatured: products.isFeatured,
					sortOrder: products.sortOrder,
					productType: products.productType,
					variantType: products.variantType,
					createdAt: products.createdAt,
					updatedAt: products.updatedAt,
					name: productTranslations.name,
					shortDescription: productTranslations.shortDescription,
					heroImageUrl: media.storageUrl,
				})
				.from(products)
				.leftJoin(categories, eq(categories.id, products.categoryId))
				.leftJoin(
					categoryTranslations,
					and(
						eq(categoryTranslations.categoryId, categories.id),
						eq(categoryTranslations.locale, input?.locale ?? "en")
					)
				)
				.leftJoin(
					productTranslations,
					and(
						eq(productTranslations.productId, products.id),
						eq(productTranslations.locale, input?.locale ?? "en")
					)
				)
				.leftJoin(
					media,
					and(
						eq(media.productId, products.id),
						eq(media.usageType, "product"),
						eq(media.sortOrder, 0)
					)
				);

			if (conditions.length > 0) {
				query = query.where(and(...conditions)) as any;
			}

			// Apply sorting
			switch (input?.sortBy) {
				case "name":
					query = input?.sortOrder === "asc"
						? query.orderBy(asc(productTranslations.name)) as any
						: query.orderBy(desc(productTranslations.name)) as any;
					break;
				case "sku":
					query = input?.sortOrder === "asc"
						? query.orderBy(asc(products.sku)) as any
						: query.orderBy(desc(products.sku)) as any;
					break;
				case "price":
					query = input?.sortOrder === "asc"
						? query.orderBy(asc(products.basePriceEurCents)) as any
						: query.orderBy(desc(products.basePriceEurCents)) as any;
					break;
				case "created":
				default:
					query = input?.sortOrder === "asc"
						? query.orderBy(asc(products.createdAt)) as any
						: query.orderBy(desc(products.createdAt)) as any;
			}

			return await query;
		}),

	// Get single product with all details (for admin detail view)
	getById: adminProcedure
		.input(z.object({
			id: z.string(),
			locale: z.string().default("en"),
		}))
		.query(async ({ ctx, input }) => {
			// Get product with category info
			const [product] = await ctx.db
				.select({
					id: products.id,
					slug: products.slug,
					sku: products.sku,
					categoryId: products.categoryId,
					categoryName: categoryTranslations.name,
					categorySlug: categories.slug,
					productLine: categories.productLine,
					basePriceEurCents: products.basePriceEurCents,
					priceNote: products.priceNote,
					specifications: products.specifications,
					variantOptions: products.variantOptions,
					customizationOptions: products.customizationOptions,
					excludedMarkets: products.excludedMarkets,
					stockStatus: products.stockStatus,
					productType: products.productType,
					variantType: products.variantType,
					isActive: products.isActive,
					isFeatured: products.isFeatured,
					sortOrder: products.sortOrder,
					createdAt: products.createdAt,
					updatedAt: products.updatedAt,
					name: productTranslations.name,
					shortDescription: productTranslations.shortDescription,
					fullDescription: productTranslations.fullDescription,
					metaTitle: productTranslations.metaTitle,
					metaDescription: productTranslations.metaDescription,
				})
				.from(products)
				.leftJoin(categories, eq(categories.id, products.categoryId))
				.leftJoin(
					categoryTranslations,
					and(
						eq(categoryTranslations.categoryId, categories.id),
						eq(categoryTranslations.locale, input.locale)
					)
				)
				.leftJoin(
					productTranslations,
					and(
						eq(productTranslations.productId, products.id),
						eq(productTranslations.locale, input.locale)
					)
				)
				.where(eq(products.id, input.id))
				.limit(1);

			if (!product) {
				return null;
			}

			// Get all images for this product
			const images = await ctx.db
				.select()
				.from(media)
				.where(eq(media.productId, input.id))
				.orderBy(media.sortOrder);

			// Get all translations
			const translations = await ctx.db
				.select()
				.from(productTranslations)
				.where(eq(productTranslations.productId, input.id));

			return {
				...product,
				images,
				translations,
			};
		}),

	// Get product stats for dashboard
	getStats: adminProcedure
		.query(async ({ ctx }) => {
			const allProducts = await ctx.db
				.select({
					id: products.id,
					basePriceEurCents: products.basePriceEurCents,
					stockStatus: products.stockStatus,
					isActive: products.isActive,
					isFeatured: products.isFeatured,
					excludedMarkets: products.excludedMarkets,
				})
				.from(products);

			const total = allProducts.length;
			const active = allProducts.filter(p => p.isActive).length;
			const inactive = total - active;
			const featured = allProducts.filter(p => p.isFeatured).length;
			const customOnly = allProducts.filter(p => !p.basePriceEurCents).length;
			const withPrice = total - customOnly;
			const usRestricted = allProducts.filter(p => p.excludedMarkets?.includes("US")).length;

			const stockBreakdown = {
				in_stock: allProducts.filter(p => p.stockStatus === "in_stock").length,
				made_to_order: allProducts.filter(p => p.stockStatus === "made_to_order").length,
				requires_quote: allProducts.filter(p => p.stockStatus === "requires_quote").length,
			};

			return {
				total,
				active,
				inactive,
				featured,
				customOnly,
				withPrice,
				usRestricted,
				stockBreakdown,
			};
		}),

	// Create new product
	create: adminProcedure
		.input(z.object({
			categoryId: z.string(),
			slug: z.string(),
			sku: z.string().optional(),
			productType: z.enum(["simple", "variable"]).default("simple"),
			variantType: z.string().optional(),
			basePriceEurCents: z.number().optional(),
			priceNote: z.string().optional(),
			stockStatus: z.enum(["in_stock", "made_to_order", "requires_quote"]).default("made_to_order"),
			excludedMarkets: z.array(z.string()).default([]),
			isActive: z.boolean().default(true),
			isFeatured: z.boolean().default(false),
			sortOrder: z.number().default(0),
			specifications: z.any().optional(),
			variantOptions: z.any().optional(),
			customizationOptions: z.any().optional(),
			// Translation (English required)
			name: z.string(),
			shortDescription: z.string().optional(),
			fullDescription: z.string().optional(),
			metaTitle: z.string().optional(),
			metaDescription: z.string().optional(),
		}))
		.mutation(async ({ ctx, input }) => {
			// Insert product
			const [product] = await ctx.db
				.insert(products)
				.values({
					categoryId: input.categoryId,
					slug: input.slug,
					sku: input.sku,
					productType: input.productType,
					variantType: input.variantType,
					basePriceEurCents: input.basePriceEurCents,
					priceNote: input.priceNote,
					stockStatus: input.stockStatus,
					excludedMarkets: input.excludedMarkets,
					isActive: input.isActive,
					isFeatured: input.isFeatured,
					sortOrder: input.sortOrder,
					specifications: input.specifications,
					variantOptions: input.variantOptions,
					customizationOptions: input.customizationOptions,
				})
				.returning();

			// Insert English translation
			await ctx.db.insert(productTranslations).values({
				productId: product!.id,
				locale: "en",
				name: input.name,
				shortDescription: input.shortDescription,
				fullDescription: input.fullDescription,
				metaTitle: input.metaTitle,
				metaDescription: input.metaDescription,
			});

			return product;
		}),

	// Update product
	update: adminProcedure
		.input(z.object({
			id: z.string(),
			categoryId: z.string().optional(),
			slug: z.string().optional(),
			sku: z.string().optional(),
			productType: z.enum(["simple", "variable"]).optional(),
			variantType: z.string().optional().nullable(),
			basePriceEurCents: z.number().optional().nullable(),
			priceNote: z.string().optional().nullable(),
			stockStatus: z.enum(["in_stock", "made_to_order", "requires_quote"]).optional(),
			excludedMarkets: z.array(z.string()).optional(),
			isActive: z.boolean().optional(),
			isFeatured: z.boolean().optional(),
			sortOrder: z.number().optional(),
			specifications: z.any().optional().nullable(),
			variantOptions: z.any().optional().nullable(),
			customizationOptions: z.any().optional().nullable(),
			// Translation update
			name: z.string().optional(),
			shortDescription: z.string().optional().nullable(),
			fullDescription: z.string().optional().nullable(),
			metaTitle: z.string().optional().nullable(),
			metaDescription: z.string().optional().nullable(),
		}))
		.mutation(async ({ ctx, input }) => {
			const { id, name, shortDescription, fullDescription, metaTitle, metaDescription, ...productData } = input;

			// Update product
			const [updated] = await ctx.db
				.update(products)
				.set(productData)
				.where(eq(products.id, id))
				.returning();

			// Update English translation if provided
			if (name || shortDescription !== undefined || fullDescription !== undefined || metaTitle !== undefined || metaDescription !== undefined) {
				const translationData: any = {};
				if (name) translationData.name = name;
				if (shortDescription !== undefined) translationData.shortDescription = shortDescription;
				if (fullDescription !== undefined) translationData.fullDescription = fullDescription;
				if (metaTitle !== undefined) translationData.metaTitle = metaTitle;
				if (metaDescription !== undefined) translationData.metaDescription = metaDescription;

				await ctx.db
					.update(productTranslations)
					.set(translationData)
					.where(
						and(
							eq(productTranslations.productId, id),
							eq(productTranslations.locale, "en")
						)
					);
			}

			return updated;
		}),

	// Delete product
	delete: adminProcedure
		.input(z.object({
			id: z.string(),
		}))
		.mutation(async ({ ctx, input }) => {
			// Media will cascade delete via FK
			await ctx.db.delete(products).where(eq(products.id, input.id));
			return { success: true };
		}),

	// Bulk operations
	bulkUpdateMarkets: adminProcedure
		.input(z.object({
			productIds: z.array(z.string()),
			excludedMarkets: z.array(z.string()),
		}))
		.mutation(async ({ ctx, input }) => {
			await ctx.db
				.update(products)
				.set({ excludedMarkets: input.excludedMarkets })
				.where(inArray(products.id, input.productIds));

			return { success: true, updated: input.productIds.length };
		}),

	bulkUpdateStatus: adminProcedure
		.input(z.object({
			productIds: z.array(z.string()),
			isActive: z.boolean(),
		}))
		.mutation(async ({ ctx, input }) => {
			await ctx.db
				.update(products)
				.set({ isActive: input.isActive })
				.where(inArray(products.id, input.productIds));

			return { success: true, updated: input.productIds.length };
		}),
});