// src/server/api/routers/admin/quote.ts

import { z } from "zod";
import { createTRPCRouter, adminProcedure } from "~/server/api/trpc";
import { quotes, orders, orderItems, products, productTranslations, emailSubscribers } from "~/server/db/schema";
import { eq, desc, asc, like, or, and } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

export const adminQuoteRouter = createTRPCRouter({
	// 1. GET ALL (Copy-pasted logic from Orders for consistent UI)
	getAll: adminProcedure
		.input(z.object({
			status: z.enum(["pending", "accepted", "rejected"]).optional(),
			search: z.string().optional(), // Search email or name
			sortBy: z.enum(["created", "price"]).default("created"),
			sortOrder: z.enum(["asc", "desc"]).default("desc"),
		}).optional())
		.query(async ({ ctx, input }) => {
			const conditions = [];

			if (input?.status) conditions.push(eq(quotes.status, input.status));

			if (input?.search) {
				const s = `%${input.search}%`;
				conditions.push(or(
					like(quotes.email, s),
					like(quotes.firstName, s),
					like(quotes.lastName, s)
				));
			}

			let query = ctx.db.select().from(quotes);

			if (conditions.length > 0) {
				query = query.where(and(...conditions)) as any;
			}

			const sortCol = input?.sortBy === "price" ? quotes.estimatedPriceEurCents : quotes.createdAt;
			query = input?.sortOrder === "asc" ? query.orderBy(asc(sortCol)) : query.orderBy(desc(sortCol));

			return await query;
		}),

	// 2. GET BY ID
	getById: adminProcedure
		.input(z.object({ id: z.string() }))
		.query(async ({ ctx, input }) => {
			// Join with Product to get the model name if available
			const result = await ctx.db
				.select({
					quote: quotes,
					productName: productTranslations.name,
					productSlug: products.slug
				})
				.from(quotes)
				.leftJoin(products, eq(quotes.productId, products.id))
				.leftJoin(productTranslations, and(
					eq(productTranslations.productId, products.id),
					eq(productTranslations.locale, "en")
				))
				.where(eq(quotes.id, input.id))
				.limit(1);

			if (!result[0]) return null;

			return {
				...result[0].quote,
				product: result[0].productName ? {
					name: result[0].productName,
					slug: result[0].productSlug
				} : null
			};
		}),

	// 3. THE MAGIC BUTTON: Convert Quote -> Order
	convertToOrder: adminProcedure
		.input(z.object({ quoteId: z.string() }))
		.mutation(async ({ ctx, input }) => {
			const quote = await ctx.db.query.quotes.findFirst({
				where: eq(quotes.id, input.quoteId)
			});

			if (!quote) throw new TRPCError({ code: "NOT_FOUND" });
			if (quote.status === "accepted") throw new TRPCError({ code: "CONFLICT", message: "Quote already converted" });

			// A. Create Order Number (ORD-{YEAR}-{RANDOM})
			const year = new Date().getFullYear();
			const random = Math.floor(1000 + Math.random() * 9000);
			const orderNumber = `ORD-${year}-${random}`;

			return await ctx.db.transaction(async (tx) => {
				// A.5. Check for subscriber discount
				const subscriber = await tx.query.emailSubscribers.findFirst({
					where: and(
						eq(emailSubscribers.email, quote.email),
						eq(emailSubscribers.isActive, true),
						eq(emailSubscribers.discountUsed, false)
					)
				});

				// Calculate discount if subscriber exists
				const discountAmount = subscriber ? Math.round(quote.estimatedPriceEurCents * 0.1) : 0; // 10% off
				const finalTotal = quote.estimatedPriceEurCents - discountAmount;

				// B. Insert Order Header
				const newOrders = await tx.insert(orders).values({
					orderNumber: orderNumber,
					email: quote.email,
					firstName: quote.firstName ?? undefined,
					lastName: quote.lastName ?? undefined,

					// Money Logic (with subscriber discount)
					subtotal: quote.estimatedPriceEurCents,
					discount: discountAmount,
					shipping: 0, // Shipping is technically inside the estimated price in your calculator logic
					tax: 0,
					total: finalTotal,
					currency: "EUR",
					market: "ROW", // Defaulting to ROW, or map from quote.country
					countryCode: quote.country ?? undefined,

					// Subscriber linking
					discountCode: subscriber?.discountCode ?? undefined,
					subscriberId: subscriber?.id ?? undefined,

					status: "pending", // Waiting for payment
					paymentStatus: "pending",

					// Link back to source
					internalNotes: subscriber
						? `Generated from Quote ID: ${quote.id}. Subscriber discount (${subscriber.discountCode}) applied.`
						: `Generated from Quote ID: ${quote.id}`,
					customerNotes: quote.customerNotes ?? undefined,
				}).returning();

				const newOrder = newOrders[0];
				if (!newOrder) {
					throw new TRPCError({
						code: "INTERNAL_SERVER_ERROR",
						message: "Failed to create order"
					});
				}

				// C. Insert Order Item (The Custom Background)
				// We need to construct the JSONB snapshot
				const dimensions = quote.dimensions as any; // Cast generic jsonb

				await tx.insert(orderItems).values({
					orderId: newOrder.id,
					productId: quote.productId ?? "CUSTOM-BG-ID", // Fallback if no specific product linked
					productName: "Custom 3D Background Configuration", // Or fetch real name
					sku: "CUSTOM-CFG",

					quantity: 1,
					pricePerUnit: quote.estimatedPriceEurCents,
					subtotal: quote.estimatedPriceEurCents,
					total: quote.estimatedPriceEurCents,
					isCustom: true,

					// THE HOLY GRAIL: SNAPSHOT
					pricingSnapshot: {
						pricingType: "configuration",
						market: "ROW",
						currency: "EUR",
						configurationDetails: {
							dimensions: {
								width: dimensions.width,
								height: dimensions.height,
								depth: dimensions.depth
							},
							unit: dimensions.unit,
							surfaceAreaSqM: (dimensions.width * dimensions.height) / 10000,
							baseRatePerSqM: 0, // You can calculate this if needed
							sidePanels: dimensions.sidePanels,
							sidePanelWidth: dimensions.sidePanelWidth,
							filtrationCutout: dimensions.filtrationCutout,
							flexibility: dimensions.flexibility
						},
						// Add additional items to snapshot if they exist
						selectedAddons: dimensions.additionalItems?.map((i: any) => ({
							addonId: i.id,
							name: "Additional Item", // You'd ideally fetch names here
							priceEurCents: 0
						}))
					}
				});

				// D. Mark Quote as Accepted
				await tx.update(quotes)
					.set({ status: "accepted", finalPriceEurCents: finalTotal })
					.where(eq(quotes.id, quote.id));

				// E. Mark subscriber discount as used (if applicable)
				if (subscriber) {
					await tx.update(emailSubscribers)
						.set({
							discountUsed: true,
							discountUsedAt: new Date()
						})
						.where(eq(emailSubscribers.id, subscriber.id));
				}

				return {
					orderId: newOrder.id,
					discountApplied: !!subscriber,
					discountAmount: discountAmount,
				};
			});
		}),
});