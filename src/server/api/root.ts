// src/server/api/root.ts
import { productRouter } from "~/server/api/routers/product";
import { reviewsRouter } from "~/server/api/routers/reviews";
import { faqRouter } from "~/server/api/routers/faq";
import { adminProductRouter } from "~/server/api/routers/admin/product";
import { adminCategoryRouter } from "~/server/api/routers/admin/category";
import { adminOrderRouter } from "./routers/admin/order";
import { adminPromoterRouter } from "./routers/admin/promoter";
import { adminFaqRouter } from "./routers/admin/faq";
import { countryRouter } from "./routers/admin/country";
import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
	product: productRouter,
	reviews: reviewsRouter,
	faq: faqRouter,
	admin: createTRPCRouter({
		category: adminCategoryRouter,
		product: adminProductRouter,
		order: adminOrderRouter,
		promoter: adminPromoterRouter,
		faq: adminFaqRouter,
		country: countryRouter,
	}),
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);