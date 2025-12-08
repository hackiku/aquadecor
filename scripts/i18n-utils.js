#!/usr/bin/env node
// scripts/i18n-utils.js
/**
 * Utility script for managing translations
 * Usage: 
 *   node scripts/i18n-utils.js check        - Check for missing translations
 *   node scripts/i18n-utils.js add-key      - Add a key to all locales
 */

const fs = require('fs');
const path = require('path');

const MESSAGES_DIR = path.join(__dirname, '../src/messages');
const LOCALES = ['en', 'us', 'de', 'nl', 'it'];

// Get all nested keys from an object
function getAllKeys(obj, prefix = '') {
	let keys = [];
	for (const key in obj) {
		const fullKey = prefix ? `${prefix}.${key}` : key;
		if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
			keys = keys.concat(getAllKeys(obj[key], fullKey));
		} else {
			keys.push(fullKey);
		}
	}
	return keys;
}

// Load messages for a locale
function loadMessages(locale) {
	const filePath = path.join(MESSAGES_DIR, `${locale}.json`);
	if (!fs.existsSync(filePath)) {
		return null;
	}
	return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

// Check for missing translations
function checkMissingTranslations() {
	console.log('🔍 Checking for missing translations...\n');

	const baseMessages = loadMessages('en');
	const baseKeys = new Set(getAllKeys(baseMessages));

	let hasIssues = false;

	for (const locale of LOCALES) {
		if (locale === 'en') continue;

		const messages = loadMessages(locale);
		if (!messages) {
			console.log(`⚠️  ${locale}.json not found`);
			hasIssues = true;
			continue;
		}

		const localeKeys = new Set(getAllKeys(messages));
		const missingKeys = [...baseKeys].filter(key => !localeKeys.has(key));

		if (missingKeys.length > 0) {
			console.log(`❌ ${locale}.json is missing ${missingKeys.length} keys:`);
			missingKeys.slice(0, 10).forEach(key => console.log(`   - ${key}`));
			if (missingKeys.length > 10) {
				console.log(`   ... and ${missingKeys.length - 10} more`);
			}
			console.log();
			hasIssues = true;
		} else {
			console.log(`✅ ${locale}.json - All keys present`);
		}
	}

	if (!hasIssues) {
		console.log('\n✨ All translations are complete!');
	}
}

// Add a new key to all locales
function addKeyToAllLocales(keyPath, defaultValue) {
	console.log(`➕ Adding key "${keyPath}" to all locales...\n`);

	for (const locale of LOCALES) {
		const messages = loadMessages(locale);
		if (!messages) {
			console.log(`⚠️  Skipping ${locale}.json (not found)`);
			continue;
		}

		// Navigate to the parent object
		const keys = keyPath.split('.');
		let current = messages;

		for (let i = 0; i < keys.length - 1; i++) {
			if (!current[keys[i]]) {
				current[keys[i]] = {};
			}
			current = current[keys[i]];
		}

		// Add the key
		const lastKey = keys[keys.length - 1];
		if (current[lastKey]) {
			console.log(`⚠️  ${locale}.json - Key already exists, skipping`);
		} else {
			current[lastKey] = locale === 'en' ? defaultValue : `[TODO: Translate] ${defaultValue}`;

			// Write back to file
			const filePath = path.join(MESSAGES_DIR, `${locale}.json`);
			fs.writeFileSync(filePath, JSON.stringify(messages, null, 2) + '\n', 'utf-8');
			console.log(`✅ ${locale}.json - Key added`);
		}
	}

	console.log('\n✨ Done!');
}

// Main CLI
const command = process.argv[2];

if (command === 'check') {
	checkMissingTranslations();
} else if (command === 'add-key') {
	const keyPath = process.argv[3];
	const defaultValue = process.argv[4];

	if (!keyPath || !defaultValue) {
		console.log('Usage: node scripts/i18n-utils.js add-key <key.path> "Default value"');
		process.exit(1);
	}

	addKeyToAllLocales(keyPath, defaultValue);
} else {
	console.log(`
Aquadecor i18n Utilities

Usage:
  node scripts/i18n-utils.js check                           - Check for missing translations
  node scripts/i18n-utils.js add-key <key.path> "value"      - Add a key to all locales

Examples:
  node scripts/i18n-utils.js check
  node scripts/i18n-utils.js add-key "shop.product.addToCart" "Add to Cart"
	`);
}