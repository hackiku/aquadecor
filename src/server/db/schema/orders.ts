// src/server/db/schema/orders.ts
import { relations } from "drizzle-orm";
import { index, text, integer, timestamp, boolean, jsonb } from "drizzle-orm/pg-core";
import { createTable } from "./_utils";
import { promoters } from "./promoters";

// ============================================================================
// ORDERS
// Full order lifecycle from cart → checkout → payment → fulfillment
// ============================================================================

export const orders = createTable(
	"order",
	(d) => ({
		id: d.text().primaryKey().$defaultFn(() => crypto.randomUUID()),
		orderNumber: d.text().notNull().unique(), // Human-readable: ORD-2025-001

		// Customer info
		email: d.text().notNull(),
		firstName: d.text(),
		lastName: d.text(),

		// Pricing (all in cents)
		subtotal: d.integer().notNull(), // Sum of line items
		discount: d.integer().default(0).notNull(), // Promo code discount
		shipping: d.integer().default(0).notNull(), // Shipping cost
		total: d.integer().notNull(), // Final amount charged
		currency: d.text().default("EUR").notNull(), // EUR, USD, etc.

		// Status tracking
		status: d.text().notNull().default("pending"),
		// Values: "pending" | "confirmed" | "in_production" | "ready_to_ship" | "shipped" | "delivered" | "cancelled" | "refunded" | "abandoned"

		paymentStatus: d.text().notNull().default("pending"),
		// Values: "pending" | "paid" | "failed" | "refunded"

		// Promo tracking
		discountCode: d.text(), // Code used (e.g., "JOEY15")
		promoterId: d.text().references(() => promoters.id),

		// Shipping
		shippingAddress: jsonb().$type<{
			firstName: string;
			lastName: string;
			company?: string;
			address1: string;
			address2?: string;
			city: string;
			state?: string;
			postalCode: string;
			country: string;
			phone?: string;
		}>(),
		trackingNumber: d.text(),

		// Notes
		notes: d.text(), // Customer notes
		internalNotes: d.text(), // Admin-only notes

		// Timestamps
		createdAt: d.timestamp({ withTimezone: true }).$defaultFn(() => new Date()).notNull(),
		updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
		confirmedAt: d.timestamp({ withTimezone: true }),
		shippedAt: d.timestamp({ withTimezone: true }),
		deliveredAt: d.timestamp({ withTimezone: true }),
	}),
	(t) => [
		index("order_email_idx").on(t.email),
		index("order_status_idx").on(t.status),
		index("order_payment_status_idx").on(t.paymentStatus),
		index("order_discount_code_idx").on(t.discountCode),
		index("order_promoter_idx").on(t.promoterId),
		index("order_created_at_idx").on(t.createdAt),
	],
);

// ============================================================================
// ORDER ITEMS
// Individual line items in an order
// ============================================================================

export const orderItems = createTable(
	"order_item",
	(d) => ({
		id: d.text().primaryKey().$defaultFn(() => crypto.randomUUID()),
		orderId: d.text().notNull().references(() => orders.id, { onDelete: "cascade" }),

		productId: d.text().notNull(), // Reference to products table
		productName: d.text().notNull(), // Snapshot at time of order
		sku: d.text(),

		quantity: d.integer().notNull().default(1),
		pricePerUnit: d.integer().notNull(), // In cents
		total: d.integer().notNull(), // quantity * pricePerUnit (in cents)

		// Custom options (for backgrounds with custom dimensions, etc.)
		customizations: jsonb().$type<{
			dimensions?: { width: number; height: number; depth?: number };
			unit?: "cm" | "inch";
			sidePanels?: "none" | "single" | "both";
			filtrationCutout?: boolean;
			notes?: string;
		}>(),

		createdAt: d.timestamp({ withTimezone: true }).$defaultFn(() => new Date()).notNull(),
	}),
	(t) => [
		index("order_item_order_idx").on(t.orderId),
		index("order_item_product_idx").on(t.productId),
	],
);

// ============================================================================
// RELATIONS
// ============================================================================

export const ordersRelations = relations(orders, ({ many, one }) => ({
	items: many(orderItems),
	promoter: one(promoters, {
		fields: [orders.promoterId],
		references: [promoters.id]
	}),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
	order: one(orders, {
		fields: [orderItems.orderId],
		references: [orders.id],
	}),
}));