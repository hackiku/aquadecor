// src/server/db/schema/shop.ts
import { relations } from "drizzle-orm";
import type { InferSelectModel, InferInsertModel } from "drizzle-orm";
import { index, text, integer, timestamp, boolean, decimal, jsonb } from "drizzle-orm/pg-core";
import { createTable } from "./_utils";

// ============================================================================
// CATEGORIES
// ============================================================================

export const categories = createTable(
	"category",
	(d) => ({
		id: d.text().primaryKey().$defaultFn(() => crypto.randomUUID()),
		slug: d.text().notNull().unique(),
		productLine: d.text().notNull(), // '3d-backgrounds' | 'aquarium-decorations'
		modelCode: d.text(), // 'Z', 'D', 'A' - for eyebrow display
		sortOrder: d.integer().default(0).notNull(),
		isActive: d.boolean().default(true).notNull(),

		// for calculator
		isPremium: d.boolean().default(false).notNull(),
		hasLargeTankPenalty: d.boolean().default(false).notNull(),

		contentBlocks: jsonb().$type<{
			icon?: string;
			emoji?: string;
			highlights?: Array<{ title: string; description: string; icon?: string }>;
			features?: string[];
			useCases?: string[];
		}>(),

		createdAt: d.timestamp({ withTimezone: true }).$defaultFn(() => new Date()).notNull(),
		updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
	}),
	(t) => [
		index("category_slug_idx").on(t.slug),
		index("category_product_line_idx").on(t.productLine),
	],
);

export const categoryTranslations = createTable(
	"category_translation",
	(d) => ({
		id: d.text().primaryKey().$defaultFn(() => crypto.randomUUID()),
		categoryId: d.text().notNull().references(() => categories.id, { onDelete: "cascade" }),
		locale: d.text().notNull(), // 'en', 'de', 'it', 'fr'
		name: d.text().notNull(),
		description: d.text(),
		metaTitle: d.text(),
		metaDescription: d.text(),
		createdAt: d.timestamp({ withTimezone: true }).$defaultFn(() => new Date()).notNull(),
		updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
	}),
	(t) => [
		index("category_translation_category_idx").on(t.categoryId),
		index("category_translation_locale_idx").on(t.locale),
	],
);

// ============================================================================
// PRODUCTS - Core product data only, pricing lives elsewhere
// ============================================================================

export const products = createTable(
	"product",
	(d) => ({
		id: d.text().primaryKey().$defaultFn(() => crypto.randomUUID()),
		categoryId: d.text().notNull().references(() => categories.id, { onDelete: "cascade" }),
		slug: d.text().notNull().unique(),
		sku: d.text().notNull().unique(), // Generated: "M-2", "Z-1", "V-5"

		// Physical properties (queryable)
		material: d.text(), // "Non-toxic silicone", "PVC", "Resin"
		widthCm: decimal("width_cm", { precision: 6, scale: 2 }),
		heightCm: decimal("height_cm", { precision: 6, scale: 2 }),
		depthCm: decimal("depth_cm", { precision: 6, scale: 2 }),
		weightGrams: d.integer(),
		productionTime: d.text(), // "Ready to ship", "7-10 days", "Made to order"

		// Technical specs (minimal JSONB)
		technicalSpecs: jsonb().$type<{
			isFloating?: boolean;
			hasFilterCutout?: boolean;
			modularity?: string;
			compatibility?: string[]; // ["freshwater", "saltwater"]
		}>(),

		// Stock & Display
		stockStatus: d.text().notNull().default("in_stock"),
		// 'in_stock' | 'made_to_order' | 'out_of_stock' | 'discontinued'
		isActive: d.boolean().default(true).notNull(),
		isFeatured: d.boolean().default(false).notNull(),
		sortOrder: d.integer().default(0).notNull(),

		// Stripe integration
		stripeProductId: d.text(),

		createdAt: d.timestamp({ withTimezone: true }).$defaultFn(() => new Date()).notNull(),
		updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
		deletedAt: d.timestamp({ withTimezone: true }),
		deletedBy: d.text(), // Admin email who deleted it (optional until auth is hooked)
	}),
	(t) => [
		index("product_category_idx").on(t.categoryId),
		index("product_slug_idx").on(t.slug),
		index("product_sku_idx").on(t.sku),
		index("product_featured_idx").on(t.isFeatured),
		index("product_stock_status_idx").on(t.stockStatus),
		index("product_deleted_at_idx").on(t.deletedAt),
	],
);

export const productTranslations = createTable(
	"product_translation",
	(d) => ({
		id: d.text().primaryKey().$defaultFn(() => crypto.randomUUID()),
		productId: d.text().notNull().references(() => products.id, { onDelete: "cascade" }),
		locale: d.text().notNull(),
		name: d.text().notNull(),
		shortDescription: d.text(), // ~160 chars
		longDescription: d.text(),
		metaTitle: d.text(),
		metaDescription: d.text(),

		// Translated specs (only if different from parent)
		materialTranslated: d.text(), // "Silikon" instead of "Silicone"
		productionTimeTranslated: d.text(),

		createdAt: d.timestamp({ withTimezone: true }).$defaultFn(() => new Date()).notNull(),
		updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
	}),
	(t) => [
		index("product_translation_product_idx").on(t.productId),
		index("product_translation_locale_idx").on(t.locale),
	],
);

// ============================================================================
// PRICING - Source of truth for ALL pricing (handles markets, bundles, etc)
// ============================================================================

export const productPricing = createTable(
	"product_pricing",
	(d) => ({
		id: d.text().primaryKey().$defaultFn(() => crypto.randomUUID()),
		productId: d.text().notNull().references(() => products.id, { onDelete: "cascade" }),

		// Market targeting
		market: d.text().notNull().default("ROW"), // 'ROW' (Rest of World) | 'US' | 'CA' | 'UK'
		currency: d.text().notNull().default("EUR"), // 'EUR' | 'USD' | 'GBP'

		// Pricing type
		pricingType: d.text().notNull(), // 'simple' | 'bundle' | 'configuration'

		// Simple pricing
		unitPriceEurCents: d.integer(), // For simple products
		allowQuantity: d.boolean().default(true),
		maxQuantity: d.integer(),
		fixedQuantity: d.integer(), // US products: "This price includes 7 pieces"

		// Configuration pricing (backgrounds with calculator)
		baseRatePerSqM: d.integer(), // €250/sqm = 25000 cents
		requiresQuote: d.boolean().default(false),
		calculatorUrl: d.text(), // '/calculator' or custom URL

		// Stripe price ID (for checkout)
		stripePriceId: d.text(),
		stripeProductId: d.text(), // Can differ from product.stripeProductId for market variants

		// Validity
		isActive: d.boolean().default(true).notNull(),
		effectiveFrom: d.timestamp({ withTimezone: true }),
		effectiveUntil: d.timestamp({ withTimezone: true }),

		createdAt: d.timestamp({ withTimezone: true }).$defaultFn(() => new Date()).notNull(),
		updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
	}),
	(t) => [
		index("pricing_product_idx").on(t.productId),
		index("pricing_market_idx").on(t.market),
		index("pricing_active_idx").on(t.isActive),
		index("pricing_type_idx").on(t.pricingType),
	],
);

// ============================================================================
// PRICING BUNDLES - Quantity tiers (3/5/10/15/20 pieces)
// ============================================================================

export const pricingBundles = createTable(
	"pricing_bundle",
	(d) => ({
		id: d.text().primaryKey().$defaultFn(() => crypto.randomUUID()),
		pricingId: d.text().notNull().references(() => productPricing.id, { onDelete: "cascade" }),

		quantity: d.integer().notNull(), // 3, 5, 10, 15, 20
		totalPriceEurCents: d.integer().notNull(), // Total for this quantity
		label: d.text(), // "Starter Pack", "Value Bundle (Save 15%)"
		savingsPercent: d.integer(), // Pre-calculated: 15 for "Save 15%"
		isDefault: d.boolean().default(false).notNull(),
		sortOrder: d.integer().default(0).notNull(),

		stripePriceId: d.text(), // Each bundle can have its own Stripe price

		createdAt: d.timestamp({ withTimezone: true }).$defaultFn(() => new Date()).notNull(),
	}),
	(t) => [
		index("bundle_pricing_idx").on(t.pricingId),
		index("bundle_default_idx").on(t.isDefault),
	],
);

// ============================================================================
// PRODUCT ADDONS - Extra items (moss, cork stoppers, etc)
// ============================================================================

export const productAddons = createTable(
	"product_addon",
	(d) => ({
		id: d.text().primaryKey().$defaultFn(() => crypto.randomUUID()),
		productId: d.text().notNull().references(() => products.id, { onDelete: "cascade" }),

		name: d.text().notNull(), // "Premium Cork Stoppers", "Java Moss"
		description: d.text(),
		priceEurCents: d.integer().notNull(),
		priceUsdCents: d.integer(), // Optional USD price
		isDefault: d.boolean().default(false).notNull(),
		isActive: d.boolean().default(true).notNull(),
		sortOrder: d.integer().default(0).notNull(),

		stripePriceId: d.text(),

		createdAt: d.timestamp({ withTimezone: true }).$defaultFn(() => new Date()).notNull(),
	}),
	(t) => [
		index("addon_product_idx").on(t.productId),
		index("addon_active_idx").on(t.isActive),
	],
);

// ============================================================================
// CUSTOMIZATION OPTIONS - Custom inputs (height, notes, etc)
// ============================================================================

export const customizationOptions = createTable(
	"customization_option",
	(d) => ({
		id: d.text().primaryKey().$defaultFn(() => crypto.randomUUID()),
		productId: d.text().notNull().references(() => products.id, { onDelete: "cascade" }),

		type: d.text().notNull(), // 'input' | 'select' | 'textarea'
		inputType: d.text(), // 'text' | 'number' | 'email' when type='input'

		label: d.text().notNull(),
		placeholder: d.text(),
		required: d.boolean().default(false).notNull(),
		sortOrder: d.integer().default(0).notNull(),

		// Validation
		minValue: d.integer(),
		maxValue: d.integer(),
		maxLength: d.integer(),
		pattern: d.text(),

		createdAt: d.timestamp({ withTimezone: true }).$defaultFn(() => new Date()).notNull(),
	}),
	(t) => [
		index("custom_option_product_idx").on(t.productId),
		index("custom_option_required_idx").on(t.required),
	],
);

// ============================================================================
// SELECT OPTIONS - Dropdown options (colors, finishes, etc)
// ============================================================================

export const selectOptions = createTable(
	"select_option",
	(d) => ({
		id: d.text().primaryKey().$defaultFn(() => crypto.randomUUID()),
		customizationOptionId: d.text().notNull().references(() => customizationOptions.id, { onDelete: "cascade" }),

		value: d.text().notNull(),
		label: d.text().notNull(),
		priceEurCents: d.integer(), // null if no price adjustment
		priceUsdCents: d.integer(),
		isDefault: d.boolean().default(false).notNull(),
		sortOrder: d.integer().default(0).notNull(),

		createdAt: d.timestamp({ withTimezone: true }).$defaultFn(() => new Date()).notNull(),
	}),
	(t) => [
		index("select_option_customization_idx").on(t.customizationOptionId),
		index("select_option_default_idx").on(t.isDefault),
	],
);

// ============================================================================
// MARKET EXCLUSIONS - Which products are blocked in which markets
// ============================================================================

export const productMarketExclusions = createTable(
	"product_market_exclusion",
	(d) => ({
		id: d.text().primaryKey().$defaultFn(() => crypto.randomUUID()),
		productId: d.text().notNull().references(() => products.id, { onDelete: "cascade" }),
		market: d.text().notNull(), // 'US' | 'CA' | 'UK'
		reason: d.text(), // "Tariffs", "Shipping restrictions", etc.
		createdAt: d.timestamp({ withTimezone: true }).$defaultFn(() => new Date()).notNull(),
	}),
	(t) => [
		index("exclusion_product_idx").on(t.productId),
		index("exclusion_market_idx").on(t.market),
	],
);

// ============================================================================
// QUOTES - Custom calculator requests (3D backgrounds)
// ============================================================================

export const quotes = createTable(
	"quote",
	(d) => ({
		id: d.text().primaryKey().$defaultFn(() => crypto.randomUUID()),
		productId: d.text().references(() => products.id), // Link to product if applicable
		email: d.text().notNull(),
		firstName: d.text(),
		lastName: d.text(),
		phone: d.text(),
		country: d.text(),

		// Configuration snapshot
		dimensions: jsonb().$type<{
			width: number;
			height: number;
			depth?: number;
			unit: "cm" | "inch";
			sidePanels: "none" | "left" | "right" | "both";
			sidePanelWidth?: number;
			filtrationCutout?: boolean;
			filtrationType: string;
			notes?: string;
			additionalItems?: Array<{ id: string; quantity: number }>; // for calculator quotes
		}>(),

		estimatedPriceEurCents: d.integer().notNull(),
		finalPriceEurCents: d.integer(),

		status: d.text().notNull().default("pending"),
		// "pending" | "quoted" | "accepted" | "paid" | "in_production" | "shipped" | "cancelled"

		customerNotes: d.text(),
		adminNotes: d.text(),

		createdAt: d.timestamp({ withTimezone: true }).$defaultFn(() => new Date()).notNull(),
		quotedAt: d.timestamp({ withTimezone: true }),
		acceptedAt: d.timestamp({ withTimezone: true }),
		paidAt: d.timestamp({ withTimezone: true }),
	}),
	(t) => [
		index("quote_email_idx").on(t.email),
		index("quote_status_idx").on(t.status),
		index("quote_created_at_idx").on(t.createdAt),
	],
);

// ============================================================================
// RELATIONS
// ============================================================================

export const categoriesRelations = relations(categories, ({ many }) => ({
	translations: many(categoryTranslations),
	products: many(products),
}));

export const categoryTranslationsRelations = relations(categoryTranslations, ({ one }) => ({
	category: one(categories, {
		fields: [categoryTranslations.categoryId],
		references: [categories.id],
	}),
}));

export const productsRelations = relations(products, ({ one, many }) => ({
	category: one(categories, {
		fields: [products.categoryId],
		references: [categories.id],
	}),
	translations: many(productTranslations),
	pricing: many(productPricing),
	addons: many(productAddons),
	customizationOptions: many(customizationOptions),
	marketExclusions: many(productMarketExclusions),
	quotes: many(quotes),
}));

export const productTranslationsRelations = relations(productTranslations, ({ one }) => ({
	product: one(products, {
		fields: [productTranslations.productId],
		references: [products.id],
	}),
}));

export const productPricingRelations = relations(productPricing, ({ one, many }) => ({
	product: one(products, {
		fields: [productPricing.productId],
		references: [products.id],
	}),
	bundles: many(pricingBundles),
}));

export const pricingBundlesRelations = relations(pricingBundles, ({ one }) => ({
	pricing: one(productPricing, {
		fields: [pricingBundles.pricingId],
		references: [productPricing.id],
	}),
}));

export const productAddonsRelations = relations(productAddons, ({ one }) => ({
	product: one(products, {
		fields: [productAddons.productId],
		references: [products.id],
	}),
}));

export const customizationOptionsRelations = relations(customizationOptions, ({ one, many }) => ({
	product: one(products, {
		fields: [customizationOptions.productId],
		references: [products.id],
	}),
	selectOptions: many(selectOptions),
}));

export const selectOptionsRelations = relations(selectOptions, ({ one }) => ({
	customizationOption: one(customizationOptions, {
		fields: [selectOptions.customizationOptionId],
		references: [customizationOptions.id],
	}),
}));

export const productMarketExclusionsRelations = relations(productMarketExclusions, ({ one }) => ({
	product: one(products, {
		fields: [productMarketExclusions.productId],
		references: [products.id],
	}),
}));

export const quotesRelations = relations(quotes, ({ one }) => ({
	product: one(products, {
		fields: [quotes.productId],
		references: [products.id],
	}),
}));

// ============================================================================
// TYPES
// ============================================================================

export type Category = InferSelectModel<typeof categories>;
export type CategoryTranslation = InferSelectModel<typeof categoryTranslations>;
export type Product = InferSelectModel<typeof products>;
export type ProductTranslation = InferSelectModel<typeof productTranslations>;
export type ProductPricing = InferSelectModel<typeof productPricing>;
export type PricingBundle = InferSelectModel<typeof pricingBundles>;
export type ProductAddon = InferSelectModel<typeof productAddons>;
export type CustomizationOption = InferSelectModel<typeof customizationOptions>;
export type SelectOption = InferSelectModel<typeof selectOptions>;
export type ProductMarketExclusion = InferSelectModel<typeof productMarketExclusions>;
export type Quote = InferSelectModel<typeof quotes>;