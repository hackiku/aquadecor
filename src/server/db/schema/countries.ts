// src/server/db/schema/countries.ts
import { pgTable, text, boolean, integer, decimal, uuid, timestamp, jsonb } from "drizzle-orm/pg-core";

// Shipping zones (Serbia post uses 1-5, we'll generalize)
export const shippingZones = pgTable("shipping_zones", {
	id: uuid("id").defaultRandom().primaryKey(),
	name: text("name").notNull(), // "EU Standard", "Balkans Express", "Asia", etc.
	code: text("code").notNull().unique(), // "zone_1", "zone_2", etc.
	description: text("description"),

	// Base shipping rates (in cents, EUR)
	baseRate: integer("base_rate").default(0), // Flat fee
	perKgRate: integer("per_kg_rate").default(0), // Per kg

	// Delivery estimates
	estimatedDaysMin: integer("estimated_days_min"),
	estimatedDaysMax: integer("estimated_days_max"),

	// Limits
	maxWeightKg: integer("max_weight_kg").default(30),
	maxValueCents: integer("max_value_cents").default(400000), // €4000 in cents

	isActive: boolean("is_active").default(true),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Countries with full metadata
export const countries = pgTable("countries", {
	id: uuid("id").defaultRandom().primaryKey(),

	// Identity
	iso2: text("iso2").notNull().unique(), // "RS", "DE", etc.
	iso3: text("iso3").notNull().unique(), // "SRB", "DEU", etc.
	name: text("name").notNull(), // "Serbia"
	localName: text("local_name"), // "Србија"
	flagEmoji: text("flag_emoji"), // "🇷🇸"

	// Shipping configuration
	shippingZoneId: uuid("shipping_zone_id").references(() => shippingZones.id),
	isShippingEnabled: boolean("is_shipping_enabled").default(true),

	// Serbia Post specific fields (from CSV)
	postOperatorCode: text("post_operator_code"), // "SRA", "DEA", etc.
	postZone: integer("post_zone"), // 1-5 from Serbia Post

	// Limits and restrictions
	maxWeightKg: integer("max_weight_kg"), // Override zone default if needed
	maxValueCents: integer("max_value_cents"), // Override zone default
	requiresCustoms: boolean("requires_customs").default(false),
	requiresPhoneNumber: boolean("requires_phone_number").default(false),

	// Additional fees/rules
	customsFeeCents: integer("customs_fee_cents").default(0),
	vatRate: decimal("vat_rate", { precision: 5, scale: 2 }), // 20.00 for 20%

	// Business metadata
	notes: text("notes"), // "Suspended", "Special handling", etc.
	restrictions: jsonb("restrictions").$type<string[]>(), // ["No live animals", etc.]

	// Analytics (cached for performance)
	totalOrders: integer("total_orders").default(0),
	totalRevenueCents: integer("total_revenue_cents").default(0),
	lastOrderAt: timestamp("last_order_at"),

	// Tracking
	isActive: boolean("is_active").default(true),
	isSuspended: boolean("is_suspended").default(false), // Temporarily disabled
	suspensionReason: text("suspension_reason"),

	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Track checkout attempts from unsupported/disabled countries (for demand analysis)
export const countryShippingAttempts = pgTable("country_shipping_attempts", {
	id: uuid("id").defaultRandom().primaryKey(),
	countryIso2: text("country_iso2").notNull(),
	countryName: text("country_name"), // In case country not in DB yet

	cartValueCents: integer("cart_value_cents"),
	productIds: jsonb("product_ids").$type<string[]>(),

	userId: uuid("user_id"), // Nullable for guest checkouts
	sessionId: text("session_id"),

	attemptedAt: timestamp("attempted_at").defaultNow().notNull(),
});

// Relations
export const countriesRelations = {
	shippingZone: {
		fields: [countries.shippingZoneId],
		references: [shippingZones.id],
	},
};