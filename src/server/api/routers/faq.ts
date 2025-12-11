// src/server/api/routers/faq.ts

import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import {
	faqs,
	faqTranslations,
	faqCategories,
	faqCategoryTranslations
} from "~/server/db/schema/faq";
import { eq, and, asc, isNotNull } from "drizzle-orm";

export const faqRouter = createTRPCRouter({
	// Get all active FAQs grouped by category for the public site
	getForPublic: publicProcedure
		.input(
			z.object({
				locale: z.string().default("en"),
				region: z.enum(["ROW", "US"]).default("ROW"),
			})
		)
		.query(async ({ ctx, input }) => {
			// 1. Fetch Categories (Active & Translated)
			const categories = await ctx.db
				.select({
					id: faqCategories.id,
					slug: faqCategories.slug,
					icon: faqCategories.icon,
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
				.where(eq(faqCategories.isActive, true))
				.orderBy(asc(faqCategories.sortOrder));

			// 2. Fetch FAQs (Active, Region-Specific & Translated)
			const questions = await ctx.db
				.select({
					id: faqs.id,
					categoryId: faqs.categoryId,
					sortOrder: faqs.sortOrder,
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
				.where(
					and(
						eq(faqs.isActive, true),
						eq(faqs.region, input.region),
						// Only return FAQs that actually have a translation for this locale
						// OR you can remove this to show empty cards, but usually hiding is better
						isNotNull(faqTranslations.question)
					)
				)
				.orderBy(asc(faqs.sortOrder));

			// 3. Nest FAQs into Categories
			// We map over categories to preserve the category sort order
			const structured = categories.map((cat) => {
				const catQuestions = questions.filter((q) => q.categoryId === cat.id);

				// Skip categories with no questions if you want, 
				// or keep them to show empty sections. 
				// Keeping them for now allows UI to handle "No questions" state.
				return {
					...cat,
					name: cat.name || cat.slug, // Fallback if translation missing
					items: catQuestions,
				};
			});

			// Filter out empty categories if desired:
			// return structured.filter(c => c.items.length > 0);
			return structured;
		}),
});