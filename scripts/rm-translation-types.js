#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

const dataDir = path.join(process.cwd(), 'src/server/db/seed/data/productLines');

function removeTypeAnnotations(filePath) {
	const content = fs.readFileSync(filePath, 'utf8');

	// Remove `: TranslationSeed` type annotation from export statements
	const updatedContent = content.replace(
		/export\s+const\s+translations:\s*TranslationSeed\s*=/g,
		'export const translations ='
	);

	if (content !== updatedContent) {
		fs.writeFileSync(filePath, updatedContent, 'utf8');
		console.log(`✓ Removed type annotation from: ${filePath}`);
		return true;
	}

	return false;
}

function processDirectory(dir) {
	const entries = fs.readdirSync(dir, { withFileTypes: true });
	let count = 0;

	for (const entry of entries) {
		const fullPath = path.join(dir, entry.name);

		if (entry.isDirectory()) {
			count += processDirectory(fullPath);
		} else if (entry.name === 'translations.ts') {
			if (removeTypeAnnotations(fullPath)) {
				count++;
			}
		}
	}

	return count;
}

const filesModified = processDirectory(dataDir);
console.log(`\nTotal files modified: ${filesModified}`);