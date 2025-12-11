// src/server/api/routers/admin/faq.ts

import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { faqs, faqTranslations } from "~/server/db/schema";
import { eq, and, desc, asc } from "drizzle-orm";

export const adminFaqRouter = createTRPCRouter({
	// Get all FAQs with translations
	getAll: publicProcedure
		.input(z.object({
			locale: z.string().default("en"),
			region: z.enum(["ROW", "US"]).optional(),
			category: z.string().optional(),
			isActive: z.boolean().optional(),
		}).optional())
		.query(async ({ ctx, input }) => {
			const conditions = [];

			if (input?.region) {
				conditions.push(eq(faqs.region, input.region));
			}

			if (input?.category) {
				conditions.push(eq(faqs.category, input.category));
			}

			if (input?.isActive !== undefined) {
				conditions.push(eq(faqs.isActive, input.isActive));
			}

			let query = ctx.db
				.select({
					id: faqs.id,
					region: faqs.region,
					category: faqs.category,
					sortOrder: faqs.sortOrder,
					isActive: faqs.isActive,
					createdAt: faqs.createdAt,
					updatedAt: faqs.updatedAt,
					question: faqTranslations.question,
					answer: faqTranslations.answer,
				})
				.from(faqs)
				.leftJoin(
					faqTranslations,
					and(
						eq(faqTranslations.faqId, faqs.id),
						eq(faqTranslations.locale, input?.locale ?? "en")
					)
				)
				.orderBy(asc(faqs.sortOrder), asc(faqs.createdAt));

			if (conditions.length > 0) {
				query = query.where(and(...conditions)) as any;
			}

			return await query;
		}),

	// Get single FAQ with all translations
	getById: publicProcedure
		.input(z.object({
			id: z.string(),
			locale: z.string().default("en"),
		}))
		.query(async ({ ctx, input }) => {
			const [faq] = await ctx.db
				.select({
					id: faqs.id,
					region: faqs.region,
					category: faqs.category,
					sortOrder: faqs.sortOrder,
					isActive: faqs.isActive,
					createdAt: faqs.createdAt,
					updatedAt: faqs.updatedAt,
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
				.where(eq(faqs.id, input.id))
				.limit(1);

			if (!faq) {
				return null;
			}

			// Get all translations
			const translations = await ctx.db
				.select()
				.from(faqTranslations)
				.where(eq(faqTranslations.faqId, input.id));

			return {
				...faq,
				translations,
			};
		}),

	// Get FAQ stats for dashboard
	getStats: publicProcedure
		.query(async ({ ctx }) => {
			const allFaqs = await ctx.db
				.select({
					id: faqs.id,
					region: faqs.region,
					isActive: faqs.isActive,
				})
				.from(faqs);

			const total = allFaqs.length;
			const active = allFaqs.filter(f => f.isActive).length;
			const byRegion = {
				ROW: allFaqs.filter(f => f.region === "ROW").length,
				US: allFaqs.filter(f => f.region === "US").length,
			};

			return {
				total,
				active,
				byRegion,
			};
		}),

	// Create new FAQ
	create: publicProcedure
		.input(z.object({
			region: z.enum(["ROW", "US"]),
			category: z.string().optional(),
			sortOrder: z.number().default(0),
			isActive: z.boolean().default(true),
			// English translation required
			question: z.string(),
			answer: z.string(),
		}))
		.mutation(async ({ ctx, input }) => {
			// Insert FAQ
			const [faq] = await ctx.db
				.insert(faqs)
				.values({
					region: input.region,
					category: input.category,
					sortOrder: input.sortOrder,
					isActive: input.isActive,
				})
				.returning();

			// Insert English translation
			await ctx.db.insert(faqTranslations).values({
				faqId: faq!.id,
				locale: "en",
				question: input.question,
				answer: input.answer,
			});

			return faq;
		}),

	// Update FAQ
	update: publicProcedure
		.input(z.object({
			id: z.string(),
			region: z.enum(["ROW", "US"]).optional(),
			category: z.string().optional().nullable(),
			sortOrder: z.number().optional(),
			isActive: z.boolean().optional(),
			// Translation update
			question: z.string().optional(),
			answer: z.string().optional(),
		}))
		.mutation(async ({ ctx, input }) => {
			const { id, question, answer, ...faqData } = input;

			// Update FAQ
			const [updated] = await ctx.db
				.update(faqs)
				.set(faqData)
				.where(eq(faqs.id, id))
				.returning();

			// Update English translation if provided
			if (question || answer) {
				const translationData: any = {};
				if (question) translationData.question = question;
				if (answer) translationData.answer = answer;

				await ctx.db
					.update(faqTranslations)
					.set(translationData)
					.where(
						and(
							eq(faqTranslations.faqId, id),
							eq(faqTranslations.locale, "en")
						)
					);
			}

			return updated;
		}),

	// Delete FAQ
	delete: publicProcedure
		.input(z.object({
			id: z.string(),
		}))
		.mutation(async ({ ctx, input }) => {
			await ctx.db.delete(faqs).where(eq(faqs.id, input.id));
			return { success: true };
		}),
});