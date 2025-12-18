// src/server/api/routers/auth.ts
import { z } from "zod";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "~/server/api/trpc";
import { users, passwordResets } from "~/server/db/schema";
import { eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import bcrypt from "bcryptjs";
import crypto from "crypto";

// TODO: Import your email service (Brevo/Resend/etc)
// import { sendEmail } from "~/lib/email";

// ============================================================================
// Validation Schemas
// ============================================================================

const registerSchema = z.object({
	name: z.string().min(1, "Name is required"),
	email: z.string().email("Invalid email address"),
	password: z.string().min(8, "Password must be at least 8 characters"),
});

const forgotPasswordSchema = z.object({
	email: z.string().email("Invalid email address"),
});

const resetPasswordSchema = z.object({
	token: z.string(),
	password: z.string().min(8, "Password must be at least 8 characters"),
});

const changePasswordSchema = z.object({
	currentPassword: z.string(),
	newPassword: z.string().min(8, "Password must be at least 8 characters"),
});

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Generate a secure random token for password resets
 */
function generateResetToken(): string {
	return crypto.randomBytes(32).toString("hex");
}

/**
 * Hash a reset token for storage (prevents token theft from DB)
 */
function hashToken(token: string): string {
	return crypto.createHash("sha256").update(token).digest("hex");
}

// ============================================================================
// Auth Router
// ============================================================================

export const authRouter = createTRPCRouter({

	// ========================================================================
	// REGISTRATION (Public)
	// ========================================================================

	register: publicProcedure
		.input(registerSchema)
		.mutation(async ({ ctx, input }) => {
			// Check if user already exists
			const existingUser = await ctx.db.query.users.findFirst({
				where: eq(users.email, input.email.toLowerCase())
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
					password: hashedPassword, // Add this field to your schema
					role: "customer",
					emailVerified: null, // Will be set after email verification
				})
				.returning();

			if (!newUser) {
				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: "Failed to create account"
				});
			}

			// TODO: Send welcome/verification email
			// await sendEmail({
			// 	to: newUser.email,
			// 	template: "welcome",
			// 	data: { name: newUser.name }
			// });

			return {
				success: true,
				userId: newUser.id,
				message: "Account created successfully"
			};
		}),

	// ========================================================================
	// FORGOT PASSWORD (Public)
	// ========================================================================

	forgotPassword: publicProcedure
		.input(forgotPasswordSchema)
		.mutation(async ({ ctx, input }) => {
			// Find user
			const user = await ctx.db.query.users.findFirst({
				where: eq(users.email, input.email.toLowerCase())
			});

			// Always return success to prevent email enumeration
			if (!user) {
				return {
					success: true,
					message: "If an account exists, a reset link has been sent"
				};
			}

			// Generate token
			const token = generateResetToken();
			const hashedToken = hashToken(token);
			const expires = new Date(Date.now() + 3600000); // 1 hour

			// Store reset token
			await ctx.db.insert(passwordResets).values({
				userId: user.id,
				token: hashedToken,
				expires,
			});

			// Send email with plain token (not hashed)
			const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${token}`;

			// TODO: Send password reset email via Brevo
			// await sendEmail({
			// 	to: user.email,
			// 	template: "password-reset",
			// 	data: {
			// 		name: user.name,
			// 		resetUrl,
			// 		expiresIn: "1 hour"
			// 	}
			// });

			console.log(`[DEV] Password reset link: ${resetUrl}`);

			return {
				success: true,
				message: "If an account exists, a reset link has been sent"
			};
		}),

	// ========================================================================
	// RESET PASSWORD (Public)
	// ========================================================================

	resetPassword: publicProcedure
		.input(resetPasswordSchema)
		.mutation(async ({ ctx, input }) => {
			const hashedToken = hashToken(input.token);

			// Find valid reset token
			const resetRequest = await ctx.db.query.passwordResets.findFirst({
				where: eq(passwordResets.token, hashedToken)
			});

			if (!resetRequest) {
				throw new TRPCError({
					code: "BAD_REQUEST",
					message: "Invalid or expired reset token"
				});
			}

			// Check expiry
			if (resetRequest.expires < new Date()) {
				// Clean up expired token
				await ctx.db.delete(passwordResets)
					.where(eq(passwordResets.id, resetRequest.id));

				throw new TRPCError({
					code: "BAD_REQUEST",
					message: "Reset token has expired"
				});
			}

			// Hash new password
			const hashedPassword = await bcrypt.hash(input.password, 10);

			// Update password
			await ctx.db.update(users)
				.set({ password: hashedPassword })
				.where(eq(users.id, resetRequest.userId));

			// Delete used token
			await ctx.db.delete(passwordResets)
				.where(eq(passwordResets.id, resetRequest.id));

			// TODO: Send confirmation email
			// const user = await ctx.db.query.users.findFirst({
			// 	where: eq(users.id, resetRequest.userId)
			// });
			// await sendEmail({
			// 	to: user.email,
			// 	template: "password-changed",
			// 	data: { name: user.name }
			// });

			return {
				success: true,
				message: "Password has been reset successfully"
			};
		}),

	// ========================================================================
	// CHANGE PASSWORD (Protected - requires login)
	// ========================================================================

	changePassword: protectedProcedure
		.input(changePasswordSchema)
		.mutation(async ({ ctx, input }) => {
			const userId = ctx.session.user.id;

			// Get user with current password
			const user = await ctx.db.query.users.findFirst({
				where: eq(users.id, userId)
			});

			if (!user?.password) {
				throw new TRPCError({
					code: "BAD_REQUEST",
					message: "User has no password (OAuth account)"
				});
			}

			// Verify current password
			const isValid = await bcrypt.compare(input.currentPassword, user.password);
			if (!isValid) {
				throw new TRPCError({
					code: "BAD_REQUEST",
					message: "Current password is incorrect"
				});
			}

			// Hash new password
			const hashedPassword = await bcrypt.hash(input.newPassword, 10);

			// Update password
			await ctx.db.update(users)
				.set({ password: hashedPassword })
				.where(eq(users.id, userId));

			// TODO: Send confirmation email
			// await sendEmail({
			// 	to: user.email,
			// 	template: "password-changed",
			// 	data: { name: user.name }
			// });

			return {
				success: true,
				message: "Password changed successfully"
			};
		}),

	// ========================================================================
	// VERIFY EMAIL (Public - but requires token)
	// ========================================================================

	verifyEmail: publicProcedure
		.input(z.object({ token: z.string() }))
		.mutation(async ({ ctx, input }) => {
			// TODO: Implement email verification
			// Similar pattern to password reset:
			// 1. Find token in DB
			// 2. Check expiry
			// 3. Update user.emailVerified
			// 4. Delete token

			throw new TRPCError({
				code: "NOT_IMPLEMENTED",
				message: "Email verification not yet implemented"
			});
		}),

	// ========================================================================
	// RESEND VERIFICATION (Protected)
	// ========================================================================

	resendVerification: protectedProcedure
		.mutation(async ({ ctx }) => {
			const userId = ctx.session.user.id;

			const user = await ctx.db.query.users.findFirst({
				where: eq(users.id, userId)
			});

			if (!user) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "User not found"
				});
			}

			if (user.emailVerified) {
				throw new TRPCError({
					code: "BAD_REQUEST",
					message: "Email is already verified"
				});
			}

			// TODO: Generate verification token and send email
			// Similar to forgot password flow

			return {
				success: true,
				message: "Verification email sent"
			};
		}),
});