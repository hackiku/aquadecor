// src/lib/i18n/config.ts
export const locales = ['en', 'de', 'nl', 'it'] as const;
export const defaultLocale = 'en' as const;

export type Locale = (typeof locales)[number];

export const localeNames: Record<Locale, string> = {
	en: 'English',
	de: 'Deutsch',
	nl: 'Nederlands',
	it: 'Italiano',
};