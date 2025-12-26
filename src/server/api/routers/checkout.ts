// src/server/api/routers/checkout.ts
import { z } from "zod"
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc"
import { validateDiscountCode } from "~/lib/discount-validation"

export const checkoutRouter = createTRPCRouter({
	validateDiscount: publicProcedure
		.input(z.object({
			code: z.string(),
			subtotal: z.number(),
			market: z.string(),
			email: z.string().email().optional()
		}))
		.mutation(async ({ input }) => {
			return await validateDiscountCode(
				input.code,
				input.subtotal,
				input.market,
				input.email
			)
		}),
})