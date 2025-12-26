// src/i18n/seo/hreflang.ts

import { routing } from '~/i18n/routing';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://aquadecorbackgrounds.com';

interface HreflangOptions {
	currentLocale: string;
	path: string; /** Path without locale prefix, e.g., "/shop/3d-backgrounds" */
	defaultLocale?: string;
	/** 
		 * Optional: Specific paths for other locales 
		 * e.g. { de: '/blog/fische', nl: '/blog/vissen' }
		 */
	localizedPaths?: Record<string, string>;
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
	const { currentLocale, path, defaultLocale = 'en', localizedPaths } = options;

	const languages: Record<string, string> = {};

	for (const locale of routing.locales) {
		const hreflangCode = locale === 'us' ? 'en-US' : locale;

		// Use specific localized path if available, otherwise fallback to standard pattern
		const localePath = localizedPaths?.[locale] || path;

		languages[hreflangCode] = `${baseUrl}/${locale}${localePath}`;
	}

	// x-default logic
	const defaultPath = localizedPaths?.[defaultLocale] || path;
	languages['x-default'] = `${baseUrl}/${defaultLocale}${defaultPath}`;

	// Determine canonical URL for THIS page
	const currentPath = localizedPaths?.[currentLocale] || path;

	return {
		alternates: {
			canonical: `${baseUrl}/${currentLocale}${currentPath}`,
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
	localizedPaths?: Record<string, string>; // for blog
}) {
	const { currentLocale, path, title, description, image, type = 'website', localizedPaths } = options;

	const hreflang = generateHreflang({ currentLocale, path, localizedPaths });

	return {
		title,
		description,
		openGraph: {
			title,
			description,
			type,
			url: hreflang.alternates.canonical,
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
