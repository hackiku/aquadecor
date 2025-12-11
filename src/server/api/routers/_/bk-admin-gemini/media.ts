// src/server/api/routers/admin/media.ts

import { z } from "zod";
import { createTRPCRouter, adminProcedure } from "~/server/api/trpc";
import { media, categories, products } from "~/server/db/schema";
import { eq, desc, asc, sql, and, like, or, inArray, isNotNull } from "drizzle-orm";

export const adminMediaRouter = createTRPCRouter({
	// ========================================================================
	// READ
	// ========================================================================

	getAll: adminProcedure
		.input(z.object({
			searchQuery: z.string().optional(),
			usageType: z.string().optional(),
			categoryId: z.string().optional(),
			productId: z.string().optional(),
			sortBy: z.enum(["createdAt", "sortOrder", "altText", "fileSize"]).default("createdAt"),
			sortOrder: z.enum(["asc", "desc"]).default("desc"),
			limit: z.number().min(1).max(100).default(50),
			offset: z.number().min(0).default(0),
		}).optional())
		.query(async ({ ctx, input }) => {
			const filters = [];

			if (input?.searchQuery) {
				filters.push(or(
					like(media.altText, `%${input.searchQuery}%`),
					like(media.storageUrl, `%${input.searchQuery}%`)
				));
			}

			if (input?.usageType) {
				filters.push(eq(media.usageType, input.usageType));
			}
			if (input?.categoryId) {
				filters.push(eq(media.categoryId, input.categoryId));
			}
			if (input?.productId) {
				filters.push(eq(media.productId, input.productId));
			}

			let orderBy;
			switch (input?.sortBy) {
				case "altText": orderBy = input.sortOrder === "asc" ? asc(media.altText) : desc(media.altText); break;
				case "sortOrder": orderBy = input.sortOrder === "asc" ? asc(media.sortOrder) : desc(media.sortOrder); break;
				case "fileSize": orderBy = input.sortOrder === "asc" ? asc(media.fileSize) : desc(media.fileSize); break;
				default: orderBy = input?.sortOrder === "asc" ? asc(media.createdAt) : desc(media.createdAt);
			}

			const items = await ctx.db
				.select()
				.from(media)
				.where(and(...filters))
				.orderBy(orderBy)
				.limit(input?.limit ?? 50)
				.offset(input?.offset ?? 0);

			const totalResult = await ctx.db
				.select({ count: sql<number>`count(*)` })
				.from(media)
				.where(and(...filters));

			return {
				images: items,
				total: Number(totalResult[0]?.count ?? 0),
			};
		}),

	getById: adminProcedure
		.input(z.object({ id: z.string() }))
		.query(async ({ ctx, input }) => {
			return await ctx.db.query.media.findFirst({
				where: eq(media.id, input.id),
				with: {
					product: true,
					category: true,
				}
			});
		}),

	getStats: adminProcedure.query(async ({ ctx }) => {
		const totalResult = await ctx.db.select({ count: sql<number>`count(*)` }).from(media);
		const sizeResult = await ctx.db.select({ size: sql<number>`sum(${media.fileSize})` }).from(media);

		// Group by Product
		// FIX: Use products.slug because products.name does not exist (it's in translations)
		const byProduct = await ctx.db
			.select({
				productId: media.productId,
				productSlug: products.slug,
				count: sql<number>`count(*)`
			})
			.from(media)
			.leftJoin(products, eq(media.productId, products.id))
			.where(isNotNull(media.productId))
			.groupBy(media.productId, products.slug)
			.orderBy(desc(sql`count(*)`))
			.limit(5);

		return {
			total: Number(totalResult[0]?.count ?? 0),
			totalSizeMB: ((Number(sizeResult[0]?.size ?? 0)) / 1024 / 1024).toFixed(2),
			byProduct: byProduct.map(p => ({
				productId: p.productId,
				count: Number(p.count),
				name: p.productSlug // Fallback to slug for display in stats
			})),
		};
	}),

	// ========================================================================
	// WRITE
	// ========================================================================

	create: adminProcedure
		.input(z.object({
			storageUrl: z.string().url(),
			storagePath: z.string().optional(),
			altText: z.string().optional(),
			usageType: z.string().default("marketing"),
			productId: z.string().optional(),
			categoryId: z.string().optional(),
			width: z.number().optional(),
			height: z.number().optional(),
			fileSize: z.number().optional(),
			mimeType: z.string().optional(),
			sortOrder: z.number().default(0),
			tags: z.array(z.string()).optional(),
		}))
		.mutation(async ({ ctx, input }) => {
			const [newItem] = await ctx.db.insert(media).values({
				...input,
				createdAt: new Date(),
				isActive: true
			}).returning();
			return newItem;
		}),

	update: adminProcedure
		.input(z.object({
			id: z.string(),
			altText: z.string().optional(),
			sortOrder: z.number().optional(),
			usageType: z.string().optional(),
			categoryId: z.string().optional().nullable(),
			productId: z.string().optional().nullable(),
			tags: z.array(z.string()).optional(),
		}))
		.mutation(async ({ ctx, input }) => {
			const { id, ...data } = input;

			const updateData: any = {};
			if (data.altText !== undefined) updateData.altText = data.altText;
			if (data.sortOrder !== undefined) updateData.sortOrder = data.sortOrder;
			if (data.usageType !== undefined) updateData.usageType = data.usageType;
			if (data.tags !== undefined) updateData.tags = data.tags;
			if (data.categoryId !== undefined) updateData.categoryId = data.categoryId;
			if (data.productId !== undefined) updateData.productId = data.productId;

			const [updated] = await ctx.db
				.update(media)
				.set(updateData)
				.where(eq(media.id, id))
				.returning();

			return updated;
		}),

	delete: adminProcedure
		.input(z.object({ id: z.string() }))
		.mutation(async ({ ctx, input }) => {
			await ctx.db.delete(media).where(eq(media.id, input.id));
			return { success: true };
		}),

	bulkDelete: adminProcedure
		.input(z.object({ ids: z.array(z.string()) }))
		.mutation(async ({ ctx, input }) => {
			if (input.ids.length === 0) return { success: true };
			await ctx.db.delete(media).where(inArray(media.id, input.ids));
			return { success: true };
		}),

	// ========================================================================
	// CATEGORY HELPERS
	// ========================================================================

	getCategories: adminProcedure
		.input(z.object({ isActive: z.boolean().optional() }).optional())
		.query(async ({ ctx, input }) => {
			const filters = [];
			if (input?.isActive !== undefined) filters.push(eq(categories.isActive, input.isActive));

			return await ctx.db
				.select({
					id: categories.id,
					// FIX: Use slug as name fallback because categories.name doesn't exist (it's in translations)
					name: categories.slug,
					slug: categories.slug,
					productLine: categories.productLine,
				})
				.from(categories)
				.where(and(...filters))
				.orderBy(asc(categories.sortOrder));
		}),

	addImageToCategory: adminProcedure
		.input(z.object({ imageId: z.string(), categoryId: z.string() }))
		.mutation(async ({ ctx, input }) => {
			await ctx.db.update(media)
				.set({
					categoryId: input.categoryId,
					usageType: "category"
				})
				.where(eq(media.id, input.imageId));
			return { success: true };
		}),

	removeImageFromCategory: adminProcedure
		.input(z.object({ imageId: z.string(), categoryId: z.string() }))
		.mutation(async ({ ctx, input }) => {
			await ctx.db.update(media)
				.set({
					categoryId: null,
					usageType: "gallery"
				})
				.where(and(
					eq(media.id, input.imageId),
					eq(media.categoryId, input.categoryId)
				));
			return { success: true };
		}),
});