// src/server/api/routers/newsletter.ts

import { z } from "zod";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "~/server/api/trpc";
import { emailSubscribers } from "~/server/db/schema/subscribers";
import { eq, desc, and, sql } from "drizzle-orm";
import { emailService } from "~/server/api/services/email-service";
import { TRPCError } from "@trpc/server";

// ============================================================================
// HELPERS
// ============================================================================

/**
 * Generate unique discount code for subscriber
 * Format: SUB10-{randomString}
 */
function generateDiscountCode(): string {
	const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Exclude confusing chars
	let code = 'SUB10-';
	for (let i = 0; i < 6; i++) {
		code += chars.charAt(Math.floor(Math.random() * chars.length));
	}
	return code;
}

/**
 * Generate confirmation token for double opt-in
 */
function generateConfirmationToken(): string {
	return crypto.randomUUID();
}

// ============================================================================
// ROUTER
// ============================================================================

export const newsletterRouter = createTRPCRouter({
	
	// ========================================================================
	// PUBLIC: Subscribe to newsletter
	// ========================================================================
	subscribe: publicProcedure
		.input(z.object({
			email: z.string().email(),
			firstName: z.string().optional(),
			lastName: z.string().optional(),
			locale: z.string().default('en'),
			source: z.string().default('website'), // 'website', 'checkout', 'popup'
		}))
		.mutation(async ({ ctx, input }) => {
			// 1. Check if already subscribed
			const existing = await ctx.db.query.emailSubscribers.findFirst({
				where: eq(emailSubscribers.email, input.email),
			});

			if (existing) {
				// Already subscribed - return existing discount code if not used
				if (existing.isActive && !existing.discountUsed) {
					return {
						success: true,
						alreadySubscribed: true,
						discountCode: existing.discountCode,
						message: 'You are already subscribed! Check your email for your discount code.',
					};
				}
				
				// Previously unsubscribed - reactivate
				if (!existing.isActive) {
					await ctx.db
						.update(emailSubscribers)
						.set({
							isActive: true,
							unsubscribedAt: null,
							unsubscribeReason: null,
							updatedAt: new Date(),
						})
						.where(eq(emailSubscribers.id, existing.id));

					return {
						success: true,
						discountCode: existing.discountCode,
						message: 'Welcome back! Your subscription has been reactivated.',
					};
				}

				// Discount already used
				return {
					success: true,
					alreadySubscribed: true,
					message: 'You are already subscribed!',
				};
			}

			// 2. Generate unique discount code
			let discountCode = generateDiscountCode();
			let attempts = 0;
			while (attempts < 5) {
				const codeExists = await ctx.db.query.emailSubscribers.findFirst({
					where: eq(emailSubscribers.discountCode, discountCode),
				});
				if (!codeExists) break;
				discountCode = generateDiscountCode();
				attempts++;
			}

			// 3. Create subscriber in database
			const confirmationToken = generateConfirmationToken();
			
			const [newSubscriber] = await ctx.db
				.insert(emailSubscribers)
				.values({
					email: input.email,
					firstName: input.firstName,
					lastName: input.lastName,
					locale: input.locale,
					source: input.source,
					discountCode,
					confirmationToken,
					subscriptionConfirmed: false, // Will be confirmed via email link
				})
				.returning();

			// 4. Subscribe to email service (Brevo/Resend)
			const emailResult = await emailService.subscribeToNewsletter({
				email: input.email,
				firstName: input.firstName,
				lastName: input.lastName,
				locale: input.locale,
			});

			// 5. Update with email service ID
			if (emailResult.success && emailResult.contactId) {
				await ctx.db
					.update(emailSubscribers)
					.set({
						brevoContactId: emailResult.contactId, // Or resendContactId based on provider
						lastSyncedAt: new Date(),
					})
					.where(eq(emailSubscribers.id, newSubscriber!.id));
			}

			// 6. TODO: Send welcome email with discount code
			// await sendWelcomeEmail({
			//   email: input.email,
			//   discountCode,
			//   confirmationToken,
			// });

			console.log('📧 New subscriber:', {
				email: input.email,
				discountCode,
				emailServiceResult: emailResult,
			});

			return {
				success: true,
				discountCode,
				message: 'Thanks for subscribing! Check your email for your 10% discount code.',
			};
		}),

	// ========================================================================
	// PUBLIC: Confirm subscription (double opt-in)
	// ========================================================================
	confirm: publicProcedure
		.input(z.object({
			token: z.string(),
		}))
		.mutation(async ({ ctx, input }) => {
			const subscriber = await ctx.db.query.emailSubscribers.findFirst({
				where: eq(emailSubscribers.confirmationToken, input.token),
			});

			if (!subscriber) {
				throw new TRPCError({
					code: 'NOT_FOUND',
					message: 'Invalid confirmation token',
				});
			}

			if (subscriber.subscriptionConfirmed) {
				return {
					success: true,
					message: 'Your subscription is already confirmed!',
				};
			}

			await ctx.db
				.update(emailSubscribers)
				.set({
					subscriptionConfirmed: true,
					confirmedAt: new Date(),
					updatedAt: new Date(),
				})
				.where(eq(emailSubscribers.id, subscriber.id));

			return {
				success: true,
				discountCode: subscriber.discountCode,
				message: 'Subscription confirmed! Your discount code is ready to use.',
			};
		}),

	// ========================================================================
	// PUBLIC: Check discount code validity
	// ========================================================================
	checkDiscount: publicProcedure
		.input(z.object({
			code: z.string(),
		}))
		.query(async ({ ctx, input }) => {
			const subscriber = await ctx.db.query.emailSubscribers.findFirst({
				where: and(
					eq(emailSubscribers.discountCode, input.code.toUpperCase()),
					eq(emailSubscribers.isActive, true),
				),
			});

			if (!subscriber) {
				return {
					valid: false,
					message: 'Invalid discount code',
				};
			}

			if (subscriber.discountUsed) {
				return {
					valid: false,
					message: 'This discount code has already been used',
				};
			}

			return {
				valid: true,
				discountPercent: 10, // Hardcoded for now - could be dynamic later
				message: '10% discount applied!',
			};
		}),

	// ========================================================================
	// PUBLIC: Unsubscribe
	// ========================================================================
	unsubscribe: publicProcedure
		.input(z.object({
			email: z.string().email(),
			reason: z.string().optional(),
		}))
		.mutation(async ({ ctx, input }) => {
			const subscriber = await ctx.db.query.emailSubscribers.findFirst({
				where: eq(emailSubscribers.email, input.email),
			});

			if (!subscriber) {
				throw new TRPCError({
					code: 'NOT_FOUND',
					message: 'Email not found',
				});
			}

			await ctx.db
				.update(emailSubscribers)
				.set({
					isActive: false,
					unsubscribedAt: new Date(),
					unsubscribeReason: input.reason,
					updatedAt: new Date(),
				})
				.where(eq(emailSubscribers.id, subscriber.id));

			return {
				success: true,
				message: 'You have been unsubscribed',
			};
		}),

	// ========================================================================
	// ADMIN: Get all subscribers
	// ========================================================================
	getAll: protectedProcedure
		.input(z.object({
			limit: z.number().min(1).max(100).default(50),
			offset: z.number().default(0),
			filter: z.enum(['all', 'active', 'inactive', 'confirmed', 'pending']).default('all'),
		}))
		.query(async ({ ctx, input }) => {
			// Only allow admins
			if (ctx.session.user.role !== 'admin') {
				throw new TRPCError({ code: 'UNAUTHORIZED' });
			}

			const filters = [];
			if (input.filter === 'active') filters.push(eq(emailSubscribers.isActive, true));
			if (input.filter === 'inactive') filters.push(eq(emailSubscribers.isActive, false));
			if (input.filter === 'confirmed') filters.push(eq(emailSubscribers.subscriptionConfirmed, true));
			if (input.filter === 'pending') filters.push(eq(emailSubscribers.subscriptionConfirmed, false));

			const subscribers = await ctx.db.query.emailSubscribers.findMany({
				where: filters.length > 0 ? and(...filters) : undefined,
				orderBy: [desc(emailSubscribers.createdAt)],
				limit: input.limit,
				offset: input.offset,
			});

			const total = await ctx.db
				.select({ count: sql<number>`count(*)` })
				.from(emailSubscribers)
				.where(filters.length > 0 ? and(...filters) : undefined);

			return {
				subscribers,
				total: total[0]?.count ?? 0,
			};
		}),

	// ========================================================================
	// ADMIN: Get stats
	// ========================================================================
	getStats: protectedProcedure
		.query(async ({ ctx }) => {
			if (ctx.session.user.role !== 'admin') {
				throw new TRPCError({ code: 'UNAUTHORIZED' });
			}

			const stats = await ctx.db
				.select({
					total: sql<number>`count(*)`,
					active: sql<number>`count(*) filter (where ${emailSubscribers.isActive} = true)`,
					confirmed: sql<number>`count(*) filter (where ${emailSubscribers.subscriptionConfirmed} = true)`,
					discountUsed: sql<number>`count(*) filter (where ${emailSubscribers.discountUsed} = true)`,
				})
				.from(emailSubscribers);

			return stats[0];
		}),
});