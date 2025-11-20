// src/server/api/routers/reviews.ts

import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { reviews } from "~/server/db/schema";
import { eq, and, desc, asc } from "drizzle-orm";

export const reviewsRouter = createTRPCRouter({
	// Get all approved reviews with filtering and sorting
	getAll: publicProcedure
		.input(z.object({
			rating: z.number().min(1).max(5).optional(),
			source: z.enum(["youtube", "forum", "facebook", "email", "reddit"]).optional(),
			verifiedOnly: z.boolean().optional(),
			sortBy: z.enum(["newest", "oldest", "highest", "lowest"]).default("newest"),
			limit: z.number().optional(),
		}).optional())
		.query(async ({ ctx, input }) => {
			// Build where conditions
			const conditions = [eq(reviews.isApproved, true)];

			if (input?.rating) {
				conditions.push(eq(reviews.rating, input.rating));
			}

			if (input?.source) {
				conditions.push(eq(reviews.source, input.source));
			}

			if (input?.verifiedOnly) {
				conditions.push(eq(reviews.verifiedPurchase, true));
			}

			// Build query
			let query = ctx.db
				.select()
				.from(reviews)
				.where(and(...conditions));

			// Apply sorting
			switch (input?.sortBy) {
				case "oldest":
					query = query.orderBy(asc(reviews.createdAt)) as any;
					break;
				case "highest":
					query = query.orderBy(desc(reviews.rating), desc(reviews.createdAt)) as any;
					break;
				case "lowest":
					query = query.orderBy(asc(reviews.rating), desc(reviews.createdAt)) as any;
					break;
				case "newest":
				default:
					query = query.orderBy(desc(reviews.createdAt)) as any;
			}

			// Apply limit
			if (input?.limit) {
				query = query.limit(input.limit) as any;
			}

			return await query;
		}),

	// Get featured reviews only
	getFeatured: publicProcedure
		.input(z.object({
			limit: z.number().default(3),
		}).optional())
		.query(async ({ ctx, input }) => {
			return await ctx.db
				.select()
				.from(reviews)
				.where(
					and(
						eq(reviews.isFeatured, true),
						eq(reviews.isApproved, true)
					)
				)
				.orderBy(desc(reviews.createdAt))
				.limit(input?.limit ?? 3);
		}),

	// Get review stats
	getStats: publicProcedure
		.query(async ({ ctx }) => {
			const allReviews = await ctx.db
				.select()
				.from(reviews)
				.where(eq(reviews.isApproved, true));

			const totalCount = allReviews.length;
			const avgRating = totalCount > 0
				? allReviews.reduce((sum, r) => sum + r.rating, 0) / totalCount
				: 0;

			const ratingBreakdown = {
				5: allReviews.filter(r => r.rating === 5).length,
				4: allReviews.filter(r => r.rating === 4).length,
				3: allReviews.filter(r => r.rating === 3).length,
				2: allReviews.filter(r => r.rating === 2).length,
				1: allReviews.filter(r => r.rating === 1).length,
			};

			const sourceBreakdown = {
				youtube: allReviews.filter(r => r.source === "youtube").length,
				forum: allReviews.filter(r => r.source === "forum").length,
				facebook: allReviews.filter(r => r.source === "facebook").length,
				email: allReviews.filter(r => r.source === "email").length,
				reddit: allReviews.filter(r => r.source === "reddit").length,
			};

			return {
				totalCount,
				avgRating: Math.round(avgRating * 10) / 10,
				ratingBreakdown,
				sourceBreakdown,
				verifiedCount: allReviews.filter(r => r.verifiedPurchase).length,
			};
		}),
});