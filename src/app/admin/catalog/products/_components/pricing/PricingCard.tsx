// src/app/admin/catalog/products/_components/pricing/PricingCard.tsx
"use client";

import { useState } from "react";
import { api } from "~/trpc/react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Edit2, Trash2, Copy, ChevronDown, ChevronUp } from "lucide-react";
import { MarketBadge } from "../MarketBadge";
import { PricingEditForm } from "./PricingEditForm";
import { BundleTierManager } from "./BundleTierManager";
import { toast } from "sonner";
import type { ProductPricing } from "~/server/db/schema/shop";

interface PricingCardProps {
	pricing: ProductPricing & { bundles?: any[] };
	onSaved?: () => void;
	onDeleted?: () => void;
	onCopyClick?: () => void;
	showCopyButton?: boolean;
}

export function PricingCard({
	pricing,
	onSaved,
	onDeleted,
	onCopyClick,
	showCopyButton = false,
}: PricingCardProps) {
	const [isEditing, setIsEditing] = useState(false);
	const [showBundles, setShowBundles] = useState(true);

	const deletePricing = api.admin.pricing.delete.useMutation({
		onSuccess: () => {
			toast.success("Pricing deleted");
			onDeleted?.();
		},
		onError: (error) => {
			toast.error(`Failed to delete: ${error.message}`);
		},
	});

	const handleDelete = () => {
		if (
			confirm(
				"Delete this pricing configuration? This will also delete all associated bundles."
			)
		) {
			deletePricing.mutate({ pricingId: pricing.id });
		}
	};

	const formatPrice = (cents: number) => `€${(cents / 100).toFixed(2)}`;

	if (isEditing) {
		return (
			<PricingEditForm
				pricing={pricing}
				onSaved={() => {
					setIsEditing(false);
					onSaved?.();
				}}
				onCancel={() => setIsEditing(false)}
			/>
		);
	}

	return (
		<Card className="border-2">
			<CardHeader>
				<div className="flex items-start justify-between gap-4">
					<div className="flex flex-wrap items-center gap-2">
						<MarketBadge market={pricing.market as "US" | "ROW" | "CA" | "UK"} />
						<Badge variant="outline" className="font-display font-light text-xs">
							{pricing.pricingType === "quantity_bundle" || pricing.pricingType === "bundle" ? "bundle" : pricing.pricingType}
						</Badge>
						<Badge variant={pricing.isActive ? "default" : "secondary"} className="text-xs">
							{pricing.isActive ? "Active" : "Inactive"}
						</Badge>
					</div>
					<div className="flex items-center gap-2 flex-shrink-0">
						{showCopyButton && (
							<Button
								variant="outline"
								size="sm"
								onClick={onCopyClick}
								className="rounded-full"
							>
								<Copy className="mr-2 h-4 w-4" />
								Copy
							</Button>
						)}
						<Button
							variant="outline"
							size="sm"
							onClick={() => setIsEditing(true)}
							className="rounded-full"
						>
							<Edit2 className="mr-2 h-4 w-4" />
							Edit
						</Button>
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
			<CardContent className="space-y-4">
				{/* SIMPLE PRICING */}
				{pricing.pricingType === "simple" && (
					<div className="space-y-3">
						<div>
							<p className="text-xs text-muted-foreground font-display font-light mb-1">
								Unit Price
							</p>
							<p className="text-2xl font-display font-light">
								{formatPrice(pricing.unitPriceEurCents || 0)}
							</p>
						</div>

						{pricing.fixedQuantity && (
							<div className="pt-2 border-t">
								<Badge variant="outline" className="font-display font-light">
									Includes {pricing.fixedQuantity} pieces
								</Badge>
							</div>
						)}

						{pricing.allowQuantity && (
							<div className="text-sm text-muted-foreground font-display font-light">
								<p>Max Quantity: {pricing.maxQuantity || 100} per order</p>
							</div>
						)}
					</div>
				)}

				{/* BUNDLE PRICING */}
				{(pricing.pricingType === "quantity_bundle" || pricing.pricingType === "bundle") && (
					<div className="space-y-3">
						<div className="flex items-center justify-between">
							<p className="text-sm font-display font-light text-muted-foreground">
								Bundle Tiers ({pricing.bundles?.length || 0})
							</p>
							<Button
								variant="ghost"
								size="sm"
								onClick={() => setShowBundles(!showBundles)}
							>
								{showBundles ? (
									<ChevronUp className="h-4 w-4" />
								) : (
									<ChevronDown className="h-4 w-4" />
								)}
							</Button>
						</div>

						{showBundles && pricing.bundles && pricing.bundles.length > 0 && (
							<div className="space-y-2 pt-2 border-t">
								{pricing.bundles.map((bundle: any) => (
									<div
										key={bundle.id}
										className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
									>
										<div>
											<p className="font-display font-normal">
												{bundle.quantity} pieces
											</p>
											{bundle.label && (
												<p className="text-xs text-muted-foreground">
													{bundle.label}
												</p>
											)}
										</div>
										<div className="text-right">
											<p className="font-display font-light">
												{formatPrice(bundle.totalPriceEurCents)}
											</p>
											{bundle.savingsPercent && (
												<p className="text-xs text-green-600">
													Save {bundle.savingsPercent}%
												</p>
											)}
										</div>
									</div>
								))}
							</div>
						)}

						{showBundles && (!pricing.bundles || pricing.bundles.length === 0) && (
							<p className="text-sm text-muted-foreground italic font-display font-light">
								No bundle tiers configured yet
							</p>
						)}
					</div>
				)}

				{/* CONFIGURATION PRICING */}
				{pricing.pricingType === "configuration" && (
					<div className="space-y-3">
						<div>
							<p className="text-xs text-muted-foreground font-display font-light mb-1">
								Base Rate per m²
							</p>
							<p className="text-2xl font-display font-light">
								{pricing.baseRatePerSqM
									? `${formatPrice(pricing.baseRatePerSqM)}/m²`
									: "—"}
							</p>
						</div>

						<div className="pt-2 border-t space-y-2">
							<div className="flex justify-between text-sm">
								<span className="text-muted-foreground font-display font-light">
									Requires Quote
								</span>
								<Badge variant={pricing.requiresQuote ? "default" : "outline"}>
									{pricing.requiresQuote ? "Yes" : "No"}
								</Badge>
							</div>
							{pricing.calculatorUrl && (
								<div className="flex justify-between text-sm">
									<span className="text-muted-foreground font-display font-light">
										Calculator
									</span>
									<span className="font-mono text-xs">{pricing.calculatorUrl}</span>
								</div>
							)}
						</div>
					</div>
				)}

				{/* Metadata */}
				<div className="pt-4 border-t space-y-2 text-xs text-muted-foreground font-display font-light">
					<div className="flex justify-between">
						<span>Currency:</span>
						<span>{pricing.currency}</span>
					</div>
					{pricing.stripePriceId && (
						<div className="flex justify-between">
							<span>Stripe Price ID:</span>
							<span className="font-mono">{pricing.stripePriceId}</span>
						</div>
					)}
				</div>
			</CardContent>
		</Card>
	);
}