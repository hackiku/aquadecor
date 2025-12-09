// src/server/api/middleware/validatePrice.ts
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { db } from "~/server/db";
import { products } from "~/server/db/schema";
import type { Product } from "~/server/db/schema/shop";

export interface PriceValidationInput {
	productId: string;
	selections: {
		selectedBundleIndex?: number;
		quantity?: number;
		selectedAddonIds?: string[];
		selectValues?: Record<string, string>;
	};
	clientPrice: number;
}

/**
 * Calculate server-side price for a product with given selections
 * This MUST match the client-side calculation exactly
 */
export function calculateServerPrice(
	product: Product,
	selections: PriceValidationInput['selections']
): number {
	const pricingConfig = product.pricing;
	const customConfig = product.customization;

	if (!pricingConfig) {
		throw new TRPCError({
			code: 'NOT_FOUND',
			message: 'Product pricing not configured',
		});
	}

	let base = 0;

	// Base price
	if (pricingConfig.type === 'simple') {
		const qty = selections.quantity || 1;
		base = pricingConfig.unitPriceEurCents * qty;
	} else if (pricingConfig.type === 'quantity_bundle') {
		const bundleIndex = selections.selectedBundleIndex || 0;
		const bundle = pricingConfig.bundles[bundleIndex];
		if (!bundle) {
			throw new TRPCError({
				code: 'BAD_REQUEST',
				message: 'Invalid bundle selection',
			});
		}
		base = bundle.totalPriceEurCents;
	} else if (pricingConfig.type === 'configuration') {
		throw new TRPCError({
			code: 'BAD_REQUEST',
			message: 'Custom products require quote',
		});
	}

	// Add addons
	if (customConfig?.addons && selections.selectedAddonIds) {
		for (const addonId of selections.selectedAddonIds) {
			const addon = customConfig.addons.find(a => a.id === addonId);
			if (addon) {
				base += addon.priceEurCents;
			}
		}
	}

	// Add select option prices
	if (customConfig?.selects && selections.selectValues) {
		for (const select of customConfig.selects) {
			const selectedValue = selections.selectValues[select.id];
			if (selectedValue) {
				const option = select.options.find(o => o.value === selectedValue);
				if (option?.priceEurCents) {
					base += option.priceEurCents;
				}
			}
		}
	}

	return base;
}

/**
 * Validate that client-submitted price matches server calculation
 * Call this before adding to cart or creating order
 */
export async function validatePrice(input: PriceValidationInput) {
	// Fetch product
	const product = await db.query.products.findFirst({
		where: eq(products.id, input.productId),
	});

	if (!product) {
		throw new TRPCError({
			code: 'NOT_FOUND',
			message: 'Product not found',
		});
	}

	// Calculate expected price
	const serverPrice = calculateServerPrice(product, input.selections);

	// Allow 1 cent tolerance for rounding
	const tolerance = 1;
	const difference = Math.abs(serverPrice - input.clientPrice);

	if (difference > tolerance) {
		throw new TRPCError({
			code: 'BAD_REQUEST',
			message: `Price mismatch: expected €${(serverPrice / 100).toFixed(2)}, got €${(input.clientPrice / 100).toFixed(2)}. Please refresh and try again.`,
		});
	}

	return {
		validatedPrice: serverPrice,
		product,
	};
}