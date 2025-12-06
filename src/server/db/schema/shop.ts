// src/server/db/schema/shop.ts
import { relations } from "drizzle-orm";
import type { InferSelectModel } from "drizzle-orm";
import { index, text, integer, timestamp, boolean, jsonb } from "drizzle-orm/pg-core";
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

		// CRO Content Blocks
		contentBlocks: jsonb().$type<{
			icon?: string;
			emoji?: string;
			highlights?: Array<{
				title: string;
				description: string;
				icon?: string;
			}>;
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
		locale: d.text().notNull(), // 'en', 'de', 'nl', 'fr', 'us'
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
// PRODUCTS
// ============================================================================

export const products = createTable(
	"product",
	(d) => ({
		id: d.text().primaryKey().$defaultFn(() => crypto.randomUUID()),
		categoryId: d.text().notNull().references(() => categories.id, { onDelete: "cascade" }),
		slug: d.text().notNull().unique(),
		sku: d.text(),

		// Product type
		productType: d.text().notNull().default("simple"), // 'simple' | 'variable'

		// Pricing (in EUR cents)
		basePriceEurCents: d.integer(),
		priceNote: d.text(), // "From €199" | "Custom quote"

		// Variants (for quantity bundles)
		variantType: d.text(), // 'quantity' | null
		variantOptions: jsonb().$type<{
			quantity?: {
				options: Array<{
					value: number;
					priceEurCents: number;
					label?: string;
				}>;
			};
		}>(),

		// Flexible specifications (STAYS TECHNICAL)
		specifications: jsonb().$type<{
			dimensions?: {
				widthCm?: number;
				heightCm?: number;
				depthCm?: number;
			};
			material?: string;
			productionTime?: string;
			modularity?: string;
			filtrationCutout?: boolean;
			// Type-specific fields
			plantType?: string;
			woodType?: string;
			rockFormation?: string;
			setContents?: string[];
			compatibility?: string[];
			isFloating?: boolean;
			[key: string]: any;
		}>(),

		// Customization
		customizationOptions: jsonb().$type<{
			allowsCustomDimensions?: boolean;
			allowsColorCustomization?: boolean;
			specialRequestField?: {
				enabled: boolean;
				label?: string;
				placeholder?: string;
				maxLength?: number;
			};
		}>(),

		// Market filtering (Trump tariffs)
		availableMarkets: d.text().array().default(["EU", "UK"]),

		// Stock & display
		stockStatus: d.text().notNull().default("in_stock"),
		// 'in_stock' | 'made_to_order' | 'requires_quote'

		isActive: d.boolean().default(true).notNull(),
		isFeatured: d.boolean().default(false).notNull(),
		sortOrder: d.integer().default(0).notNull(),

		createdAt: d.timestamp({ withTimezone: true }).$defaultFn(() => new Date()).notNull(),
		updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
	}),
	(t) => [
		index("product_category_idx").on(t.categoryId),
		index("product_slug_idx").on(t.slug),
		index("product_sku_idx").on(t.sku),
		index("product_featured_idx").on(t.isFeatured),
	],
);


export const productTranslations = createTable(
	"product_translation",
	(d) => ({
		id: d.text().primaryKey().$defaultFn(() => crypto.randomUUID()),
		productId: d.text().notNull().references(() => products.id, { onDelete: "cascade" }),
		locale: d.text().notNull(),
		name: d.text().notNull(),
		shortDescription: d.text(), // ~160 chars for meta/cards
		fullDescription: d.text(),
		metaTitle: d.text(),
		metaDescription: d.text(),

		// ✅ NEW: Optional spec overrides for translation
		specOverrides: jsonb().$type<Record<string, string>>(),
		// Example: { "productionTime": "10-12 Werktage", "material": "Silberbirke" }

		createdAt: d.timestamp({ withTimezone: true }).$defaultFn(() => new Date()).notNull(),
		updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
	}),
	(t) => [
		index("product_translation_product_idx").on(t.productId),
		index("product_translation_locale_idx").on(t.locale),
	],
);


// ============================================================================
// QUOTES (3D Calculator)
// ============================================================================

export const quotes = createTable(
	"quote",
	(d) => ({
		id: d.text().primaryKey().$defaultFn(() => crypto.randomUUID()),
		productSlug: d.text().notNull(),
		email: d.text().notNull(),
		firstName: d.text(),
		lastName: d.text(),
		phone: d.text(),
		country: d.text(),

		dimensions: jsonb().$type<{
			width: number;
			height: number;
			depth?: number;
			unit: "cm" | "inch";
			sidePanels: "none" | "single" | "both";
			sidePanelWidth?: number;
			filtrationCutout?: boolean;
			notes?: string;
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
}));

export const productTranslationsRelations = relations(productTranslations, ({ one }) => ({
	product: one(products, {
		fields: [productTranslations.productId],
		references: [products.id],
	}),
}));

export const quotesRelations = relations(quotes, ({ one }) => ({
	// Could link to users/products if needed
}));

// ============================================================================
// TYPES
// ============================================================================

export type Category = InferSelectModel<typeof categories>;
export type CategoryTranslation = InferSelectModel<typeof categoryTranslations>;
export type Product = InferSelectModel<typeof products>;
export type ProductTranslation = InferSelectModel<typeof productTranslations>;
export type Quote = InferSelectModel<typeof quotes>;