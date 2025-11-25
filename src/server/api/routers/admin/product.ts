// src/server/api/routers/admin/product.ts

import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import {
	categories,
	products,
	productTranslations,
	productImages,
	categoryTranslations,
} from "~/server/db/schema";
import { eq, and, inArray, desc, asc, sql } from "drizzle-orm";

export const adminProductRouter = createTRPCRouter({
	// Get all products with category info and translations (for admin table)
	getAll: publicProcedure
		.input(z.object({
			locale: z.string().default("en"),
			categoryId: z.string().optional(),
			stockStatus: z.enum(["in_stock", "made_to_order", "out_of_stock"]).optional(),
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
					isActive: products.isActive,
					isFeatured: products.isFeatured,
					sortOrder: products.sortOrder,
					createdAt: products.createdAt,
					updatedAt: products.updatedAt,
					name: productTranslations.name,
					shortDescription: productTranslations.shortDescription,
					featuredImageUrl: productImages.storageUrl,
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
					productImages,
					and(
						eq(productImages.productId, products.id),
						eq(productImages.sortOrder, 0)
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
	getById: publicProcedure
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
					stockStatus: products.stockStatus,
					isActive: products.isActive,
					isFeatured: products.isFeatured,
					sortOrder: products.sortOrder,
					createdAt: products.createdAt,
					updatedAt: products.updatedAt,
					name: productTranslations.name,
					shortDescription: productTranslations.shortDescription,
					fullDescription: productTranslations.fullDescription,
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

			// Get all images
			const images = await ctx.db
				.select()
				.from(productImages)
				.where(eq(productImages.productId, input.id))
				.orderBy(productImages.sortOrder);

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
	getStats: publicProcedure
		.query(async ({ ctx }) => {
			const allProducts = await ctx.db
				.select({
					id: products.id,
					basePriceEurCents: products.basePriceEurCents,
					stockStatus: products.stockStatus,
					isActive: products.isActive,
					isFeatured: products.isFeatured,
				})
				.from(products);

			const total = allProducts.length;
			const active = allProducts.filter(p => p.isActive).length;
			const inactive = total - active;
			const featured = allProducts.filter(p => p.isFeatured).length;
			const customOnly = allProducts.filter(p => !p.basePriceEurCents).length;
			const withPrice = total - customOnly;

			const stockBreakdown = {
				in_stock: allProducts.filter(p => p.stockStatus === "in_stock").length,
				made_to_order: allProducts.filter(p => p.stockStatus === "made_to_order").length,
				out_of_stock: allProducts.filter(p => p.stockStatus === "out_of_stock").length,
			};

			return {
				total,
				active,
				inactive,
				featured,
				customOnly,
				withPrice,
				stockBreakdown,
			};
		}),

	// Create new product
	create: publicProcedure
		.input(z.object({
			categoryId: z.string(),
			slug: z.string(),
			sku: z.string().optional(),
			basePriceEurCents: z.number().optional(),
			priceNote: z.string().optional(),
			stockStatus: z.enum(["in_stock", "made_to_order", "out_of_stock"]).default("made_to_order"),
			isActive: z.boolean().default(true),
			isFeatured: z.boolean().default(false),
			sortOrder: z.number().default(0),
			specifications: z.any().optional(),
			// Translation (English required)
			name: z.string(),
			shortDescription: z.string().optional(),
			fullDescription: z.string().optional(),
		}))
		.mutation(async ({ ctx, input }) => {
			// Insert product
			const [product] = await ctx.db
				.insert(products)
				.values({
					categoryId: input.categoryId,
					slug: input.slug,
					sku: input.sku,
					basePriceEurCents: input.basePriceEurCents,
					priceNote: input.priceNote,
					stockStatus: input.stockStatus,
					isActive: input.isActive,
					isFeatured: input.isFeatured,
					sortOrder: input.sortOrder,
					specifications: input.specifications,
				})
				.returning();

			// Insert English translation
			await ctx.db.insert(productTranslations).values({
				productId: product!.id,
				locale: "en",
				name: input.name,
				shortDescription: input.shortDescription,
				fullDescription: input.fullDescription,
			});

			return product;
		}),

	// Update product
	update: publicProcedure
		.input(z.object({
			id: z.string(),
			categoryId: z.string().optional(),
			slug: z.string().optional(),
			sku: z.string().optional(),
			basePriceEurCents: z.number().optional().nullable(),
			priceNote: z.string().optional().nullable(),
			stockStatus: z.enum(["in_stock", "made_to_order", "out_of_stock"]).optional(),
			isActive: z.boolean().optional(),
			isFeatured: z.boolean().optional(),
			sortOrder: z.number().optional(),
			specifications: z.any().optional().nullable(),
			// Translation update
			name: z.string().optional(),
			shortDescription: z.string().optional().nullable(),
			fullDescription: z.string().optional().nullable(),
		}))
		.mutation(async ({ ctx, input }) => {
			const { id, name, shortDescription, fullDescription, ...productData } = input;

			// Update product
			const [updated] = await ctx.db
				.update(products)
				.set(productData)
				.where(eq(products.id, id))
				.returning();

			// Update English translation if provided
			if (name || shortDescription !== undefined || fullDescription !== undefined) {
				const translationData: any = {};
				if (name) translationData.name = name;
				if (shortDescription !== undefined) translationData.shortDescription = shortDescription;
				if (fullDescription !== undefined) translationData.fullDescription = fullDescription;

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
	delete: publicProcedure
		.input(z.object({
			id: z.string(),
		}))
		.mutation(async ({ ctx, input }) => {
			await ctx.db.delete(products).where(eq(products.id, input.id));
			return { success: true };
		}),
});