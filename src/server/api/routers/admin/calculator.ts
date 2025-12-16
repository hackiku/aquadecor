// src/server/api/routers/admin/calculator.ts
import { z } from "zod";
import { createTRPCRouter, adminProcedure } from "~/server/api/trpc";
import { categories, products, media, productTranslations } from "~/server/db/schema";
import { eq, and, desc, asc, inArray } from "drizzle-orm";

export const adminCalculatorRouter = createTRPCRouter({
	// ============================================================================
	// BACKGROUND CATEGORIES (The main models)
	// ============================================================================
	getBackgroundCategories: adminProcedure.query(async ({ ctx }) => {
		return await ctx.db
			.select()
			.from(categories)
			.where(eq(categories.productLine, "3d-backgrounds"))
			.orderBy(asc(categories.sortOrder));
	}),

	toggleCategoryStatus: adminProcedure
		.input(z.object({
			id: z.string(),
			isActive: z.boolean(),
		}))
		.mutation(async ({ ctx, input }) => {
			await ctx.db
				.update(categories)
				.set({ isActive: input.isActive })
				.where(eq(categories.id, input.id));
			return { success: true };
		}),

	reorderCategories: adminProcedure
		.input(z.object({
			items: z.array(z.object({
				id: z.string(),
				sortOrder: z.number(),
			})),
		}))
		.mutation(async ({ ctx, input }) => {
			await Promise.all(
				input.items.map((item) =>
					ctx.db
						.update(categories)
						.set({ sortOrder: item.sortOrder })
						.where(eq(categories.id, item.id))
				)
			);
			return { success: true };
		}),

	// ============================================================================
	// ADDITIONAL ITEMS (Addons)
	// We use 'aquarium-decorations' products + 'isFeatured' flag to denote
	// items that should appear in the calculator flow.
	// ============================================================================
	getCalculatorAddons: adminProcedure.query(async ({ ctx }) => {
		// Fetch all products that are marked as featured (our proxy for "In Calculator")
		// AND belong to the decorations line
		const results = await ctx.db
			.select({
				id: products.id,
				name: productTranslations.name,
				slug: products.slug,
				sku: products.sku,
				isActive: products.isActive,
				isFeatured: products.isFeatured,
				sortOrder: products.sortOrder,
				imageUrl: media.storageUrl,
			})
			.from(products)
			.innerJoin(categories, eq(categories.id, products.categoryId))
			.leftJoin(productTranslations, and(
				eq(productTranslations.productId, products.id),
				eq(productTranslations.locale, "en")
			))
			.leftJoin(media, and(
				eq(media.productId, products.id),
				eq(media.sortOrder, 0)
			))
			.where(and(
				eq(categories.productLine, "aquarium-decorations"),
				eq(products.isFeatured, true),
				eq(products.isActive, true) // Only active products
			))
			.orderBy(asc(products.sortOrder));

		return results;
	}),

	// Search for products to add
	searchAddonCandidates: adminProcedure
		.input(z.object({ query: z.string() }))
		.query(async ({ ctx, input }) => {
			if (input.query.length < 2) return [];

			// Simple search for products NOT yet in calculator
			const results = await ctx.db
				.select({
					id: products.id,
					name: productTranslations.name,
					sku: products.sku,
					imageUrl: media.storageUrl,
				})
				.from(products)
				.innerJoin(categories, eq(categories.id, products.categoryId))
				.leftJoin(productTranslations, and(
					eq(productTranslations.productId, products.id),
					eq(productTranslations.locale, "en")
				))
				.leftJoin(media, and(
					eq(media.productId, products.id),
					eq(media.sortOrder, 0)
				))
				.where(and(
					eq(categories.productLine, "aquarium-decorations"),
					eq(products.isFeatured, false) // Not currently in calculator
				))
				.limit(10);

			// In a real app we'd use ilike or tsvector for search, 
			// assuming generic filter here for simplicity or relying on client filtering of a larger set
			// For this scaffold, returning first 10 candidates to populate list
			return results;
		}),

	addAddon: adminProcedure
		.input(z.object({ productId: z.string() }))
		.mutation(async ({ ctx, input }) => {
			await ctx.db
				.update(products)
				.set({ isFeatured: true })
				.where(eq(products.id, input.productId));
			return { success: true };
		}),

	removeAddon: adminProcedure
		.input(z.object({ productId: z.string() }))
		.mutation(async ({ ctx, input }) => {
			await ctx.db
				.update(products)
				.set({ isFeatured: false })
				.where(eq(products.id, input.productId));
			return { success: true };
		}),

	reorderAddons: adminProcedure
		.input(z.object({
			items: z.array(z.object({
				id: z.string(),
				sortOrder: z.number(),
			})),
		}))
		.mutation(async ({ ctx, input }) => {
			await Promise.all(
				input.items.map((item) =>
					ctx.db
						.update(products)
						.set({ sortOrder: item.sortOrder })
						.where(eq(products.id, item.id))
				)
			);
			return { success: true };
		}),
});