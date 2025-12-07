// src/server/api/routers/calculator.ts

import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { quotes } from "~/server/db/schema";

// Input validation schema
const quoteConfigSchema = z.object({
	// Product
	modelCategory: z.enum([
		"a-models",
		"a-slim-models",
		"b-models",
		"c-models",
		"e-models",
		"f-models",
		"g-models",
		"k-models",
		"l-models",
		"n-models",
	]),
	flexibility: z.enum(["solid", "flexible"]),

	// Dimensions
	dimensions: z.object({
		width: z.number().min(50).max(200),
		height: z.number().min(30).max(100),
		depth: z.number().min(30).max(80).optional(),
	}),
	unit: z.enum(["cm", "inch"]),

	// Options
	sidePanels: z.enum(["none", "single", "both"]),
	sidePanelWidth: z.number().min(30).max(80).optional(),
	filtrationCutout: z.boolean().optional(),

	// Shipping
	country: z.string(),

	// Contact (for quote submission)
	name: z.string().optional(),
	email: z.string().email().optional(),
	notes: z.string().optional(),
});

export const calculatorRouter = createTRPCRouter({
	/**
	 * Create a quote request
	 * Stores config in DB and sends email notifications
	 */
	createQuote: publicProcedure
		.input(quoteConfigSchema)
		.mutation(async ({ ctx, input }) => {
			// Calculate server-side price (validate client calculation)
			const surfaceAreaM2 = (input.dimensions.width * input.dimensions.height) / 10000;
			const baseRate = MODEL_PRICING[input.modelCategory] ?? 250;
			let total = surfaceAreaM2 * baseRate;

			// Add flexibility upcharge
			if (input.flexibility === "flexible") {
				total += total * 0.2;
			}

			// Add side panels
			if (input.sidePanels !== "none" && input.sidePanelWidth) {
				const sidePanelArea = (input.sidePanelWidth * input.dimensions.height) / 10000;
				const multiplier = input.sidePanels === "both" ? 2 : 1;
				total += sidePanelArea * baseRate * multiplier;
			}

			// Add filtration cutout
			if (input.filtrationCutout) {
				total += 50;
			}

			const estimatedPriceCents = Math.round(total * 100);

			// Split name into first/last for schema compatibility
			const fullName = input.name?.trim() ?? "Anonymous";
			const nameParts = fullName.split(" ");
			const firstName = nameParts[0] ?? "Anonymous";
			const lastName = nameParts.slice(1).join(" ");

			// Insert into database
			const [quote] = await ctx.db.insert(quotes).values({
				// Map input fields to schema columns
				productSlug: input.modelCategory, // Using category as slug for now
				email: input.email ?? "no-email@provided.com",
				firstName: firstName,
				lastName: lastName || undefined,
				country: input.country,

				// Map dimensions and options to JSONB column
				dimensions: {
					width: input.dimensions.width,
					height: input.dimensions.height,
					depth: input.dimensions.depth,
					unit: input.unit,
					sidePanels: input.sidePanels,
					sidePanelWidth: input.sidePanelWidth,
					filtrationCutout: input.filtrationCutout,
					notes: input.notes
				},

				estimatedPriceEurCents: estimatedPriceCents,
				status: "pending",
				customerNotes: input.notes,
			}).returning();

			// TODO: Send emails
			// await sendCustomerConfirmation(quote);
			// await sendAdminNotification(quote);

			return {
				quoteId: quote!.id,
				estimatedPrice: estimatedPriceCents,
			};
		}),

	/**
	 * Get model categories (optional - can use static data instead)
	 */
	getModelCategories: publicProcedure.query(async () => {
		// Return static model data from _data/model-categories.ts
		// Or fetch from database if you want dynamic pricing
		return MODEL_CATEGORIES as any[];
	}),
});

// Pricing constants (sync with client-side)
const MODEL_PRICING: Record<string, number> = {
	"a-models": 250,
	"a-slim-models": 230,
	"b-models": 280,
	"c-models": 300,
	"e-models": 260,
	"f-models": 350,
	"g-models": 240,
	"k-models": 320,
	"l-models": 270,
	"n-models": 290,
};

const MODEL_CATEGORIES: any[] = [
	/* Copy from _data/model-categories.ts */
];