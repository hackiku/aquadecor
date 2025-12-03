// src/server/api/routers/admin/gallery.ts

import { z } from "zod";
import { createTRPCRouter, adminProcedure } from "~/server/api/trpc";
import { productImages, galleryCategories, galleryImageCategories } from "~/server/db/schema";
import { eq, desc, asc, sql, and, like, or, inArray } from "drizzle-orm";

export const adminGalleryRouter = createTRPCRouter({
	// Get all images with optional filters
	getAll: adminProcedure
		.input(z.object({
			productId: z.string().optional(),
			categoryId: z.string().optional(),
			searchQuery: z.string().optional(),
			sortBy: z.enum(["createdAt", "sortOrder", "altText"]).default("createdAt"),
			sortOrder: z.enum(["asc", "desc"]).default("desc"),
			limit: z.number().min(1).max(100).default(50),
			offset: z.number().min(0).default(0),
		}).optional())
		.query(async ({ ctx, input }) => {
			const conditions = [];

			// Filter by product
			if (input?.productId) {
				conditions.push(eq(productImages.productId, input.productId));
			}

			// Filter by gallery category (many-to-many)
			if (input?.categoryId) {
				const imageIdsInCategory = await ctx.db
					.select({ imageId: galleryImageCategories.imageId })
					.from(galleryImageCategories)
					.where(eq(galleryImageCategories.categoryId, input.categoryId));

				const imageIds = imageIdsInCategory.map(r => r.imageId);
				if (imageIds.length > 0) {
					conditions.push(inArray(productImages.id, imageIds));
				} else {
					// No images in this category, return empty
					return { images: [], total: 0, hasMore: false };
				}
			}

			// Search in altText and storageUrl
			if (input?.searchQuery) {
				conditions.push(
					or(
						like(productImages.altText, `%${input.searchQuery}%`),
						like(productImages.storageUrl, `%${input.searchQuery}%`)
					)
				);
			}

			// Build query
			let query = ctx.db
				.select({
					id: productImages.id,
					productId: productImages.productId,
					storageUrl: productImages.storageUrl,
					storagePath: productImages.storagePath,
					altText: productImages.altText,
					width: productImages.width,
					height: productImages.height,
					fileSize: productImages.fileSize,
					mimeType: productImages.mimeType,
					sortOrder: productImages.sortOrder,
					createdAt: productImages.createdAt,
				})
				.from(productImages);

			// Apply filters
			if (conditions.length > 0) {
				query = query.where(and(...conditions)) as any;
			}

			// Sorting - Fix TypeScript by being explicit about column access
			const sortField = input?.sortBy ?? "createdAt";
			const sortDirection = input?.sortOrder ?? "desc";

			if (sortDirection === "desc") {
				query = query.orderBy(desc(productImages[sortField])) as any;
			} else {
				query = query.orderBy(asc(productImages[sortField])) as any;
			}

			// Pagination
			query = query.limit(input?.limit ?? 50).offset(input?.offset ?? 0) as any;

			const images = await query;

			// Get total count
			const totalQuery = ctx.db
				.select({ count: sql<number>`COUNT(*)::int` })
				.from(productImages);

			const totalResult = conditions.length > 0
				? await totalQuery.where(and(...conditions))
				: await totalQuery;

			const total = totalResult[0]?.count ?? 0;

			return {
				images,
				total,
				hasMore: (input?.offset ?? 0) + images.length < total,
			};
		}),

	// Get single image by ID
	getById: adminProcedure
		.input(z.object({
			id: z.string(),
		}))
		.query(async ({ ctx, input }) => {
			const [image] = await ctx.db
				.select()
				.from(productImages)
				.where(eq(productImages.id, input.id))
				.limit(1);

			return image ?? null;
		}),

	// Create new image
	create: adminProcedure
		.input(z.object({
			productId: z.string(),
			storageUrl: z.string().url(),
			storagePath: z.string().optional(),
			altText: z.string().optional(),
			width: z.number().int().positive().optional(),
			height: z.number().int().positive().optional(),
			fileSize: z.number().int().positive().optional(),
			mimeType: z.string().optional(),
			sortOrder: z.number().int().default(0),
		}))
		.mutation(async ({ ctx, input }) => {
			const [image] = await ctx.db
				.insert(productImages)
				.values(input)
				.returning();

			return image;
		}),

	// Update image
	update: adminProcedure
		.input(z.object({
			id: z.string(),
			productId: z.string().optional(),
			storageUrl: z.string().url().optional(),
			storagePath: z.string().optional(),
			altText: z.string().optional(),
			width: z.number().int().positive().optional(),
			height: z.number().int().positive().optional(),
			fileSize: z.number().int().positive().optional(),
			mimeType: z.string().optional(),
			sortOrder: z.number().int().optional(),
		}))
		.mutation(async ({ ctx, input }) => {
			const { id, ...updateData } = input;

			const [updated] = await ctx.db
				.update(productImages)
				.set(updateData)
				.where(eq(productImages.id, id))
				.returning();

			return updated;
		}),

	// Delete image
	delete: adminProcedure
		.input(z.object({
			id: z.string(),
		}))
		.mutation(async ({ ctx, input }) => {
			await ctx.db
				.delete(productImages)
				.where(eq(productImages.id, input.id));

			return { success: true };
		}),

	// Bulk delete images
	bulkDelete: adminProcedure
		.input(z.object({
			ids: z.array(z.string()),
		}))
		.mutation(async ({ ctx, input }) => {
			if (input.ids.length === 0) {
				return { success: true, deleted: 0 };
			}

			await ctx.db
				.delete(productImages)
				.where(inArray(productImages.id, input.ids));

			return { success: true, deleted: input.ids.length };
		}),

	// Update sort orders (for drag-and-drop reordering)
	updateSortOrders: adminProcedure
		.input(z.object({
			updates: z.array(z.object({
				id: z.string(),
				sortOrder: z.number().int(),
			})),
		}))
		.mutation(async ({ ctx, input }) => {
			// Execute updates in parallel
			await Promise.all(
				input.updates.map(({ id, sortOrder }) =>
					ctx.db
						.update(productImages)
						.set({ sortOrder })
						.where(eq(productImages.id, id))
				)
			);

			return { success: true };
		}),

	// Get stats for dashboard
	getStats: adminProcedure
		.query(async ({ ctx }) => {
			const totalImagesResult = await ctx.db
				.select({ count: sql<number>`COUNT(*)::int` })
				.from(productImages);

			const totalImages = totalImagesResult[0]?.count ?? 0;

			const totalSizeResult = await ctx.db
				.select({
					size: sql<number>`SUM(COALESCE(${productImages.fileSize}, 0))::bigint`
				})
				.from(productImages);

			const totalSize = totalSizeResult[0]?.size ?? 0;

			// Images by product (top 5)
			const imagesByProduct = await ctx.db
				.select({
					productId: productImages.productId,
					count: sql<number>`COUNT(*)::int`,
				})
				.from(productImages)
				.groupBy(productImages.productId)
				.orderBy(desc(sql`COUNT(*)`))
				.limit(5);

			return {
				total: totalImages,
				totalSizeBytes: totalSize,
				totalSizeMB: (totalSize / 1024 / 1024).toFixed(2),
				byProduct: imagesByProduct,
			};
		}),

	// ============================================================================
	// GALLERY CATEGORIES
	// ============================================================================

	// Get all gallery categories
	getCategories: adminProcedure
		.input(z.object({
			isActive: z.boolean().optional(),
		}).optional())
		.query(async ({ ctx, input }) => {
			const conditions = [];

			if (input?.isActive !== undefined) {
				conditions.push(eq(galleryCategories.isActive, input.isActive));
			}

			let query = ctx.db
				.select({
					id: galleryCategories.id,
					slug: galleryCategories.slug,
					name: galleryCategories.name,
					description: galleryCategories.description,
					sortOrder: galleryCategories.sortOrder,
					isActive: galleryCategories.isActive,
					usageContext: galleryCategories.usageContext,
					createdAt: galleryCategories.createdAt,
					// Count images in this category
					imageCount: sql<number>`(
						SELECT COUNT(*)::int 
						FROM ${galleryImageCategories} 
						WHERE ${galleryImageCategories.categoryId} = ${galleryCategories.id}
					)`,
				})
				.from(galleryCategories)
				.orderBy(asc(galleryCategories.sortOrder));

			if (conditions.length > 0) {
				query = query.where(and(...conditions)) as any;
			}

			return await query;
		}),

	// Get single category with images
	getCategoryById: adminProcedure
		.input(z.object({
			id: z.string(),
		}))
		.query(async ({ ctx, input }) => {
			const [category] = await ctx.db
				.select()
				.from(galleryCategories)
				.where(eq(galleryCategories.id, input.id))
				.limit(1);

			if (!category) return null;

			// Get image count
			const imageCountResult = await ctx.db
				.select({ count: sql<number>`COUNT(*)::int` })
				.from(galleryImageCategories)
				.where(eq(galleryImageCategories.categoryId, input.id));

			const imageCount = imageCountResult[0]?.count ?? 0;

			return {
				...category,
				imageCount,
			};
		}),

	// Create gallery category
	createCategory: adminProcedure
		.input(z.object({
			slug: z.string(),
			name: z.string(),
			description: z.string().optional(),
			usageContext: z.string().optional(),
			sortOrder: z.number().default(0),
			isActive: z.boolean().default(true),
		}))
		.mutation(async ({ ctx, input }) => {
			const [category] = await ctx.db
				.insert(galleryCategories)
				.values(input)
				.returning();

			return category;
		}),

	// Update gallery category
	updateCategory: adminProcedure
		.input(z.object({
			id: z.string(),
			slug: z.string().optional(),
			name: z.string().optional(),
			description: z.string().optional(),
			usageContext: z.string().optional(),
			sortOrder: z.number().optional(),
			isActive: z.boolean().optional(),
		}))
		.mutation(async ({ ctx, input }) => {
			const { id, ...updateData } = input;

			const [updated] = await ctx.db
				.update(galleryCategories)
				.set(updateData)
				.where(eq(galleryCategories.id, id))
				.returning();

			return updated;
		}),

	// Delete gallery category
	deleteCategory: adminProcedure
		.input(z.object({
			id: z.string(),
		}))
		.mutation(async ({ ctx, input }) => {
			// Delete category (cascade will remove image associations)
			await ctx.db
				.delete(galleryCategories)
				.where(eq(galleryCategories.id, input.id));

			return { success: true };
		}),

	// Add image to category
	addImageToCategory: adminProcedure
		.input(z.object({
			imageId: z.string(),
			categoryId: z.string(),
		}))
		.mutation(async ({ ctx, input }) => {
			// Check if already exists
			const existing = await ctx.db
				.select()
				.from(galleryImageCategories)
				.where(
					and(
						eq(galleryImageCategories.imageId, input.imageId),
						eq(galleryImageCategories.categoryId, input.categoryId)
					)
				)
				.limit(1);

			if (existing.length > 0) {
				return existing[0];
			}

			const [association] = await ctx.db
				.insert(galleryImageCategories)
				.values(input)
				.returning();

			return association;
		}),

	// Remove image from category
	removeImageFromCategory: adminProcedure
		.input(z.object({
			imageId: z.string(),
			categoryId: z.string(),
		}))
		.mutation(async ({ ctx, input }) => {
			await ctx.db
				.delete(galleryImageCategories)
				.where(
					and(
						eq(galleryImageCategories.imageId, input.imageId),
						eq(galleryImageCategories.categoryId, input.categoryId)
					)
				);

			return { success: true };
		}),
});