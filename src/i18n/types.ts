// src/i18n/types.ts

/**
 * Type utilities for type-safe translations
 */

import type enMessages from '~/messages/en.json';

/**
 * All message keys from en.json (base locale)
 */
export type Messages = typeof enMessages;

/**
 * Recursively get all nested keys from an object
 * e.g., "common.nav.shop" or "setup.examples.1.title"
 */
type NestedKeyOf<T> = T extends object
	? {
		[K in keyof T]: K extends string
		? T[K] extends object
		? `${K}.${NestedKeyOf<T[K]>}`
		: K
		: never;
	}[keyof T]
	: never;

/**
 * All possible translation key paths
 * Usage: const key: TranslationKey = "common.nav.shop";
 */
export type TranslationKey = NestedKeyOf<Messages>;

/**
 * Type for namespace keys (top-level keys)
 */
export type Namespace = keyof Messages;

/**
 * Get the value type for a given key path
 */
export type MessageValue<K extends string> = K extends keyof Messages
	? Messages[K]
	: K extends `${infer N}.${infer R}`
	? N extends keyof Messages
	? R extends keyof Messages[N]
	? Messages[N][R]
	: never
	: never
	: never;