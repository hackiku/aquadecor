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


		// ================================================
		// Content
		// ================================================

		'/blog': '/blog',

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

		// ================================================
		// Auth pages
		// ================================================

		'/login': {
			en: '/login',
			de: '/anmelden',      // German: "sign in"
			nl: '/inloggen',      // Dutch: "log in"
			it: '/accedi',        // Italian: "access"
			us: '/login'
		},

		'/register': {
			en: '/register',
			de: '/registrieren',  // German: "register"
			nl: '/registreren',   // Dutch: "register"
			it: '/registrati',    // Italian: "register"
			us: '/register'
		},

		'/forgot-password': {
			en: '/forgot-password',
			de: '/passwort-vergessen',
			nl: '/wachtwoord-vergeten',
			it: '/password-dimenticata',
			us: '/forgot-password'
		},

		'/reset-password': {
			en: '/reset-password',
			de: '/passwort-zurucksetzen',
			nl: '/wachtwoord-resetten',
			it: '/reimposta-password',
			us: '/reset-password'
		},

		'/account': {
			en: '/account',
			de: '/konto',         // German uses "Konto"
			nl: '/account',       // Dutch same as English
			it: '/account',       // Italian same as English
			us: '/account'
		},

		'/account/orders': {
			en: '/account/orders',
			de: '/konto/bestellungen',    // Orders
			nl: '/account/bestellingen',
			it: '/account/ordini',
			us: '/account/orders'
		},

		'/account/addresses': {
			en: '/account/addresses',
			de: '/konto/adressen',        // Addresses
			nl: '/account/adressen',
			it: '/account/indirizzi',
			us: '/account/addresses'
		},

		'/account/wishlist': {
			en: '/account/wishlist',
			de: '/konto/wunschliste',     // Wishlist
			nl: '/account/verlanglijst',
			it: '/account/lista-desideri',
			us: '/account/wishlist'
		},

		'/account/settings': {
			en: '/account/settings',
			de: '/konto/einstellungen',   // Settings
			nl: '/account/instellingen',
			it: '/account/impostazioni',
			us: '/account/settings'
		},

		// ================================================
		// Admin
		// ================================================

		'/admin': '/admin',

		// Support/Contact
		'/contact': {
			en: '/contact',
			de: '/kontakt',
			nl: '/contact',
			it: '/contatti',
			us: '/contact'
		},

		'/support': {
			en: '/support',
			de: '/support',
			nl: '/support',
			it: '/assistenza',
			us: '/support'
		},


		// ================================================
		// Legal
		// ================================================

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