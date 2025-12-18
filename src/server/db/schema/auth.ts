// src/server/db/schema/auth.ts
import { relations } from "drizzle-orm";
import { index, primaryKey, boolean, text, timestamp } from "drizzle-orm/pg-core";
import type { InferSelectModel } from "drizzle-orm";
import type { AdapterAccount } from "next-auth/adapters";
import { createTable } from "./_utils";
import { countries } from "./countries"; 

// ============================================================================
// USERS (Extended T3 Model)
// ============================================================================

export const users = createTable("user", (d) => ({
	id: d.varchar({ length: 255 }).notNull().primaryKey().$defaultFn(() => crypto.randomUUID()),
	name: d.varchar({ length: 255 }),
	email: d.varchar({ length: 255 }).notNull(),
	emailVerified: d.timestamp({ mode: "date", withTimezone: true }).$defaultFn(() => new Date()),
	image: d.varchar({ length: 255 }),

	// ADD THIS:
	password: d.text(), // Nullable - OAuth users won't have password

	role: d.text().default("customer").notNull(), // "admin" | "customer" | "promoter"
	phone: d.text(),
	createdAt: d.timestamp({ withTimezone: true }).$defaultFn(() => new Date()).notNull(),
}));

export const usersRelations = relations(users, ({ many }) => ({
	accounts: many(accounts),
	sessions: many(sessions),
	addresses: many(addresses),
}));

// ============================================================================
// ADDRESSES (New)
// ============================================================================

export const addresses = createTable(
	"address",
	(d) => ({
		id: d.text().primaryKey().$defaultFn(() => crypto.randomUUID()),
		userId: d.varchar({ length: 255 }).notNull().references(() => users.id, { onDelete: "cascade" }),

		// Type
		type: d.text().default("shipping").notNull(), // 'shipping' | 'billing'
		isDefault: d.boolean().default(false).notNull(),
		label: d.text(), // "Home", "Office"

		// Contact
		firstName: d.text().notNull(),
		lastName: d.text().notNull(),
		company: d.text(),
		phone: d.text(),

		// Location
		streetAddress1: d.text().notNull(),
		streetAddress2: d.text(),
		city: d.text().notNull(),
		state: d.text(),
		postalCode: d.text().notNull(),

		// Country Link (FK to your countries table for validation/zones)
		countryCode: d.text().notNull(), // 'US', 'DE' - referencing countries.iso2 ideally

		createdAt: d.timestamp({ withTimezone: true }).$defaultFn(() => new Date()).notNull(),
		updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
	}),
	(t) => [
		index("address_user_id_idx").on(t.userId),
	]
);

export const addressesRelations = relations(addresses, ({ one }) => ({
	user: one(users, {
		fields: [addresses.userId],
		references: [users.id],
	}),
}));

// ============================================================================
// T3 NEXTAUTH TABLES (Unchanged)
// ============================================================================

export const accounts = createTable(
	"account",
	(d) => ({
		userId: d
			.varchar({ length: 255 })
			.notNull()
			.references(() => users.id),
		type: d.varchar({ length: 255 }).$type<AdapterAccount["type"]>().notNull(),
		provider: d.varchar({ length: 255 }).notNull(),
		providerAccountId: d.varchar({ length: 255 }).notNull(),
		refresh_token: d.text(),
		access_token: d.text(),
		expires_at: d.integer(),
		token_type: d.varchar({ length: 255 }),
		scope: d.varchar({ length: 255 }),
		id_token: d.text(),
		session_state: d.varchar({ length: 255 }),
	}),
	(t) => [
		primaryKey({ columns: [t.provider, t.providerAccountId] }),
		index("account_user_id_idx").on(t.userId),
	],
);

export const verificationTokens = createTable(
	"verification_token",
	(d) => ({
		identifier: d.varchar({ length: 255 }).notNull(),
		token: d.varchar({ length: 255 }).notNull(),
		expires: d.timestamp({ mode: "date", withTimezone: true }).notNull(),
	}),
	(t) => [primaryKey({ columns: [t.identifier, t.token] })],
);

// ============================================================================
// PASSWORD RESET
// ============================================================================
export const passwordResets = createTable(
	"password_reset",
	(d) => ({
		id: d.text().primaryKey().$defaultFn(() => crypto.randomUUID()),
		userId: d.varchar({ length: 255 }).notNull().references(() => users.id, { onDelete: "cascade" }),
		token: d.text().notNull().unique(), // Hashed token
		expires: d.timestamp({ withTimezone: true }).notNull(),
		createdAt: d.timestamp({ withTimezone: true }).$defaultFn(() => new Date()).notNull(),
	}),
	(t) => [
		index("password_reset_token_idx").on(t.token),
		index("password_reset_user_idx").on(t.userId),
	]
);

// ============================================================================
// RELATIONS
// ============================================================================

export const accountsRelations = relations(accounts, ({ one }) => ({
	user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const sessions = createTable(
	"session",
	(d) => ({
		sessionToken: d.varchar({ length: 255 }).notNull().primaryKey(),
		userId: d
			.varchar({ length: 255 })
			.notNull()
			.references(() => users.id),
		expires: d.timestamp({ mode: "date", withTimezone: true }).notNull(),
	}),
	(t) => [index("session_user_id_idx").on(t.userId)],
);

export const sessionsRelations = relations(sessions, ({ one }) => ({
	user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));


export const passwordResetsRelations = relations(passwordResets, ({ one }) => ({
	user: one(users, {
		fields: [passwordResets.userId],
		references: [users.id],
	}),
}));


export type User = InferSelectModel<typeof users>;
export type Address = InferSelectModel<typeof addresses>;
export type Account = InferSelectModel<typeof accounts>;
export type Session = InferSelectModel<typeof sessions>;

// Commonly used joined types for components
export type UserProfile = Pick<User,
	| 'id'
	| 'name'
	| 'email'
	| 'image'
	| 'phone'
	| 'role'
>;

// For address forms/cards - exactly what EditAddress needs
export type AddressFormData = Pick<Address,
	| 'label'
	| 'firstName'
	| 'lastName'
	| 'company'
	| 'streetAddress1'
	| 'streetAddress2'
	| 'city'
	| 'state'
	| 'postalCode'
	| 'countryCode'
	| 'phone'
	| 'isDefault'
>;

// For address display - includes ID for editing
export type AddressWithId = AddressFormData & Pick<Address, 'id'>;

// For account overview - user with address count
export type UserWithStats = UserProfile & {
	addressCount?: number;
	defaultAddress?: Address | null;
};

export type PasswordReset = InferSelectModel<typeof passwordResets>;