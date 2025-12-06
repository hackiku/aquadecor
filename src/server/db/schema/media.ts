// src/server/db/schema/media.ts
import { relations } from "drizzle-orm";
import type { InferSelectModel } from "drizzle-orm";
import { index, text, integer, timestamp, boolean } from "drizzle-orm/pg-core";
import { createTable } from "./_utils";
import { products, categories } from "./shop";

// ============================================================================
// MEDIA (Unified Gallery System)
// ============================================================================

export const media = createTable(
	"media",
	(d) => ({
		id: d.text().primaryKey().$defaultFn(() => crypto.randomUUID()),

		// PRIMARY URL: Currently old CDN, will be Supabase after migration
		storageUrl: d.text().notNull(),
		// Now: 'https://cdn.aquadecorbackgrounds.com/aquadecor-blob/z-1.webp'
		// Later: '<supabase>/storage/v1/object/public/products/z-1.webp'

		// Future Supabase path
		storagePath: d.text(), // 'products/z-1/hero.webp'

		// OLD CDN backup (for migration scripts - DELETE AFTER MIGRATION COMPLETE)
		legacyCdnUrl: d.text(),

		// Metadata
		altText: d.text(),
		width: d.integer(),
		height: d.integer(),
		fileSize: d.integer(),
		mimeType: d.text(),

		// Usage context
		usageType: d.text().notNull(),
		// 'product' | 'product-slider' | 'category' | 'marketing' | 'customer-setup'

		// Associations
		productId: d.text().references(() => products.id, { onDelete: "cascade" }),
		categoryId: d.text().references(() => categories.id, { onDelete: "cascade" }),

		// Display order
		sortOrder: d.integer().default(0).notNull(),

		// Tags
		tags: d.text().array().default([]),

		isActive: d.boolean().default(true).notNull(),
		createdAt: d.timestamp({ withTimezone: true }).$defaultFn(() => new Date()).notNull(),
	}),
	(t) => [
		index("media_product_idx").on(t.productId),
		index("media_category_idx").on(t.categoryId),
		index("media_usage_type_idx").on(t.usageType),
	],
);

export const mediaRelations = relations(media, ({ one }) => ({
	product: one(products, {
		fields: [media.productId],
		references: [products.id],
	}),
	category: one(categories, {
		fields: [media.categoryId],
		references: [categories.id],
	}),
}));

export type Media = InferSelectModel<typeof media>;