// src/server/db/schema/faq.ts
import { relations } from "drizzle-orm";
import { index, text, integer, timestamp, boolean } from "drizzle-orm/pg-core";
import { createTable } from "./_utils";

// ============================================================================
// FAQS
// Frequently asked questions with multi-language support
// ============================================================================

export const faqs = createTable(
	"faq",
	(d) => ({
		id: d.text().primaryKey().$defaultFn(() => crypto.randomUUID()),

		// Region targeting (can be expanded later)
		region: d.text().notNull(), // "ROW" (Rest of World) or "US"

		// Display
		category: d.text(), // Optional grouping: "shipping", "orders", "products", etc.
		sortOrder: d.integer().default(0).notNull(),
		isActive: d.boolean().default(true).notNull(),

		// Timestamps
		createdAt: d.timestamp({ withTimezone: true }).$defaultFn(() => new Date()).notNull(),
		updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
	}),
	(t) => [
		index("faq_region_idx").on(t.region),
		index("faq_category_idx").on(t.category),
		index("faq_sort_idx").on(t.sortOrder),
		index("faq_active_idx").on(t.isActive),
	],
);

// ============================================================================
// FAQ TRANSLATIONS
// Questions and answers in multiple languages
// ============================================================================

export const faqTranslations = createTable(
	"faq_translation",
	(d) => ({
		id: d.text().primaryKey().$defaultFn(() => crypto.randomUUID()),
		faqId: d.text().notNull().references(() => faqs.id, { onDelete: "cascade" }),
		locale: d.text().notNull(), // "en", "de", "pl", "cs", etc.

		question: d.text().notNull(),
		answer: d.text().notNull(),

		createdAt: d.timestamp({ withTimezone: true }).$defaultFn(() => new Date()).notNull(),
	}),
	(t) => [
		index("faq_translation_faq_idx").on(t.faqId),
		index("faq_translation_locale_idx").on(t.locale),
	],
);

// ============================================================================
// RELATIONS
// ============================================================================

export const faqsRelations = relations(faqs, ({ many }) => ({
	translations: many(faqTranslations),
}));

export const faqTranslationsRelations = relations(faqTranslations, ({ one }) => ({
	faq: one(faqs, {
		fields: [faqTranslations.faqId],
		references: [faqs.id],
	}),
}));