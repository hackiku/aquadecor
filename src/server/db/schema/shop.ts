// src/server/db/schema/shop.ts
import { relations } from "drizzle-orm";
import { index, text, integer, timestamp, boolean, jsonb } from "drizzle-orm/pg-core";
import { createTable } from "./_utils";

// ============================================================================
// CATEGORIES
// Flat structure tagged by product line:
// - A Models (productLine: "3d-backgrounds")
// - A Slim Models (productLine: "3d-backgrounds")
// - Aquarium Plants (productLine: "aquarium-decorations")
// - D Models (productLine: "aquarium-decorations")
// 
// Product line landing pages (3d-backgrounds, aquarium-decorations) are 
// hardcoded Next.js pages, not DB entities - better for CRO control.
// ============================================================================

export const categories = createTable(
	"category",
	(d) => ({
		id: d.text().primaryKey().$defaultFn(() => crypto.randomUUID()),
		slug: d.text().notNull().unique(), // 'a-models', 'aquarium-plants'
		productLine: d.text().notNull(), // '3d-backgrounds' | 'aquarium-decorations'

		// Display
		sortOrder: d.integer().default(0).notNull(),
		isActive: d.boolean().default(true).notNull(),

		// Metadata
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
		locale: d.text().notNull(), // 'en', 'de', 'pl', 'cs', etc.

		name: d.text().notNull(), // "A Models - Classic Rocky Backgrounds"
		description: d.text(), // Category description

		createdAt: d.timestamp({ withTimezone: true }).$defaultFn(() => new Date()).notNull(),
	}),
	(t) => [
		index("category_translation_category_idx").on(t.categoryId),
		index("category_translation_locale_idx").on(t.locale),
	],
);

// ============================================================================
// PRODUCTS
// Single table for both 3D backgrounds and decorations
// SKU examples: F1, F2 (backgrounds), Z1, Z10 (plants), D1, D10 (logs/roots)
// ============================================================================

export const products = createTable(
	"product",
	(d) => ({
		id: d.text().primaryKey().$defaultFn(() => crypto.randomUUID()),
		categoryId: d.text().notNull().references(() => categories.id),
		slug: d.text().notNull().unique(), // 'f1-3d-background', 'z1-aquarium-plant'
		sku: d.text().unique(), // 'F1', 'Z1' - user-facing semantic ID

		// Pricing - stored in EUR cents (€49 = 4900)
		basePriceEurCents: d.integer(), // null = custom-only (quote required)
		priceNote: d.text(), // "From €199", "Production takes 10-12 business days"

		// Specifications (flexible JSON for both backgrounds and decorations)
		specifications: jsonb().$type<{
			// Common fields
			dimensions?: {
				widthCm?: number;
				heightCm?: number;
				depthCm?: number;
			};
			material?: string;
			weight?: string;
			productionTime?: string; // "10-12 business days"

			// Background-specific (nullable)
			modularity?: "single" | "sectioned";
			filtrationCutout?: boolean;
			sidePanels?: "none" | "single" | "both";

			// Decoration-specific (nullable)
			plantType?: "moss" | "cabomba" | "eucalyptus" | "other";
			rockFormation?: "cichlid-spawning" | "tanganyika" | "loose" | "magnetic";
			compatibility?: string[]; // Fish species compatibility
		}>(),

		// Inventory & Status
		stockStatus: d.text().default("made_to_order").notNull(), // 'in_stock' | 'made_to_order' | 'out_of_stock'
		isActive: d.boolean().default(true).notNull(),
		isFeatured: d.boolean().default(false).notNull(), // For homepage ProductSlider
		sortOrder: d.integer().default(0).notNull(),

		// Timestamps
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

		name: d.text().notNull(), // Product title
		shortDescription: d.text(), // One-liner for ProductCard
		fullDescription: d.text(), // Long description for product detail page

		createdAt: d.timestamp({ withTimezone: true }).$defaultFn(() => new Date()).notNull(),
	}),
	(t) => [
		index("product_translation_product_idx").on(t.productId),
		index("product_translation_locale_idx").on(t.locale),
	],
);

// ============================================================================
// PRODUCT IMAGES
// Supports mixed sources: CDN URLs and local /public/ paths
// Later: Migrate to Supabase Storage (storagePath will be used then)
// ============================================================================

export const productImages = createTable(
	"product_image",
	(d) => ({
		id: d.text().primaryKey().$defaultFn(() => crypto.randomUUID()),
		productId: d.text().notNull().references(() => products.id, { onDelete: "cascade" }),

		// Image location (supports CDN, public folder, or future Supabase Storage)
		storageUrl: d.text().notNull(), // Full URL or path
		storagePath: d.text(), // Future: 'products/abc123/hero.jpg' (nullable for now)

		// Metadata
		altText: d.text(),
		width: d.integer(),
		height: d.integer(),
		fileSize: d.integer(), // bytes
		mimeType: d.text(), // 'image/jpeg', 'image/png', 'image/webp'

		// Display
		sortOrder: d.integer().default(0).notNull(), // 0 = featured/hero image

		createdAt: d.timestamp({ withTimezone: true }).$defaultFn(() => new Date()).notNull(),
	}),
	(t) => [
		index("product_image_product_idx").on(t.productId),
		index("product_image_sort_idx").on(t.sortOrder),
	],
);

// ============================================================================
// QUOTES
// Calculator submissions for custom 3D backgrounds
// ============================================================================

export const quotes = createTable(
	"quote",
	(d) => ({
		id: d.text().primaryKey().$defaultFn(() => crypto.randomUUID()),

		// Customer info
		name: d.text().notNull(),
		email: d.text().notNull(),
		country: d.text().notNull(),

		// Configuration (store as JSONB for flexibility)
		config: d.jsonb().notNull().$type<{
			modelCategory: string;
			flexibility: "solid" | "flexible";
			dimensions: { width: number; height: number; depth: number };
			unit: "cm" | "inch";
			sidePanels: "none" | "single" | "both";
			sidePanelWidth?: number;
			filtrationCutout?: boolean;
			notes?: string;
		}>(),

		// Pricing (stored in EUR cents)
		estimatedPriceEurCents: d.integer().notNull(),
		finalPriceEurCents: d.integer(), // After manual review/adjustment

		// Status tracking
		status: d.text().notNull().default("pending"),
		// Values: "pending" | "quoted" | "accepted" | "paid" | "in_production" | "shipped" | "cancelled"

		// Notes
		customerNotes: d.text(),
		adminNotes: d.text(),

		// Timestamps
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
	images: many(productImages),
}));

export const productTranslationsRelations = relations(productTranslations, ({ one }) => ({
	product: one(products, {
		fields: [productTranslations.productId],
		references: [products.id],
	}),
}));

export const productImagesRelations = relations(productImages, ({ one }) => ({
	product: one(products, {
		fields: [productImages.productId],
		references: [products.id],
	}),
}));

export const quotesRelations = relations(quotes, ({ one }) => ({
	// Could link to users table if auth is added
}));