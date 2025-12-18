// src/i18n/seo/hreflang.ts

import { routing } from '~/i18n/routing';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://aquadecorbackgrounds.com';

interface HreflangOptions {
	/** Current locale from params */
	currentLocale: string;
	/** Path without locale prefix, e.g., "/shop/3d-backgrounds" */
	path: string;
	/** Optional: Different x-default locale (defaults to 'en') */
	defaultLocale?: string;
}

/**
 * Generate hreflang alternates for Next.js metadata
 * 
 * @example
 * ```ts
 * export async function generateMetadata({ params }) {
 *   const { locale } = await params;
 *   
 *   return {
 *     title: "My Page",
 *     ...generateHreflang({
 *       currentLocale: locale,
 *       path: "/shop/3d-backgrounds"
 *     })
 *   };
 * }
 * ```
 */
export function generateHreflang(options: HreflangOptions) {
	const { currentLocale, path, defaultLocale = 'en' } = options;

	// Build language alternatives
	const languages: Record<string, string> = {};

	// Add all locales
	for (const locale of routing.locales) {
		// Map locale to proper hreflang code
		const hreflangCode = locale === 'us' ? 'en-US' : locale;
		languages[hreflangCode] = `${baseUrl}/${locale}${path}`;
	}

	// Add x-default (fallback for unmatched locales)
	languages['x-default'] = `${baseUrl}/${defaultLocale}${path}`;

	return {
		alternates: {
			canonical: `${baseUrl}/${currentLocale}${path}`,
			languages,
		},
	};
}

/**
 * Extract clean path from full URL path
 * Removes locale prefix for hreflang generation
 * 
 * @example
 * cleanPath("/en/shop/3d-backgrounds") // "/shop/3d-backgrounds"
 * cleanPath("/de/about") // "/about"
 */
export function cleanPath(fullPath: string): string {
	return fullPath.replace(/^\/(en|de|nl|it|us)/, '') || '/';
}

/**
 * Generate OpenGraph metadata with hreflang
 * Combines OG tags with hreflang in one call
 */
export function generateSEOMetadata(options: {
	currentLocale: string;
	path: string;
	title: string;
	description: string;
	image?: string;
	type?: 'website' | 'article';
}) {
	const { currentLocale, path, title, description, image, type = 'website' } = options;

	const hreflang = generateHreflang({ currentLocale, path });

	return {
		title,
		description,
		openGraph: {
			title,
			description,
			type,
			url: `${baseUrl}/${currentLocale}${path}`,
			...(image && { images: [image] }),
		},
		twitter: {
			card: 'summary_large_image',
			title,
			description,
			...(image && { images: [image] }),
		},
		...hreflang,
	};
}