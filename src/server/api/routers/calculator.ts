// src/server/api/routers/calculator.ts

import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import {
	quotes,
	products,
	productPricing,
	productTranslations,
	categories,
	categoryTranslations,
	media
} from "~/server/db/schema";
import { eq, and, min, sql, desc } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

// UPDATED: Schema now supports left/right individual panels and additional items
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
	sidePanels: z.enum(["none", "left", "right", "both"]), // UPDATED: Added left/right
	sidePanelWidth: z.number().optional(),
	filtrationType: z.string(),
	filtrationCustomNotes: z.string().optional(),
	country: z.string().min(1),
	name: z.string().optional(),
	email: z.string().email(),
	notes: z.string().optional(),
	additionalItems: z.array(z.object({ // NEW: Track additional items
		id: z.string(),
		quantity: z.number().min(1),
	})).optional(),
});

export const calculatorRouter = createTRPCRouter({

	// Get calculator categories (models) with their category-level placeholder images
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
				.leftJoin(categoryTranslations, and(
					eq(categoryTranslations.categoryId, categories.id),
					eq(categoryTranslations.locale, input.locale)
				))
				.leftJoin(media, and(
					eq(media.categoryId, categories.id),
					eq(media.usageType, "category"),
					eq(media.sortOrder, 0)
				))
				.leftJoin(products, eq(products.categoryId, categories.id))
				.leftJoin(productPricing, and(
					eq(productPricing.productId, products.id),
					eq(productPricing.isActive, true)
				))
				.where(and(
					eq(categories.productLine, "3d-backgrounds"),
					eq(categories.isActive, true)
				))
				.groupBy(
					categories.id,
					categories.slug,
					categoryTranslations.name,
					categoryTranslations.description,
					media.storageUrl,
					categories.sortOrder
				)
				.orderBy(categories.sortOrder);

			return results.map(cat => ({
				...cat,
				baseRatePerM2: cat.baseRatePerSqM ? cat.baseRatePerSqM / 100 : 250,
				hasSubcategories: cat.productCount > 1,
				// Use category image or fallback
				textureUrl: cat.image || "/media/images/background-placeholder.png"
			}));
		}),

	// NEW: Get subcategories (products) for a specific category with their product images
	getSubcategories: publicProcedure
		.input(z.object({
			categoryId: z.string().optional(),
			categorySlug: z.string().optional(),
			locale: z.string().default("en"),
		}))
		.query(async ({ ctx, input }) => {
			if (!input.categoryId && !input.categorySlug) {
				throw new TRPCError({
					code: "BAD_REQUEST",
					message: "Either categoryId or categorySlug is required"
				});
			}

			// Find category first
			const categoryFilter = input.categoryId
				? eq(categories.id, input.categoryId)
				: eq(categories.slug, input.categorySlug!);

			const category = await ctx.db
				.select({ id: categories.id })
				.from(categories)
				.where(categoryFilter)
				.limit(1);

			if (!category[0]) {
				return { products: [] };
			}

			// Fetch products with their translations and hero images
			const productsWithMedia = await ctx.db
				.select({
					id: products.id,
					slug: products.slug,
					sku: products.sku,
					// Get translated fields
					name: productTranslations.name,
					shortDescription: productTranslations.shortDescription,
					baseRatePerSqM: productPricing.baseRatePerSqM,
					// Get the hero image (sortOrder 0) or first available
					heroImage: media.storageUrl,
					sortOrder: products.sortOrder,
				})
				.from(products)
				.leftJoin(productTranslations, and(
					eq(productTranslations.productId, products.id),
					eq(productTranslations.locale, input.locale)
				))
				.leftJoin(productPricing, and(
					eq(productPricing.productId, products.id),
					eq(productPricing.isActive, true)
				))
				.leftJoin(media, and(
					eq(media.productId, products.id),
					eq(media.usageType, "product"),
					eq(media.sortOrder, 0), // Hero image priority
					eq(media.isActive, true)
				))
				.where(and(
					eq(products.categoryId, category[0].id),
					eq(products.isActive, true)
				))
				.orderBy(products.sortOrder);

			// Group by product to get unique products with their first hero image
			const uniqueProducts = new Map();
			for (const p of productsWithMedia) {
				if (!uniqueProducts.has(p.id)) {
					uniqueProducts.set(p.id, p);
				}
			}

			// Format response with fallback images
			return {
				products: Array.from(uniqueProducts.values()).map(p => ({
					id: p.id,
					slug: p.slug,
					sku: p.sku,
					name: p.name || p.slug, // Fallback to slug if no translation
					shortDescription: p.shortDescription || "Custom fit design",
					baseRatePerM2: p.baseRatePerSqM ? p.baseRatePerSqM / 100 : 250,
					// CRITICAL: Use product image with proper fallback
					heroImageUrl: p.heroImage || "/media/images/background-placeholder.png",
					textureUrl: p.heroImage || "/media/images/background-placeholder.png",
				}))
			};
		}),

	// Get additional items (decorations) for calculator
	getCalculatorAddons: publicProcedure
		.input(z.object({
			locale: z.string().default("en"),
		}))
		.query(async ({ ctx, input }) => {
			// Fetch featured products from aquarium-decorations line
			const results = await ctx.db
				.select({
					id: products.id,
					name: productTranslations.name,
					slug: products.slug,
					sku: products.sku,
					description: productTranslations.shortDescription,
					baseRatePerSqM: productPricing.baseRatePerSqM,
					image: media.storageUrl,
					sortOrder: products.sortOrder,
				})
				.from(products)
				.innerJoin(categories, eq(categories.id, products.categoryId))
				.leftJoin(productTranslations, and(
					eq(productTranslations.productId, products.id),
					eq(productTranslations.locale, input.locale)
				))
				.leftJoin(productPricing, and(
					eq(productPricing.productId, products.id),
					eq(productPricing.isActive, true)
				))
				.leftJoin(media, and(
					eq(media.productId, products.id),
					eq(media.usageType, "product"),
					eq(media.sortOrder, 0),
					eq(media.isActive, true)
				))
				.where(and(
					eq(categories.productLine, "aquarium-decorations"),
					eq(products.isFeatured, true),
					eq(products.isActive, true)
				))
				.orderBy(products.sortOrder);

			return results.map(item => ({
				id: item.id,
				name: item.name || item.slug,
				description: item.description || "Aquarium decoration",
				priceCents: item.baseRatePerSqM || 2500, // Fallback to €25
				image: item.image || "/media/images/decoration-placeholder.png",
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
					.where(input.modelCategoryId.includes("-")
						? eq(categories.slug, input.modelCategoryId)
						: eq(categories.id, input.modelCategoryId)
					)
					.limit(1);

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

			// UPDATED: Side panel calculation for left/right/both
			let sidePanelCost = 0;
			if (input.sidePanels !== "none" && sidePanelWidthCm > 0) {
				const panelAreaM2 = (sidePanelWidthCm * heightCm) / 10000;
				const singlePanelCost = Math.round(panelAreaM2 * baseRatePerSqMCents);
				// Both = 2 panels, left or right = 1 panel
				const panelCount = input.sidePanels === "both" ? 2 : 1;
				sidePanelCost = singlePanelCost * panelCount;
			}

			const filtrationCost = input.filtrationType !== "none" ? 5000 : 0;
			const totalEstimatedCents = basePrice + flexUpcharge + sidePanelCost + filtrationCost;

			const fullName = input.name?.trim() ?? "Guest";
			const spaceIdx = fullName.indexOf(" ");
			const firstName = spaceIdx > 0 ? fullName.substring(0, spaceIdx) : fullName;
			const lastName = spaceIdx > 0 ? fullName.substring(spaceIdx + 1) : "";

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
						sidePanels: input.sidePanels, // Now stores "left" | "right" | "both" | "none"
						sidePanelWidth: input.sidePanelWidth,
						filtrationCutout: input.filtrationType !== "none",
						filtrationType: input.filtrationType,
						notes: input.filtrationCustomNotes,
						additionalItems: input.additionalItems, // Store additional items
					} as any,
					estimatedPriceEurCents: totalEstimatedCents,
					status: "pending",
					customerNotes: input.notes,
				}).returning();

				if (!savedQuote) {
					throw new TRPCError({
						code: "INTERNAL_SERVER_ERROR",
						message: "Failed to return quote ID"
					});
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