// src/server/db/seed/data/.../magical-items/pricing.ts (NEW FILE)
import type { InferInsertModel } from "drizzle-orm";
import { productPricing, pricingBundles, productAddons, customizationOptions } from "../../../../../schema";

export type PricingSeedV2 = InferInsertModel<typeof productPricing> & { productSlug: string; bundles?: any[] };
export type BundleSeedV2 = InferInsertModel<typeof pricingBundles> & { pricingSlug: string };

export const pricingData: PricingSeedV2[] = [
	{
		productSlug: "fairy-dust-bundle",
		market: "ROW",
		currency: "EUR",
		pricingType: "bundle",
		// stripePriceId, stripeProductId etc.
		// Bundles are defined in a separate file/array, but this structure is clearer
	},
	// US Pricing for a simple product
	{
		productSlug: "enchanted-pebble",
		market: "US",
		currency: "USD",
		pricingType: "simple",
		unitPriceEurCents: 1099, // Note: storing USD value in `unitPriceEurCents` for Drizzle's `integer` column
		allowQuantity: true,
	},
];