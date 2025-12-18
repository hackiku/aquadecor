// src/app/sitemap.ts
import type { MetadataRoute } from 'next';
import { db } from '~/server/db';
import { categories, products, media } from '~/server/db/schema';
import { routing } from '~/i18n/routing';
import { eq, and } from 'drizzle-orm';
import { getBlogPosts } from '~/lib/strapi/queries'; // blog SEO

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://aquadecorbackgrounds.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	// Fetch all data in parallel for performance
	const [allCategories, allProducts, blogPosts] = await Promise.all([
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
				// ✅ SEO WIN: Fetch the hero image URL for Google Images
				heroImage: media.storageUrl,
			})
			.from(products)
			// Join media to get the main image (sortOrder 0)
			.leftJoin(media, and(
				eq(media.productId, products.id),
				eq(media.usageType, 'product'),
				eq(media.sortOrder, 0)
			))
			.where(eq(products.isActive, true)),
			getBlogPosts().catch(() => []) // ✅ Fetch Strapi posts (safe catch)
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
		.filter((p): p is NonNullable<typeof p> => p !== null);

	const sitemapEntries: MetadataRoute.Sitemap = [];

	// Generate entries for each locale
	for (const locale of routing.locales) {
		// ========================================
		// 1. CORE PAGES (Highest Priority)
		// ========================================

		sitemapEntries.push(
			{
				url: `${baseUrl}/${locale}`,
				lastModified: new Date(),
				changeFrequency: 'daily',
				priority: 1.0,
			},
			{
				url: `${baseUrl}/${locale}/shop`,
				lastModified: new Date(),
				changeFrequency: 'daily',
				priority: 0.9,
			}
		);

		// ========================================
		// 2. PRODUCT LINES (Main Category Hubs)
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
		// 3. CATEGORY PAGES
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
		// 4. PRODUCT PAGES (With Images!)
		// ========================================

		for (const product of productsWithCategories) {
			sitemapEntries.push({
				url: `${baseUrl}/${locale}/shop/${product.productLine}/${product.categorySlug}/${product.slug}`,
				lastModified: product.updatedAt || new Date(),
				changeFrequency: 'monthly',
				priority: 0.7,
				// ✅ GOOGLE IMAGES: Index this product's image
				images: product.heroImage ? [product.heroImage] : undefined,
			});
		}

		// ========================================
		// 5. INFORMATIONAL & TOOLS
		// ========================================

		const staticPages = [
			{ path: 'about', priority: 0.6 },
			{ path: 'setup', priority: 0.6 },
			{ path: 'faq', priority: 0.6 },
			{ path: 'calculator', priority: 0.7 }, // High value tool
			{ path: 'distributors', priority: 0.5 },
		];

		for (const page of staticPages) {
			sitemapEntries.push({
				url: `${baseUrl}/${locale}/${page.path}`,
				lastModified: new Date(),
				changeFrequency: 'monthly',
				priority: page.priority,
			});
		}

		// ========================================
		// 6. SOCIAL PROOF & BLOG HUB
		// ========================================

		sitemapEntries.push(
			{
				url: `${baseUrl}/${locale}/gallery`,
				lastModified: new Date(),
				changeFrequency: 'weekly',
				priority: 0.6,
			},
			{
				url: `${baseUrl}/${locale}/reviews`,
				lastModified: new Date(),
				changeFrequency: 'weekly',
				priority: 0.6,
			},
			{
				url: `${baseUrl}/${locale}/blog`,
				lastModified: new Date(),
				changeFrequency: 'weekly',
				priority: 0.5,
			}
		);

		// ========================================
		// 8. LEGAL PAGES (Low Priority)
		// ========================================

		const legalPages = ['terms', 'privacy', 'shipping', 'refund'];
		for (const page of legalPages) {
			sitemapEntries.push({
				url: `${baseUrl}/${locale}/${page}`,
				lastModified: new Date(),
				changeFrequency: 'yearly',
				priority: 0.3,
			});
		}

		for (const post of blogPosts) {
			sitemapEntries.push({
				url: `${baseUrl}/${locale}/blog/${post.slug}`,
				// Prefer updated date, fallback to publish date
				lastModified: new Date(post.publishedAt),
				changeFrequency: 'monthly',
				priority: 0.6,
				// ✅ Google Images for Blog
				images: post.cover?.url ? [post.cover.url] : undefined
			});
		}
	}
	return sitemapEntries;
}

// Regenerate once a day
export const revalidate = 86400;