// src/server/api/routers/product.ts (1 file, ~200 lines)

import { z } from "zod";

import {
	createTRPCRouter,
	protectedProcedure,
	publicProcedure,
} from "~/server/api/trpc";


export const productRouter = createTRPCRouter({
	getAll: publicProcedure.query(async ({ ctx }) => {
		return ctx.db.query.products.findMany({
			with: { category: true, variants: true },
		});
	}),

	getBySlug: publicProcedure
		.input(z.object({ slug: z.string() }))
		.query(async ({ ctx, input }) => {
			return ctx.db.query.products.findFirst({
				where: eq(products.slug, input.slug),
				with: { variants: true, images: true },
			});
		}),

	create: protectedProcedure  // Only admins
		.input(z.object({
			name: z.string(),
			slug: z.string(),
			price: z.number(),
			categoryId: z.string(),
		}))
		.mutation(async ({ ctx, input }) => {
			return ctx.db.insert(products).values(input);
		}),

	update: protectedProcedure
		.input(z.object({
			id: z.string(),
			name: z.string().optional(),
			price: z.number().optional(),
		}))
		.mutation(async ({ ctx, input }) => {
			const { id, ...data } = input;
			return ctx.db.update(products)
				.set(data)
				.where(eq(products.id, id));
		}),

	delete: protectedProcedure
		.input(z.object({ id: z.string() }))
		.mutation(async ({ ctx, input }) => {
			return ctx.db.delete(products)
				.where(eq(products.id, input.id));
		}),
});