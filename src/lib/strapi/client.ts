// src/lib/strapi/client.ts

import { env } from "~/env.js";
// import type { qs } from "qs";
import qs from "qs";

interface StrapiResponse<T> {
	data: T;
	meta?: {
		pagination?: {
			page: number;
			pageSize: number;
			pageCount: number;
			total: number;
		};
	};
}

/**
 * Fetch data from Strapi API
 * @param path - API endpoint path (e.g., '/blogs')
 * @param params - Query parameters (fields, populate, filters, etc.)
 * @param options - Additional fetch options
 */
export async function fetchStrapi<T = any>(
	path: string,
	params: Record<string, any> = {},
	options: RequestInit = {}
): Promise<StrapiResponse<T>> {
	const query = qs.stringify(params, { encodeValuesOnly: true });
	const url = `${env.STRAPI_URL}/api${path}${query ? `?${query}` : ""}`;

	const res = await fetch(url, {
		headers: {
			Authorization: `Bearer ${env.STRAPI_API_TOKEN}`,
			"Content-Type": "application/json",
		},
		next: { revalidate: 3600 }, // Cache for 1 hour
		...options,
	});

	if (!res.ok) {
		throw new Error(`Strapi fetch failed: ${res.status} ${res.statusText}`);
	}

	return res.json();
}

/**
 * Get Strapi media URL
 * @param path - Media path from Strapi (can be relative or full URL)
 */
export function getStrapiMedia(path: string | undefined): string {
	if (!path) return "";

	// If already a full URL, return as-is
	if (path.startsWith("http")) return path;

	// Otherwise prepend Strapi URL
	return `${env.STRAPI_URL}${path}`;
}

/**
 * Transform Strapi response to simpler format
 * Converts { data: { id, attributes: {...} } } to { id, ...attributes }
 */
export function flattenStrapiResponse<T>(data: any): T {
	if (!data) return data;

	if (Array.isArray(data)) {
		return data.map((item) => flattenStrapiResponse(item)) as T;
	}

	if (data.attributes) {
		const { id, attributes } = data;
		return { id, ...attributes } as T;
	}

	return data;
}