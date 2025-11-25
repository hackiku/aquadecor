// src/server/api/root.ts
import { productRouter } from "~/server/api/routers/product";
import { reviewsRouter } from "~/server/api/routers/reviews";
import { adminProductRouter } from "~/server/api/routers/admin/product";
import { adminCategoryRouter } from "~/server/api/routers/admin/category";
import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
	product: productRouter,
	reviews: reviewsRouter,
	admin: createTRPCRouter({
		product: adminProductRouter,
		category: adminCategoryRouter,
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