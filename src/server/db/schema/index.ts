// src/server/db/schema/index.ts
// 
// Modular schema organization for Aquadecor store
// 
// Structure:
// - auth.ts: NextAuth tables (T3 stack, do not modify)
// - store.ts: Product catalog (categories, products, images, translations)
//

export * from "./auth";
export * from "./shop";