// src/server/db/schema/promoters.ts
import { relations } from "drizzle-orm";
import { index, text, integer, timestamp, boolean } from "drizzle-orm/pg-core";
import { createTable } from "./_utils";
import { orders } from "./orders";

// ============================================================================
// PROMOTERS
// Affiliate/team members who get commission on sales
// ============================================================================

export const promoters = createTable(
	"promoter",
	(d) => ({
		id: d.text().primaryKey().$defaultFn(() => crypto.randomUUID()),

		// Personal info
		firstName: d.text().notNull(),
		lastName: d.text().notNull(),
		email: d.text().notNull().unique(),

		// Stats (cached for performance)
		totalOrders: d.integer().default(0).notNull(),
		totalRevenue: d.integer().default(0).notNull(), // In cents
		totalCommission: d.integer().default(0).notNull(), // In cents

		// Status
		isActive: d.boolean().default(true).notNull(),

		// Timestamps
		createdAt: d.timestamp({ withTimezone: true }).$defaultFn(() => new Date()).notNull(),
		lastOrderAt: d.timestamp({ withTimezone: true }),
	}),
	(t) => [
		index("promoter_email_idx").on(t.email),
		index("promoter_active_idx").on(t.isActive),
	],
);

// ============================================================================
// PROMOTER CODES
// Discount codes linked to promoters
// ============================================================================

export const promoterCodes = createTable(
	"promoter_code",
	(d) => ({
		id: d.text().primaryKey().$defaultFn(() => crypto.randomUUID()),
		promoterId: d.text().notNull().references(() => promoters.id, { onDelete: "cascade" }),

		// Code details
		code: d.text().notNull().unique(), // "JOEY15", "SUMMER20"
		discountPercent: d.integer().notNull(), // 10, 15, 20, etc.
		commissionPercent: d.integer().notNull(), // How much promoter gets (3%, 5%, 10%)

		// Stats
		usageCount: d.integer().default(0).notNull(),

		// Status
		isActive: d.boolean().default(true).notNull(),

		// Timestamps
		createdAt: d.timestamp({ withTimezone: true }).$defaultFn(() => new Date()).notNull(),
	}),
	(t) => [
		index("promoter_code_promoter_idx").on(t.promoterId),
		index("promoter_code_code_idx").on(t.code),
		index("promoter_code_active_idx").on(t.isActive),
	],
);

// ============================================================================
// RELATIONS
// ============================================================================

export const promotersRelations = relations(promoters, ({ many }) => ({
	codes: many(promoterCodes),
	orders: many(orders),
}));

export const promoterCodesRelations = relations(promoterCodes, ({ one }) => ({
	promoter: one(promoters, {
		fields: [promoterCodes.promoterId],
		references: [promoters.id],
	}),
}));