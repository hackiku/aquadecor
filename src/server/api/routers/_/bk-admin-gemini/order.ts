// src/server/api/routers/admin/order.ts

import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { orders, orderItems } from "~/server/db/schema";
import { eq, desc, asc, sql, and, like, or } from "drizzle-orm";

export const adminOrderRouter = createTRPCRouter({
	// Get all orders with filtering and search
	getAll: publicProcedure
		.input(z.object({
			status: z.enum(["pending", "confirmed", "in_production", "ready_to_ship", "shipped", "delivered", "cancelled", "refunded", "abandoned"]).optional(),
			paymentStatus: z.enum(["pending", "paid", "failed", "refunded"]).optional(),
			email: z.string().optional(), // Search by email or order number
			discountCode: z.string().optional(),
			sortBy: z.enum(["created", "total", "orderNumber"]).default("created"),
			sortOrder: z.enum(["asc", "desc"]).default("desc"),
		}).optional())
		.query(async ({ ctx, input }) => {
			const conditions = [];

			if (input?.status) {
				conditions.push(eq(orders.status, input.status));
			}

			if (input?.paymentStatus) {
				conditions.push(eq(orders.paymentStatus, input.paymentStatus));
			}

			if (input?.email) {
				conditions.push(
					or(
						like(orders.email, `%${input.email}%`),
						like(orders.orderNumber, `%${input.email}%`)
					)
				);
			}

			if (input?.discountCode) {
				conditions.push(like(orders.discountCode, `%${input.discountCode}%`));
			}

			let query = ctx.db
				.select({
					id: orders.id,
					orderNumber: orders.orderNumber,
					email: orders.email,
					firstName: orders.firstName,
					lastName: orders.lastName,
					subtotal: orders.subtotal,
					discount: orders.discount,
					shipping: orders.shipping,
					total: orders.total,
					currency: orders.currency,
					status: orders.status,
					paymentStatus: orders.paymentStatus,
					discountCode: orders.discountCode,
					promoterId: orders.promoterId,
					trackingNumber: orders.trackingNumber,
					createdAt: orders.createdAt,
					updatedAt: orders.updatedAt,
					confirmedAt: orders.confirmedAt,
					shippedAt: orders.shippedAt,
					deliveredAt: orders.deliveredAt,
				})
				.from(orders);

			if (conditions.length > 0) {
				query = query.where(and(...conditions)) as any;
			}

			// Apply sorting
			switch (input?.sortBy) {
				case "total":
					query = input?.sortOrder === "asc"
						? query.orderBy(asc(orders.total)) as any
						: query.orderBy(desc(orders.total)) as any;
					break;
				case "orderNumber":
					query = input?.sortOrder === "asc"
						? query.orderBy(asc(orders.orderNumber)) as any
						: query.orderBy(desc(orders.orderNumber)) as any;
					break;
				case "created":
				default:
					query = input?.sortOrder === "asc"
						? query.orderBy(asc(orders.createdAt)) as any
						: query.orderBy(desc(orders.createdAt)) as any;
			}

			return await query;
		}),

	// Get single order with all details
	getById: publicProcedure
		.input(z.object({
			id: z.string(),
		}))
		.query(async ({ ctx, input }) => {
			const [order] = await ctx.db
				.select()
				.from(orders)
				.where(eq(orders.id, input.id))
				.limit(1);

			if (!order) {
				return null;
			}

			// Get order items
			const items = await ctx.db
				.select()
				.from(orderItems)
				.where(eq(orderItems.orderId, input.id));

			return {
				...order,
				items,
			};
		}),

	// Get order stats for dashboard
	getStats: publicProcedure
		.query(async ({ ctx }) => {
			const allOrders = await ctx.db
				.select({
					id: orders.id,
					status: orders.status,
					paymentStatus: orders.paymentStatus,
					total: orders.total,
				})
				.from(orders);

			const total = allOrders.length;
			const pending = allOrders.filter(o => o.status === "pending").length;
			const confirmed = allOrders.filter(o => o.status === "confirmed").length;
			const inProduction = allOrders.filter(o => o.status === "in_production").length;
			const shipped = allOrders.filter(o => o.status === "shipped").length;
			const delivered = allOrders.filter(o => o.status === "delivered").length;

			const totalRevenue = allOrders
				.filter(o => o.paymentStatus === "paid")
				.reduce((sum, o) => sum + o.total, 0);

			return {
				total,
				pending,
				confirmed,
				inProduction,
				shipped,
				delivered,
				totalRevenue,
			};
		}),

	// Update order status
	updateStatus: publicProcedure
		.input(z.object({
			id: z.string(),
			status: z.enum(["pending", "confirmed", "in_production", "ready_to_ship", "shipped", "delivered", "cancelled", "refunded", "abandoned"]),
			paymentStatus: z.enum(["pending", "paid", "failed", "refunded"]).optional(),
			trackingNumber: z.string().optional(),
			internalNotes: z.string().optional(),
		}))
		.mutation(async ({ ctx, input }) => {
			const { id, status, paymentStatus, trackingNumber, internalNotes } = input;

			const updateData: any = { status };

			if (paymentStatus) updateData.paymentStatus = paymentStatus;
			if (trackingNumber) updateData.trackingNumber = trackingNumber;
			if (internalNotes !== undefined) updateData.internalNotes = internalNotes;

			// Auto-set timestamps based on status
			if (status === "confirmed" && !updateData.confirmedAt) {
				updateData.confirmedAt = new Date();
			}
			if (status === "shipped" && !updateData.shippedAt) {
				updateData.shippedAt = new Date();
			}
			if (status === "delivered" && !updateData.deliveredAt) {
				updateData.deliveredAt = new Date();
			}

			const [updated] = await ctx.db
				.update(orders)
				.set(updateData)
				.where(eq(orders.id, id))
				.returning();

			return updated;
		}),

	// Delete order (admin only, use sparingly)
	delete: publicProcedure
		.input(z.object({
			id: z.string(),
		}))
		.mutation(async ({ ctx, input }) => {
			await ctx.db.delete(orders).where(eq(orders.id, input.id));
			return { success: true };
		}),
});