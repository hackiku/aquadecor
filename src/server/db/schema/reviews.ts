// src/server/db/schema/reviews.ts
import { relations } from "drizzle-orm";
import { createTable } from "./_utils";
import { products } from "./shop";
import { index } from "drizzle-orm/pg-core";

// Reviews
export const reviews = createTable(
	"review",
	(d) => ({
		id: d.text().primaryKey().$defaultFn(() => crypto.randomUUID()),
		productId: d.text().references(() => products.id), // NULLABLE for general reviews
		userId: d.text(), // Nullable for imported reviews

		// Content
		rating: d.integer().notNull(), // 1-5
		title: d.text(),
		content: d.text().notNull(),

		// Attribution
		authorName: d.text().notNull(), // "Kevin 'fishbubbles'"
		authorLocation: d.text(), // "Florida"
		verifiedPurchase: d.boolean().default(false).notNull(),

		// Source
		source: d.text(), // "youtube", "forum", "facebook", "email", "reddit"
		sourceUrl: d.text(), // Link to original

		// Status
		isFeatured: d.boolean().default(false).notNull(),
		isApproved: d.boolean().default(false).notNull(),

		createdAt: d.timestamp({ withTimezone: true }).$defaultFn(() => new Date()).notNull(),
	}),
	(t) => [
		index("review_product_idx").on(t.productId),
		index("review_featured_idx").on(t.isFeatured),
		index("review_approved_idx").on(t.isApproved),
	],
);

// Review media (photos/videos)
export const reviewMedia = createTable(
	"review_media",
	(d) => ({
		id: d.text().primaryKey().$defaultFn(() => crypto.randomUUID()),
		reviewId: d.text().notNull().references(() => reviews.id, { onDelete: "cascade" }),

		type: d.text().notNull(), // "image", "video"
		storageUrl: d.text().notNull(),
		thumbnailUrl: d.text(),

		sortOrder: d.integer().default(0).notNull(),
		createdAt: d.timestamp({ withTimezone: true }).$defaultFn(() => new Date()).notNull(),
	}),
	(t) => [
		index("review_media_review_idx").on(t.reviewId),
	],
);

// Social proof sources (for tracking platforms)
export const socialProofSources = createTable(
	"social_proof_source",
	(d) => ({
		id: d.text().primaryKey().$defaultFn(() => crypto.randomUUID()),

		platform: d.text().notNull(), // "youtube", "forum", "facebook"
		name: d.text().notNull(), // "King of DIY", "Simply Discus Forum"
		url: d.text().notNull(),

		// Metadata
		followerCount: d.integer(),
		description: d.text(),

		isActive: d.boolean().default(true).notNull(),
		createdAt: d.timestamp({ withTimezone: true }).$defaultFn(() => new Date()).notNull(),
	}),
);

// ============================================================================
// RELATIONS
// ============================================================================

export const reviewsRelations = relations(reviews, ({ one, many }) => ({
	product: one(products, {
		fields: [reviews.productId],
		references: [products.id],
	}),
	media: many(reviewMedia),
}));

export const reviewMediaRelations = relations(reviewMedia, ({ one }) => ({
	review: one(reviews, {
		fields: [reviewMedia.reviewId],
		references: [reviews.id],
	}),
}));