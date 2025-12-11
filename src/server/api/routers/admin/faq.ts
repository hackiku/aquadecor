// src/server/api/routers/admin/faq.ts

import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import {
	faqs,
	faqTranslations,
	faqCategories,
	faqCategoryTranslations
} from "~/server/db/schema/faq";
import { eq, and, asc, desc } from "drizzle-orm";

export const adminFaqRouter = createTRPCRouter({
	// ========================================================================
	// DASHBOARD DATA
	// ========================================================================

	getFullStructure: publicProcedure
		.input(z.object({
			locale: z.string().default("en"),
			region: z.enum(["ROW", "US"]).optional(),
		}))
		.query(async ({ ctx, input }) => {
			// 1. Get Categories
			const categoriesData = await ctx.db
				.select({
					id: faqCategories.id,
					slug: faqCategories.slug,
					sortOrder: faqCategories.sortOrder,
					name: faqCategoryTranslations.name,
				})
				.from(faqCategories)
				.leftJoin(
					faqCategoryTranslations,
					and(
						eq(faqCategoryTranslations.categoryId, faqCategories.id),
						eq(faqCategoryTranslations.locale, input.locale)
					)
				)
				.orderBy(asc(faqCategories.sortOrder));

			// 2. Get FAQs
			const faqConditions = [eq(faqs.isActive, true)];
			if (input.region) {
				faqConditions.push(eq(faqs.region, input.region));
			}

			const faqsData = await ctx.db
				.select({
					id: faqs.id,
					categoryId: faqs.categoryId,
					sortOrder: faqs.sortOrder,
					region: faqs.region,
					question: faqTranslations.question,
					answer: faqTranslations.answer,
				})
				.from(faqs)
				.leftJoin(
					faqTranslations,
					and(
						eq(faqTranslations.faqId, faqs.id),
						eq(faqTranslations.locale, input.locale)
					)
				)
				.where(and(...faqConditions))
				.orderBy(asc(faqs.sortOrder));

			// 3. Nest FAQs into Categories
			const result = categoriesData.map(cat => ({
				...cat,
				name: cat.name || cat.slug, // Fallback to slug if translation missing
				items: faqsData.filter(f => f.categoryId === cat.id)
			}));

			// 4. Handle "Uncategorized" if any
			const uncategorized = faqsData.filter(f => !f.categoryId);
			if (uncategorized.length > 0) {
				result.push({
					id: "uncategorized",
					slug: "uncategorized",
					sortOrder: 9999,
					name: "Uncategorized",
					items: uncategorized
				});
			}

			return result;
		}),

	// ========================================================================
	// CATEGORY MANAGEMENT
	// ========================================================================

	getAllCategories: publicProcedure
		.input(z.object({ locale: z.string().default("en") }).optional())
		.query(async ({ ctx, input }) => {
			return await ctx.db
				.select({
					id: faqCategories.id,
					slug: faqCategories.slug,
					sortOrder: faqCategories.sortOrder,
					name: faqCategoryTranslations.name,
				})
				.from(faqCategories)
				.leftJoin(
					faqCategoryTranslations,
					and(
						eq(faqCategoryTranslations.categoryId, faqCategories.id),
						eq(faqCategoryTranslations.locale, input?.locale ?? "en")
					)
				)
				.orderBy(asc(faqCategories.sortOrder));
		}),

	upsertCategory: publicProcedure
		.input(z.object({
			id: z.string().optional(),
			slug: z.string().min(1),
			name: z.string().min(1), // EN name
			sortOrder: z.number().default(0),
			locale: z.string().default("en"),
		}))
		.mutation(async ({ ctx, input }) => {
			let categoryId = input.id;

			if (categoryId) {
				// Update existing category
				await ctx.db
					.update(faqCategories)
					.set({
						slug: input.slug,
						sortOrder: input.sortOrder,
						updatedAt: new Date(),
					})
					.where(eq(faqCategories.id, categoryId));
			} else {
				// Create new
				const [newCat] = await ctx.db
					.insert(faqCategories)
					.values({
						slug: input.slug,
						sortOrder: input.sortOrder,
					})
					.returning();
				categoryId = newCat!.id;
			}

			// Upsert Translation
			const [existingTrans] = await ctx.db
				.select()
				.from(faqCategoryTranslations)
				.where(and(
					eq(faqCategoryTranslations.categoryId, categoryId!),
					eq(faqCategoryTranslations.locale, input.locale)
				));

			if (existingTrans) {
				await ctx.db
					.update(faqCategoryTranslations)
					.set({ name: input.name })
					.where(eq(faqCategoryTranslations.id, existingTrans.id));
			} else {
				await ctx.db
					.insert(faqCategoryTranslations)
					.values({
						categoryId: categoryId!,
						locale: input.locale,
						name: input.name,
					});
			}

			return { success: true, id: categoryId };
		}),


	reorderCategories: publicProcedure
		.input(z.object({
			items: z.array(z.object({
				id: z.string(),
				sortOrder: z.number(),
			})),
		}))
		.mutation(async ({ ctx, input }) => {
			await ctx.db.transaction(async (tx) => {
				for (const item of input.items) {
					await tx
						.update(faqCategories)
						.set({ sortOrder: item.sortOrder })
						.where(eq(faqCategories.id, item.id));
				}
			});
			return { success: true };
		}),

	// New: Reorder FAQs
	reorderFaqs: publicProcedure
		.input(z.object({
			items: z.array(z.object({
				id: z.string(),
				sortOrder: z.number(),
			})),
		}))
		.mutation(async ({ ctx, input }) => {
			await ctx.db.transaction(async (tx) => {
				for (const item of input.items) {
					await tx
						.update(faqs)
						.set({ sortOrder: item.sortOrder })
						.where(eq(faqs.id, item.id));
				}
			});
			return { success: true };
		}),


	deleteCategory: publicProcedure
		.input(z.object({ id: z.string() }))
		.mutation(async ({ ctx, input }) => {
			await ctx.db.delete(faqCategories).where(eq(faqCategories.id, input.id));
			return { success: true };
		}),

	// ========================================================================
	// FAQ ITEMS MANAGEMENT
	// ========================================================================

	upsertFaq: publicProcedure
		.input(z.object({
			id: z.string().optional(),
			categoryId: z.string().optional().nullable(),
			region: z.enum(["ROW", "US"]),
			question: z.string().min(1),
			answer: z.string().min(1),
			sortOrder: z.number().default(0),
			locale: z.string().default("en"),
		}))
		.mutation(async ({ ctx, input }) => {
			let faqId = input.id;

			if (faqId) {
				// Update
				await ctx.db
					.update(faqs)
					.set({
						categoryId: input.categoryId,
						region: input.region,
						sortOrder: input.sortOrder,
						updatedAt: new Date(),
					})
					.where(eq(faqs.id, faqId));
			} else {
				// Create
				const [newFaq] = await ctx.db
					.insert(faqs)
					.values({
						categoryId: input.categoryId,
						region: input.region,
						sortOrder: input.sortOrder,
					})
					.returning();
				faqId = newFaq!.id;
			}

			// Upsert Translation
			const [existingTrans] = await ctx.db
				.select()
				.from(faqTranslations)
				.where(and(
					eq(faqTranslations.faqId, faqId!),
					eq(faqTranslations.locale, input.locale)
				));

			if (existingTrans) {
				await ctx.db
					.update(faqTranslations)
					.set({
						question: input.question,
						answer: input.answer
					})
					.where(eq(faqTranslations.id, existingTrans.id));
			} else {
				await ctx.db
					.insert(faqTranslations)
					.values({
						faqId: faqId!,
						locale: input.locale,
						question: input.question,
						answer: input.answer,
					});
			}

			return { success: true, id: faqId };
		}),

	deleteFaq: publicProcedure
		.input(z.object({ id: z.string() }))
		.mutation(async ({ ctx, input }) => {
			await ctx.db.delete(faqs).where(eq(faqs.id, input.id));
			return { success: true };
		}),
});