// src/server/api/routers/account.ts
import { z } from "zod";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "~/server/api/trpc";
import { users, addresses, type User, type Address } from "~/server/db/schema";
import { eq, and } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import bcrypt from "bcryptjs";

// ---------------------------------------------------------
// Helper: Get Current User ID
// ---------------------------------------------------------
// Toggle between mock and real auth by changing this function
const getCurrentUserId = async (ctx: any): Promise<string> => {
	// PRODUCTION VERSION (uncomment when auth is ready):
	/*
	if (!ctx.session?.user?.id) {
		throw new TRPCError({ 
			code: "UNAUTHORIZED",
			message: "You must be logged in to access this resource" 
		});
	}
	return ctx.session.user.id;
	*/

	// DEV VERSION (using seed data):
	const user = await ctx.db.query.users.findFirst({
		where: (u, { eq }) => eq(u.email, "brankanemet15@gmail.com")
	});

	if (!user) {
		throw new TRPCError({
			code: "NOT_FOUND",
			message: "Mock user not found. Run seed first."
		});
	}

	return user.id;
};

// ---------------------------------------------------------
// Validation Schemas
// ---------------------------------------------------------
const addressSchema = z.object({
	label: z.string().min(1, "Label is required"),
	firstName: z.string().min(1, "First name is required"),
	lastName: z.string().min(1, "Last name is required"),
	company: z.string().optional(),
	streetAddress1: z.string().min(5, "Street address is required"),
	streetAddress2: z.string().optional(),
	city: z.string().min(1, "City is required"),
	state: z.string().optional(),
	postalCode: z.string().min(1, "Postal code is required"),
	countryCode: z.string().min(2, "Country is required"),
	phone: z.string().optional(),
	isDefault: z.boolean().default(false),
});

const profileSchema = z.object({
	name: z.string().min(1, "Name is required").optional(),
	phone: z.string().optional(),
});

const registerSchema = z.object({
	name: z.string().min(1, "Name is required"),
	email: z.string().email("Invalid email address"),
	password: z.string().min(8, "Password must be at least 8 characters"),
});

// ---------------------------------------------------------
// Account Router
// ---------------------------------------------------------
export const accountRouter = createTRPCRouter({

	// ========================================================================
	// REGISTRATION (Public - no auth needed)
	// ========================================================================

	register: publicProcedure
		.input(registerSchema)
		.mutation(async ({ ctx, input }): Promise<{ success: boolean; userId: string }> => {
			// Check if user already exists
			const existingUser = await ctx.db.query.users.findFirst({
				where: (u, { eq }) => eq(u.email, input.email.toLowerCase())
			});

			if (existingUser) {
				throw new TRPCError({
					code: "CONFLICT",
					message: "An account with this email already exists"
				});
			}

			// Hash password
			const hashedPassword = await bcrypt.hash(input.password, 10);

			// Create user
			const [newUser] = await ctx.db
				.insert(users)
				.values({
					name: input.name,
					email: input.email.toLowerCase(),
					role: "customer",
					// Note: We're not storing password here since NextAuth handles it
					// This is just for the database record
					// You'll need to handle password storage based on your auth provider
				})
				.returning();

			if (!newUser) {
				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: "Failed to create account"
				});
			}

			// TODO: Send verification email
			// TODO: Create session or return token for auto-login

			return {
				success: true,
				userId: newUser.id,
			};
		}),

	// ========================================================================
	// PROFILE MANAGEMENT
	// ========================================================================

	getProfile: publicProcedure.query(async ({ ctx }): Promise<User | null> => {
		const userId = await getCurrentUserId(ctx);

		const user = await ctx.db.query.users.findFirst({
			where: (u, { eq }) => eq(u.id, userId),
			columns: {
				id: true,
				name: true,
				email: true,
				image: true,
				phone: true,
				role: true,
			}
		});

		return user ?? null;
	}),

	updateProfile: publicProcedure
		.input(profileSchema)
		.mutation(async ({ ctx, input }) => {
			const userId = await getCurrentUserId(ctx);

			const [updated] = await ctx.db
				.update(users)
				.set({
					name: input.name,
					phone: input.phone,
				})
				.where(eq(users.id, userId))
				.returning();

			return updated;
		}),

	// ========================================================================
	// ADDRESS BOOK
	// ========================================================================

	address: createTRPCRouter({

		getAll: publicProcedure.query(async ({ ctx }): Promise<Address[]> => {
			const userId = await getCurrentUserId(ctx);

			return await ctx.db.query.addresses.findMany({
				where: (a, { eq }) => eq(a.userId, userId),
				orderBy: (a, { desc }) => [desc(a.isDefault), desc(a.createdAt)],
			});
		}),

		getById: publicProcedure
			.input(z.object({ id: z.string() }))
			.query(async ({ ctx, input }): Promise<Address | null> => {
				const userId = await getCurrentUserId(ctx);

				const address = await ctx.db.query.addresses.findFirst({
					where: (a, { eq, and }) => and(
						eq(a.id, input.id),
						eq(a.userId, userId)
					)
				});

				return address ?? null;
			}),

		create: publicProcedure
			.input(addressSchema)
			.mutation(async ({ ctx, input }): Promise<Address> => {
				const userId = await getCurrentUserId(ctx);

				return await ctx.db.transaction(async (tx) => {
					// If setting as default, unset others first
					if (input.isDefault) {
						await tx.update(addresses)
							.set({ isDefault: false })
							.where(eq(addresses.userId, userId));
					}

					// Check if this is the FIRST address, make it default automatically
					const existingCount = await tx.query.addresses.findMany({
						where: (a, { eq }) => eq(a.userId, userId),
					});

					const shouldBeDefault = input.isDefault || existingCount.length === 0;

					const [newAddress] = await tx.insert(addresses).values({
						userId,
						...input,
						isDefault: shouldBeDefault,
					}).returning();

					if (!newAddress) {
						throw new TRPCError({
							code: "INTERNAL_SERVER_ERROR",
							message: "Failed to create address"
						});
					}

					return newAddress;
				});
			}),

		update: publicProcedure
			.input(addressSchema.extend({ id: z.string() }))
			.mutation(async ({ ctx, input }): Promise<Address> => {
				const userId = await getCurrentUserId(ctx);
				const { id, ...data } = input;

				// Ensure user owns this address
				const existing = await ctx.db.query.addresses.findFirst({
					where: (a, { eq, and }) => and(eq(a.id, id), eq(a.userId, userId))
				});

				if (!existing) {
					throw new TRPCError({
						code: "NOT_FOUND",
						message: "Address not found or you don't have permission to edit it"
					});
				}

				return await ctx.db.transaction(async (tx) => {
					if (data.isDefault) {
						await tx.update(addresses)
							.set({ isDefault: false })
							.where(eq(addresses.userId, userId));
					}

					const [updated] = await tx.update(addresses)
						.set(data)
						.where(eq(addresses.id, id))
						.returning();

					if (!updated) {
						throw new TRPCError({
							code: "INTERNAL_SERVER_ERROR",
							message: "Failed to update address"
						});
					}

					return updated;
				});
			}),

		delete: publicProcedure
			.input(z.object({ id: z.string() }))
			.mutation(async ({ ctx, input }) => {
				const userId = await getCurrentUserId(ctx);

				// Check ownership
				const existing = await ctx.db.query.addresses.findFirst({
					where: (a, { eq, and }) => and(eq(a.id, input.id), eq(a.userId, userId))
				});

				if (!existing) {
					throw new TRPCError({
						code: "NOT_FOUND",
						message: "Address not found or you don't have permission to delete it"
					});
				}

				await ctx.db.delete(addresses).where(eq(addresses.id, input.id));
				return { success: true };
			}),

		setDefault: publicProcedure
			.input(z.object({ id: z.string() }))
			.mutation(async ({ ctx, input }) => {
				const userId = await getCurrentUserId(ctx);

				// Verify ownership
				const existing = await ctx.db.query.addresses.findFirst({
					where: (a, { eq, and }) => and(eq(a.id, input.id), eq(a.userId, userId))
				});

				if (!existing) {
					throw new TRPCError({
						code: "NOT_FOUND",
						message: "Address not found"
					});
				}

				return await ctx.db.transaction(async (tx) => {
					// Unset all
					await tx.update(addresses)
						.set({ isDefault: false })
						.where(eq(addresses.userId, userId));

					// Set target
					const [updated] = await tx.update(addresses)
						.set({ isDefault: true })
						.where(eq(addresses.id, input.id))
						.returning();

					return updated;
				});
			}),
	}),
});