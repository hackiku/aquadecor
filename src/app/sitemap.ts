// src/app/sitemap.ts
import type { MetadataRoute } from 'next';
import { db } from '~/server/db';
import { categories, products } from '~/server/db/schema';
import { routing } from '~/i18n/routing';
import { eq } from 'drizzle-orm';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://aquadecor.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	// Fetch all active categories
	const allCategories = await db
		.select({
			slug: categories.slug,
			productLine: categories.productLine,
			updatedAt: categories.updatedAt,
		})
		.from(categories)
		.where(eq(categories.isActive, true));

	// Fetch all active products
	const allProducts = await db
		.select({
			slug: products.slug,
			categoryId: products.categoryId,
			updatedAt: products.updatedAt,
		})
		.from(products)
		.where(eq(products.isActive, true));

	// Map products to their categories for URL construction
	const productsWithCategories = allProducts.map(product => {
		const category = allCategories.find(cat => cat.slug === product.categoryId);
		return {
			...product,
			categorySlug: category?.slug || 'unknown',
			productLine: category?.productLine || 'unknown',
		};
	});

	const sitemapEntries: MetadataRoute.Sitemap = [];

	// Generate entries for each locale
	for (const locale of routing.locales) {
		// Homepage
		sitemapEntries.push({
			url: `${baseUrl}/${locale}`,
			lastModified: new Date(),
			changeFrequency: 'daily',
			priority: 1.0,
		});

		// Main shop page
		sitemapEntries.push({
			url: `${baseUrl}/${locale}/shop`,
			lastModified: new Date(),
			changeFrequency: 'daily',
			priority: 0.9,
		});

		// Product line pages (3d-backgrounds, aquarium-decorations)
		sitemapEntries.push({
			url: `${baseUrl}/${locale}/shop/3d-backgrounds`,
			lastModified: new Date(),
			changeFrequency: 'weekly',
			priority: 0.9,
		});

		sitemapEntries.push({
			url: `${baseUrl}/${locale}/shop/aquarium-decorations`,
			lastModified: new Date(),
			changeFrequency: 'weekly',
			priority: 0.9,
		});

		// Category pages
		for (const category of allCategories) {
			sitemapEntries.push({
				url: `${baseUrl}/${locale}/shop/${category.productLine}/${category.slug}`,
				lastModified: category.updatedAt || new Date(),
				changeFrequency: 'weekly',
				priority: 0.8,
			});
		}

		// Product pages
		for (const product of productsWithCategories) {
			// Skip if category data is missing
			if (product.categorySlug === 'unknown' || product.productLine === 'unknown') {
				continue;
			}

			sitemapEntries.push({
				url: `${baseUrl}/${locale}/shop/${product.productLine}/${product.categorySlug}/${product.slug}`,
				lastModified: product.updatedAt || new Date(),
				changeFrequency: 'monthly',
				priority: 0.7,
			});
		}

		// Static pages
		sitemapEntries.push(
			{
				url: `${baseUrl}/${locale}/about`,
				lastModified: new Date(),
				changeFrequency: 'monthly',
				priority: 0.6,
			},
			{
				url: `${baseUrl}/${locale}/calculator`,
				lastModified: new Date(),
				changeFrequency: 'monthly',
				priority: 0.7,
			},
			{
				url: `${baseUrl}/${locale}/setup`,
				lastModified: new Date(),
				changeFrequency: 'monthly',
				priority: 0.6,
			},
			{
				url: `${baseUrl}/${locale}/faq`,
				lastModified: new Date(),
				changeFrequency: 'monthly',
				priority: 0.6,
			},
			{
				url: `${baseUrl}/${locale}/gallery`,
				lastModified: new Date(),
				changeFrequency: 'weekly',
				priority: 0.5,
			},
			{
				url: `${baseUrl}/${locale}/reviews`,
				lastModified: new Date(),
				changeFrequency: 'weekly',
				priority: 0.5,
			},
			{
				url: `${baseUrl}/${locale}/distributors`,
				lastModified: new Date(),
				changeFrequency: 'monthly',
				priority: 0.5,
			},
			{
				url: `${baseUrl}/${locale}/blog`,
				lastModified: new Date(),
				changeFrequency: 'weekly',
				priority: 0.5,
			},
		);

		// Legal pages
		sitemapEntries.push(
			{
				url: `${baseUrl}/${locale}/terms`,
				lastModified: new Date(),
				changeFrequency: 'yearly',
				priority: 0.3,
			},
			{
				url: `${baseUrl}/${locale}/privacy`,
				lastModified: new Date(),
				changeFrequency: 'yearly',
				priority: 0.3,
			},
			{
				url: `${baseUrl}/${locale}/shipping`,
				lastModified: new Date(),
				changeFrequency: 'monthly',
				priority: 0.4,
			},
			{
				url: `${baseUrl}/${locale}/refund`,
				lastModified: new Date(),
				changeFrequency: 'yearly',
				priority: 0.3,
			},
		);
	}

	return sitemapEntries;
}

// Optional: Export revalidate to regenerate sitemap periodically
export const revalidate = 86400; // Regenerate every 24 hours