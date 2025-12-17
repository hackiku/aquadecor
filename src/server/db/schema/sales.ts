// src/server/db/schema/sales.ts
import { relations, type InferSelectModel } from "drizzle-orm";
import { index, text, integer, timestamp, boolean, jsonb } from "drizzle-orm/pg-core";
import { createTable } from "./_utils";
import { orders } from "./orders";

// ============================================================================
// SALES CAMPAIGNS
// Time-bound promotional campaigns (Black Friday, Summer Sale, etc.)
// ============================================================================


export const sales = createTable(
	"sale",
	(d) => ({
		id: d.text().primaryKey().$defaultFn(() => crypto.randomUUID()),

		// Campaign info
		name: d.text().notNull(),
		slug: d.text().notNull().unique(),

		// LOGIC HOOKS
		type: d.text().notNull().default('percentage'), // 'percentage' | 'fixed_amount'

		// SCOPE
		targetType: d.text().default('all'), // 'all' | 'category' | 'product_line' | 'specific_products'
		targetCategoryIds: d.text().array(),
		targetProductIds: d.text().array(),
		targetMarkets: d.text().array().default(['ROW', 'US']), // Default to supported markets

		// Discount details
		discountPercent: d.integer(), // Used if type = 'percentage'
		discountAmountCents: d.integer(), // Used if type = 'fixed_amount'

		discountCode: d.text().notNull().unique(), // "BLACKFRIDAY25"

		// Campaign duration
		startsAt: d.timestamp({ withTimezone: true }).notNull(),
		endsAt: d.timestamp({ withTimezone: true }).notNull(),

		// Banner configuration
		bannerType: d.text().notNull().default("SaleBanner"),
		// Values: "SaleBanner" | "CountdownBanner" | "FlashSaleBanner" | "MinimalBanner"
		bannerConfig: jsonb().$type<{
			backgroundColor?: string;
			textColor?: string;
			showCountdown?: boolean;
			customMessage?: string;
			ctaText?: string;
			ctaLink?: string;
		}>(),

		// Page visibility
		visibleOn: d.text().array().notNull().default(["/"]),

		// Stats
		usageCount: d.integer().default(0).notNull(),
		totalRevenue: d.integer().default(0).notNull(),

		isActive: d.boolean().default(true).notNull(),
		createdAt: d.timestamp({ withTimezone: true }).$defaultFn(() => new Date()).notNull(),
		updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
	}),
	(t) => [
		index("sale_slug_idx").on(t.slug),
		index("sale_code_idx").on(t.discountCode),
		index("sale_active_idx").on(t.isActive),
		index("sale_dates_idx").on(t.startsAt, t.endsAt),
	],
);

// ============================================================================
// RELATIONS
// ============================================================================

export const salesRelations = relations(sales, ({ many }) => ({
	orders: many(orders),
}));

export type Sale = InferSelectModel<typeof sales>;