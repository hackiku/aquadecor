// src/server/queries/sales.ts
import { db } from "~/server/db";
import { sales } from "~/server/db/schema";
import { and, eq, lte, gte } from "drizzle-orm";
import { unstable_cache } from "next/cache";

async function getActiveSaleQuery() {
	const now = new Date();

	const [activeSale] = await db
		.select()
		.from(sales)
		.where(
			and(
				eq(sales.isActive, true),
				lte(sales.startsAt, now),
				gte(sales.endsAt, now)
			)
		)
		.limit(1);

	return activeSale ?? null;
}

// Cached with 5 minute revalidation (or manual revalidation)
export const getActiveSale = unstable_cache(
	getActiveSaleQuery,
	["active-sale"],
	{
		revalidate: 300, // 5 minutes fallback
		tags: ["active-sale"], // For manual revalidation
	}
);