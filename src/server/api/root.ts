// src/server/api/root.ts
import { accountRouter } from "./routers/account";
// shop
import { productRouter } from "~/server/api/routers/product";
import { reviewsRouter } from "~/server/api/routers/reviews";
import { calculatorRouter } from "~/server/api/routers/calculator";
// content
import { faqRouter } from "~/server/api/routers/faq";
import { countryRouter, publicCountryRouter } from "./routers/admin/country";
import { mediaRouter } from "./routers/media";
import { adminMediaRouter } from "./routers/admin/media";
// admin
import { adminCategoryRouter } from "~/server/api/routers/admin/category";
import { adminProductRouter } from "~/server/api/routers/admin/product";
import { adminPricingRouter } from "./routers/admin/pricing";
import { adminCalculatorRouter } from "./routers/admin/calculator";
import { adminOrderRouter } from "./routers/admin/order";
import { adminPromoterRouter } from "./routers/admin/promoter";
import { adminSaleRouter } from "./routers/admin/sale";
import { adminFaqRouter } from "./routers/admin/faq";
// TEMPORARY: Supabase testing router (delete after migration)
import { supabaseTestRouter } from "./routers/test/supabase-test";
import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
	account: accountRouter,
	product: productRouter,
	calculator: calculatorRouter,
	media: mediaRouter, // Public media (old CDN)
	reviews: reviewsRouter,
	faq: faqRouter,
	publicCountry: publicCountryRouter,
	admin: createTRPCRouter({
		category: adminCategoryRouter,
		product: adminProductRouter,
		pricing: adminPricingRouter,
		media: adminMediaRouter, // Admin media (old CDN)
		calculator: adminCalculatorRouter,
		order: adminOrderRouter,
		promoter: adminPromoterRouter,
		sale: adminSaleRouter,
		faq: adminFaqRouter,
		country: countryRouter,
		// TEMPORARY: Supabase testing (delete after migration)
		supabaseTest: supabaseTestRouter,
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