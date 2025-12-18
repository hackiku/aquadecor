// src/app/sitemap.ts
import type { MetadataRoute } from 'next';
import { db } from '~/server/db';
import { categories, products } from '~/server/db/schema';
import { routing } from '~/i18n/routing';
import { eq } from 'drizzle-orm';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://aquadecorbackgrounds.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	// Fetch all data in parallel for performance
	const [allCategories, allProducts] = await Promise.all([
		db
			.select({
				id: categories.id,
				slug: categories.slug,
				productLine: categories.productLine,
				updatedAt: categories.updatedAt,
			})
			.from(categories)
			.where(eq(categories.isActive, true)),

		db
			.select({
				slug: products.slug,
				categoryId: products.categoryId,
				updatedAt: products.updatedAt,
			})
			.from(products)
			.where(eq(products.isActive, true))
	]);

	// Create category lookup map for O(1) access
	const categoryMap = new Map(
		allCategories.map(cat => [cat.id, { slug: cat.slug, productLine: cat.productLine }])
	);

	// Map products to their categories
	const productsWithCategories = allProducts
		.map(product => {
			const category = categoryMap.get(product.categoryId);
			if (!category) return null; // Skip orphaned products

			return {
				...product,
				categorySlug: category.slug,
				productLine: category.productLine,
			};
		})
		.filter(Boolean); // Remove nulls

	const sitemapEntries: MetadataRoute.Sitemap = [];

	// Generate entries for each locale
	for (const locale of routing.locales) {
		// ========================================
		// CORE PAGES (Highest Priority)
		// ========================================

		sitemapEntries.push(
			// Homepage
			{
				url: `${baseUrl}/${locale}`,
				lastModified: new Date(),
				changeFrequency: 'daily',
				priority: 1.0,
			},
			// Main shop page
			{
				url: `${baseUrl}/${locale}/shop`,
				lastModified: new Date(),
				changeFrequency: 'daily',
				priority: 0.9,
			}
		);

		// ========================================
		// PRODUCT LINES (Main Category Hubs)
		// ========================================

		sitemapEntries.push(
			{
				url: `${baseUrl}/${locale}/shop/3d-backgrounds`,
				lastModified: new Date(),
				changeFrequency: 'weekly',
				priority: 0.9,
			},
			{
				url: `${baseUrl}/${locale}/shop/aquarium-decorations`,
				lastModified: new Date(),
				changeFrequency: 'weekly',
				priority: 0.9,
			}
		);

		// ========================================
		// CATEGORY PAGES
		// ========================================

		for (const category of allCategories) {
			sitemapEntries.push({
				url: `${baseUrl}/${locale}/shop/${category.productLine}/${category.slug}`,
				lastModified: category.updatedAt || new Date(),
				changeFrequency: 'weekly',
				priority: 0.8,
			});
		}

		// ========================================
		// PRODUCT PAGES
		// ========================================

		for (const product of productsWithCategories) {
			sitemapEntries.push({
				url: `${baseUrl}/${locale}/shop/${product.productLine}/${product.categorySlug}/${product.slug}`,
				lastModified: product.updatedAt || new Date(),
				changeFrequency: 'monthly',
				priority: 0.7,
			});
		}

		// ========================================
		// INFORMATIONAL PAGES
		// ========================================

		sitemapEntries.push(
			{
				url: `${baseUrl}/${locale}/about`,
				lastModified: new Date(),
				changeFrequency: 'monthly',
				priority: 0.6,
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
			}
		);

		// ========================================
		// TOOLS & CALCULATORS (Higher Priority)
		// ========================================

		sitemapEntries.push({
			url: `${baseUrl}/${locale}/calculator`,
			lastModified: new Date(),
			changeFrequency: 'monthly',
			priority: 0.7, // Tools are high-value pages
		});

		// ========================================
		// SOCIAL PROOF & DISCOVERY
		// ========================================

		sitemapEntries.push(
			{
				url: `${baseUrl}/${locale}/gallery`,
				lastModified: new Date(),
				changeFrequency: 'weekly',
				priority: 0.6, // Gallery updated often, good for discovery
			},
			{
				url: `${baseUrl}/${locale}/reviews`,
				lastModified: new Date(),
				changeFrequency: 'weekly',
				priority: 0.6,
			},
			{
				url: `${baseUrl}/${locale}/distributors`,
				lastModified: new Date(),
				changeFrequency: 'monthly',
				priority: 0.5,
			}
		);

		// ========================================
		// BLOG (Future Content Hub)
		// ========================================

		sitemapEntries.push({
			url: `${baseUrl}/${locale}/blog`,
			lastModified: new Date(),
			changeFrequency: 'weekly',
			priority: 0.5,
		});

		// TODO: Add individual blog posts when you have them
		// const blogPosts = await db.query.blogPosts.findMany();
		// for (const post of blogPosts) {
		//   sitemapEntries.push({
		//     url: `${baseUrl}/${locale}/blog/${post.slug}`,
		//     lastModified: post.updatedAt || new Date(),
		//     changeFrequency: 'monthly',
		//     priority: 0.6,
		//   });
		// }

		// ========================================
		// LEGAL PAGES (Low Priority but Required)
		// ========================================

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
				priority: 0.4, // Shipping info changes more often
			},
			{
				url: `${baseUrl}/${locale}/refund`,
				lastModified: new Date(),
				changeFrequency: 'yearly',
				priority: 0.3,
			}
		);
	}

	return sitemapEntries;
}

// Regenerate sitemap every 24 hours
export const revalidate = 86400;

// ========================================
// SITEMAP STATISTICS
// ========================================
// With 200 products, 20 categories, 5 locales:
// - Core pages: 10
// - Product lines: 10
// - Categories: 100
// - Products: 1000
// - Info pages: 25
// - Tools: 5
// - Social: 15
// - Blog: 5
// - Legal: 20
// TOTAL: ~1,190 URLs
//
// All URLs are ISR-cached, so sitemap generation is fast
// Google will recrawl changed pages based on lastModified dates