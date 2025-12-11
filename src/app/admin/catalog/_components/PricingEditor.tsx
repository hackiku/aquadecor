// src/app/admin/catalog/_components/PricingEditor.tsx
"use client";

import { useState } from "react";
import { api } from "~/trpc/react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Switch } from "~/components/ui/switch";
import { Badge } from "~/components/ui/badge";
import { Loader2, Save, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { MarketBadge } from "./MarketBadge";
import type { ProductPricing } from "~/server/db/schema/shop";

interface PricingEditorProps {
	pricing: ProductPricing;
	onSaved?: () => void;
	onDeleted?: () => void;
}

export function PricingEditor({ pricing, onSaved, onDeleted }: PricingEditorProps) {
	const [isEditing, setIsEditing] = useState(false);
	const [formData, setFormData] = useState({
		unitPriceEurCents: pricing.unitPriceEurCents || 0,
		fixedQuantity: pricing.fixedQuantity || undefined,
		baseRatePerSqM: pricing.baseRatePerSqM || undefined,
		requiresQuote: pricing.requiresQuote || false,
		calculatorUrl: pricing.calculatorUrl || '',
		isActive: pricing.isActive,
	});

	const updatePricing = api.admin.pricing.update.useMutation({
		onSuccess: () => {
			toast.success('Pricing updated successfully');
			setIsEditing(false);
			onSaved?.();
		},
		onError: (error) => {
			toast.error(`Failed to update pricing: ${error.message}`);
		},
	});

	const deletePricing = api.admin.pricing.delete.useMutation({
		onSuccess: () => {
			toast.success('Pricing deleted');
			onDeleted?.();
		},
		onError: (error) => {
			toast.error(`Failed to delete pricing: ${error.message}`);
		},
	});

	const handleSave = () => {
		updatePricing.mutate({
			pricingId: pricing.id,
			...formData,
		});
	};

	const handleDelete = () => {
		if (confirm('Are you sure you want to delete this pricing configuration?')) {
			deletePricing.mutate({ pricingId: pricing.id });
		}
	};

	const formatPrice = (cents: number) => `€${(cents / 100).toFixed(2)}`;

	return (
		<Card className="border-2">
			<CardHeader>
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-3">
						<CardTitle className="font-display font-normal">
							{pricing.market} Pricing
						</CardTitle>
						<MarketBadge market={pricing.market as 'US' | 'ROW'} />
						<Badge variant="outline" className="font-display font-light text-xs">
							{pricing.pricingType}
						</Badge>
						<Badge variant={pricing.isActive ? 'default' : 'secondary'} className="text-xs">
							{pricing.isActive ? 'Active' : 'Inactive'}
						</Badge>
					</div>
					<div className="flex items-center gap-2">
						{!isEditing && (
							<Button
								variant="outline"
								size="sm"
								onClick={() => setIsEditing(true)}
								className="rounded-full"
							>
								Edit
							</Button>
						)}
						{isEditing && (
							<>
								<Button
									variant="ghost"
									size="sm"
									onClick={() => setIsEditing(false)}
									className="rounded-full"
								>
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
							</>
						)}
						<Button
							variant="ghost"
							size="sm"
							onClick={handleDelete}
							disabled={deletePricing.isPending}
							className="rounded-full text-destructive hover:text-destructive"
						>
							<Trash2 className="h-4 w-4" />
						</Button>
					</div>
				</div>
			</CardHeader>
			<CardContent className="space-y-6">
				{/* Simple Pricing */}
				{pricing.pricingType === 'simple' && (
					<div className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="unitPrice" className="font-display font-light">
								Unit Price (€)
							</Label>
							{isEditing ? (
								<Input
									id="unitPrice"
									type="number"
									step="0.01"
									value={(formData.unitPriceEurCents / 100).toFixed(2)}
									onChange={(e) =>
										setFormData({
											...formData,
											unitPriceEurCents: Math.round(parseFloat(e.target.value) * 100),
										})
									}
									className="font-display font-light"
								/>
							) : (
								<p className="text-2xl font-display font-light">
									{formatPrice(pricing.unitPriceEurCents || 0)}
								</p>
							)}
						</div>

						{(pricing.fixedQuantity || isEditing) && (
							<div className="space-y-2">
								<Label htmlFor="fixedQuantity" className="font-display font-light">
									Fixed Quantity (US "includes X pieces")
								</Label>
								{isEditing ? (
									<Input
										id="fixedQuantity"
										type="number"
										value={formData.fixedQuantity || ''}
										onChange={(e) =>
											setFormData({
												...formData,
												fixedQuantity: parseInt(e.target.value) || undefined,
											})
										}
										placeholder="Optional"
										className="font-display font-light"
									/>
								) : (
									<p className="font-display font-light">
										{pricing.fixedQuantity} pieces
									</p>
								)}
							</div>
						)}
					</div>
				)}

				{/* Bundle Pricing */}
				{pricing.pricingType === 'bundle' && (
					<div className="space-y-2">
						<p className="text-sm text-muted-foreground font-display font-light">
							Bundle tiers are managed in the Bundles section below
						</p>
					</div>
				)}

				{/* Configuration Pricing (Calculator) */}
				{pricing.pricingType === 'configuration' && (
					<div className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="baseRate" className="font-display font-light">
								Base Rate per m² (€)
							</Label>
							{isEditing ? (
								<Input
									id="baseRate"
									type="number"
									step="0.01"
									value={(formData.baseRatePerSqM || 0) / 100}
									onChange={(e) =>
										setFormData({
											...formData,
											baseRatePerSqM: Math.round(parseFloat(e.target.value) * 100),
										})
									}
									className="font-display font-light"
								/>
							) : (
								<p className="text-2xl font-display font-light">
									{formatPrice(pricing.baseRatePerSqM || 0)}/m²
								</p>
							)}
						</div>

						<div className="flex items-center justify-between">
							<Label htmlFor="requiresQuote" className="font-display font-light">
								Requires Manual Quote
							</Label>
							{isEditing ? (
								<Switch
									id="requiresQuote"
									checked={formData.requiresQuote}
									onCheckedChange={(checked) =>
										setFormData({ ...formData, requiresQuote: checked })
									}
								/>
							) : (
								<Badge variant={pricing.requiresQuote ? 'default' : 'outline'}>
									{pricing.requiresQuote ? 'Yes' : 'No'}
								</Badge>
							)}
						</div>

						{(pricing.calculatorUrl || isEditing) && (
							<div className="space-y-2">
								<Label htmlFor="calculatorUrl" className="font-display font-light">
									Calculator URL
								</Label>
								{isEditing ? (
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
								) : (
									<p className="font-display font-light text-sm text-muted-foreground">
										{pricing.calculatorUrl}
									</p>
								)}
							</div>
						)}
					</div>
				)}

				{/* Active Toggle */}
				<div className="flex items-center justify-between pt-4 border-t">
					<Label htmlFor="isActive" className="font-display font-light">
						Active
					</Label>
					{isEditing ? (
						<Switch
							id="isActive"
							checked={formData.isActive}
							onCheckedChange={(checked) =>
								setFormData({ ...formData, isActive: checked })
							}
						/>
					) : (
						<Badge variant={pricing.isActive ? 'default' : 'secondary'}>
							{pricing.isActive ? 'Active' : 'Inactive'}
						</Badge>
					)}
				</div>
			</CardContent>
		</Card>
	);
}