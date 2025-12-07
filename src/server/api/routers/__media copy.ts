// src/server/api/routers/media.ts

import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { media, categories, products } from "~/server/db/schema";
import { eq, desc, asc, sql, and, like, or, isNotNull } from "drizzle-orm";

export const mediaRouter = createTRPCRouter({
	// Get main gallery feed (infinite scroll ready)
	getGallery: publicProcedure
		.input(z.object({
			categoryId: z.string().optional(),
			productId: z.string().optional(),
			usageType: z.string().optional(), // 'customer-setup', 'product', etc.
			search: z.string().optional(),
			limit: z.number().min(1).max(50).default(20),
			cursor: z.number().default(0), // Offset based cursor
		}))
		.query(async ({ ctx, input }) => {
			const filters = [
				eq(media.isActive, true), // Only active images
			];

			if (input.categoryId) filters.push(eq(media.categoryId, input.categoryId));
			if (input.productId) filters.push(eq(media.productId, input.productId));
			if (input.usageType) filters.push(eq(media.usageType, input.usageType));

			if (input.search) {
				filters.push(or(
					like(media.altText, `%${input.search}%`),
					like(media.tags, `%${input.search}%`) // Search tags if array stored as string or check logic
				));
			}

			// Main query
			const items = await ctx.db
				.select({
					id: media.id,
					url: media.storageUrl,
					alt: media.altText,
					width: media.width,
					height: media.height,
					usageType: media.usageType,
					productName: products.slug, // Fallback to slug for public
					categoryName: categories.slug,
				})
				.from(media)
				.leftJoin(products, eq(media.productId, products.id))
				.leftJoin(categories, eq(media.categoryId, categories.id))
				.where(and(...filters))
				.orderBy(desc(media.sortOrder), desc(media.createdAt))
				.limit(input.limit + 1) // Fetch one extra to check for next page
				.offset(input.cursor);

			let nextCursor: number | undefined = undefined;
			if (items.length > input.limit) {
				items.pop(); // Remove the extra item
				nextCursor = input.cursor + input.limit;
			}

			return {
				items,
				nextCursor,
			};
		}),

	// Get public categories for filter pills
	getCategories: publicProcedure
		.query(async ({ ctx }) => {
			return await ctx.db
				.select({
					id: categories.id,
					name: categories.slug, // In future use translation
					slug: categories.slug,
					imageCount: sql<number>`count(${media.id})`,
				})
				.from(categories)
				.leftJoin(media, eq(media.categoryId, categories.id))
				.where(eq(categories.isActive, true))
				.groupBy(categories.id)
				.orderBy(desc(sql`count(${media.id})`));
		}),
});