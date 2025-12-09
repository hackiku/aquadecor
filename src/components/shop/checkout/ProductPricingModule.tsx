// src/components/shop/checkout/ProductPricingModule.tsx
"use client";

import { useState, useMemo, useEffect } from "react";
import { CustomOnlyBadge } from "~/components/shop/product/CustomOnlyBadge";
import { AddToCartButton } from "~/components/shop/cart/AddToCartButton";
import { Input } from "~/components/ui/input";
import { Truck, Clock, Package } from "lucide-react";
import { Button } from "~/components/ui/button";
import { BundleSelector } from "./BundleSelector";
import { AddonCheckboxes } from "./AddonCheckboxes";
import { CustomInputs } from "./CustomInputs";
import { SelectOptions } from "./SelectOptions";
import { PriceDisplay } from "./PriceDisplay";

interface ProductPricingModuleProps {
	product: any; // Product from getBySlug query
	isCustomOnly: boolean;
}

export function ProductPricingModule({ product, isCustomOnly }: ProductPricingModuleProps) {
	// Debug logging
	useEffect(() => {
		console.log('[ProductPricingModule] Initialized', {
			productId: product.id,
			slug: product.slug,
			isCustomOnly,
			pricingType: product.pricing?.pricingType,
			hasBundles: !!product.bundles,
			hasAddons: !!product.addons,
			hasCustomOptions: !!product.customizationOptions,
		});
	}, [product, isCustomOnly]);

	// Extract data from V2 structure
	const pricing = product.pricing;
	const bundles = product.bundles || [];
	const addons = product.addons || [];
	const customOptions = product.customizationOptions || [];

	// State
	const [selectedBundleIndex, setSelectedBundleIndex] = useState(() => {
		if (pricing?.pricingType === 'quantity_bundle' && bundles.length > 0) {
			const defaultIndex = bundles.findIndex((b: any) => b.isDefault);
			return defaultIndex !== -1 ? defaultIndex : 0;
		}
		return 0;
	});

	const [quantity, setQuantity] = useState(1);
	const [selectedAddonIds, setSelectedAddonIds] = useState<Set<string>>(new Set());
	const [inputValues, setInputValues] = useState<Record<string, string>>({});
	const [selectValues, setSelectValues] = useState<Record<string, string>>({});

	// Initialize select defaults
	useEffect(() => {
		const defaults: Record<string, string> = {};
		customOptions.forEach((opt: any) => {
			if (opt.type === 'select' && opt.selectOptions) {
				const defaultOpt = opt.selectOptions.find((o: any) => o.isDefault) || opt.selectOptions[0];
				if (defaultOpt) defaults[opt.id] = defaultOpt.value;
			}
		});
		setSelectValues(defaults);
	}, [customOptions]);

	// Validation
	const { errors, isValid } = useMemo(() => {
		const errors: Record<string, string> = {};

		customOptions.forEach((opt: any) => {
			const value = inputValues[opt.id];

			if (opt.type === 'input' || opt.type === 'textarea') {
				if (opt.required && !value) {
					errors[opt.id] = `${opt.label} is required`;
				}

				if (value && opt.inputType === 'number') {
					const num = parseFloat(value);
					if (isNaN(num)) {
						errors[opt.id] = 'Must be a valid number';
					} else {
						if (opt.minValue !== undefined && num < opt.minValue) {
							errors[opt.id] = `Must be at least ${opt.minValue}`;
						}
						if (opt.maxValue !== undefined && num > opt.maxValue) {
							errors[opt.id] = `Must not exceed ${opt.maxValue}`;
						}
					}
				}
			}

			if (opt.type === 'select') {
				if (opt.required && !selectValues[opt.id]) {
					errors[opt.id] = `${opt.label} is required`;
				}
			}
		});

		return { errors, isValid: Object.keys(errors).length === 0 };
	}, [inputValues, selectValues, customOptions]);

	// Price calculation
	const { totalPrice, breakdown } = useMemo(() => {
		let base = 0;
		const breakdown: Array<{ label: string; amountEurCents: number }> = [];

		// Base price
		if (pricing?.pricingType === 'simple') {
			base = (pricing.unitPriceEurCents || 0) * quantity;
			breakdown.push({ label: `Unit Price × ${quantity}`, amountEurCents: base });
		} else if (pricing?.pricingType === 'quantity_bundle' && bundles.length > 0) {
			const bundle = bundles[selectedBundleIndex];
			if (bundle) {
				base = bundle.totalPriceEurCents || 0;
				breakdown.push({ label: bundle.label || `${bundle.quantity} pieces`, amountEurCents: base });
			}
		}

		// Addons
		addons.forEach((addon: any) => {
			if (selectedAddonIds.has(addon.id)) {
				base += addon.priceEurCents || 0;
				breakdown.push({ label: `+ ${addon.name}`, amountEurCents: addon.priceEurCents || 0 });
			}
		});

		// Select options
		customOptions.forEach((opt: any) => {
			if (opt.type === 'select' && opt.selectOptions) {
				const selectedValue = selectValues[opt.id];
				const selectedOption = opt.selectOptions.find((o: any) => o.value === selectedValue);
				if (selectedOption?.priceEurCents) {
					base += selectedOption.priceEurCents;
					breakdown.push({ label: `+ ${selectedOption.label}`, amountEurCents: selectedOption.priceEurCents });
				}
			}
		});

		console.log('[Price Calculation]', { base, breakdown, pricingType: pricing?.pricingType });

		return { totalPrice: base, breakdown };
	}, [pricing, selectedBundleIndex, quantity, selectedAddonIds, selectValues, addons, customOptions, bundles]);

	// Custom quote products
	if (isCustomOnly || pricing?.pricingType === 'configured') {
		console.log('[Custom Only Mode]');
		return (
			<div className="space-y-6">
				<CustomOnlyBadge variant="banner" showCalculatorLink />
				<TrustSignals />
				<Button asChild className="w-full rounded-full shadow-lg shadow-primary/20">
					<a href="/calculator">Get Custom Quote</a>
				</Button>
			</div>
		);
	}

	// No pricing configured
	if (!pricing || totalPrice === 0) {
		console.warn('[No Pricing]', { pricing, totalPrice });
		return (
			<div className="space-y-4 text-center p-6 border-2 border-dashed rounded-xl">
				<p className="text-sm text-muted-foreground">Pricing not configured for this product</p>
			</div>
		);
	}

	// Format bundles for BundleSelector component
	const formattedBundles = bundles.map((b: any) => ({
		quantity: b.quantity,
		totalPriceEurCents: b.totalPriceEurCents,
		label: b.label,
		isDefault: b.isDefault,
	}));

	// Format addons for AddonCheckboxes component
	const formattedAddons = addons.map((a: any) => ({
		id: a.id,
		name: a.name,
		description: a.description,
		priceEurCents: a.priceEurCents,
		isDefault: a.isDefault,
	}));

	// Format custom inputs
	const inputOptions = customOptions.filter((opt: any) => opt.type === 'input' || opt.type === 'textarea');
	const selectOptions = customOptions.filter((opt: any) => opt.type === 'select');

	console.log('[Regular Product Mode]', { totalPrice, isValid, pricingType: pricing.pricingType });

	return (
		<div className="space-y-6">
			{/* Bundle Selector */}
			{pricing?.pricingType === 'quantity_bundle' && formattedBundles.length > 0 && (
				<BundleSelector
					bundles={formattedBundles}
					selectedIndex={selectedBundleIndex}
					onSelect={setSelectedBundleIndex}
				/>
			)}

			{/* Simple Quantity */}
			{pricing?.pricingType === 'simple' && pricing.allowQuantity && (
				<div className="space-y-3 pb-4 border-b">
					<div className="flex items-center justify-between">
						<label className="text-sm font-display font-medium">Quantity</label>
						<span className="text-sm font-display font-medium text-muted-foreground">{quantity}</span>
					</div>
					<Input
						type="number"
						min={1}
						max={pricing.maxQuantity || 100}
						value={quantity}
						onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
						className="font-display"
					/>
				</div>
			)}

			{/* Addons */}
			{formattedAddons.length > 0 && (
				<AddonCheckboxes
					addons={formattedAddons}
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
			{selectOptions.length > 0 && (
				<SelectOptions
					selects={selectOptions.map((opt: any) => ({
						id: opt.id,
						label: opt.label,
						required: opt.required,
						options: opt.selectOptions || [],
					}))}
					selectedValues={selectValues}
					onSelect={(id, value) => setSelectValues(prev => ({ ...prev, [id]: value }))}
				/>
			)}

			{/* Inputs */}
			{inputOptions.length > 0 && (
				<CustomInputs
					inputs={inputOptions.map((opt: any) => ({
						id: opt.id,
						label: opt.label,
						type: opt.inputType || opt.type,
						required: opt.required,
						placeholder: opt.placeholder,
						validation: {
							min: opt.minValue,
							max: opt.maxValue,
							maxLength: opt.maxLength,
						},
					}))}
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
					quantity: pricing?.pricingType === 'simple' ? quantity : 1,
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