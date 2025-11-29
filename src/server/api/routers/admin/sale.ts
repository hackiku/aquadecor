// src/server/api/routers/admin/sale.ts

import { z } from "zod";
import { createTRPCRouter, adminProcedure } from "~/server/api/trpc";
import { sales } from "~/server/db/schema";
import { eq, desc, asc, and, gte, lte, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache"; // when team adds/updates sale banner


// Validation schemas
const bannerConfigSchema = z.object({
	backgroundColor: z.string().optional(),
	textColor: z.string().optional(),
	showCountdown: z.boolean().optional(),
	customMessage: z.string().optional(),
	ctaText: z.string().optional(),
	ctaLink: z.string().optional(),
});

const createSaleSchema = z.object({
	name: z.string().min(1, "Name is required"),
	slug: z.string().min(1, "Slug is required"),
	discountPercent: z.number().min(0).max(100),
	discountCode: z.string().min(1, "Discount code is required"),
	startsAt: z.date(),
	endsAt: z.date(),
	bannerType: z.enum(["SaleBanner", "CountdownBanner", "FlashSaleBanner", "MinimalBanner"]),
	bannerConfig: bannerConfigSchema.optional(),
	visibleOn: z.array(z.string()).default(["/"]),
	isActive: z.boolean().default(true),
});

const updateSaleSchema = createSaleSchema.partial().extend({
	id: z.string(),
});

export const adminSaleRouter = createTRPCRouter({
	// ========================================
	// QUERIES
	// ========================================

	// Get all sales with filtering
	getAll: adminProcedure
		.input(z.object({
			status: z.enum(["active", "upcoming", "expired", "all"]).default("all"),
			sortBy: z.enum(["created", "starts", "ends", "name"]).default("created"),
			sortOrder: z.enum(["asc", "desc"]).default("desc"),
		}).optional())
		.query(async ({ ctx, input }) => {
			const now = new Date();
			let query = ctx.db
				.select()
				.from(sales);

			// Filter by status
			const conditions = [];

			if (input?.status === "active") {
				// Currently running sales
				conditions.push(
					and(
						eq(sales.isActive, true),
						lte(sales.startsAt, now),
						gte(sales.endsAt, now)
					)
				);
			} else if (input?.status === "upcoming") {
				// Future sales
				conditions.push(
					and(
						eq(sales.isActive, true),
						gte(sales.startsAt, now)
					)
				);
			} else if (input?.status === "expired") {
				// Past sales
				conditions.push(
					lte(sales.endsAt, now)
				);
			}
			// "all" - no filter

			if (conditions.length > 0) {
				query = query.where(and(...conditions)) as any;
			}

			// Apply sorting
			switch (input?.sortBy) {
				case "name":
					query = input?.sortOrder === "asc"
						? query.orderBy(asc(sales.name)) as any
						: query.orderBy(desc(sales.name)) as any;
					break;
				case "starts":
					query = input?.sortOrder === "asc"
						? query.orderBy(asc(sales.startsAt)) as any
						: query.orderBy(desc(sales.startsAt)) as any;
					break;
				case "ends":
					query = input?.sortOrder === "asc"
						? query.orderBy(asc(sales.endsAt)) as any
						: query.orderBy(desc(sales.endsAt)) as any;
					break;
				case "created":
				default:
					query = input?.sortOrder === "asc"
						? query.orderBy(asc(sales.createdAt)) as any
						: query.orderBy(desc(sales.createdAt)) as any;
			}

			return await query;
		}),

	// Get single sale by ID
	getById: adminProcedure
		.input(z.object({
			id: z.string(),
		}))
		.query(async ({ ctx, input }) => {
			const [sale] = await ctx.db
				.select()
				.from(sales)
				.where(eq(sales.id, input.id))
				.limit(1);

			return sale ?? null;
		}),

	// Get single sale by slug
	getBySlug: adminProcedure
		.input(z.object({
			slug: z.string(),
		}))
		.query(async ({ ctx, input }) => {
			const [sale] = await ctx.db
				.select()
				.from(sales)
				.where(eq(sales.slug, input.slug))
				.limit(1);

			return sale ?? null;
		}),

	// Get currently active sale (for banner display)
	getActive: adminProcedure
		.query(async ({ ctx }) => {
			const now = new Date();

			const [activeSale] = await ctx.db
				.select()
				.from(sales)
				.where(
					and(
						eq(sales.isActive, true),
						lte(sales.startsAt, now),
						gte(sales.endsAt, now)
					)
				)
				.orderBy(desc(sales.startsAt))
				.limit(1);

			return activeSale ?? null;
		}),

	// Get sale stats for dashboard
	getStats: adminProcedure
		.query(async ({ ctx }) => {
			const now = new Date();
			const allSales = await ctx.db
				.select({
					id: sales.id,
					startsAt: sales.startsAt,
					endsAt: sales.endsAt,
					isActive: sales.isActive,
					usageCount: sales.usageCount,
					totalRevenue: sales.totalRevenue,
				})
				.from(sales);

			const total = allSales.length;

			const active = allSales.filter(
				s => s.isActive && s.startsAt <= now && s.endsAt >= now
			).length;

			const upcoming = allSales.filter(
				s => s.isActive && s.startsAt > now
			).length;

			const expired = allSales.filter(
				s => s.endsAt < now
			).length;

			const totalUsage = allSales.reduce((sum, s) => sum + s.usageCount, 0);
			const totalRevenue = allSales.reduce((sum, s) => sum + s.totalRevenue, 0);

			return {
				total,
				active,
				upcoming,
				expired,
				totalUsage,
				totalRevenue,
			};
		}),

	// ========================================
	// MUTATIONS
	// ========================================

	// Create new sale
	create: adminProcedure
		.input(createSaleSchema)
		.mutation(async ({ ctx, input }) => {
			const [created] = await ctx.db
				.insert(sales)
				.values({
					...input,
					discountCode: input.discountCode.toUpperCase(),
					bannerConfig: input.bannerConfig as any,
				})
				.returning();

			return created;
		}),

	// Update sale
	update: adminProcedure
		.input(updateSaleSchema)
		.mutation(async ({ ctx, input }) => {
			const { id, ...updateData } = input;

			// Uppercase discount code if provided
			if (updateData.discountCode) {
				updateData.discountCode = updateData.discountCode.toUpperCase();
			}

			const [updated] = await ctx.db
				.update(sales)
				.set({
					...updateData,
					bannerConfig: updateData.bannerConfig as any,
					updatedAt: new Date(),
				})
				.where(eq(sales.id, id))
				.returning();

			return updated;
		}),

	// Toggle sale active status
	toggleActive: adminProcedure
		.input(z.object({
			id: z.string(),
			isActive: z.boolean(),
		}))
		.mutation(async ({ ctx, input }) => {
			const [updated] = await ctx.db
				.update(sales)
				.set({
					isActive: input.isActive,
					updatedAt: new Date(),
				})
				.where(eq(sales.id, input.id))
				.returning();

			return updated;
		}),

	// Delete sale
	delete: adminProcedure
		.input(z.object({
			id: z.string(),
		}))
		.mutation(async ({ ctx, input }) => {
			await ctx.db.delete(sales).where(eq(sales.id, input.id));
			return { success: true };
		}),

	// Increment usage count (called when discount is applied)
	incrementUsage: adminProcedure
		.input(z.object({
			id: z.string(),
			orderTotal: z.number(), // In cents
		}))
		.mutation(async ({ ctx, input }) => {
			const [updated] = await ctx.db
				.update(sales)
				.set({
					usageCount: sql`${sales.usageCount} + 1`,
					totalRevenue: sql`${sales.totalRevenue} + ${input.orderTotal}`,
				})
				.where(eq(sales.id, input.id))
				.returning();

			return updated;
		}),
});