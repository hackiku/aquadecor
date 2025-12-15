// src/server/api/routers/calculator.ts

import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import {
	quotes,
	products,
	productPricing,
	categories,
	categoryTranslations,
	media
} from "~/server/db/schema";
import { eq, and, min, sql } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

const createQuoteSchema = z.object({
	modelCategoryId: z.string().min(1),
	subcategoryId: z.string().optional().nullable(),
	flexibility: z.enum(["solid", "flexible"]),
	dimensions: z.object({
		width: z.number().min(10),
		height: z.number().min(10),
		depth: z.number().optional(),
	}),
	unit: z.enum(["cm", "inch"]),
	sidePanels: z.enum(["none", "single", "both"]),
	sidePanelWidth: z.number().optional(),
	filtrationType: z.string(),
	filtrationCustomNotes: z.string().optional(),
	country: z.string().min(1),
	name: z.string().optional(),
	email: z.string().email(),
	notes: z.string().optional(),
});

export const calculatorRouter = createTRPCRouter({

	getCalculatorModels: publicProcedure
		.input(z.object({
			locale: z.string().default("en"),
		}))
		.query(async ({ ctx, input }) => {
			const results = await ctx.db
				.select({
					id: categories.id,
					slug: categories.slug,
					name: categoryTranslations.name,
					description: categoryTranslations.description,
					image: media.storageUrl,
					baseRatePerSqM: min(productPricing.baseRatePerSqM),
					productCount: sql<number>`count(distinct ${products.id})`.mapWith(Number),
				})
				.from(categories)
				.leftJoin(categoryTranslations, and(eq(categoryTranslations.categoryId, categories.id), eq(categoryTranslations.locale, input.locale)))
				.leftJoin(media, and(eq(media.categoryId, categories.id), eq(media.usageType, "category"), eq(media.sortOrder, 0)))
				.leftJoin(products, eq(products.categoryId, categories.id))
				.leftJoin(productPricing, and(eq(productPricing.productId, products.id), eq(productPricing.isActive, true)))
				.where(and(eq(categories.productLine, "3d-backgrounds"), eq(categories.isActive, true)))
				.groupBy(categories.id, categories.slug, categoryTranslations.name, categoryTranslations.description, media.storageUrl, categories.sortOrder)
				.orderBy(categories.sortOrder);

			return results.map(cat => ({
				...cat,
				baseRatePerM2: cat.baseRatePerSqM ? cat.baseRatePerSqM / 100 : 250,
				hasSubcategories: cat.productCount > 1,
				// FIX: Provide default texture (same as image for now)
				textureUrl: cat.image
			}));
		}),

	createQuote: publicProcedure
		.input(createQuoteSchema)
		.mutation(async ({ ctx, input }) => {
			let baseRatePerSqMCents = 0;
			let productIdResolved: string | undefined = undefined;

			if (input.subcategoryId && input.subcategoryId !== "skip") {
				const productPrice = await ctx.db
					.select({ rate: productPricing.baseRatePerSqM, id: products.id })
					.from(products)
					.leftJoin(productPricing, eq(productPricing.productId, products.id))
					.where(eq(products.id, input.subcategoryId))
					.limit(1);

				if (productPrice.length > 0 && productPrice[0]?.rate) {
					baseRatePerSqMCents = productPrice[0].rate;
					productIdResolved = productPrice[0].id;
				}
			}

			if (baseRatePerSqMCents === 0) {
				const category = await ctx.db
					.select({ id: categories.id })
					.from(categories)
					.where(input.modelCategoryId.includes("-") ? eq(categories.slug, input.modelCategoryId) : eq(categories.id, input.modelCategoryId))
					.limit(1);

				// FIX: Add check for category existence
				if (category.length > 0 && category[0]) {
					const minRate = await ctx.db
						.select({ minRate: min(productPricing.baseRatePerSqM) })
						.from(products)
						.leftJoin(productPricing, eq(productPricing.productId, products.id))
						.where(eq(products.categoryId, category[0].id));

					baseRatePerSqMCents = minRate[0]?.minRate ?? 25000;
				} else {
					baseRatePerSqMCents = 25000;
				}
			}

			const widthCm = input.unit === "inch" ? input.dimensions.width * 2.54 : input.dimensions.width;
			const heightCm = input.unit === "inch" ? input.dimensions.height * 2.54 : input.dimensions.height;
			const sidePanelWidthCm = input.sidePanelWidth ? (input.unit === "inch" ? input.sidePanelWidth * 2.54 : input.sidePanelWidth) : 0;

			const surfaceAreaM2 = (widthCm * heightCm) / 10000;
			const basePrice = Math.round(surfaceAreaM2 * baseRatePerSqMCents);
			const flexUpcharge = input.flexibility === "flexible" ? Math.round(basePrice * 0.20) : 0;

			let sidePanelCost = 0;
			if (input.sidePanels !== "none" && sidePanelWidthCm > 0) {
				const panelAreaM2 = (sidePanelWidthCm * heightCm) / 10000;
				const singlePanelCost = Math.round(panelAreaM2 * baseRatePerSqMCents);
				sidePanelCost = input.sidePanels === "both" ? singlePanelCost * 2 : singlePanelCost;
			}

			const filtrationCost = input.filtrationType !== "none" ? 5000 : 0;
			const totalEstimatedCents = basePrice + flexUpcharge + sidePanelCost + filtrationCost;

			const fullName = input.name?.trim() ?? "Guest";
			const spaceIdx = fullName.indexOf(" ");
			const firstName = spaceIdx > 0 ? fullName.substring(0, spaceIdx) : fullName;
			const lastName = spaceIdx > 0 ? fullName.substring(spaceIdx + 1) : "";

			try {
				const [savedQuote] = await ctx.db.insert(quotes).values({
					productId: productIdResolved, // Can be undefined now
					email: input.email,
					firstName: firstName,
					lastName: lastName,
					country: input.country,
					// FIX: Drizzle JSONB strict typing fix
					dimensions: {
						width: input.dimensions.width,
						height: input.dimensions.height,
						depth: input.dimensions.depth,
						unit: input.unit,
						sidePanels: input.sidePanels,
						sidePanelWidth: input.sidePanelWidth,
						filtrationCutout: input.filtrationType !== "none",
						filtrationType: input.filtrationType, // Ensure schema supports this new field or remove it
						notes: input.filtrationCustomNotes
					} as any, // Cast to any if schema type definition is lagging behind
					estimatedPriceEurCents: totalEstimatedCents,
					status: "pending",
					customerNotes: input.notes,
				}).returning();

				// FIX: Check if savedQuote exists
				if (!savedQuote) {
					throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to return quote ID" });
				}

				return {
					success: true,
					quoteId: savedQuote.id,
					estimatedPriceEur: totalEstimatedCents / 100,
				};

			} catch (error) {
				console.error("Quote submission error:", error);
				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: "Could not submit quote. Please try again."
				});
			}
		}),
});