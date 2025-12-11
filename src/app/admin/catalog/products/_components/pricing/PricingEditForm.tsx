// src/app/admin/catalog/products/_components/pricing/PricingEditForm.tsx
"use client";

import { useState } from "react";
import { api } from "~/trpc/react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Switch } from "~/components/ui/switch";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "~/components/ui/select";
import { Loader2, Save, X } from "lucide-react";
import { toast } from "sonner";
import { MarketBadge } from "../MarketBadge";
import type { ProductPricing } from "~/server/db/schema/shop";

interface PricingEditFormProps {
	pricing: ProductPricing;
	onSaved?: () => void;
	onCancel?: () => void;
}

type PricingType = "simple" | "bundle" | "configuration";

export function PricingEditForm({ pricing, onSaved, onCancel }: PricingEditFormProps) {
	const [formData, setFormData] = useState({
		pricingType: pricing.pricingType as PricingType,

		// Simple pricing
		unitPriceEurCents: pricing.unitPriceEurCents || 0,
		allowQuantity: pricing.allowQuantity ?? true,
		maxQuantity: pricing.maxQuantity || 100,
		fixedQuantity: pricing.fixedQuantity || undefined,

		// Configuration pricing
		baseRatePerSqM: pricing.baseRatePerSqM || undefined,
		requiresQuote: pricing.requiresQuote || false,
		calculatorUrl: pricing.calculatorUrl || "/calculator",

		// General
		isActive: pricing.isActive,
	});

	const utils = api.useUtils();

	const updatePricing = api.admin.pricing.update.useMutation({
		onSuccess: async () => {
			toast.success("Pricing updated successfully");
			// CRITICAL: Invalidate the cache to force refetch
			await utils.admin.pricing.getByProduct.invalidate({
				productId: pricing.productId,
			});
			onSaved?.();
		},
		onError: (error) => {
			toast.error(`Failed to update pricing: ${error.message}`);
		},
	});

	const handleSave = () => {
		// Validation
		if (formData.pricingType === "simple" && formData.unitPriceEurCents <= 0) {
			toast.error("Unit price must be greater than 0");
			return;
		}

		if (
			formData.pricingType === "configuration" &&
			(!formData.baseRatePerSqM || formData.baseRatePerSqM <= 0)
		) {
			toast.error("Base rate per m² must be greater than 0");
			return;
		}

		updatePricing.mutate({
			pricingId: pricing.id,
			unitPriceEurCents:
				formData.pricingType === "simple" ? formData.unitPriceEurCents : undefined,
			allowQuantity: formData.pricingType === "simple" ? formData.allowQuantity : undefined,
			maxQuantity:
				formData.pricingType === "simple" && formData.allowQuantity
					? formData.maxQuantity
					: undefined,
			fixedQuantity: formData.fixedQuantity,
			baseRatePerSqM:
				formData.pricingType === "configuration" ? formData.baseRatePerSqM : undefined,
			requiresQuote:
				formData.pricingType === "configuration" ? formData.requiresQuote : undefined,
			calculatorUrl:
				formData.pricingType === "configuration" ? formData.calculatorUrl : undefined,
			isActive: formData.isActive,
		});
	};

	return (
		<Card className="border-2 border-primary">
			<CardHeader>
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2">
						<CardTitle className="font-display font-normal text-lg">
							Edit {pricing.market} Pricing
						</CardTitle>
						<MarketBadge market={pricing.market as "US" | "ROW" | "CA" | "UK"} />
					</div>
					<div className="flex items-center gap-2">
						<Button variant="ghost" size="sm" onClick={onCancel} className="rounded-full">
							<X className="mr-2 h-4 w-4" />
							Cancel
						</Button>
						<Button
							size="sm"
							onClick={handleSave}
							disabled={updatePricing.isPending}
							className="rounded-full"
						>
							{updatePricing.isPending ? (
								<Loader2 className="h-4 w-4 animate-spin" />
							) : (
								<>
									<Save className="mr-2 h-4 w-4" />
									Save
								</>
							)}
						</Button>
					</div>
				</div>
			</CardHeader>
			<CardContent className="space-y-6">
				{/* Pricing Type Selector */}
				<div className="space-y-2 p-4 rounded-lg bg-muted/50">
					<Label className="font-display font-light">Pricing Type</Label>
					<Select
						value={formData.pricingType}
						onValueChange={(value) =>
							setFormData({ ...formData, pricingType: value as PricingType })
						}
					>
						<SelectTrigger className="font-display font-light">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="simple" className="font-display font-light">
								Simple - Single unit price
							</SelectItem>
							<SelectItem value="bundle" className="font-display font-light">
								Bundle - Quantity tiers (3/5/10 pieces)
							</SelectItem>
							<SelectItem value="configuration" className="font-display font-light">
								Configuration - Calculator/custom quote
							</SelectItem>
						</SelectContent>
					</Select>
					<p className="text-xs text-muted-foreground font-display font-light">
						{formData.pricingType === "simple" && "Set a single price per unit"}
						{formData.pricingType === "bundle" &&
							"Manage bundle tiers separately below"}
						{formData.pricingType === "configuration" &&
							"For custom-sized backgrounds with calculator"}
					</p>
				</div>

				{/* SIMPLE PRICING FIELDS */}
				{formData.pricingType === "simple" && (
					<div className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="unitPrice" className="font-display font-light">
								Unit Price (€)
							</Label>
							<Input
								id="unitPrice"
								type="number"
								step="0.01"
								min="0"
								value={(formData.unitPriceEurCents / 100).toFixed(2)}
								onChange={(e) =>
									setFormData({
										...formData,
										unitPriceEurCents: Math.round(
											parseFloat(e.target.value || "0") * 100
										),
									})
								}
								className="font-display font-light"
							/>
						</div>

						<div className="flex items-center justify-between">
							<Label htmlFor="allowQuantity" className="font-display font-light">
								Allow Quantity Selection
							</Label>
							<Switch
								id="allowQuantity"
								checked={formData.allowQuantity}
								onCheckedChange={(checked) =>
									setFormData({ ...formData, allowQuantity: checked })
								}
							/>
						</div>

						{formData.allowQuantity && (
							<div className="space-y-2">
								<Label htmlFor="maxQuantity" className="font-display font-light">
									Max Quantity (per order)
								</Label>
								<Input
									id="maxQuantity"
									type="number"
									min="1"
									value={formData.maxQuantity}
									onChange={(e) =>
										setFormData({
											...formData,
											maxQuantity: parseInt(e.target.value) || 100,
										})
									}
									className="font-display font-light"
								/>
							</div>
						)}

						<div className="space-y-2">
							<Label htmlFor="fixedQuantity" className="font-display font-light">
								Fixed Quantity (Optional - for US "includes X pieces")
							</Label>
							<Input
								id="fixedQuantity"
								type="number"
								min="0"
								value={formData.fixedQuantity || ""}
								onChange={(e) =>
									setFormData({
										...formData,
										fixedQuantity: parseInt(e.target.value) || undefined,
									})
								}
								placeholder="Leave empty for per-unit pricing"
								className="font-display font-light"
							/>
							<p className="text-xs text-muted-foreground font-display font-light">
								E.g., "7" means "Price includes 7 pieces"
							</p>
						</div>
					</div>
				)}

				{/* BUNDLE PRICING NOTE */}
				{formData.pricingType === "bundle" && (
					<div className="p-4 rounded-lg bg-muted/50">
						<p className="text-sm text-muted-foreground font-display font-light">
							Bundle pricing tiers are managed separately in the "Bundle Tiers" section.
						</p>
						<p className="text-xs text-muted-foreground font-display font-light mt-2">
							After saving, you can add quantity tiers like 3 pieces, 5 pieces, 10 pieces,
							etc.
						</p>
					</div>
				)}

				{/* CONFIGURATION PRICING FIELDS */}
				{formData.pricingType === "configuration" && (
					<div className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="baseRate" className="font-display font-light">
								Base Rate per m² (€)
							</Label>
							<Input
								id="baseRate"
								type="number"
								step="0.01"
								min="0"
								value={formData.baseRatePerSqM ? (formData.baseRatePerSqM / 100).toFixed(2) : ""}
								onChange={(e) =>
									setFormData({
										...formData,
										baseRatePerSqM: Math.round(parseFloat(e.target.value || "0") * 100),
									})
								}
								placeholder="e.g., 250.00"
								className="font-display font-light"
							/>
							<p className="text-xs text-muted-foreground font-display font-light">
								Used for calculating custom-sized backgrounds
							</p>
						</div>

						<div className="flex items-center justify-between">
							<div className="space-y-1">
								<Label htmlFor="requiresQuote" className="font-display font-light">
									Requires Manual Quote
								</Label>
								<p className="text-xs text-muted-foreground font-display font-light">
									Forces customers to contact for pricing
								</p>
							</div>
							<Switch
								id="requiresQuote"
								checked={formData.requiresQuote}
								onCheckedChange={(checked) =>
									setFormData({ ...formData, requiresQuote: checked })
								}
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="calculatorUrl" className="font-display font-light">
								Calculator URL
							</Label>
							<Input
								id="calculatorUrl"
								type="text"
								value={formData.calculatorUrl}
								onChange={(e) =>
									setFormData({ ...formData, calculatorUrl: e.target.value })
								}
								placeholder="/calculator"
								className="font-display font-light"
							/>
						</div>
					</div>
				)}

				{/* Active Toggle */}
				<div className="flex items-center justify-between pt-4 border-t">
					<Label htmlFor="isActive" className="font-display font-light">
						Active
					</Label>
					<Switch
						id="isActive"
						checked={formData.isActive}
						onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
					/>
				</div>
			</CardContent>
		</Card>
	);
}