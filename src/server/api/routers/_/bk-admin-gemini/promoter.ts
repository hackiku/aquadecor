// src/server/api/routers/admin/promoter.ts

import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { promoters, promoterCodes } from "~/server/db/schema";
import { eq, desc, asc, sql } from "drizzle-orm";

export const adminPromoterRouter = createTRPCRouter({
	// Get all promoters with their codes
	getAll: publicProcedure
		.input(z.object({
			isActive: z.boolean().optional(),
			sortBy: z.enum(["name", "orders", "revenue", "created"]).default("created"),
			sortOrder: z.enum(["asc", "desc"]).default("desc"),
		}).optional())
		.query(async ({ ctx, input }) => {
			let query = ctx.db
				.select()
				.from(promoters);

			if (input?.isActive !== undefined) {
				query = query.where(eq(promoters.isActive, input.isActive)) as any;
			}

			// Apply sorting
			switch (input?.sortBy) {
				case "name":
					query = input?.sortOrder === "asc"
						? query.orderBy(asc(promoters.firstName)) as any
						: query.orderBy(desc(promoters.firstName)) as any;
					break;
				case "orders":
					query = input?.sortOrder === "asc"
						? query.orderBy(asc(promoters.totalOrders)) as any
						: query.orderBy(desc(promoters.totalOrders)) as any;
					break;
				case "revenue":
					query = input?.sortOrder === "asc"
						? query.orderBy(asc(promoters.totalRevenue)) as any
						: query.orderBy(desc(promoters.totalRevenue)) as any;
					break;
				case "created":
				default:
					query = input?.sortOrder === "asc"
						? query.orderBy(asc(promoters.createdAt)) as any
						: query.orderBy(desc(promoters.createdAt)) as any;
			}

			const allPromoters = await query;

			// Get codes for each promoter
			const promotersWithCodes = await Promise.all(
				allPromoters.map(async (promoter) => {
					const codes = await ctx.db
						.select()
						.from(promoterCodes)
						.where(eq(promoterCodes.promoterId, promoter.id));

					return {
						...promoter,
						codes,
					};
				})
			);

			return promotersWithCodes;
		}),

	// Get single promoter with full details
	getById: publicProcedure
		.input(z.object({
			id: z.string(),
		}))
		.query(async ({ ctx, input }) => {
			const [promoter] = await ctx.db
				.select()
				.from(promoters)
				.where(eq(promoters.id, input.id))
				.limit(1);

			if (!promoter) {
				return null;
			}

			// Get all codes
			const codes = await ctx.db
				.select()
				.from(promoterCodes)
				.where(eq(promoterCodes.promoterId, input.id));

			return {
				...promoter,
				codes,
			};
		}),

	// Get promoter stats for dashboard
	getStats: publicProcedure
		.query(async ({ ctx }) => {
			const allPromoters = await ctx.db
				.select({
					id: promoters.id,
					isActive: promoters.isActive,
					totalOrders: promoters.totalOrders,
					totalRevenue: promoters.totalRevenue,
					totalCommission: promoters.totalCommission,
				})
				.from(promoters);

			const total = allPromoters.length;
			const active = allPromoters.filter(p => p.isActive).length;
			const totalOrders = allPromoters.reduce((sum, p) => sum + p.totalOrders, 0);
			const totalRevenue = allPromoters.reduce((sum, p) => sum + p.totalRevenue, 0);
			const totalCommission = allPromoters.reduce((sum, p) => sum + p.totalCommission, 0);

			return {
				total,
				active,
				totalOrders,
				totalRevenue,
				totalCommission,
			};
		}),

	// Create/invite new promoter
	create: publicProcedure
		.input(z.object({
			firstName: z.string(),
			lastName: z.string(),
			email: z.string().email(),
		}))
		.mutation(async ({ ctx, input }) => {
			const [promoter] = await ctx.db
				.insert(promoters)
				.values({
					firstName: input.firstName,
					lastName: input.lastName,
					email: input.email,
					isActive: true,
				})
				.returning();

			// TODO: Send invite email here

			return promoter;
		}),

	// Update promoter
	update: publicProcedure
		.input(z.object({
			id: z.string(),
			firstName: z.string().optional(),
			lastName: z.string().optional(),
			email: z.string().email().optional(),
			isActive: z.boolean().optional(),
		}))
		.mutation(async ({ ctx, input }) => {
			const { id, ...updateData } = input;

			const [updated] = await ctx.db
				.update(promoters)
				.set(updateData)
				.where(eq(promoters.id, id))
				.returning();

			return updated;
		}),

	// Delete promoter
	delete: publicProcedure
		.input(z.object({
			id: z.string(),
		}))
		.mutation(async ({ ctx, input }) => {
			await ctx.db.delete(promoters).where(eq(promoters.id, input.id));
			return { success: true };
		}),

	// ========================================
	// PROMOTER CODES
	// ========================================

	// Add code to promoter
	addCode: publicProcedure
		.input(z.object({
			promoterId: z.string(),
			code: z.string(),
			discountPercent: z.number().min(0).max(100),
			commissionPercent: z.number().min(0).max(100),
		}))
		.mutation(async ({ ctx, input }) => {
			const [code] = await ctx.db
				.insert(promoterCodes)
				.values({
					promoterId: input.promoterId,
					code: input.code.toUpperCase(),
					discountPercent: input.discountPercent,
					commissionPercent: input.commissionPercent,
					isActive: true,
				})
				.returning();

			return code;
		}),

	// Update code
	updateCode: publicProcedure
		.input(z.object({
			id: z.string(),
			code: z.string().optional(),
			discountPercent: z.number().min(0).max(100).optional(),
			commissionPercent: z.number().min(0).max(100).optional(),
			isActive: z.boolean().optional(),
		}))
		.mutation(async ({ ctx, input }) => {
			const { id, ...updateData } = input;

			if (updateData.code) {
				updateData.code = updateData.code.toUpperCase();
			}

			const [updated] = await ctx.db
				.update(promoterCodes)
				.set(updateData)
				.where(eq(promoterCodes.id, id))
				.returning();

			return updated;
		}),

	// Delete code
	deleteCode: publicProcedure
		.input(z.object({
			id: z.string(),
		}))
		.mutation(async ({ ctx, input }) => {
			await ctx.db.delete(promoterCodes).where(eq(promoterCodes.id, input.id));
			return { success: true };
		}),
});