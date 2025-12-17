// src/server/api/routers/admin/pricing.ts
import { z } from "zod";
import { createTRPCRouter, adminProcedure } from "~/server/api/trpc";
import {
	productPricing,
	pricingBundles,
	productAddons,
	products,
} from "~/server/db/schema";
import { eq, and, desc, asc } from "drizzle-orm";

export const adminPricingRouter = createTRPCRouter({
	// ============================================================================
	// PRICING CRUD
	// ============================================================================

	// Get all pricing configs for a product
	getByProduct: adminProcedure
		.input(z.object({
			productId: z.string(),
		}))
		.query(async ({ ctx, input }) => {
			const pricingConfigs = await ctx.db
				.select()
				.from(productPricing)
				.where(eq(productPricing.productId, input.productId))
				.orderBy(asc(productPricing.market));

			// Get bundles for each pricing config
			const pricingWithBundles = await Promise.all(
				pricingConfigs.map(async (pricing) => {
					const bundles = await ctx.db
						.select()
						.from(pricingBundles)
						.where(eq(pricingBundles.pricingId, pricing.id))
						.orderBy(asc(pricingBundles.sortOrder));

					return {
						...pricing,
						bundles,
					};
				})
			);

			return pricingWithBundles;
		}),

	// Create new pricing configuration
	create: adminProcedure
		.input(z.object({
			productId: z.string(),
			market: z.enum(["ROW", "US"]),
			currency: z.enum(["EUR", "USD"]),
			pricingType: z.enum(["simple", "bundle", "configuration"]),

			// Simple pricing fields
			unitPriceEurCents: z.number().int().optional(),
			allowQuantity: z.boolean().default(true),
			maxQuantity: z.number().int().optional(),
			fixedQuantity: z.number().int().optional(), // US: "includes 7 pieces"

			// Configuration pricing fields (backgrounds)
			baseRatePerSqM: z.number().int().optional(), // €250/sqm = 25000
			requiresQuote: z.boolean().default(false),
			calculatorUrl: z.string().optional(),

			// Stripe integration
			stripePriceId: z.string().optional(),
			stripeProductId: z.string().optional(),

			// Validity
			isActive: z.boolean().default(true),
			effectiveFrom: z.date().optional(),
			effectiveUntil: z.date().optional(),
		}))
		.mutation(async ({ ctx, input }) => {
			const [pricing] = await ctx.db
				.insert(productPricing)
				.values(input)
				.returning();

			return pricing;
		}),

	// Update pricing configuration
	update: adminProcedure
		.input(z.object({
			pricingId: z.string(),

			// Updatable fields
			unitPriceEurCents: z.number().int().optional(),
			allowQuantity: z.boolean().optional(),
			maxQuantity: z.number().int().optional(),
			fixedQuantity: z.number().int().optional(),
			baseRatePerSqM: z.number().int().optional(),
			requiresQuote: z.boolean().optional(),
			calculatorUrl: z.string().optional(),
			stripePriceId: z.string().optional(),
			stripeProductId: z.string().optional(),
			isActive: z.boolean().optional(),
			effectiveFrom: z.date().optional(),
			effectiveUntil: z.date().optional(),
		}))
		.mutation(async ({ ctx, input }) => {
			const { pricingId, ...updateData } = input;

			const [updated] = await ctx.db
				.update(productPricing)
				.set(updateData)
				.where(eq(productPricing.id, pricingId))
				.returning();

			return updated;
		}),

	// Delete pricing configuration
	delete: adminProcedure
		.input(z.object({
			pricingId: z.string(),
		}))
		.mutation(async ({ ctx, input }) => {
			// Bundles will cascade delete via FK
			await ctx.db
				.delete(productPricing)
				.where(eq(productPricing.id, input.pricingId));

			return { success: true };
		}),

	// ============================================================================
	// BUNDLE CRUD
	// ============================================================================

	// Get bundles for a pricing config
	getBundles: adminProcedure
		.input(z.object({
			pricingId: z.string(),
		}))
		.query(async ({ ctx, input }) => {
			return await ctx.db
				.select()
				.from(pricingBundles)
				.where(eq(pricingBundles.pricingId, input.pricingId))
				.orderBy(asc(pricingBundles.sortOrder));
		}),

	// Create bundle tier
	createBundle: adminProcedure
		.input(z.object({
			pricingId: z.string(),
			quantity: z.number().int().positive(),
			totalPriceEurCents: z.number().int().positive(),
			label: z.string().optional(),
			savingsPercent: z.number().int().min(0).max(100).optional(),
			isDefault: z.boolean().default(false),
			sortOrder: z.number().int().default(0),
			stripePriceId: z.string().optional(),
		}))
		.mutation(async ({ ctx, input }) => {
			// If this is set as default, unset other defaults first
			if (input.isDefault) {
				await ctx.db
					.update(pricingBundles)
					.set({ isDefault: false })
					.where(eq(pricingBundles.pricingId, input.pricingId));
			}

			const [bundle] = await ctx.db
				.insert(pricingBundles)
				.values(input)
				.returning();

			return bundle;
		}),

	// Update bundle tier
	updateBundle: adminProcedure
		.input(z.object({
			bundleId: z.string(),
			quantity: z.number().int().positive().optional(),
			totalPriceEurCents: z.number().int().positive().optional(),
			label: z.string().optional(),
			savingsPercent: z.number().int().min(0).max(100).optional(),
			isDefault: z.boolean().optional(),
			sortOrder: z.number().int().optional(),
			stripePriceId: z.string().optional(),
		}))
		.mutation(async ({ ctx, input }) => {
			const { bundleId, ...updateData } = input;

			// If setting as default, unset others first
			if (input.isDefault) {
				const bundle = await ctx.db.query.pricingBundles.findFirst({
					where: eq(pricingBundles.id, bundleId),
				});

				if (bundle) {
					await ctx.db
						.update(pricingBundles)
						.set({ isDefault: false })
						.where(eq(pricingBundles.pricingId, bundle.pricingId));
				}
			}

			const [updated] = await ctx.db
				.update(pricingBundles)
				.set(updateData)
				.where(eq(pricingBundles.id, bundleId))
				.returning();

			return updated;
		}),

	// Delete bundle tier
	deleteBundle: adminProcedure
		.input(z.object({
			bundleId: z.string(),
		}))
		.mutation(async ({ ctx, input }) => {
			await ctx.db
				.delete(pricingBundles)
				.where(eq(pricingBundles.id, input.bundleId));

			return { success: true };
		}),

	// Reorder bundles
	reorderBundles: adminProcedure
		.input(z.object({
			bundleOrders: z.array(z.object({
				bundleId: z.string(),
				sortOrder: z.number().int(),
			})),
		}))
		.mutation(async ({ ctx, input }) => {
			// Update all bundles in a transaction
			await Promise.all(
				input.bundleOrders.map(({ bundleId, sortOrder }) =>
					ctx.db
						.update(pricingBundles)
						.set({ sortOrder })
						.where(eq(pricingBundles.id, bundleId))
				)
			);

			return { success: true };
		}),

	// ============================================================================
	// ADDONS CRUD
	// ============================================================================

	// Get addons for a product
	getAddons: adminProcedure
		.input(z.object({
			productId: z.string(),
		}))
		.query(async ({ ctx, input }) => {
			return await ctx.db
				.select()
				.from(productAddons)
				.where(eq(productAddons.productId, input.productId))
				.orderBy(asc(productAddons.sortOrder));
		}),

	// Create addon
	createAddon: adminProcedure
		.input(z.object({
			productId: z.string(),
			name: z.string(),
			description: z.string().optional(),
			priceEurCents: z.number().int().nonnegative(),
			priceUsdCents: z.number().int().nonnegative().optional(),
			isActive: z.boolean().default(true),
			sortOrder: z.number().int().default(0),
		}))
		.mutation(async ({ ctx, input }) => {
			const [addon] = await ctx.db
				.insert(productAddons)
				.values(input)
				.returning();

			return addon;
		}),

	// Update addon
	updateAddon: adminProcedure
		.input(z.object({
			addonId: z.string(),
			name: z.string().optional(),
			description: z.string().optional(),
			priceEurCents: z.number().int().nonnegative().optional(),
			priceUsdCents: z.number().int().nonnegative().optional(),
			isActive: z.boolean().optional(),
			sortOrder: z.number().int().optional(),
		}))
		.mutation(async ({ ctx, input }) => {
			const { addonId, ...updateData } = input;

			const [updated] = await ctx.db
				.update(productAddons)
				.set(updateData)
				.where(eq(productAddons.id, addonId))
				.returning();

			return updated;
		}),

	// Delete addon
	deleteAddon: adminProcedure
		.input(z.object({
			addonId: z.string(),
		}))
		.mutation(async ({ ctx, input }) => {
			await ctx.db
				.delete(productAddons)
				.where(eq(productAddons.id, input.addonId));

			return { success: true };
		}),

	// ============================================================================
	// UTILITY OPERATIONS
	// ============================================================================

	// Copy pricing from one market to another (for quick setup)
	copyPricing: adminProcedure
		.input(z.object({
			sourcePricingId: z.string(),
			targetMarket: z.enum(["US", "ROW", "CA", "UK"]),
			targetCurrency: z.enum(["USD", "EUR", "GBP", "CAD"]),
			priceMultiplier: z.number().default(1), // e.g., 1.1 for 10% increase
		}))
		.mutation(async ({ ctx, input }) => {
			// Get source pricing with bundles
			const [sourcePricing] = await ctx.db
				.select()
				.from(productPricing)
				.where(eq(productPricing.id, input.sourcePricingId))
				.limit(1);

			if (!sourcePricing) {
				throw new Error("Source pricing not found");
			}

			const sourceBundles = await ctx.db
				.select()
				.from(pricingBundles)
				.where(eq(pricingBundles.pricingId, input.sourcePricingId));

			// Create new pricing
			const [newPricing] = await ctx.db
				.insert(productPricing)
				.values({
					productId: sourcePricing.productId,
					market: input.targetMarket,
					currency: input.targetCurrency,
					pricingType: sourcePricing.pricingType,
					unitPriceEurCents: sourcePricing.unitPriceEurCents
						? Math.round(sourcePricing.unitPriceEurCents * input.priceMultiplier)
						: undefined,
					allowQuantity: sourcePricing.allowQuantity,
					maxQuantity: sourcePricing.maxQuantity,
					fixedQuantity: sourcePricing.fixedQuantity,
					baseRatePerSqM: sourcePricing.baseRatePerSqM
						? Math.round(sourcePricing.baseRatePerSqM * input.priceMultiplier)
						: undefined,
					requiresQuote: sourcePricing.requiresQuote,
					calculatorUrl: sourcePricing.calculatorUrl,
					isActive: sourcePricing.isActive,
				})
				.returning();

			// Copy bundles
			if (sourceBundles.length > 0) {
				await ctx.db.insert(pricingBundles).values(
					sourceBundles.map((bundle) => ({
						pricingId: newPricing!.id,
						quantity: bundle.quantity,
						totalPriceEurCents: Math.round(bundle.totalPriceEurCents * input.priceMultiplier),
						label: bundle.label,
						savingsPercent: bundle.savingsPercent,
						isDefault: bundle.isDefault,
						sortOrder: bundle.sortOrder,
					}))
				);
			}

			return newPricing;
		}),

	// Get pricing stats for dashboard
	getStats: adminProcedure
		.query(async ({ ctx }) => {
			const allPricing = await ctx.db
				.select({
					market: productPricing.market,
					pricingType: productPricing.pricingType,
					isActive: productPricing.isActive,
				})
				.from(productPricing);

			const byMarket = {
				US: allPricing.filter(p => p.market === 'US').length,
				ROW: allPricing.filter(p => p.market === 'ROW').length,
				// CA: allPricing.filter(p => p.market === 'CA').length,
				// UK: allPricing.filter(p => p.market === 'UK').length,
			};

			const byType = {
				simple: allPricing.filter(p => p.pricingType === 'simple').length,
				bundle: allPricing.filter(p => p.pricingType === 'bundle').length,
				configuration: allPricing.filter(p => p.pricingType === 'configuration').length,
			};

			const active = allPricing.filter(p => p.isActive).length;
			const inactive = allPricing.length - active;

			return {
				total: allPricing.length,
				active,
				inactive,
				byMarket,
				byType,
			};
		}),
});