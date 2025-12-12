// src/i18n/routing.ts
import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
	// All supported locales
	locales: ['en', 'de', 'nl', 'it', 'us'],

	// Default locale
	defaultLocale: 'en',

	// Translated paths for static pages
	// Shop paths stay consistent (English slugs)
	pathnames: {
		// Static marketing pages - TRANSLATED
		'/': '/',
		'/about': {
			en: '/about',
			de: '/uber-uns',
			nl: '/over-ons',
			it: '/chi-siamo',
			us: '/about'
		},
		'/setup': {
			en: '/setup',
			de: '/installation',
			nl: '/installatie',
			it: '/installazione',
			us: '/setup'
		},
		'/calculator': {
			en: '/calculator',
			de: '/rechner',
			nl: '/calculator',
			it: '/calcolatore',
			us: '/calculator'
		},
		'/faq': {
			en: '/faq',
			de: '/haufig-gestellte-fragen',
			nl: '/veelgestelde-vragen',
			it: '/domande-frequenti',
			us: '/faq'
		},
		'/gallery': {
			en: '/gallery',
			de: '/galerie',
			nl: '/galerij',
			it: '/galleria',
			us: '/gallery'
		},
		'/reviews': {
			en: '/reviews',
			de: '/bewertungen',
			nl: '/beoordelingen',
			it: '/recensioni',
			us: '/reviews'
		},

		// Shop - ENGLISH SLUGS (consistent across locales)
		// Static product line pages
		'/shop': '/shop',
		'/shop/3d-backgrounds': '/shop/3d-backgrounds',
		'/shop/aquarium-decorations': '/shop/aquarium-decorations',

		// Dynamic category & product pages (MUST match your actual folder structure)
		'/shop/[productLine]/[categorySlug]': '/shop/[productLine]/[categorySlug]',
		'/shop/[productLine]/[categorySlug]/[productSlug]': '/shop/[productLine]/[categorySlug]/[productSlug]',

		// Distributors
		'/distributors': {
			en: '/distributors',
			de: '/handler',
			nl: '/distributeurs',
			it: '/distributori',
			us: '/distributors'
		},

		// Auth pages - NO TRANSLATION (functional)
		'/login': '/login',
		'/register': '/register',
		'/account': '/account',

		// Admin - NO TRANSLATION
		'/admin': '/admin',

		// Support/Contact
		'/support': '/support',
		'/contact': '/contact',

		// Blog
		'/blog': '/blog',

		// Legal pages (NO /legal prefix needed)
		'/terms': '/terms',
		'/privacy': '/privacy',
		'/shipping': '/shipping',
		'/refund': '/refund',
	}
});

// Type-safe locale
export type Locale = (typeof routing.locales)[number];

// Helper to check if locale is US market
export function isUSMarket(locale: string): boolean {
	return locale === 'us';
}

// Locale display names for UI
export const localeNames: Record<Locale, string> = {
	en: 'English',
	de: 'Deutsch',
	nl: 'Nederlands',
	it: 'Italiano',
	us: 'USA',
};

// Market-specific configuration
export const marketConfig = {
	us: {
		tariffNotice: true,
		restrictedProducts: [], // You'll populate this from DB
		currencyOverride: 'USD',
	},
} as const;