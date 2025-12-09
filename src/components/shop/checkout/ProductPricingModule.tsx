// src/components/shop/checkout/ProductPricingModule.tsx
"use client";

import { useState, useMemo, useEffect } from "react";
import { CustomOnlyBadge } from "~/components/shop/product/CustomOnlyBadge";
import { AddToCartButton } from "~/components/shop/cart/AddToCartButton";
import { Input } from "~/components/ui/input";
import { Truck, Clock, Package } from "lucide-react";
import type { Product } from "~/server/db/schema/shop";
import { Button } from "~/components/ui/button";
import { BundleSelector } from "./BundleSelector";
import { AddonCheckboxes } from "./AddonCheckboxes";
import { CustomInputs } from "./CustomInputs";
import { SelectOptions } from "./SelectOptions";
import { PriceDisplay } from "./PriceDisplay";

interface ProductPricingModuleProps {
	product: Product & { categorySlug: string; productLineSlug: string };
	isCustomOnly: boolean;
}

export function ProductPricingModule({ product, isCustomOnly }: ProductPricingModuleProps) {
	// Debug logging (remove after testing)
	useEffect(() => {
		console.log('[ProductPricingModule] Initialized', {
			productId: product.id,
			slug: product.slug,
			isCustomOnly,
			pricingType: product.pricing?.type,
			stockStatus: product.stockStatus,
			hasPricing: !!product.pricing,
			hasLegacyPrice: !!product.basePriceEurCents,
		});
	}, [product, isCustomOnly]);

	// Get pricing config (new or legacy)
	const pricingConfig = product.pricing || legacyToPricing(product);
	const customConfig = product.customization;

	// State
	const [selectedBundleIndex, setSelectedBundleIndex] = useState(() => {
		if (pricingConfig?.type === 'quantity_bundle') {
			const defaultIndex = pricingConfig.bundles.findIndex(b => b.isDefault);
			return defaultIndex !== -1 ? defaultIndex : 0;
		}
		return 0;
	});

	const [quantity, setQuantity] = useState(1);
	const [selectedAddonIds, setSelectedAddonIds] = useState<Set<string>>(new Set());
	const [inputValues, setInputValues] = useState<Record<string, string>>({});
	const [selectValues, setSelectValues] = useState<Record<string, string>>({});

	// Initialize defaults
	useEffect(() => {
		if (customConfig?.selects) {
			const defaults: Record<string, string> = {};
			customConfig.selects.forEach(select => {
				const defaultOpt = select.options.find(o => o.isDefault) || select.options[0];
				if (defaultOpt) defaults[select.id] = defaultOpt.value;
			});
			setSelectValues(defaults);
		}
	}, [customConfig]);

	// Validation
	const { errors, isValid } = useMemo(() => {
		const errors: Record<string, string> = {};

		customConfig?.inputs?.forEach(input => {
			const value = inputValues[input.id];

			if (input.required && !value) {
				errors[input.id] = `${input.label} is required`;
			}

			if (value && input.type === 'number') {
				const num = parseFloat(value);
				if (isNaN(num)) {
					errors[input.id] = 'Must be a valid number';
				} else {
					if (input.validation?.min !== undefined && num < input.validation.min) {
						errors[input.id] = `Must be at least ${input.validation.min}`;
					}
					if (input.validation?.max !== undefined && num > input.validation.max) {
						errors[input.id] = `Must not exceed ${input.validation.max}`;
					}
				}
			}
		});

		customConfig?.selects?.forEach(select => {
			if (select.required && !selectValues[select.id]) {
				errors[select.id] = `${select.label} is required`;
			}
		});

		return { errors, isValid: Object.keys(errors).length === 0 };
	}, [inputValues, selectValues, customConfig]);

	// Price calculation
	const { totalPrice, breakdown } = useMemo(() => {
		let base = 0;
		const breakdown: Array<{ label: string; amountEurCents: number }> = [];

		// Base price
		if (pricingConfig?.type === 'simple') {
			base = pricingConfig.unitPriceEurCents * quantity;
			breakdown.push({ label: `Unit Price × ${quantity}`, amountEurCents: base });
		} else if (pricingConfig?.type === 'quantity_bundle') {
			const bundle = pricingConfig.bundles[selectedBundleIndex];
			if (bundle) {
				base = bundle.totalPriceEurCents;
				breakdown.push({ label: bundle.label || `${bundle.quantity} pieces`, amountEurCents: base });
			}
		}

		// Addons
		customConfig?.addons?.forEach(addon => {
			if (selectedAddonIds.has(addon.id)) {
				base += addon.priceEurCents;
				breakdown.push({ label: `+ ${addon.name}`, amountEurCents: addon.priceEurCents });
			}
		});

		// Select options
		customConfig?.selects?.forEach(select => {
			const selectedValue = selectValues[select.id];
			const selectedOption = select.options.find(o => o.value === selectedValue);
			if (selectedOption?.priceEurCents) {
				base += selectedOption.priceEurCents;
				breakdown.push({ label: `+ ${selectedOption.label}`, amountEurCents: selectedOption.priceEurCents });
			}
		});

		console.log('[Price Calculation]', { base, breakdown, pricingType: pricingConfig?.type });

		return { totalPrice: base, breakdown };
	}, [pricingConfig, selectedBundleIndex, quantity, selectedAddonIds, selectValues, customConfig]);

	// Custom quote products
	if (isCustomOnly || pricingConfig?.type === 'configuration') {
		console.log('[Custom Only Mode]', { isCustomOnly, pricingType: pricingConfig?.type });
		return (
			<div className="space-y-6">
				<CustomOnlyBadge variant="banner" showCalculatorLink />
				<TrustSignals />
				<Button asChild className="w-full rounded-full shadow-lg shadow-primary/20">
					<a href={pricingConfig?.type === 'configuration' ? pricingConfig.calculatorUrl || '/calculator' : '/calculator'}>
						Get Custom Quote
					</a>
				</Button>
			</div>
		);
	}

	// No pricing configured at all
	if (!pricingConfig || totalPrice === 0) {
		console.warn('[No Pricing]', { pricingConfig, totalPrice });
		return (
			<div className="space-y-4 text-center p-6 border-2 border-dashed rounded-xl">
				<p className="text-sm text-muted-foreground">Pricing not configured for this product</p>
			</div>
		);
	}

	// Regular products
	console.log('[Regular Product Mode]', { totalPrice, isValid, pricingType: pricingConfig.type });

	return (
		<div className="space-y-6">
			{/* Bundle Selector */}
			{pricingConfig?.type === 'quantity_bundle' && pricingConfig.bundles.length > 0 && (
				<BundleSelector
					bundles={pricingConfig.bundles}
					selectedIndex={selectedBundleIndex}
					onSelect={setSelectedBundleIndex}
				/>
			)}

			{/* Simple Quantity */}
			{pricingConfig?.type === 'simple' && pricingConfig.allowQuantity && (
				<div className="space-y-3 pb-4 border-b">
					<div className="flex items-center justify-between">
						<label className="text-sm font-display font-medium">Quantity</label>
						<span className="text-sm font-display font-medium text-muted-foreground">{quantity}</span>
					</div>
					<Input
						type="number"
						min={1}
						max={pricingConfig.maxQuantity || 100}
						value={quantity}
						onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
						className="font-display"
					/>
				</div>
			)}

			{/* Addons */}
			{customConfig?.addons && (
				<AddonCheckboxes
					addons={customConfig.addons}
					selectedIds={selectedAddonIds}
					onToggle={(id) => {
						const newSet = new Set(selectedAddonIds);
						if (newSet.has(id)) newSet.delete(id);
						else newSet.add(id);
						setSelectedAddonIds(newSet);
					}}
				/>
			)}

			{/* Selects */}
			{customConfig?.selects && (
				<SelectOptions
					selects={customConfig.selects}
					selectedValues={selectValues}
					onSelect={(id, value) => setSelectValues(prev => ({ ...prev, [id]: value }))}
				/>
			)}

			{/* Inputs */}
			{customConfig?.inputs && (
				<CustomInputs
					inputs={customConfig.inputs}
					values={inputValues}
					errors={errors}
					onChange={(id, value) => setInputValues(prev => ({ ...prev, [id]: value }))}
				/>
			)}

			{/* Price */}
			<PriceDisplay totalEurCents={totalPrice} breakdown={breakdown} />

			{/* Trust Signals */}
			<TrustSignals />

			{/* CTA */}
			<AddToCartButton
				product={{
					id: product.id,
					slug: product.slug,
					name: product.name,
					sku: product.sku,
					basePriceEurCents: totalPrice,
					quantity: pricingConfig?.type === 'simple' ? quantity : 1,
				}}
				size="lg"
				className="w-full rounded-full shadow-lg shadow-primary/20"
				disabled={!isValid || totalPrice === 0}
			/>

			{!isValid && Object.keys(errors).length > 0 && (
				<p className="text-xs text-center text-destructive font-display">
					Please complete all required fields
				</p>
			)}
		</div>
	);
}

// Trust signals component
function TrustSignals() {
	return (
		<div className="space-y-3 pt-4 border-t">
			<div className="flex items-center gap-3 text-sm">
				<div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
					<Truck className="h-4 w-4 text-primary" />
				</div>
				<span className="font-display font-light">Free worldwide shipping</span>
			</div>
			<div className="flex items-center gap-3 text-sm">
				<div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
					<Clock className="h-4 w-4 text-primary" />
				</div>
				<span className="font-display font-light">10-12 day production</span>
			</div>
			<div className="flex items-center gap-3 text-sm">
				<div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
					<Package className="h-4 w-4 text-primary" />
				</div>
				<span className="font-display font-light">Custom sizes available</span>
			</div>
		</div>
	);
}

// Legacy adapter
function legacyToPricing(product: Product): Product['pricing'] {
	if (product.pricing) return product.pricing;

	// Check for quantity bundles first
	if (product.variantOptions?.quantity?.options) {
		return {
			type: 'quantity_bundle',
			bundles: product.variantOptions.quantity.options.map((opt, idx) => ({
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
			type: 'simple',
			unitPriceEurCents: product.basePriceEurCents,
			allowQuantity: true,
		};
	}

	// Fallback to configuration (custom quote)
	return {
		type: 'configuration',
		requiresQuote: true,
	};
}