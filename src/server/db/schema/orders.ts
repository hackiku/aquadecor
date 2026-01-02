// src/server/db/schema/orders.ts
import { relations, type InferSelectModel } from "drizzle-orm";
import { index, text, integer, timestamp, boolean, jsonb } from "drizzle-orm/pg-core";
import { createTable } from "./_utils";
import { products } from "./shop";
import { promoters } from "./promoters";
import { sales } from "./sales";
import { countries } from "./countries";
import { emailSubscribers } from "./subscribers";

// ============================================================================
// ORDERS
// Full order lifecycle from cart â†’ checkout â†’ payment â†’ fulfillment
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
		tax: d.integer().default(0).notNull(), // VAT/sales tax
		total: d.integer().notNull(), // Final amount charged
		currency: d.text().default("EUR").notNull(), // EUR, USD, GBP

		// Market tracking
		market: d.text().notNull().default("ROW"), // 'ROW' | 'US' | 'CA' | 'UK'
		countryCode: d.text(), // ISO2: 'DE', 'US', 'RS'

		// Status tracking
		status: d.text().notNull().default("pending"),
		// "pending" | "confirmed" | "in_production" | "ready_to_ship" | "shipped" | "delivered" | "cancelled" | "refunded" | "abandoned"

		paymentStatus: d.text().notNull().default("pending"),
		// "pending" | "paid" | "failed" | "refunded" | "partially_refunded"

		paymentProvider: d.text(), // "stripe" | "paypal" | "bank_transfer"
		paymentIntentId: d.text(), // Stripe payment_intent_id or PayPal order_id

		// Promo tracking
		discountCode: d.text(), // Code used (e.g., "JOEY15")
		promoterId: d.text().references(() => promoters.id),
		saleId: d.text().references(() => sales.id),
		subscriberId: d.text().references(() => emailSubscribers.id), // For subscriber discounts

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
			country: string; // Full name: "Germany"
			countryCode: string; // ISO2: "DE"
			phone?: string;
		}>(),
		trackingNumber: d.text(),
		carrierName: d.text(), // "Serbia Post", "DHL", "UPS"

		// Notes
		customerNotes: d.text(), // Customer notes
		internalNotes: d.text(), // Admin-only notes

		// Timestamps
		createdAt: d.timestamp({ withTimezone: true }).$defaultFn(() => new Date()).notNull(),
		updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
		confirmedAt: d.timestamp({ withTimezone: true }),
		paidAt: d.timestamp({ withTimezone: true }),
		shippedAt: d.timestamp({ withTimezone: true }),
		deliveredAt: d.timestamp({ withTimezone: true }),
		cancelledAt: d.timestamp({ withTimezone: true }),
	}),
	(t) => [
		index("order_email_idx").on(t.email),
		index("order_status_idx").on(t.status),
		index("order_payment_status_idx").on(t.paymentStatus),
		index("order_market_idx").on(t.market),
		index("order_country_idx").on(t.countryCode),
		index("order_discount_code_idx").on(t.discountCode),
		index("order_promoter_idx").on(t.promoterId),
		index("order_sale_idx").on(t.saleId),
		index("order_subscriber_idx").on(t.subscriberId),
		index("order_created_at_idx").on(t.createdAt),
	],
);

// ============================================================================
// ORDER ITEMS
// Individual line items with FULL PRICING SNAPSHOT
// ============================================================================

export const orderItems = createTable(
	"order_item",
	(d) => ({
		id: d.text().primaryKey().$defaultFn(() => crypto.randomUUID()),
		orderId: d.text().notNull().references(() => orders.id, { onDelete: "cascade" }),
		productId: d.text().notNull().references(() => products.id), // FK to products

		// Product snapshot (immutable)
		productName: d.text().notNull(),
		sku: d.text().notNull(),
		productSlug: d.text(), // For linking back to product page

		// Pricing snapshot (CRITICAL: never changes even if product price changes)
		pricingSnapshot: jsonb().$type<{
			pricingType: 'simple' | 'bundle' | 'configuration';
			market: string; // Which market price was used
			currency: string;

			// Simple pricing
			unitPriceEurCents?: number;
			quantity?: number;

			// Bundle pricing
			bundleId?: string; // FK to pricingBundles at time of purchase
			bundleQuantity?: number; // How many pieces in the bundle
			bundleTotalPriceEurCents?: number;
			bundleLabel?: string;

			// Configuration pricing
			configurationDetails?: {
				dimensions: { width: number; height: number; depth?: number };
				unit: 'cm' | 'inch';
				surfaceAreaSqM: number;
				baseRatePerSqM: number;
				sidePanels?: 'none' | 'single' | 'both';
				sidePanelWidth?: number;
				filtrationCutout?: boolean;
				flexibility?: 'solid' | 'flexible';
			};

			// Addons
			selectedAddons?: Array<{
				addonId: string;
				name: string;
				priceEurCents: number;
			}>;

			// Custom inputs & selects
			customizations?: {
				inputs?: Record<string, string>; // {height_cm: "45", notes: "..."}
				selects?: Record<string, { value: string; label: string; priceEurCents?: number }>;
			};
		}>(),

		// Calculated totals (for display)
		quantity: d.integer().notNull().default(1), // Actual cart quantity
		pricePerUnit: d.integer().notNull(), // In cents
		subtotal: d.integer().notNull(), // Before addons/customizations
		addonsTotal: d.integer().default(0).notNull(),
		customizationsTotal: d.integer().default(0).notNull(),
		total: d.integer().notNull(), // Final line item total

		// Fulfillment tracking
		isCustom: d.boolean().default(false).notNull(), // Made-to-order or configured
		productionStatus: d.text(), // "pending" | "in_production" | "ready" | "shipped"

		createdAt: d.timestamp({ withTimezone: true }).$defaultFn(() => new Date()).notNull(),
	}),
	(t) => [
		index("order_item_order_idx").on(t.orderId),
		index("order_item_product_idx").on(t.productId),
		index("order_item_production_status_idx").on(t.productionStatus),
	],
);

// ============================================================================
// ORDER STATUS HISTORY - Track all status changes
// ============================================================================

export const orderStatusHistory = createTable(
	"order_status_history",
	(d) => ({
		id: d.text().primaryKey().$defaultFn(() => crypto.randomUUID()),
		orderId: d.text().notNull().references(() => orders.id, { onDelete: "cascade" }),

		fromStatus: d.text(),
		toStatus: d.text().notNull(),
		notes: d.text(),
		changedBy: d.text(), // userId or "system"

		createdAt: d.timestamp({ withTimezone: true }).$defaultFn(() => new Date()).notNull(),
	}),
	(t) => [
		index("status_history_order_idx").on(t.orderId),
		index("status_history_created_at_idx").on(t.createdAt),
	],
);

// ============================================================================
// RELATIONS
// ============================================================================

export const ordersRelations = relations(orders, ({ many, one }) => ({
	items: many(orderItems),
	statusHistory: many(orderStatusHistory),
	promoter: one(promoters, {
		fields: [orders.promoterId],
		references: [promoters.id],
	}),
	sale: one(sales, {
		fields: [orders.saleId],
		references: [sales.id],
	}),
	subscriber: one(emailSubscribers, {
		fields: [orders.subscriberId],
		references: [emailSubscribers.id],
	}),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
	order: one(orders, {
		fields: [orderItems.orderId],
		references: [orders.id],
	}),
	product: one(products, {
		fields: [orderItems.productId],
		references: [products.id],
	}),
}));

export const orderStatusHistoryRelations = relations(orderStatusHistory, ({ one }) => ({
	order: one(orders, {
		fields: [orderStatusHistory.orderId],
		references: [orders.id],
	}),
}));

// ============================================================================
// TYPES
// ============================================================================

export type Order = InferSelectModel<typeof orders>;
export type OrderItem = InferSelectModel<typeof orderItems>;
export type OrderStatusHistory = InferSelectModel<typeof orderStatusHistory>;