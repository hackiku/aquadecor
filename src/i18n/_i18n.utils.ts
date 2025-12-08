// src/lib/i18n/i18n.utils.ts

import { notFound } from 'next/navigation';

// Namespaces that are always loaded (e.g., Nav, Footer, Global buttons, all SEO/Meta)
const ALWAYS_LOADED_NAMESPACES = ['common', 'metadata'];

/**
 * Dynamically loads translation messages, split into namespaces.
 * This function allows pages to load only the JSON data they need.
 * @param locale The current locale ('en', 'de', 'us', etc.)
 * @param pageNamespaces Namespaces specific to the current page (e.g., ['setup', 'shop'])
 * @returns A flattened object of all loaded messages, keyed by namespace.
 */
export async function getPageMessages(locale: string, pageNamespaces: string[]) {
	// Use a Set to ensure no duplicates, then convert back to an array
	const namespacesToLoad = Array.from(new Set([...pageNamespaces, ...ALWAYS_LOADED_NAMESPACES]));
	const allMessages: Record<string, any> = {};

	for (const namespace of namespacesToLoad) {
		try {
			// NOTE: Using the tilde (~) alias for the root folder
			const messages = (await import(`~/messages/${locale}/${namespace}.json`)).default;
			allMessages[namespace] = messages;
		} catch (error) {
			// --- FALLBACK SAFETY DURING DEV/TRANSLATION ---
			// If the base language (en) is missing, it is an application error.
			// If a translation (de, us, etc.) is missing, we log a warning and continue.
			if (locale === 'en') {
				console.error(`CRITICAL: Missing base namespace file: ${locale}/${namespace}.json`);
				// We still don't call notFound() here, as a missing base file should be treated as a bug
				// but for faster development you might want it to fail gracefully.
			} else {
				// Only log a warning for missing translations
				console.warn(`[i18n] Missing namespace file: ${locale}/${namespace}.json. Falling back to key/default locale.`);
			}
			allMessages[namespace] = {}; // Ensure the namespace object exists to prevent runtime errors
		}
	}

	return allMessages;
}