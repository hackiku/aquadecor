// src/server/auth/config.ts
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import type { DefaultSession, NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "~/server/db";
import { users, accounts, sessions, verificationTokens } from "~/server/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs"; // bun add bcryptjs

declare module "next-auth" {
	interface Session extends DefaultSession {
		user: {
			id: string;
			role: string;
		} & DefaultSession["user"];
	}
}

export const authConfig = {
	providers: [
		CredentialsProvider({
			name: "Email",
			credentials: {
				email: { label: "Email", type: "email" },
				password: { label: "Password", type: "password" }
			},
			async authorize(credentials) {
				if (!credentials?.email || !credentials?.password) return null;

				// Find user
				const user = await db.query.users.findFirst({
					where: eq(users.email, credentials.email as string),
				});

				if (!user) return null;

				// For now, just accept any password (DEV ONLY!)
				// Later: const validPassword = await bcrypt.compare(credentials.password, user.password);

				return {
					id: user.id,
					email: user.email,
					name: user.name,
					role: user.role,
				};
			}
		})
	],
	adapter: DrizzleAdapter(db, {
		usersTable: users,
		accountsTable: accounts,
		sessionsTable: sessions,
		verificationTokensTable: verificationTokens,
	}),
	session: {
		strategy: "jwt", // Use JWT for credentials provider
	},
	callbacks: {
		session: ({ session, token }) => ({
			...session,
			user: {
				...session.user,
				id: token.sub!,
				role: token.role as string,
			},
		}),
		jwt: ({ token, user }) => {
			if (user) {
				token.role = (user as any).role;
			}
			return token;
		},
	},
	pages: {
		signIn: '/login',
	},
	debug: true,
} satisfies NextAuthConfig;