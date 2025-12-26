// src/app/robots.ts
import type { MetadataRoute } from 'next';

/**
 * Dynamic robots.txt generation
 * 
 * - PRODUCTION: Allow crawling with sensible blocks
 * - PREVIEW/DEV: Block all crawlers (no indexing on vercel.app)
 */
export default function robots(): MetadataRoute.Robots {
	const isProduction = process.env.VERCEL_ENV === 'production';
	const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://aquadecorbackgrounds.com';

	// ========================================
	// PREVIEW/DEV - Block Everything
	// ========================================
	if (!isProduction) {
		return {
			rules: {
				userAgent: '*',
				disallow: '/',
			},
		};
	}

	// ========================================
	// PRODUCTION - Selective Allow/Block
	// ========================================
	return {
		rules: [
			{
				userAgent: '*',
				allow: '/',
				disallow: [
					'/api/',          // API routes
					'/admin/',        // Admin panel
					'/_next/',        // Next.js internals
					'/account/',      // User dashboards
					'/checkout/',     // Cart/checkout flow
					'/login',         // Auth pages
					'/register',
					'/forgot-password',
					'/reset-password',
				],
			},
			// Optional: Special rules for specific bots
			{
				userAgent: 'GPTBot', // OpenAI scraper
				disallow: '/',        // Block ChatGPT training
			},
		],
		sitemap: `${baseUrl}/sitemap.xml`,
	};
}