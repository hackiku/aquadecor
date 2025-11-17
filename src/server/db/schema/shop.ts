// src/server/db/schema/shop.ts
import { relations } from "drizzle-orm";
import { index, text, integer, timestamp, boolean, jsonb } from "drizzle-orm/pg-core";
import { createTable } from "./_utils";

// ============================================================================
// CATEGORIES
// Hierarchical structure:
// - 3D Backgrounds (parent)
//   - A Models - Classic Rocky (child)
//   - A Slim Models - Thin Rocky (child)
//   - B Models - Amazonian (child)
// - Aquarium decorations (parent)
//   - Aquarium Plants (child)
//   - Aquarium Rocks (child)
//   - D Models - Logs/Leaves/Driftwood (child)
//   - H Models - Artificial Reefs (child)
// ============================================================================

export const categories = createTable(
	"category",
	(d) => ({
		id: d.text().primaryKey(), // 'backgrounds-3d', 'backgrounds-3d-a-models'
		slug: d.text().notNull().unique(), // 'backgrounds-3d', 'a-models'
		parentId: d.text(), // null for top-level categories

		// Display
		sortOrder: d.integer().default(0).notNull(),
		isActive: d.boolean().default(true).notNull(),

		// Metadata
		createdAt: d.timestamp({ withTimezone: true }).$defaultFn(() => new Date()).notNull(),
		updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
	}),
	(t) => [
		index("category_parent_id_idx").on(t.parentId),
		index("category_slug_idx").on(t.slug),
	],
);

export const categoryTranslations = createTable(
	"category_translation",
	(d) => ({
		id: d.text().primaryKey().$defaultFn(() => crypto.randomUUID()),
		categoryId: d.text().notNull().references(() => categories.id, { onDelete: "cascade" }),
		locale: d.text().notNull(), // 'en', 'de', 'pl', 'cs', etc.

		name: d.text().notNull(), // "3D Backgrounds", "A Models - Classic Rocky Backgrounds"
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
// Based on Excel: Each row is a product variant with SKU like:
// - F1: 3D Background
// - F2: 3D Background  
// - Z1: Aquarium Plant
// - Z2: Aquarium Plant
// ============================================================================

export const products = createTable(
	"product",
	(d) => ({
		id: d.text().primaryKey().$defaultFn(() => crypto.randomUUID()),
		categoryId: d.text().notNull().references(() => categories.id),
		slug: d.text().notNull().unique(), // 'rocky-cave-background', 'z1-aquarium-plant'
		sku: d.text(), // 'F1', 'F2', 'Z1', 'Z2' from Excel

		// Pricing - stored in EUR cents (€199 = 19900)
		// Many products show "Production takes 10-12 business days" = made-to-order
		basePriceEurCents: d.integer(), // null = request quote only
		priceNote: d.text(), // "From €199", "Production takes 10-12 business days"

		// Specifications (flexible JSON structure)
		specifications: jsonb().$type<{
			// Dimensions for calculator
			dimensions?: {
				widthCm?: number;
				heightCm?: number;
				depthCm?: number;
			};
			// From Excel columns
			weight?: string;
			material?: string;
			compatibility?: string[];
			productionTime?: string; // "10-12 business days"
		}>(),

		// Inventory & Status
		stockStatus: d.text().default("made_to_order").notNull(), // 'in_stock', 'low_stock', 'out_of_stock', 'made_to_order'
		isActive: d.boolean().default(true).notNull(),
		isFeatured: d.boolean().default(false).notNull(), // For homepage slider
		sortOrder: d.integer().default(0).notNull(),

		// Media
		featuredImageId: d.text(), // Points to productImages.id

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
		shortDescription: d.text(), // One-liner for cards
		fullDescription: d.text(), // Long HTML description from Excel "MiniDescription"

		createdAt: d.timestamp({ withTimezone: true }).$defaultFn(() => new Date()).notNull(),
	}),
	(t) => [
		index("product_translation_product_idx").on(t.productId),
		index("product_translation_locale_idx").on(t.locale),
	],
);

// ============================================================================
// PRODUCT IMAGES
// Stored in Supabase Storage at: product-images/[productId]/[filename]
// ============================================================================

export const productImages = createTable(
	"product_image",
	(d) => ({
		id: d.text().primaryKey().$defaultFn(() => crypto.randomUUID()),
		productId: d.text().notNull().references(() => products.id, { onDelete: "cascade" }),

		// Supabase Storage path
		storagePath: d.text().notNull(), // 'products/abc123/hero.jpg'
		storageUrl: d.text().notNull(), // Full Supabase public URL

		// Metadata
		altText: d.text(),
		width: d.integer(),
		height: d.integer(),
		fileSize: d.integer(), // bytes
		mimeType: d.text(), // 'image/jpeg', 'image/png', 'image/webp'

		// Display
		sortOrder: d.integer().default(0).notNull(),

		createdAt: d.timestamp({ withTimezone: true }).$defaultFn(() => new Date()).notNull(),
	}),
	(t) => [
		index("product_image_product_idx").on(t.productId),
	],
);

// ============================================================================
// RELATIONS
// ============================================================================

export const categoriesRelations = relations(categories, ({ one, many }) => ({
	parent: one(categories, {
		fields: [categories.parentId],
		references: [categories.id],
		relationName: "categoryHierarchy",
	}),
	children: many(categories, {
		relationName: "categoryHierarchy",
	}),
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
	featuredImage: one(productImages, {
		fields: [products.featuredImageId],
		references: [productImages.id],
	}),
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