// src/i18n/types.ts

import common from '~/messages/en/common.json';
import home from '~/messages/en/home.json';
import shop from '~/messages/en/shop.json';
import product from '~/messages/en/product.json';
import cart from '~/messages/en/cart.json';
import checkout from '~/messages/en/checkout.json';
import setup from '~/messages/en/setup.json';
import calculator from '~/messages/en/calculator.json';
import about from '~/messages/en/about.json';
import blog from '~/messages/en/blog.json';
import legal from '~/messages/en/legal.json';
import register from '~/messages/en/register.json';
import faq from '~/messages/en/faq.json';

/**
 * Combine all individual namespace files into one Messages type.
 * Since each JSON has the namespace as the root key (e.g. { "faq": {...} }),
 * intersecting them creates the full { common: ..., faq: ... } structure.
 */
export type Messages =
	typeof common &
	typeof home &
	typeof shop &
	typeof product &
	typeof cart &
	typeof checkout &
	typeof setup &
	typeof calculator &
	typeof about &
	typeof blog &
	typeof legal &
	typeof register &
	typeof faq;

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