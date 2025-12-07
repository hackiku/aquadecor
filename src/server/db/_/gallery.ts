// src/server/db/schema/gallery.ts
import { relations } from "drizzle-orm";
import type { InferSelectModel } from "drizzle-orm";
import { index, text, integer, timestamp, boolean } from "drizzle-orm/pg-core";
import { createTable } from "./_utils";
import { productImages } from "./shop";

// ============================================================================
// GALLERY CATEGORIES
// Marketing images that can be used across shop, blog, social, etc.
// Different from product categories - these are for content organization
// Examples: "A Models - Classic Rocky Backgrounds", "Customer Setups", "Behind the Scenes"
// ============================================================================

export const galleryCategories = createTable(
	"gallery_category",
	(d) => ({
		id: d.text().primaryKey().$defaultFn(() => crypto.randomUUID()),
		slug: d.text().notNull().unique(), // 'a-models-classic', 'customer-setups'
		name: d.text().notNull(), // "A Models - Classic Rocky Backgrounds"
		description: d.text(), // Optional description for internal use

		// Display
		sortOrder: d.integer().default(0).notNull(),
		isActive: d.boolean().default(true).notNull(),

		// Usage context (where these images are typically used)
		usageContext: d.text(), // 'product', 'marketing', 'social', 'blog', etc.

		// Metadata
		createdAt: d.timestamp({ withTimezone: true }).$defaultFn(() => new Date()).notNull(),
		updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
	}),
	(t) => [
		index("gallery_category_slug_idx").on(t.slug),
		index("gallery_category_usage_idx").on(t.usageContext),
	],
);

// ============================================================================
// GALLERY IMAGES TO CATEGORIES (many-to-many)
// Images can belong to multiple categories and be used in multiple contexts
// ============================================================================

export const galleryImageCategories = createTable(
	"gallery_image_category",
	(d) => ({
		id: d.text().primaryKey().$defaultFn(() => crypto.randomUUID()),
		imageId: d.text().notNull().references(() => productImages.id, { onDelete: "cascade" }),
		categoryId: d.text().notNull().references(() => galleryCategories.id, { onDelete: "cascade" }),

		createdAt: d.timestamp({ withTimezone: true }).$defaultFn(() => new Date()).notNull(),
	}),
	(t) => [
		index("gallery_image_cat_image_idx").on(t.imageId),
		index("gallery_image_cat_category_idx").on(t.categoryId),
	],
);

// ============================================================================
// RELATIONS
// ============================================================================

export const galleryCategoriesRelations = relations(galleryCategories, ({ many }) => ({
	imageCategories: many(galleryImageCategories),
}));

export const galleryImageCategoriesRelations = relations(galleryImageCategories, ({ one }) => ({
	image: one(productImages, {
		fields: [galleryImageCategories.imageId],
		references: [productImages.id],
	}),
	category: one(galleryCategories, {
		fields: [galleryImageCategories.categoryId],
		references: [galleryCategories.id],
	}),
}));

// ============================================================================
// TYPES
// ============================================================================

export type GalleryCategory = InferSelectModel<typeof galleryCategories>;
export type GalleryImageCategory = InferSelectModel<typeof galleryImageCategories>;