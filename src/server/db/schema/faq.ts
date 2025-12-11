// src/server/db/schema/faq.ts

import { relations } from "drizzle-orm";
import type { InferSelectModel } from "drizzle-orm";
import { index, text, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createTable } from "./_utils"; // Assuming you have this helper from shop.ts

// ============================================================================
// FAQ CATEGORIES (New)
// ============================================================================

export const faqCategories = createTable(
	"faq_category",
	(d) => ({
		id: d.text().primaryKey().$defaultFn(() => crypto.randomUUID()),
		slug: d.text().unique().notNull(), // e.g., 'shipping', 'payment'
		icon: d.text(), // lucide icon name
		sortOrder: d.integer().default(0).notNull(),
		isActive: d.boolean().default(true).notNull(),
		createdAt: d.timestamp({ withTimezone: true }).$defaultFn(() => new Date()).notNull(),
		updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
	}),
	(t) => [
		index("faq_category_sort_idx").on(t.sortOrder),
	]
);

export const faqCategoryTranslations = createTable(
	"faq_category_translation",
	(d) => ({
		id: d.text().primaryKey().$defaultFn(() => crypto.randomUUID()),
		categoryId: d.text().notNull().references(() => faqCategories.id, { onDelete: "cascade" }),
		locale: d.text().notNull().default("en"),
		name: d.text().notNull(), // "Shipping" vs "Versand"
		createdAt: d.timestamp({ withTimezone: true }).$defaultFn(() => new Date()).notNull(),
	}),
	(t) => [
		index("faq_cat_trans_cat_idx").on(t.categoryId),
		index("faq_cat_trans_locale_idx").on(t.locale),
	]
);

// ============================================================================
// FAQS (Updated)
// ============================================================================

export const faqs = createTable(
	"faq",
	(d) => ({
		id: d.text().primaryKey().$defaultFn(() => crypto.randomUUID()),
		// Link to new category table
		categoryId: d.text().references(() => faqCategories.id, { onDelete: "set null" }),

		region: d.text().notNull().default("ROW"), // 'ROW' | 'US'
		sortOrder: d.integer().default(0).notNull(),
		isActive: d.boolean().default(true).notNull(),
		createdAt: d.timestamp({ withTimezone: true }).$defaultFn(() => new Date()).notNull(),
		updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
	}),
	(t) => [
		index("faq_region_idx").on(t.region),
		index("faq_category_idx").on(t.categoryId),
	]
);

export const faqTranslations = createTable(
	"faq_translation",
	(d) => ({
		id: d.text().primaryKey().$defaultFn(() => crypto.randomUUID()),
		faqId: d.text().notNull().references(() => faqs.id, { onDelete: "cascade" }),
		locale: d.text().notNull().default("en"),
		question: d.text().notNull(),
		answer: d.text().notNull(),
		createdAt: d.timestamp({ withTimezone: true }).$defaultFn(() => new Date()).notNull(),
		updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
	}),
	(t) => [
		index("faq_trans_faq_idx").on(t.faqId),
		index("faq_trans_locale_idx").on(t.locale),
	]
);

// ============================================================================
// RELATIONS
// ============================================================================

export const faqCategoriesRelations = relations(faqCategories, ({ many }) => ({
	translations: many(faqCategoryTranslations),
	faqs: many(faqs),
}));

export const faqCategoryTranslationsRelations = relations(faqCategoryTranslations, ({ one }) => ({
	category: one(faqCategories, {
		fields: [faqCategoryTranslations.categoryId],
		references: [faqCategories.id],
	}),
}));

export const faqsRelations = relations(faqs, ({ one, many }) => ({
	category: one(faqCategories, {
		fields: [faqs.categoryId],
		references: [faqCategories.id],
	}),
	translations: many(faqTranslations),
}));

export const faqTranslationsRelations = relations(faqTranslations, ({ one }) => ({
	faq: one(faqs, {
		fields: [faqTranslations.faqId],
		references: [faqs.id],
	}),
}));

export type FaqItem = InferSelectModel<typeof faqs>;
export type FaqCategory = InferSelectModel<typeof faqCategories>;
export type FaqTranslation = InferSelectModel<typeof faqTranslations>;