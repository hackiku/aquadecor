#!/usr/bin/env bun
// scripts/migrate-legacy-pricing.ts
// Run this to convert all products from old schema to new pricing/customization schema
// @ts-nocheck
import { drizzle } from "drizzle-orm/postgres-js";
import { isNull } from "drizzle-orm";
import postgres from "postgres";
import { products } from "../src/server/db/schema";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
	throw new Error("DATABASE_URL not set");
}

const client = postgres(connectionString);
const db = drizzle(client);

function legacyToPricing(product: any) {
	// Already has new pricing
	if (product.pricing) return product.pricing;

	// Check for quantity bundles first
	if (product.variantOptions?.quantity?.options) {
		return {
			type: 'quantity_bundle' as const,
			bundles: product.variantOptions.quantity.options.map((opt: any, idx: number) => ({
				quantity: opt.value,
				totalPriceEurCents: opt.priceEurCents,
				label: opt.label,
				isDefault: idx === 0,
			})),
		};
	}

	// Simple pricing
	if (product.basePriceEurCents !== null && product.basePriceEurCents !== undefined) {
		return {
			type: 'simple' as const,
			unitPriceEurCents: product.basePriceEurCents,
			allowQuantity: true,
		};
	}

	// Fallback to configuration (custom quote)
	return {
		type: 'configuration' as const,
		requiresQuote: true,
	};
}

function legacyToCustomization(product: any) {
	// Already has new customization
	if (product.customization) return product.customization;

	const customization: any = {};

	// Convert old addonOptions to new addons
	if (product.addonOptions?.items) {
		customization.addons = product.addonOptions.items
			.filter((item: any) => item.type === 'checkbox')
			.map((item: any) => ({
				id: item.name.toLowerCase().replace(/\s+/g, '_'),
				name: item.name,
				description: item.description,
				priceEurCents: item.priceEurCents || 0,
				type: 'checkbox' as const,
			}));
	}

	return Object.keys(customization).length > 0 ? customization : null;
}

async function main() {
	console.log("🚀 Starting migration of legacy products...\n");

	// Get all products without new pricing
	const legacyProducts = await db
		.select()
		.from(products)
		.where(isNull(products.pricing));

	console.log(`Found ${legacyProducts.length} products to migrate\n`);

	let successCount = 0;
	let errorCount = 0;

	for (const product of legacyProducts) {
		try {
			const newPricing = legacyToPricing(product);
			const newCustomization = legacyToCustomization(product);

			await db
				.update(products)
				.set({
					pricing: newPricing as any,
					customization: newCustomization as any,
				})
				.where(eq(products.id, product.id));

			console.log(`✓ ${product.sku || product.slug}: ${newPricing.type}`);
			successCount++;
		} catch (error) {
			console.error(`✗ ${product.sku || product.slug}:`, error);
			errorCount++;
		}
	}

	console.log(`\n✅ Migration complete!`);
	console.log(`   Success: ${successCount}`);
	console.log(`   Errors: ${errorCount}`);

	// Verify
	const remaining = await db
		.select()
		.from(products)
		.where(isNull(products.pricing));

	if (remaining.length > 0) {
		console.warn(`\n⚠️  Warning: ${remaining.length} products still without pricing`);
	}

	process.exit(errorCount > 0 ? 1 : 0);
}

main().finally(() => client.end());