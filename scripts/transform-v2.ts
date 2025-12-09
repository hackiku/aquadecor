#!/usr/bin/env bun
// scripts/transform-v2.ts
// Transforms old product seed data to V2 normalized structure
// Usage: bun run scripts/transform-v2.ts

import fs from 'fs';
import path from 'path';

const OLD_DIR = path.join(process.cwd(), 'src/server/db/seed/data/old');
const NEW_DIR = path.join(process.cwd(), 'src/server/db/seed/data/productLines');

// ============================================================================
// TRANSFORMATION LOGIC
// ============================================================================

function transformProduct(old: any): any {
	const product: any = {
		categorySlug: old.categorySlug,
		slug: old.slug,
		sku: old.sku,
		stockStatus: old.stockStatus || 'in_stock',
		isActive: old.isActive !== undefined ? old.isActive : true,
		isFeatured: old.isFeatured || false,
		sortOrder: old.sortOrder || 0,
	};

	// Extract from specifications
	if (old.specifications) {
		const specs = old.specifications;

		if (specs.material) product.material = specs.material;
		if (specs.productionTime) product.productionTime = specs.productionTime;

		// Dimensions
		if (specs.dimensions) {
			if (specs.dimensions.widthCm) product.widthCm = specs.dimensions.widthCm;
			if (specs.dimensions.heightCm) product.heightCm = specs.dimensions.heightCm;
			if (specs.dimensions.depthCm) product.depthCm = specs.dimensions.depthCm;
		}

		if (specs.weightGrams) product.weightGrams = specs.weightGrams;

		// Technical specs
		const techSpecs: any = {};
		if (specs.isFloating !== undefined) techSpecs.isFloating = specs.isFloating;
		if (specs.hasFilterCutout !== undefined) techSpecs.hasFilterCutout = specs.hasFilterCutout;
		if (specs.modularity) techSpecs.modularity = specs.modularity;
		if (specs.compatibility) techSpecs.compatibility = specs.compatibility;

		if (Object.keys(techSpecs).length > 0) {
			product.technicalSpecs = techSpecs;
		}
	}

	return product;
}

function extractPricing(old: any): any {
	const pricing: any = {
		productSlug: old.slug,
		slug: `${old.slug}-pricing`,
	};

	// Determine type
	if (old.variantOptions?.quantity?.options) {
		pricing.pricingType = 'quantity_bundle';
	} else if (old.basePriceEurCents !== null && old.basePriceEurCents !== undefined) {
		pricing.pricingType = 'simple';
		pricing.unitPriceEurCents = old.basePriceEurCents;
		pricing.allowQuantity = true;
		pricing.maxQuantity = 100;
	} else {
		pricing.pricingType = 'configured';
	}

	return pricing;
}

function extractBundles(old: any): any[] {
	if (!old.variantOptions?.quantity?.options) return [];

	return old.variantOptions.quantity.options.map((opt: any, idx: number) => ({
		pricingSlug: `${old.slug}-pricing`,
		quantity: opt.value,
		totalPriceEurCents: opt.priceEurCents,
		label: opt.label,
		isDefault: idx === 0,
	}));
}

function extractAddons(old: any): any[] {
	if (!old.addonOptions?.items) return [];

	return old.addonOptions.items
		.filter((addon: any) => addon.type === 'checkbox')
		.map((addon: any) => ({
			productSlug: old.slug,
			addonId: addon.name.toLowerCase().replace(/\s+/g, '_'),
			name: addon.name,
			description: addon.description,
			priceEurCents: addon.priceEurCents || 0,
			isDefault: false,
		}));
}

function extractMarketExclusions(old: any): any[] {
	if (!old.excludedMarkets || old.excludedMarkets.length === 0) return [];

	return old.excludedMarkets.map((market: string) => ({
		productSlug: old.slug,
		market: market,
	}));
}

function transformTranslations(oldTranslations: any): any {
	const newTranslations: any = {};

	for (const [slug, langs] of Object.entries(oldTranslations)) {
		newTranslations[slug] = {};

		for (const [locale, content] of Object.entries(langs as any)) {
			// Only keep en and de
			if (locale !== 'en' && locale !== 'de') continue;

			const c = content as any;
			newTranslations[slug][locale] = {
				name: c.name,
				shortDescription: c.shortDescription || '',
				fullDescription: c.fullDescription || c.longDescription || c.description || '',
				metaTitle: c.metaTitle || `${c.name} | Aquadecor Backgrounds`,
				metaDescription: c.metaDescription || (c.shortDescription?.substring(0, 155) || ''),
			};
		}
	}

	return newTranslations;
}

function transformMedia(oldMedia: any[]): any[] {
	return oldMedia.map(item => ({
		...item,
		storagePath: item.storagePath || null,
	}));
}

// ============================================================================
// FILE GENERATORS
// ============================================================================

function generateProductsFile(products: any[], categoryPath: string): string {
	const relativePath = categoryPath.replace(NEW_DIR, '').replace(/\\/g, '/');

	return `// src/server/db/seed/data/productLines${relativePath}/products.ts

export const products = ${JSON.stringify(products, null, '\t')};
`;
}

function generatePricingFile(pricing: any[], bundles: any[], addons: any[], exclusions: any[], categoryPath: string): string {
	const relativePath = categoryPath.replace(NEW_DIR, '').replace(/\\/g, '/');

	let content = `// src/server/db/seed/data/productLines${relativePath}/pricing.ts

// ============================================================================
// PRODUCT PRICING
// ============================================================================
export const pricing = ${JSON.stringify(pricing, null, '\t')};

`;

	content += `// ============================================================================
// PRICING BUNDLES
// ============================================================================
export const bundles = ${JSON.stringify(bundles, null, '\t')};

`;

	content += `// ============================================================================
// PRODUCT ADDONS
// ============================================================================
export const addons = ${JSON.stringify(addons, null, '\t')};

`;

	content += `// ============================================================================
// MARKET EXCLUSIONS
// ============================================================================
export const marketExclusions = ${JSON.stringify(exclusions, null, '\t')};
`;

	return content;
}

function generateTranslationsFile(translations: any, categoryPath: string): string {
	const relativePath = categoryPath.replace(NEW_DIR, '').replace(/\\/g, '/');

	return `// src/server/db/seed/data/productLines${relativePath}/translations.ts

import type { TranslationSeed } from "../../../../../schema";

export const translations: TranslationSeed = ${JSON.stringify(translations, null, '\t')};
`;
}

function generateMediaFile(media: any[], categoryPath: string): string {
	const relativePath = categoryPath.replace(NEW_DIR, '').replace(/\\/g, '/');

	return `// src/server/db/seed/data/productLines${relativePath}/media.ts

import type { MediaSeed } from "../../../../../schema";

export const media: MediaSeed[] = ${JSON.stringify(media, null, '\t')};
`;
}

// ============================================================================
// CATEGORY PROCESSOR (Using Dynamic Import)
// ============================================================================

async function processCategory(oldCategoryPath: string, newCategoryPath: string): Promise<void> {
	const categoryName = path.basename(oldCategoryPath);
	console.log(`\n📦 Processing: ${categoryName}`);

	try {
		// Build absolute paths for dynamic import
		const productsPath = path.join(oldCategoryPath, 'products.ts');
		const translationsPath = path.join(oldCategoryPath, 'translations.ts');
		const mediaPath = path.join(oldCategoryPath, 'media.ts');

		if (!fs.existsSync(productsPath)) {
			console.log(`  ⚠️  No products.ts found, skipping`);
			return;
		}

		// Dynamic import (works with TypeScript!)
		const productsModule = await import(`file://${productsPath}`);
		const oldProducts = productsModule.products;

		if (!oldProducts) {
			console.log(`  ❌ No products export found`);
			return;
		}

		// Transform products
		const newProducts = oldProducts.map(transformProduct);
		const allPricing = oldProducts.map(extractPricing);
		const allBundles = oldProducts.flatMap(extractBundles);
		const allAddons = oldProducts.flatMap(extractAddons);
		const allExclusions = oldProducts.flatMap(extractMarketExclusions);

		console.log(`  ✓ Transformed ${newProducts.length} products`);
		console.log(`  ✓ Extracted ${allPricing.length} pricing configs`);
		console.log(`  ✓ Extracted ${allBundles.length} bundles`);
		console.log(`  ✓ Extracted ${allAddons.length} addons`);
		console.log(`  ✓ Extracted ${allExclusions.length} market exclusions`);

		// Transform translations
		let newTranslations = {};
		if (fs.existsSync(translationsPath)) {
			const translationsModule = await import(`file://${translationsPath}`);
			const oldTranslations = translationsModule.translations;
			if (oldTranslations) {
				newTranslations = transformTranslations(oldTranslations);
				console.log(`  ✓ Transformed translations`);
			}
		}

		// Transform media
		let newMedia: any[] = [];
		if (fs.existsSync(mediaPath)) {
			const mediaModule = await import(`file://${mediaPath}`);
			const oldMedia = mediaModule.media;
			if (oldMedia) {
				newMedia = transformMedia(oldMedia);
				console.log(`  ✓ Transformed ${newMedia.length} media items`);
			}
		}

		// Create new directory
		fs.mkdirSync(newCategoryPath, { recursive: true });

		// Write new files
		fs.writeFileSync(
			path.join(newCategoryPath, 'products.ts'),
			generateProductsFile(newProducts, newCategoryPath)
		);

		fs.writeFileSync(
			path.join(newCategoryPath, 'pricing.ts'),
			generatePricingFile(allPricing, allBundles, allAddons, allExclusions, newCategoryPath)
		);

		fs.writeFileSync(
			path.join(newCategoryPath, 'translations.ts'),
			generateTranslationsFile(newTranslations, newCategoryPath)
		);

		fs.writeFileSync(
			path.join(newCategoryPath, 'media.ts'),
			generateMediaFile(newMedia, newCategoryPath)
		);

		console.log(`  ✅ Written all files`);

	} catch (error: any) {
		console.error(`  ❌ Error:`, error.message);
	}
}

// ============================================================================
// MAIN
// ============================================================================

async function main() {
	console.log('🚀 V2 Seed Data Transformation\n');
	console.log(`Old: ${OLD_DIR}`);
	console.log(`New: ${NEW_DIR}\n`);

	// Create new directory
	fs.mkdirSync(NEW_DIR, { recursive: true });

	const productLines = ['3d-backgrounds', 'aquarium-decorations'];

	for (const productLine of productLines) {
		const oldProductLinePath = path.join(OLD_DIR, productLine);
		const newProductLinePath = path.join(NEW_DIR, productLine);

		if (!fs.existsSync(oldProductLinePath)) {
			console.log(`⚠️  Skipping ${productLine} - not found`);
			continue;
		}

		console.log(`\n${'='.repeat(60)}`);
		console.log(`📦 PRODUCT LINE: ${productLine.toUpperCase()}`);
		console.log('='.repeat(60));

		// Copy static files
		const staticFiles = ['categories.ts', 'category-translations.ts', 'index.ts'];
		for (const file of staticFiles) {
			const oldPath = path.join(oldProductLinePath, file);
			const newPath = path.join(newProductLinePath, file);

			if (fs.existsSync(oldPath)) {
				fs.mkdirSync(path.dirname(newPath), { recursive: true });
				fs.copyFileSync(oldPath, newPath);
				console.log(`✓ Copied ${file}`);
			}
		}

		// Get categories
		const categories = fs.readdirSync(oldProductLinePath)
			.filter(item => {
				const itemPath = path.join(oldProductLinePath, item);
				return fs.statSync(itemPath).isDirectory();
			});

		// Process each category
		for (const category of categories) {
			// Copy magical-items as-is (already V2)
			if (category === 'magical-items') {
				console.log(`\n📦 Copying: magical-items (already V2)`);
				const oldCatPath = path.join(oldProductLinePath, category);
				const newCatPath = path.join(newProductLinePath, category);
				fs.mkdirSync(newCatPath, { recursive: true });

				const files = fs.readdirSync(oldCatPath);
				for (const file of files) {
					fs.copyFileSync(
						path.join(oldCatPath, file),
						path.join(newCatPath, file)
					);
				}
				console.log(`  ✅ Copied all files`);
				continue;
			}

			const oldCategoryPath = path.join(oldProductLinePath, category);
			const newCategoryPath = path.join(newProductLinePath, category);

			await processCategory(oldCategoryPath, newCategoryPath);
		}
	}

	console.log(`\n${'='.repeat(60)}`);
	console.log('✨ Transformation Complete!');
	console.log('='.repeat(60));
	console.log('\nNext steps:');
	console.log('1. Review generated files in productLines/');
	console.log('2. Update seed/seed.ts imports to use productLines/');
	console.log('3. Run: bun run db:fresh\n');
}

main().catch(console.error);