// src/server/api/routers/faq.ts

import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { faqs, faqTranslations } from "~/server/db/schema";
import { eq, and, asc } from "drizzle-orm";

export const faqRouter = createTRPCRouter({
	// Get all active FAQs for public display
	getAll: publicProcedure
		.input(
			z
				.object({
					locale: z.string().default("en"),
					region: z.enum(["ROW", "US"]).optional(),
					category: z.string().optional(),
				})
				.optional(),
		)
		.query(async ({ ctx, input }) => {
			const conditions = [eq(faqs.isActive, true)];

			if (input?.region) {
				conditions.push(eq(faqs.region, input.region));
			}

			if (input?.category) {
				conditions.push(eq(faqs.category, input.category));
			}

			const results = await ctx.db
				.select({
					id: faqs.id,
					region: faqs.region,
					category: faqs.category,
					sortOrder: faqs.sortOrder,
					question: faqTranslations.question,
					answer: faqTranslations.answer,
				})
				.from(faqs)
				.leftJoin(
					faqTranslations,
					and(
						eq(faqTranslations.faqId, faqs.id),
						eq(faqTranslations.locale, input?.locale ?? "en"),
					),
				)
				.where(and(...conditions))
				.orderBy(asc(faqs.sortOrder), asc(faqs.createdAt));

			// Group by category
			const grouped = results.reduce(
				(acc, faq) => {
					const category = faq.category || "General";
					if (!acc[category]) {
						acc[category] = [];
					}
					acc[category].push(faq);
					return acc;
				},
				{} as Record<string, typeof results>,
			);

			return {
				all: results,
				byCategory: grouped,
				categories: Object.keys(grouped).sort(),
			};
		}),

	// Get available categories
	getCategories: publicProcedure.query(async ({ ctx }) => {
		const results = await ctx.db
			.selectDistinct({ category: faqs.category })
			.from(faqs)
			.where(eq(faqs.isActive, true));

		return results
			.map((r) => r.category || "General")
			.filter(Boolean)
			.sort();
	}),
});