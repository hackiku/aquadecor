// src/lib/i18n/config.ts
export const locales = ['en', 'de', 'nl', 'it', 'us'] as const;
export const defaultLocale = 'en' as const;

export type Locale = (typeof locales)[number];

// Market-specific configuration
export const marketConfig = {
	us: {
		// US market specific settings
		tariffNotice: true,
		restrictedProducts: ['some-product-ids'], // You'll populate this from DB
		currencyOverride: 'USD',
	},
} as const;

// Helper to check if locale is US market
export function isUSMarket(locale: string): boolean {
	return locale === 'us';
}

export const localeNames: Record<Locale, string> = {
	en: 'English',
	de: 'Deutsch',
	nl: 'Nederlands',
	it: 'Italiano',
	us: 'USA',
};