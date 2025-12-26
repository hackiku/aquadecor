// @ts-nocheck
// src/lib/i18n/helpers.ts

export function getHreflangAlternates(
	locale: Locale,
	path: string,
	availableLocales: Locale[]
): Record<string, string> {
	const baseUrl = 'https://aquadecorbackgrounds.com';
	const alternates: Record<string, string> = {};

	// Only add hreflang for locales where this page exists
	for (const availableLocale of availableLocales) {
		const hreflangCode = {
			us: 'en-US',
			de: 'de-DE',
			nl: 'nl-NL',
		}[availableLocale];

		alternates[hreflangCode] = `${baseUrl}/${availableLocale}${path}`;
	}

	// x-default = fallback for unknown locales (usually your main market)
	alternates['x-default'] = `${baseUrl}/us${path}`;

	return alternates;
}