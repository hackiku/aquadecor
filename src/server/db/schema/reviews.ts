// Add to shop.ts or create reviews.ts
import { relations } from "drizzle-orm";
import { createTable } from "./_utils";
import { products } from "./shop";
import { index } from "drizzle-orm/pg-core";

// Reviews
export const reviews = createTable(
	"review",
	(d) => ({
		id: d.text().primaryKey().$defaultFn(() => crypto.randomUUID()),
		productId: d.text().notNull().references(() => products.id),
		userId: d.text(), // Nullable for imported reviews

		// Content
		rating: d.integer().notNull(), // 1-5
		title: d.text(),
		content: d.text().notNull(),

		// Attribution
		authorName: d.text().notNull(), // "Kevin 'fishbubbles'"
		authorLocation: d.text(), // "Florida"
		verifiedPurchase: d.boolean().default(false),

		// Source
		source: d.text(), // "youtube", "forum", "facebook", "email"
		sourceUrl: d.text(), // Link to original

		// Status
		isFeatured: d.boolean().default(false),
		isApproved: d.boolean().default(false),

		createdAt: d.timestamp({ withTimezone: true }).$defaultFn(() => new Date()).notNull(),
	}),
	(t) => [
		index("review_product_idx").on(t.productId),
		index("review_featured_idx").on(t.isFeatured),
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
);

// Social proof sources
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

		isActive: d.boolean().default(true),
		createdAt: d.timestamp({ withTimezone: true }).$defaultFn(() => new Date()).notNull(),
	}),
);