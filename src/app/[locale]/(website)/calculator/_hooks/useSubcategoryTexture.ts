// @ts-nocheck
// src/app/(website)/calculator/_hooks/useSubcategoryTexture.ts
import { api } from "~/trpc/react";

/**
 * Fetch the texture URL for a selected subcategory (product)
 * Returns the product's hero image for use in AquariumScene
 */
export function useSubcategoryTexture(subcategoryId: string | null) {
	// Only fetch if we have a valid subcategory ID (not null, not "skip")
	const shouldFetch = subcategoryId && subcategoryId !== "skip";

	const { data } = api.calculator.getSubcategories.useQuery(
		{ categoryId: subcategoryId! },
		{ enabled: !!shouldFetch }
	);

	// Return the first product's texture (since we're querying by specific product ID)
	return data?.products?.[0]?.textureUrl || null;
}