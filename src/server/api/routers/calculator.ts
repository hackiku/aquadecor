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
import { eq, and, min, sql, inArray } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { calculateQuote } from "~/lib/calculator/engine";

// ============================================================================
// VALIDATION SCHEMAS
// ============================================================================

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
	sidePanels: z.enum(["none", "left", "right", "both"]),
	sidePanelWidth: z.number().optional(),
	filtrationType: z.string(),
	filtrationCustomNotes: z.string().optional(),
	country: z.string().min(1),
	// Contact Info
	name: z.string().optional(),
	email: z.string().email(),
	notes: z.string().optional(),
	// Addons
	additionalItems: z.array(z.object({
		id: z.string(),
		quantity: z.number().min(1),
	})).optional(),
});

// ============================================================================
// ROUTER
// ============================================================================

export const calculatorRouter = createTRPCRouter({

	// 1. Get Models (Categories)
	getCalculatorModels: publicProcedure
		.input(z.object({ locale: z.string().default("en") }))
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
				// Fallback rate if none found (25000 cents = €250)
				baseRatePerM2: cat.baseRatePerSqM ? cat.baseRatePerSqM / 100 : 250,
				hasSubcategories: cat.productCount > 1,
				textureUrl: cat.image || "/media/images/background-placeholder.png"
			}));
		}),

	// 2. Get Subcategories (Products)
	getSubcategories: publicProcedure
		.input(z.object({
			categorySlug: z.string().optional(),
			locale: z.string().default("en"),
		}))
		.query(async ({ ctx, input }) => {
			if (!input.categorySlug) return { products: [] };

			// Join Categories -> Products -> Media -> Pricing -> Translations
			const rows = await ctx.db
				.select({
					id: products.id,
					slug: products.slug,
					sku: products.sku,
					name: productTranslations.name,
					shortDescription: productTranslations.shortDescription,
					baseRate: productPricing.baseRatePerSqM,
					heroImage: media.storageUrl,
				})
				.from(categories)
				.innerJoin(products, eq(products.categoryId, categories.id))
				.leftJoin(productTranslations, and(
					eq(productTranslations.productId, products.id),
					eq(productTranslations.locale, input.locale)
				))
				.leftJoin(productPricing, eq(productPricing.productId, products.id))
				.leftJoin(media, and(
					eq(media.productId, products.id),
					eq(media.sortOrder, 0)
				))
				.where(and(
					eq(categories.slug, input.categorySlug),
					eq(products.isActive, true)
				))
				.orderBy(products.sortOrder);

			// Remove duplicates (if any) and format
			const unique = new Map();
			for (const r of rows) {
				if (!unique.has(r.id)) unique.set(r.id, r);
			}

			return {
				products: Array.from(unique.values()).map(p => ({
					id: p.id,
					slug: p.slug,
					sku: p.sku,
					name: p.name || p.slug,
					shortDescription: p.shortDescription,
					baseRatePerM2: p.baseRate ? p.baseRate / 100 : 250,
					heroImageUrl: p.heroImage,
					textureUrl: p.heroImage, // Using hero as texture for now
				}))
			};
		}),

	// 3. Get Addons
	getCalculatorAddons: publicProcedure
		.input(z.object({ locale: z.string().default("en") }))
		.query(async ({ ctx, input }) => {
			const items = await ctx.db
				.select({
					id: products.id,
					name: productTranslations.name,
					slug: products.slug,
					// ADDED: Fetch the description
					description: productTranslations.shortDescription,
					basePrice: productPricing.unitPriceEurCents,
					image: media.storageUrl,
				})
				.from(products)
				.innerJoin(categories, eq(categories.id, products.categoryId))
				.leftJoin(productTranslations, and(
					eq(productTranslations.productId, products.id),
					eq(productTranslations.locale, input.locale)
				))
				.leftJoin(productPricing, eq(productPricing.productId, products.id))
				.leftJoin(media, and(
					eq(media.productId, products.id),
					eq(media.sortOrder, 0)
				))
				.where(and(
					eq(categories.productLine, "aquarium-decorations"),
					eq(products.isFeatured, true),
					eq(products.isActive, true)
				));

			return items.map(i => ({
				id: i.id,
				name: i.name || i.slug,
				// ADDED: Pass it through
				description: i.description,
				priceCents: i.basePrice || 0,
				image: i.image
			}));
		}),

	// 4. Create Quote (The Big Logic)
	createQuote: publicProcedure
		.input(createQuoteSchema)
		.mutation(async ({ ctx, input }) => {
			// A. Resolve Base Rate & Strategy Flags
			// We try to find the specific product (subcategory) rate first.
			// If that fails or isn't selected, we fallback to the Category's default rate.

			let baseRateCents = 25000; // Default €250
			let categorySlug = "";

			// Try fetching specific product pricing
			if (input.subcategoryId && input.subcategoryId !== "skip") {
				const productData = await ctx.db
					.select({
						rate: productPricing.baseRatePerSqM,
						catSlug: categories.slug
					})
					.from(products)
					.innerJoin(categories, eq(categories.id, products.categoryId))
					.leftJoin(productPricing, eq(productPricing.productId, products.id))
					.where(eq(products.id, input.subcategoryId))
					.limit(1);

				if (productData[0]) {
					if (productData[0].rate) baseRateCents = productData[0].rate;
					categorySlug = productData[0].catSlug;
				}
			}

			// If no product found or skipped, get Category defaults
			if (!categorySlug) {
				const catData = await ctx.db
					.select({
						slug: categories.slug,
						// Get lowest rate in category as fallback
						minRate: min(productPricing.baseRatePerSqM)
					})
					.from(categories)
					.leftJoin(products, eq(products.categoryId, categories.id))
					.leftJoin(productPricing, eq(productPricing.productId, products.id))
					.where(eq(categories.id, input.modelCategoryId))
					.groupBy(categories.id, categories.slug)
					.limit(1);

				if (catData[0]) {
					categorySlug = catData[0].slug;
					if (catData[0].minRate) baseRateCents = catData[0].minRate;
				}
			}

			// B. Calculate Additional Items Cost
			let additionalItemsTotalCents = 0;
			if (input.additionalItems && input.additionalItems.length > 0) {
				const itemIds = input.additionalItems.map(i => i.id);
				const itemPrices = await ctx.db
					.select({
						id: products.id,
						price: productPricing.unitPriceEurCents
					})
					.from(products)
					.leftJoin(productPricing, eq(productPricing.productId, products.id))
					.where(inArray(products.id, itemIds));

				// Map prices for O(1) lookup
				const priceMap = new Map(itemPrices.map(i => [i.id, i.price || 0]));

				for (const item of input.additionalItems) {
					const price = priceMap.get(item.id) || 0;
					additionalItemsTotalCents += price * item.quantity;
				}
			}

			// C. Run The Math Engine
			// Helper to convert Zod input to Engine input
			const isInch = input.unit === "inch";

			const strategy = resolvePricingStrategy(categorySlug);

			const calculation = calculateQuote({
				widthCm: isInch ? input.dimensions.width * 2.54 : input.dimensions.width,
				heightCm: isInch ? input.dimensions.height * 2.54 : input.dimensions.height,
				baseRatePerM2Cents: baseRateCents,
				countryCode: input.country,

				// Strategy Flags
				isPremiumModel: strategy.isPremium,
				isLargeTankPenalty: strategy.isLargeTankPenalty,

				// User Options
				isFlexible: input.flexibility === "flexible",
				hasFiltration: input.filtrationType !== "none",
				sidePanelsCount: input.sidePanels === "both" ? 2 : (input.sidePanels !== "none" ? 1 : 0),
				sidePanelWidthCm: input.sidePanelWidth ? (isInch ? input.sidePanelWidth * 2.54 : input.sidePanelWidth) : 0,
			});

			const finalTotalCents = calculation.totalCents + additionalItemsTotalCents;

			// D. Save to DB
			const fullName = input.name?.trim() ?? "Guest";
			const [firstName, ...rest] = fullName.split(" ");
			const lastName = rest.join(" ");

			const [savedQuote] = await ctx.db.insert(quotes).values({
				// Product ID is nullable in your schema, linking to the specific design if chosen
				productId: (input.subcategoryId && input.subcategoryId !== "skip") ? input.subcategoryId : undefined,
				email: input.email,
				firstName: firstName || "Guest",
				lastName: lastName || "",
				country: input.country,

				// Store the full configuration
				dimensions: {
					width: input.dimensions.width,
					height: input.dimensions.height,
					depth: input.dimensions.depth,
					unit: input.unit,
					sidePanels: input.sidePanels,
					sidePanelWidth: input.sidePanelWidth,
					filtrationType: input.filtrationType,
					notes: input.filtrationCustomNotes,
					additionalItems: input.additionalItems
				},

				estimatedPriceEurCents: finalTotalCents,
				status: "pending",
				customerNotes: input.notes,
			}).returning();

			if (!savedQuote) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

			// E. Return
			return {
				success: true,
				quoteId: savedQuote.id,
				estimatedPriceEur: finalTotalCents / 100,
				breakdown: {
					...calculation,
					additionalItemsCents: additionalItemsTotalCents
				}
			};
		}),
});


// ============================================================================
// HELPER: STRATEGY RESOLVER
// ============================================================================

/**
 * Maps legacy "Strategy" logic to boolean flags based on category slug.
 * This effectively replaces the "StrategyResolver" and "Factory" classes 
 * from the old C# backend.
 */
function resolvePricingStrategy(categorySlug: string): { isPremium: boolean; isLargeTankPenalty: boolean } {
	const slug = categorySlug.toLowerCase();

	// 1. Premium Models (Old: ExpensiveShippingBackgroundCalculationStrategy)
	// These models are complex and cost 50% more base rate.
	// You should verify these slugs against your actual DB data.
	const premiumSlugs = [
		"massive-rock",
		"canyon-rock",
		"premium-slate"
	];

	// 2. Large Tank Penalty (Old: ExpensiveSquareMeterBackgroundCalculationStrategy)
	// These models get expensive only if they are huge (>2m2)
	const penaltySlugs = [
		"amazon",
		"river-bed",
		"roots"
	];

	return {
		isPremium: premiumSlugs.some(s => slug.includes(s)),
		isLargeTankPenalty: penaltySlugs.some(s => slug.includes(s)),
	};
}