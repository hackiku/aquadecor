// src/server/api/routers/admin/country.ts
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { countries, shippingZones, countryShippingAttempts } from "~/server/db/schema";
import { eq, desc, sql, and, or, like, count, sum } from "drizzle-orm";

export const countryRouter = createTRPCRouter({
	// Get all countries with optional filtering
	getAll: publicProcedure
		.input(
			z.object({
				shippingZoneId: z.string().optional(),
				isShippingEnabled: z.boolean().optional(),
				isSuspended: z.boolean().optional(),
				searchQuery: z.string().optional(), // Search by name or ISO code
				sortBy: z.enum(["name", "totalOrders", "totalRevenue"]).default("name"),
				sortOrder: z.enum(["asc", "desc"]).default("asc"),
			}),
		)
		.query(async ({ ctx, input }) => {
			const conditions = [];

			if (input.shippingZoneId) {
				conditions.push(eq(countries.shippingZoneId, input.shippingZoneId));
			}

			if (input.isShippingEnabled !== undefined) {
				conditions.push(eq(countries.isShippingEnabled, input.isShippingEnabled));
			}

			if (input.isSuspended !== undefined) {
				conditions.push(eq(countries.isSuspended, input.isSuspended));
			}

			if (input.searchQuery) {
				const searchPattern = `%${input.searchQuery}%`;
				conditions.push(
					or(
						like(countries.name, searchPattern),
						like(countries.iso2, searchPattern),
						like(countries.iso3, searchPattern),
					),
				);
			}

			const orderByColumn =
				input.sortBy === "totalOrders"
					? countries.totalOrders
					: input.sortBy === "totalRevenue"
						? countries.totalRevenueCents
						: countries.name;

			const orderDirection = input.sortOrder === "desc" ? desc : undefined;

			const result = await ctx.db
				.select({
					id: countries.id,
					iso2: countries.iso2,
					iso3: countries.iso3,
					name: countries.name,
					localName: countries.localName,
					flagEmoji: countries.flagEmoji,
					shippingZoneId: countries.shippingZoneId,
					isShippingEnabled: countries.isShippingEnabled,
					isSuspended: countries.isSuspended,
					suspensionReason: countries.suspensionReason,
					requiresCustoms: countries.requiresCustoms,
					requiresPhoneNumber: countries.requiresPhoneNumber,
					postZone: countries.postZone,
					totalOrders: countries.totalOrders,
					totalRevenueCents: countries.totalRevenueCents,
					lastOrderAt: countries.lastOrderAt,
					notes: countries.notes,
					// Join shipping zone info
					zone: {
						id: shippingZones.id,
						name: shippingZones.name,
						code: shippingZones.code,
					},
				})
				.from(countries)
				.leftJoin(shippingZones, eq(countries.shippingZoneId, shippingZones.id))
				.where(conditions.length > 0 ? and(...conditions) : undefined)
				.orderBy(orderDirection ? orderDirection(orderByColumn) : orderByColumn);

			return result;
		}),

	// Get single country by ID with full details
	getById: publicProcedure
		.input(z.object({ id: z.string() }))
		.query(async ({ ctx, input }) => {
			const result = await ctx.db
				.select({
					id: countries.id,
					iso2: countries.iso2,
					iso3: countries.iso3,
					name: countries.name,
					localName: countries.localName,
					flagEmoji: countries.flagEmoji,
					shippingZoneId: countries.shippingZoneId,
					isShippingEnabled: countries.isShippingEnabled,
					isActive: countries.isActive,
					isSuspended: countries.isSuspended,
					suspensionReason: countries.suspensionReason,
					postOperatorCode: countries.postOperatorCode,
					postZone: countries.postZone,
					maxWeightKg: countries.maxWeightKg,
					maxValueCents: countries.maxValueCents,
					requiresCustoms: countries.requiresCustoms,
					requiresPhoneNumber: countries.requiresPhoneNumber,
					customsFeeCents: countries.customsFeeCents,
					vatRate: countries.vatRate,
					notes: countries.notes,
					restrictions: countries.restrictions,
					totalOrders: countries.totalOrders,
					totalRevenueCents: countries.totalRevenueCents,
					lastOrderAt: countries.lastOrderAt,
					createdAt: countries.createdAt,
					updatedAt: countries.updatedAt,
					zone: shippingZones,
				})
				.from(countries)
				.leftJoin(shippingZones, eq(countries.shippingZoneId, shippingZones.id))
				.where(eq(countries.id, input.id))
				.limit(1);

			return result[0] ?? null;
		}),

	// Get dashboard stats
	getStats: publicProcedure.query(async ({ ctx }) => {
		const stats = await ctx.db
			.select({
				totalCountries: count(),
				enabledCountries: sql<number>`count(*) filter (where ${countries.isShippingEnabled} = true)`,
				suspendedCountries: sql<number>`count(*) filter (where ${countries.isSuspended} = true)`,
				totalOrders: sum(countries.totalOrders),
				totalRevenueCents: sum(countries.totalRevenueCents),
			})
			.from(countries);

		// Get top 5 countries by orders
		const topByOrders = await ctx.db
			.select({
				name: countries.name,
				flagEmoji: countries.flagEmoji,
				totalOrders: countries.totalOrders,
			})
			.from(countries)
			.where(eq(countries.isShippingEnabled, true))
			.orderBy(desc(countries.totalOrders))
			.limit(5);

		// Get top 5 countries by revenue
		const topByRevenue = await ctx.db
			.select({
				name: countries.name,
				flagEmoji: countries.flagEmoji,
				totalRevenueCents: countries.totalRevenueCents,
			})
			.from(countries)
			.where(eq(countries.isShippingEnabled, true))
			.orderBy(desc(countries.totalRevenueCents))
			.limit(5);

		// Get breakdown by zone
		const byZone = await ctx.db
			.select({
				zoneName: shippingZones.name,
				zoneCode: shippingZones.code,
				countryCount: count(countries.id),
				totalOrders: sum(countries.totalOrders),
			})
			.from(countries)
			.leftJoin(shippingZones, eq(countries.shippingZoneId, shippingZones.id))
			.where(eq(countries.isShippingEnabled, true))
			.groupBy(shippingZones.id, shippingZones.name, shippingZones.code);

		return {
			...stats[0],
			topByOrders,
			topByRevenue,
			byZone,
		};
	}),

	// Update country settings
	update: publicProcedure
		.input(
			z.object({
				id: z.string(),
				isShippingEnabled: z.boolean().optional(),
				isSuspended: z.boolean().optional(),
				suspensionReason: z.string().optional().nullable(),
				shippingZoneId: z.string().optional(),
				requiresCustoms: z.boolean().optional(),
				requiresPhoneNumber: z.boolean().optional(),
				maxWeightKg: z.number().optional().nullable(),
				maxValueCents: z.number().optional().nullable(),
				notes: z.string().optional().nullable(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const { id, ...updateData } = input;

			const [updated] = await ctx.db
				.update(countries)
				.set({
					...updateData,
					updatedAt: new Date(),
				})
				.where(eq(countries.id, id))
				.returning();

			return updated;
		}),

	// Bulk enable/disable countries
	bulkUpdateStatus: publicProcedure
		.input(
			z.object({
				countryIds: z.array(z.string()),
				isShippingEnabled: z.boolean().optional(),
				isSuspended: z.boolean().optional(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const updateData: Record<string, boolean | Date> = {
				updatedAt: new Date(),
			};

			if (input.isShippingEnabled !== undefined) {
				updateData.isShippingEnabled = input.isShippingEnabled;
			}
			if (input.isSuspended !== undefined) {
				updateData.isSuspended = input.isSuspended;
			}

			for (const id of input.countryIds) {
				await ctx.db.update(countries).set(updateData).where(eq(countries.id, id));
			}

			return { updated: input.countryIds.length };
		}),

	// Get all shipping zones
	getZones: publicProcedure.query(async ({ ctx }) => {
		return await ctx.db.select().from(shippingZones).orderBy(shippingZones.code);
	}),

	// Create new country
	create: publicProcedure
		.input(
			z.object({
				iso2: z.string().length(2),
				iso3: z.string().length(3),
				name: z.string().min(1),
				localName: z.string().optional(),
				flagEmoji: z.string().optional(),
				shippingZoneId: z.string().optional(),
				postOperatorCode: z.string().optional(),
				postZone: z.number().min(0).max(5).optional(),
				requiresCustoms: z.boolean().default(false),
				requiresPhoneNumber: z.boolean().default(false),
				isShippingEnabled: z.boolean().default(true),
				notes: z.string().optional(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const [created] = await ctx.db
				.insert(countries)
				.values({
					...input,
					isActive: true,
				})
				.returning();

			return created;
		}),

	// Get shipping attempts (demand analysis)
	getShippingAttempts: publicProcedure
		.input(
			z.object({
				limit: z.number().default(20),
				countryIso2: z.string().optional(),
			}),
		)
		.query(async ({ ctx, input }) => {
			const conditions = input.countryIso2 ? [eq(countryShippingAttempts.countryIso2, input.countryIso2)] : [];

			// Get raw attempts
			const attempts = await ctx.db
				.select()
				.from(countryShippingAttempts)
				.where(conditions.length > 0 ? and(...conditions) : undefined)
				.orderBy(desc(countryShippingAttempts.attemptedAt))
				.limit(input.limit);

			// Get aggregated stats by country
			const aggregated = await ctx.db
				.select({
					countryIso2: countryShippingAttempts.countryIso2,
					countryName: countryShippingAttempts.countryName,
					attemptCount: count(),
					totalValueCents: sum(countryShippingAttempts.cartValueCents),
					lastAttemptAt: sql<Date>`max(${countryShippingAttempts.attemptedAt})`,
				})
				.from(countryShippingAttempts)
				.groupBy(countryShippingAttempts.countryIso2, countryShippingAttempts.countryName)
				.orderBy(desc(count()))
				.limit(10);

			return {
				attempts,
				topUnsupported: aggregated,
			};
		}),
});