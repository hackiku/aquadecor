// src/server/db/schema/index.ts
// 
// Modular schema organization for Aquadecor store
// 
// Structure:
// - auth.ts: NextAuth tables (T3 stack, do not modify)
// - shop.ts: Product catalog (categories, products, images, translations)
// - orders.ts: Order management and fulfillment
// - promoters.ts: Affiliate/promoter system
// - faq.ts: FAQ system with i18n
// - reviews.ts: Product reviews
// - countries.ts: Shipping countries
//

export * from "./auth";
export * from "./shop";
export * from "./orders";
export * from "./promoters";
export * from "./sales";
export * from "./faq";
export * from "./reviews";
export * from "./countries";
// export * from "./gallery";
export * from "./media";