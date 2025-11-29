// src/server/db/schema/sales.ts
import { relations } from "drizzle-orm";
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
		name: d.text().notNull(), // "Black Friday 2025"
		slug: d.text().notNull().unique(), // "black-friday-2025"

		// Discount details
		discountPercent: d.integer().notNull(), // 25 for 25% off
		discountCode: d.text().notNull().unique(), // "BLACKFRIDAY25"

		// Campaign duration
		startsAt: d.timestamp({ withTimezone: true }).notNull(),
		endsAt: d.timestamp({ withTimezone: true }).notNull(),

		// Banner configuration
		bannerType: d.text().notNull().default("SaleBanner"),
		// Values: "SaleBanner" | "CountdownBanner" | "FlashSaleBanner" | "MinimalBanner"

		bannerConfig: jsonb().$type<{
			backgroundColor?: string; // Custom bg color
			textColor?: string; // Custom text color
			showCountdown?: boolean; // Show countdown timer
			customMessage?: string; // Override default message
			ctaText?: string; // Custom CTA button text
			ctaLink?: string; // Custom CTA link
		}>(),

		// Page visibility - simple array of route patterns
		visibleOn: d.text().array().notNull().default(["/"]),
		// Examples: ["/", "/shop", "/shop/*"] - we'll match these in layout

		// Stats (cached for performance)
		usageCount: d.integer().default(0).notNull(),
		totalRevenue: d.integer().default(0).notNull(), // In cents

		// Status
		isActive: d.boolean().default(true).notNull(), // Manual override to disable

		// Timestamps
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