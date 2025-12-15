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

// Schema for creating a quote
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

	// 1. Fetch Categories for Calculator (Aggregated Price & Counts)
	getCalculatorModels: publicProcedure
		.input(z.object({
			locale: z.string().default("en"),
		}))
		.query(async ({ ctx, input }) => {
			// We want: Category Details + Min Base Rate + Product Count
			const results = await ctx.db
				.select({
					id: categories.id,
					slug: categories.slug,
					name: categoryTranslations.name,
					description: categoryTranslations.description,
					image: media.storageUrl,
					// Aggregate pricing and counts
					baseRatePerSqM: min(productPricing.baseRatePerSqM),
					productCount: sql<number>`count(distinct ${products.id})`.mapWith(Number),
				})
				.from(categories)
				.leftJoin(
					categoryTranslations,
					and(
						eq(categoryTranslations.categoryId, categories.id),
						eq(categoryTranslations.locale, input.locale)
					)
				)
				.leftJoin(
					media,
					and(
						eq(media.categoryId, categories.id),
						eq(media.usageType, "category"),
						eq(media.sortOrder, 0)
					)
				)
				// Join products to get counts and pricing
				.leftJoin(products, eq(products.categoryId, categories.id))
				.leftJoin(
					productPricing,
					and(
						eq(productPricing.productId, products.id),
						eq(productPricing.isActive, true)
					)
				)
				.where(
					and(
						eq(categories.productLine, "3d-backgrounds"),
						eq(categories.isActive, true)
					)
				)
				.groupBy(
					categories.id,
					categories.slug,
					categoryTranslations.name,
					categoryTranslations.description,
					media.storageUrl,
					categories.sortOrder
				)
				.orderBy(categories.sortOrder);

			// Transform for client
			return results.map(cat => ({
				...cat,
				// Ensure we have a valid rate (fallback to €250 if missing)
				// DB stores cents (25000), client expects EUR (250) for the base logic
				baseRatePerM2: cat.baseRatePerSqM ? cat.baseRatePerSqM / 100 : 250,
				// Determine if it should show the subcategory step
				hasSubcategories: cat.productCount > 1
			}));
		}),

	// 2. Create Quote Mutation
	createQuote: publicProcedure
		.input(createQuoteSchema)
		.mutation(async ({ ctx, input }) => {
			let baseRatePerSqMCents = 0;
			let productIdResolved: string | null = null;

			// A. Check for specific product price first
			if (input.subcategoryId && input.subcategoryId !== "skip") {
				const productPrice = await ctx.db
					.select({
						rate: productPricing.baseRatePerSqM,
						id: products.id
					})
					.from(products)
					.leftJoin(productPricing, eq(productPricing.productId, products.id))
					.where(eq(products.id, input.subcategoryId))
					.limit(1);

				if (productPrice.length > 0 && productPrice[0]?.rate) {
					baseRatePerSqMCents = productPrice[0].rate;
					productIdResolved = productPrice[0].id;
				}
			}

			// B. Fallback to Category Minimum
			if (baseRatePerSqMCents === 0) {
				const category = await ctx.db
					.select({ id: categories.id })
					.from(categories)
					.where(
						input.modelCategoryId.includes("-") // naive check for slug vs uuid
							? eq(categories.slug, input.modelCategoryId)
							: eq(categories.id, input.modelCategoryId)
					)
					.limit(1);

				if (category.length > 0) {
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

			// Calculation (Server Side Source of Truth)
			const widthCm = input.unit === "inch" ? input.dimensions.width * 2.54 : input.dimensions.width;
			const heightCm = input.unit === "inch" ? input.dimensions.height * 2.54 : input.dimensions.height;
			const sidePanelWidthCm = input.sidePanelWidth
				? (input.unit === "inch" ? input.sidePanelWidth * 2.54 : input.sidePanelWidth)
				: 0;

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

			// Extract Name
			const fullName = input.name?.trim() ?? "Guest";
			const spaceIdx = fullName.indexOf(" ");
			const firstName = spaceIdx > 0 ? fullName.substring(0, spaceIdx) : fullName;
			const lastName = spaceIdx > 0 ? fullName.substring(spaceIdx + 1) : "";

			// Save to DB
			try {
				const [savedQuote] = await ctx.db.insert(quotes).values({
					productId: productIdResolved,
					email: input.email,
					firstName: firstName,
					lastName: lastName,
					country: input.country,
					dimensions: {
						width: input.dimensions.width,
						height: input.dimensions.height,
						depth: input.dimensions.depth,
						unit: input.unit,
						sidePanels: input.sidePanels,
						sidePanelWidth: input.sidePanelWidth,
						filtrationCutout: input.filtrationType !== "none",
						filtrationType: input.filtrationType,
						notes: input.filtrationCustomNotes
					},
					estimatedPriceEurCents: totalEstimatedCents,
					status: "pending",
					customerNotes: input.notes,
				}).returning();

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