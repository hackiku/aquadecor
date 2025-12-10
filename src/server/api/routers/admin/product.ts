import { z } from "zod";
import { createTRPCRouter, adminProcedure } from "~/server/api/trpc";
import {
	categories,
	products,
	productTranslations,
	media,
	categoryTranslations,
	productPricing,
	productMarketExclusions,
	customizationOptions,
	selectOptions,
	pricingBundles,
	productAddons,
} from "~/server/db/schema";
import { eq, and, inArray, desc, asc, sql } from "drizzle-orm";

// Zod schema for new/updated product translations
const ProductTranslationSchema = z.object({
	name: z.string(),
	shortDescription: z.string().optional().nullable(),
	longDescription: z.string().optional().nullable(),
	metaTitle: z.string().optional().nullable(),
	metaDescription: z.string().optional().nullable(),
	materialTranslated: z.string().optional().nullable(),
	productionTimeTranslated: z.string().optional().nullable(),
});

// Primary market/currency for admin table display and sorting
const PRIMARY_MARKET = "ROW";
const PRIMARY_CURRENCY = "EUR";

export const adminProductRouter = createTRPCRouter({
	// ============================================================================
	// GET ALL (List View)
	// ============================================================================
	getAll: adminProcedure
		.input(z.object({
			locale: z.string().default("en"),
			categoryId: z.string().optional(),
			productLine: z.string().optional(),
			stockStatus: z.enum(["in_stock", "made_to_order", "requires_quote", "out_of_stock", "discontinued"]).optional(),
			isActive: z.boolean().optional(),
			sortBy: z.enum(["name", "sku", "price", "created"]).default("created"),
			sortOrder: z.enum(["asc", "desc"]).default("desc"),
		}).optional())
		.query(async ({ ctx, input }) => {
			const conditions = [];

			if (input?.categoryId) {
				conditions.push(eq(products.categoryId, input.categoryId));
			}
			if (input?.stockStatus) {
				conditions.push(eq(products.stockStatus, input.stockStatus));
			}
			if (input?.isActive !== undefined) {
				conditions.push(eq(products.isActive, input.isActive));
			}
			if (input?.productLine) {
				conditions.push(eq(categories.productLine, input.productLine));
			}

			// Subquery/Join to get the primary pricing for the product list (ROW/EUR)
			const primaryPricing = ctx.db
				.select()
				.from(productPricing)
				.where(
					and(
						eq(productPricing.market, PRIMARY_MARKET),
						eq(productPricing.currency, PRIMARY_CURRENCY),
						eq(productPricing.isActive, true)
					)
				)
				.as("primaryPricing");

			let query = ctx.db
				.select({
					id: products.id,
					slug: products.slug,
					sku: products.sku,
					categoryId: products.categoryId,
					categoryName: categoryTranslations.name,
					categorySlug: categories.slug,
					productLine: categories.productLine,
					
					// NEW: Pricing from primaryPricing join
					unitPriceEurCents: primaryPricing.unitPriceEurCents,
					pricingType: primaryPricing.pricingType,
					
					stockStatus: products.stockStatus,
					isActive: products.isActive,
					isFeatured: products.isFeatured,
					sortOrder: products.sortOrder,
					
					createdAt: products.createdAt,
					updatedAt: products.updatedAt,
					name: productTranslations.name,
					shortDescription: productTranslations.shortDescription,
					heroImageUrl: media.storageUrl,
				})
				.from(products)
				.leftJoin(categories, eq(categories.id, products.categoryId))
				.leftJoin(
					categoryTranslations,
					and(
						eq(categoryTranslations.categoryId, categories.id),
						eq(categoryTranslations.locale, input?.locale ?? "en")
					)
				)
				.leftJoin(
					productTranslations,
					and(
						eq(productTranslations.productId, products.id),
						eq(productTranslations.locale, input?.locale ?? "en")
					)
				)
				.leftJoin(
					media,
					and(
						eq(media.productId, products.id),
						eq(media.usageType, "product"),
						eq(media.sortOrder, 0)
					)
				)
				.leftJoin(primaryPricing, eq(primaryPricing.productId, products.id));

			if (conditions.length > 0) {
				query = query.where(and(...conditions)) as any;
			}

			// Apply sorting
			switch (input?.sortBy) {
				case "name":
					query = input?.sortOrder === "asc"
						? query.orderBy(asc(productTranslations.name)) as any
						: query.orderBy(desc(productTranslations.name)) as any;
					break;
				case "sku":
					query = input?.sortOrder === "asc"
						? query.orderBy(asc(products.sku)) as any
						: query.orderBy(desc(products.sku)) as any;
					break;
				case "price":
					// Sort by price from the joined primaryPricing table
					query = input?.sortOrder === "asc"
						? query.orderBy(asc(primaryPricing.unitPriceEurCents)) as any
						: query.orderBy(desc(primaryPricing.unitPriceEurCents)) as any;
					break;
				case "created":
				default:
					query = input?.sortOrder === "asc"
						? query.orderBy(asc(products.createdAt)) as any
						: query.orderBy(desc(products.createdAt)) as any;
			}

			return await query;
		}),

	// ============================================================================
	// GET BY ID (Detail View)
	// ============================================================================
	getById: adminProcedure
		.input(z.object({
			id: z.string(),
			locale: z.string().default("en"),
		}))
		.query(async ({ ctx, input }) => {
			// 1. Get core product data and translation
			const [product] = await ctx.db
				.select({
					id: products.id,
					slug: products.slug,
					sku: products.sku,
					categoryId: products.categoryId,
					categorySlug: categories.slug,
					productLine: categories.productLine,
					
					// Core Product Fields
					material: products.material,
					widthCm: products.widthCm,
					heightCm: products.heightCm,
					depthCm: products.depthCm,
					weightGrams: products.weightGrams,
					productionTime: products.productionTime,
					technicalSpecs: products.technicalSpecs, // JSONB
					stockStatus: products.stockStatus,
					isActive: products.isActive,
					isFeatured: products.isFeatured,
					sortOrder: products.sortOrder,
					createdAt: products.createdAt,
					updatedAt: products.updatedAt,
					
					// Translated Fields (NOTE: fullDescription is now longDescription)
					name: productTranslations.name,
					shortDescription: productTranslations.shortDescription,
					longDescription: productTranslations.longDescription,
					metaTitle: productTranslations.metaTitle,
					metaDescription: productTranslations.metaDescription,
					materialTranslated: productTranslations.materialTranslated,
					productionTimeTranslated: productTranslations.productionTimeTranslated,
				})
				.from(products)
				.leftJoin(categories, eq(categories.id, products.categoryId))
				.leftJoin(
					categoryTranslations,
					and(
						eq(categoryTranslations.categoryId, categories.id),
						eq(categoryTranslations.locale, input.locale)
					)
				)
				.leftJoin(
					productTranslations,
					and(
						eq(productTranslations.productId, products.id),
						eq(productTranslations.locale, input.locale)
					)
				)
				.where(eq(products.id, input.id))
				.limit(1);

			if (!product) return null;

			// 2. Get all pricing configurations for all markets
			const pricingConfigs = await ctx.db
				.select()
				.from(productPricing)
				.where(eq(productPricing.productId, product.id));

			// 3. Get bundles for all applicable pricing configs
			const bundlePricingIds = pricingConfigs
				.filter(p => p.pricingType === "quantity_bundle")
				.map(p => p.id);
			
			let bundles = [];
			if (bundlePricingIds.length > 0) {
				bundles = await ctx.db
					.select()
					.from(pricingBundles)
					.where(inArray(pricingBundles.pricingId, bundlePricingIds))
					.orderBy(pricingBundles.quantity);
			}

			// 4. Get addons
			const addons = await ctx.db
				.select()
				.from(productAddons)
				.where(eq(productAddons.productId, product.id))
				.orderBy(productAddons.sortOrder);

			// 5. Get customization options
			const customOptions = await ctx.db
				.select()
				.from(customizationOptions)
				.where(eq(customizationOptions.productId, product.id))
				.orderBy(customizationOptions.sortOrder);

			// 6. Get select options for each customization option (for type='select')
			const selectOptionsByCustomOptionId: Record<string, any[]> = {};
			const selectOptionIds = customOptions.filter(opt => opt.type === "select").map(opt => opt.id);
			
			if (selectOptionIds.length > 0) {
				const allSelectOptions = await ctx.db
					.select()
					.from(selectOptions)
					.where(inArray(selectOptions.customizationOptionId, selectOptionIds))
					.orderBy(selectOptions.sortOrder);
				
				for (const opt of allSelectOptions) {
					if (!selectOptionsByCustomOptionId[opt.customizationOptionId]) {
						selectOptionsByCustomOptionId[opt.customizationOptionId] = [];
					}
					selectOptionsByCustomOptionId[opt.customizationOptionId].push(opt);
				}
			}

			// 7. Get market exclusions
			const marketExclusions = await ctx.db
				.select()
				.from(productMarketExclusions)
				.where(eq(productMarketExclusions.productId, product.id));

			// 8. Get all media
			const images = await ctx.db
				.select()
				.from(media)
				.where(eq(media.productId, product.id))
				.orderBy(media.sortOrder);

			// 9. Get all translations (for translation tab)
			const translations = await ctx.db
				.select()
				.from(productTranslations)
				.where(eq(productTranslations.productId, input.id));

			return {
				...product,
				pricingConfigs,
				bundles,
				addons,
				customizationOptions: customOptions.map(opt => ({
					...opt,
					selectOptions: opt.type === "select" ? selectOptionsByCustomOptionId[opt.id] || [] : undefined,
				})),
				marketExclusions,
				images,
				translations,
			};
		}),

	// ============================================================================
	// GET STATS
	// ============================================================================
	getStats: adminProcedure
		.query(async ({ ctx }) => {
			const allProducts = await ctx.db
				.select({
					id: products.id,
					stockStatus: products.stockStatus,
					isActive: products.isActive,
					isFeatured: products.isFeatured,
				})
				.from(products);

			const productIds = allProducts.map(p => p.id);
			
			// Find all products that require a quote (from pricing or product itself)
			const quoteRequiredProducts = await ctx.db
				.select({ productId: products.id })
				.from(products)
				.leftJoin(productPricing, eq(productPricing.productId, products.id))
				.where(
					and(
						eq(products.isActive, true),
						sql`${products.stockStatus} = 'requires_quote' OR ${productPricing.requiresQuote} = true`
					)
				);
			const requiresQuoteIds = new Set(quoteRequiredProducts.map(p => p.productId));


			// Check for US exclusions
			const usExclusions = await ctx.db
				.select()
				.from(productMarketExclusions)
				.where(
					and(
						inArray(productMarketExclusions.productId, productIds),
						eq(productMarketExclusions.market, "US")
					)
				);
			const usRestrictedIds = new Set(usExclusions.map(e => e.productId));

			const total = allProducts.length;
			const active = allProducts.filter(p => p.isActive).length;
			const inactive = total - active;
			const featured = allProducts.filter(p => p.isFeatured).length;
			const usRestricted = usRestrictedIds.size;
			const customOnly = requiresQuoteIds.size;
			const withPrice = allProducts.length - customOnly;

			const stockBreakdown = {
				in_stock: allProducts.filter(p => p.stockStatus === "in_stock").length,
				made_to_order: allProducts.filter(p => p.stockStatus === "made_to_order").length,
				requires_quote: allProducts.filter(p => p.stockStatus === "requires_quote").length,
				out_of_stock: allProducts.filter(p => p.stockStatus === "out_of_stock").length,
				discontinued: allProducts.filter(p => p.stockStatus === "discontinued").length,
			};

			return {
				total,
				active,
				inactive,
				featured,
				customOnly,
				withPrice,
				usRestricted,
				stockBreakdown,
			};
		}),

	// ============================================================================
	// CREATE
	// ============================================================================
	create: adminProcedure
		.input(z.object({
			categoryId: z.string(),
			slug: z.string(),
			sku: z.string().optional(),
			stockStatus: z.enum(["in_stock", "made_to_order", "requires_quote", "out_of_stock", "discontinued"]).default("made_to_order"),
			isActive: z.boolean().default(true),
			isFeatured: z.boolean().default(false),
			sortOrder: z.number().default(0),
			
			// Physical/Technical
			material: z.string().optional().nullable(),
			widthCm: z.number().optional().nullable(),
			heightCm: z.number().optional().nullable(),
			depthCm: z.number().optional().nullable(),
			weightGrams: z.number().int().optional().nullable(),
			productionTime: z.string().optional().nullable(),
			technicalSpecs: z.any().optional().nullable(), // JSONB

			// Translation (English required, using new fields)
			translation: ProductTranslationSchema,
		}))
		.mutation(async ({ ctx, input }) => {
			// 1. Insert product
			const [product] = await ctx.db
				.insert(products)
				.values({
					categoryId: input.categoryId,
					slug: input.slug,
					sku: input.sku,
					stockStatus: input.stockStatus,
					isActive: input.isActive,
					isFeatured: input.isFeatured,
					sortOrder: input.sortOrder,
					material: input.material,
					widthCm: input.widthCm ? sql`${input.widthCm}::decimal` : undefined, // Cast needed for decimal columns
					heightCm: input.heightCm ? sql`${input.heightCm}::decimal` : undefined,
					depthCm: input.depthCm ? sql`${input.depthCm}::decimal` : undefined,
					weightGrams: input.weightGrams,
					productionTime: input.productionTime,
					technicalSpecs: input.technicalSpecs,
				})
				.returning();

			if (!product) throw new Error("Failed to create product.");

			// 2. Insert English translation
			await ctx.db.insert(productTranslations).values({
				productId: product.id,
				locale: "en",
				name: input.translation.name,
				shortDescription: input.translation.shortDescription,
				longDescription: input.translation.longDescription,
				metaTitle: input.translation.metaTitle,
				metaDescription: input.translation.metaDescription,
				materialTranslated: input.translation.materialTranslated,
				productionTimeTranslated: input.translation.productionTimeTranslated,
			});

			// NOTE: Initial pricing, addons, and customization options are not
			// created here and should be managed via subsequent Admin UI actions.

			return product;
		}),

	// ============================================================================
	// UPDATE
	// ============================================================================
	update: adminProcedure
		.input(z.object({
			id: z.string(),
			categoryId: z.string().optional(),
			slug: z.string().optional(),
			sku: z.string().optional(),
			stockStatus: z.enum(["in_stock", "made_to_order", "requires_quote", "out_of_stock", "discontinued"]).optional(),
			isActive: z.boolean().optional(),
			isFeatured: z.boolean().optional(),
			sortOrder: z.number().optional(),
			
			// Physical/Technical (optional updates)
			material: z.string().optional().nullable(),
			widthCm: z.number().optional().nullable(),
			heightCm: z.number().optional().nullable(),
			depthCm: z.number().optional().nullable(),
			weightGrams: z.number().int().optional().nullable(),
			productionTime: z.string().optional().nullable(),
			technicalSpecs: z.any().optional().nullable(),

			// Translation update (for "en" locale)
			translation: ProductTranslationSchema.partial().optional(),
		}))
		.mutation(async ({ ctx, input }) => {
			const { id, translation, ...productData } = input;

			// Prepare data for products table update, handling decimal casting
			const updateData: Record<string, any> = { ...productData };
			if (updateData.widthCm !== undefined) updateData.widthCm = updateData.widthCm !== null ? sql`${updateData.widthCm}::decimal` : null;
			if (updateData.heightCm !== undefined) updateData.heightCm = updateData.heightCm !== null ? sql`${updateData.heightCm}::decimal` : null;
			if (updateData.depthCm !== undefined) updateData.depthCm = updateData.depthCm !== null ? sql`${updateData.depthCm}::decimal` : null;

			// 1. Update core product
			const [updated] = await ctx.db
				.update(products)
				.set(updateData)
				.where(eq(products.id, id))
				.returning();

			// 2. Update English translation if provided
			if (translation && Object.keys(translation).length > 0) {
				const translationData: Record<string, any> = {};
				if (translation.name !== undefined) translationData.name = translation.name;
				if (translation.shortDescription !== undefined) translationData.shortDescription = translation.shortDescription;
				if (translation.longDescription !== undefined) translationData.longDescription = translation.longDescription;
				if (translation.metaTitle !== undefined) translationData.metaTitle = translation.metaTitle;
				if (translation.metaDescription !== undefined) translationData.metaDescription = translation.metaDescription;
				if (translation.materialTranslated !== undefined) translationData.materialTranslated = translation.materialTranslated;
				if (translation.productionTimeTranslated !== undefined) translationData.productionTimeTranslated = translation.productionTimeTranslated;

				await ctx.db
					.update(productTranslations)
					.set(translationData)
					.where(
						and(
							eq(productTranslations.productId, id),
							eq(productTranslations.locale, "en")
						)
					);
			}

			return updated;
		}),

	// ============================================================================
	// DELETE
	// ============================================================================
	delete: adminProcedure
		.input(z.object({
			id: z.string(),
		}))
		.mutation(async ({ ctx, input }) => {
			// All related tables (translations, pricing, media, etc.) will cascade delete via FK
			await ctx.db.delete(products).where(eq(products.id, input.id));
			return { success: true };
		}),

	// ============================================================================
	// BULK OPERATIONS
	// ============================================================================
	bulkUpdateMarkets: adminProcedure
		.input(z.object({
			productIds: z.array(z.string()),
			market: z.string(), // e.g., 'US', 'CA'
			isExcluded: z.boolean(),
		}))
		.mutation(async ({ ctx, input }) => {
			if (input.isExcluded) {
				// ADD exclusion: Insert new rows (ON CONFLICT DO NOTHING)
				const exclusionValues = input.productIds.map(productId => ({
					productId,
					market: input.market,
				}));

				// Drizzle doesn't have a direct upsert for multiple values, so we use raw or a loop/separate endpoint.
				// For simplicity in a bulk op, we'll delete and re-insert, or just do simple inserts and ignore errors.
				// For maximum safety and atomicity, a delete followed by insert is cleaner than relying on ON CONFLICT DO NOTHING with Drizzle's current batch options.
				await ctx.db
					.delete(productMarketExclusions)
					.where(
						and(
							inArray(productMarketExclusions.productId, input.productIds),
							eq(productMarketExclusions.market, input.market)
						)
					);
				
				await ctx.db.insert(productMarketExclusions).values(exclusionValues);
			} else {
				// REMOVE exclusion: Delete existing rows
				await ctx.db
					.delete(productMarketExclusions)
					.where(
						and(
							inArray(productMarketExclusions.productId, input.productIds),
							eq(productMarketExclusions.market, input.market)
						)
					);
			}

			return { success: true, updated: input.productIds.length };
		}),

	bulkUpdateStatus: adminProcedure
		.input(z.object({
			productIds: z.array(z.string()),
			isActive: z.boolean(),
		}))
		.mutation(async ({ ctx, input }) => {
			await ctx.db
				.update(products)
				.set({ isActive: input.isActive })
				.where(inArray(products.id, input.productIds));

			return { success: true, updated: input.productIds.length };
		}),
});