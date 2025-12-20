// src/server/db/schema/subscribers.ts
import { relations, type InferSelectModel } from "drizzle-orm";
import { index, text, boolean, timestamp, integer } from "drizzle-orm/pg-core";
import { createTable } from "./_utils";
import { orders } from "./orders";

// ============================================================================
// EMAIL SUBSCRIBERS
// People who subscribe to newsletter get 10% off first order
// ============================================================================

export const emailSubscribers = createTable(
	"email_subscriber",
	(d) => ({
		id: d.text().primaryKey().$defaultFn(() => crypto.randomUUID()),

		// Contact
		email: d.text().notNull().unique(),

		// Optional if they provide it later
		firstName: d.text(),
		lastName: d.text(),

		// Subscription details
		source: d.text().default('website').notNull(), // 'website', 'checkout', 'admin'
		locale: d.text().default('en').notNull(), // For targeted campaigns

		// Discount tracking
		discountCode: d.text().unique(), // Auto-generated: "SUB10-{shortId}"
		discountUsed: d.boolean().default(false).notNull(),
		discountUsedAt: d.timestamp({ withTimezone: true }),

		// Engagement tracking
		subscriptionConfirmed: d.boolean().default(false).notNull(),
		confirmationToken: d.text().unique(), // For double opt-in
		confirmedAt: d.timestamp({ withTimezone: true }),

		// Email service sync
		brevoContactId: d.text(), // Brevo/Sendinblue contact ID
		resendContactId: d.text(), // Resend contact ID (if we switch)
		lastSyncedAt: d.timestamp({ withTimezone: true }),

		// Status
		isActive: d.boolean().default(true).notNull(),
		unsubscribedAt: d.timestamp({ withTimezone: true }),
		unsubscribeReason: d.text(),

		// Stats
		emailsSent: d.integer().default(0).notNull(),
		emailsOpened: d.integer().default(0).notNull(),
		emailsClicked: d.integer().default(0).notNull(),

		// Timestamps
		createdAt: d.timestamp({ withTimezone: true }).$defaultFn(() => new Date()).notNull(),
		updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
	}),
	(t) => [
		index("subscriber_email_idx").on(t.email),
		index("subscriber_code_idx").on(t.discountCode),
		index("subscriber_active_idx").on(t.isActive),
		index("subscriber_confirmed_idx").on(t.subscriptionConfirmed),
	],
);

// ============================================================================
// RELATIONS
// ============================================================================

export const emailSubscribersRelations = relations(emailSubscribers, ({ many }) => ({
	orders: many(orders), // Track orders using subscriber discount
}));

// ============================================================================
// TYPES
// ============================================================================

export type EmailSubscriber = InferSelectModel<typeof emailSubscribers>;

// For public signup forms
export type SubscriberInput = Pick<EmailSubscriber,
	| 'email'
	| 'firstName'
	| 'lastName'
	| 'source'
	| 'locale'
>;

// For admin dashboard
export type SubscriberWithStats = EmailSubscriber & {
	orderCount?: number;
	totalSpent?: number;
};