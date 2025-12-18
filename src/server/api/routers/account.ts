// src/server/api/routers/account.ts
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { users, addresses, type Address, type UserProfile } from "~/server/db/schema";
import { eq, and } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

// ============================================================================
// Validation Schemas
// ============================================================================

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

// ============================================================================
// Account Router - All Protected (Must be logged in)
// ============================================================================

export const accountRouter = createTRPCRouter({

	// ========================================================================
	// PROFILE MANAGEMENT
	// ========================================================================

	getProfile: protectedProcedure.query(async ({ ctx }): Promise<UserProfile | null> => {
		const userId = ctx.session.user.id; // Guaranteed to exist

		const user = await ctx.db.query.users.findFirst({
			where: eq(users.id, userId),
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

	updateProfile: protectedProcedure
		.input(profileSchema)
		.mutation(async ({ ctx, input }): Promise<UserProfile> => {
			const userId = ctx.session.user.id;

			const [updated] = await ctx.db
				.update(users)
				.set({
					name: input.name,
					phone: input.phone,
				})
				.where(eq(users.id, userId))
				.returning({
					id: users.id,
					name: users.name,
					email: users.email,
					image: users.image,
					phone: users.phone,
					role: users.role,
				});

			if (!updated) {
				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: "Failed to update profile"
				});
			}

			return updated;
		}),

	// ========================================================================
	// ADDRESS BOOK
	// ========================================================================

	address: createTRPCRouter({

		getAll: protectedProcedure.query(async ({ ctx }): Promise<Address[]> => {
			const userId = ctx.session.user.id;

			return await ctx.db.query.addresses.findMany({
				where: eq(addresses.userId, userId),
				orderBy: (a, { desc }) => [desc(a.isDefault), desc(a.createdAt)],
			});
		}),

		getById: protectedProcedure
			.input(z.object({ id: z.string() }))
			.query(async ({ ctx, input }): Promise<Address | null> => {
				const userId = ctx.session.user.id;

				const address = await ctx.db.query.addresses.findFirst({
					where: and(
						eq(addresses.id, input.id),
						eq(addresses.userId, userId)
					)
				});

				return address ?? null;
			}),

		create: protectedProcedure
			.input(addressSchema)
			.mutation(async ({ ctx, input }): Promise<Address> => {
				const userId = ctx.session.user.id;

				return await ctx.db.transaction(async (tx) => {
					// If setting as default, unset others first
					if (input.isDefault) {
						await tx.update(addresses)
							.set({ isDefault: false })
							.where(eq(addresses.userId, userId));
					}

					// Check if this is the FIRST address, make it default automatically
					const existingCount = await tx.query.addresses.findMany({
						where: eq(addresses.userId, userId),
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

		update: protectedProcedure
			.input(addressSchema.extend({ id: z.string() }))
			.mutation(async ({ ctx, input }): Promise<Address> => {
				const userId = ctx.session.user.id;
				const { id, ...data } = input;

				// Ensure user owns this address
				const existing = await ctx.db.query.addresses.findFirst({
					where: and(eq(addresses.id, id), eq(addresses.userId, userId))
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

		delete: protectedProcedure
			.input(z.object({ id: z.string() }))
			.mutation(async ({ ctx, input }) => {
				const userId = ctx.session.user.id;

				// Check ownership
				const existing = await ctx.db.query.addresses.findFirst({
					where: and(eq(addresses.id, input.id), eq(addresses.userId, userId))
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

		setDefault: protectedProcedure
			.input(z.object({ id: z.string() }))
			.mutation(async ({ ctx, input }): Promise<Address> => {
				const userId = ctx.session.user.id;

				// Verify ownership
				const existing = await ctx.db.query.addresses.findFirst({
					where: and(eq(addresses.id, input.id), eq(addresses.userId, userId))
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

					if (!updated) {
						throw new TRPCError({
							code: "INTERNAL_SERVER_ERROR",
							message: "Failed to set default address"
						});
					}

					return updated;
				});
			}),
	}),

	// ========================================================================
	// ORDER HISTORY (Protected)
	// ========================================================================

	orders: createTRPCRouter({
		getAll: protectedProcedure.query(async ({ ctx }) => {
			const userEmail = ctx.session.user.email;

			// TODO: Add userId FK to orders table, then use:
			// const userId = ctx.session.user.id;
			// const orders = await ctx.db.query.orders.findMany({
			// 	where: eq(orders.userId, userId),
			// 	orderBy: desc(orders.createdAt)
			// });

			// For now, query by email
			const { orders } = await import("~/server/db/schema");
			const { desc, eq } = await import("drizzle-orm");

			return await ctx.db.query.orders.findMany({
				where: eq(orders.email, userEmail ?? ""),
				orderBy: (o, { desc }) => [desc(o.createdAt)],
				with: {
					items: true,
				},
			});
		}),

		getById: protectedProcedure
			.input(z.object({ id: z.string() }))
			.query(async ({ ctx, input }) => {
				const userEmail = ctx.session.user.email;
				const { orders } = await import("~/server/db/schema");
				const { eq, and } = await import("drizzle-orm");

				const order = await ctx.db.query.orders.findFirst({
					where: and(
						eq(orders.id, input.id),
						eq(orders.email, userEmail ?? "")
					),
					with: {
						items: true,
					},
				});

				if (!order) {
					throw new TRPCError({
						code: "NOT_FOUND",
						message: "Order not found"
					});
				}

				return order;
			}),
	}),

	// ========================================================================
	// WISHLIST (Protected) - TODO: Implement when schema is ready
	// ========================================================================

	wishlist: createTRPCRouter({
		getAll: protectedProcedure.query(async ({ ctx }) => {
			// TODO: Implement when wishlist table exists
			throw new TRPCError({
				code: "NOT_IMPLEMENTED",
				message: "Wishlist not yet implemented"
			});
		}),

		add: protectedProcedure
			.input(z.object({ productId: z.string() }))
			.mutation(async ({ ctx, input }) => {
				// TODO: Implement
				throw new TRPCError({
					code: "NOT_IMPLEMENTED",
					message: "Wishlist not yet implemented"
				});
			}),

		remove: protectedProcedure
			.input(z.object({ productId: z.string() }))
			.mutation(async ({ ctx, input }) => {
				// TODO: Implement
				throw new TRPCError({
					code: "NOT_IMPLEMENTED",
					message: "Wishlist not yet implemented"
				});
			}),
	}),
});