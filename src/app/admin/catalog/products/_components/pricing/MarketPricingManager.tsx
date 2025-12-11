// src/app/admin/catalog/products/_components/pricing/MarketPricingManager.tsx
"use client";

import { useState } from "react";
import { api } from "~/trpc/react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Alert, AlertDescription } from "~/components/ui/alert";
import { Plus, Copy, AlertCircle, Loader2 } from "lucide-react";
import { PricingCard } from "./PricingCard";
import { AddMarketDialog } from "./AddMarketDialog";
import { CopyPricingDialog } from "./CopyPricingDialog";
import { MarketBadge } from "../MarketBadge";
import { toast } from "sonner";
import type { ProductPricing } from "~/server/db/schema/shop";

interface MarketPricingManagerProps {
	productId: string;
	productLine: "3d-backgrounds" | "aquarium-decorations";
}

type Market = "US" | "ROW" | "CA" | "UK";

export function MarketPricingManager({ productId, productLine }: MarketPricingManagerProps) {
	const [addMarketOpen, setAddMarketOpen] = useState(false);
	const [copyDialogOpen, setCopyDialogOpen] = useState(false);
	const [sourcePricingId, setSourcePricingId] = useState<string | null>(null);

	const utils = api.useUtils();

	// Mutation to remove market exclusions
	const removeExclusions = api.admin.product.setMarketAvailability.useMutation({
		onSuccess: async () => {
			toast.success("Market exclusions removed");
			await utils.admin.product.getMarketAvailability.invalidate({ productId });
		},
		onError: (error: any) => {
			toast.error(`Failed to remove exclusions: ${error.message}`);
		},
	});

	// Get all pricing configs for this product
	const { data: pricingConfigs, isLoading } = api.admin.pricing.getByProduct.useQuery(
		{ productId },
		{
			// Refresh when component mounts or productId changes
			refetchOnMount: "always",
		}
	);

	// Get market availability
	const { data: marketAvailability } = api.admin.product.getMarketAvailability.useQuery({ productId });

	const handlePricingSaved = async () => {
		// Invalidate the pricing query to force refetch
		await utils.admin.pricing.getByProduct.invalidate({ productId });
	};

	const handlePricingDeleted = async () => {
		await utils.admin.pricing.getByProduct.invalidate({ productId });
	};

	const handleCopyClick = (pricingId: string) => {
		setSourcePricingId(pricingId);
		setCopyDialogOpen(true);
	};

	if (isLoading) {
		return (
			<Card>
				<CardContent className="py-8">
					<p className="text-center text-muted-foreground font-display font-light">
						Loading pricing configurations...
					</p>
				</CardContent>
			</Card>
		);
	}

	// Group pricing by market
	const pricingByMarket = new Map<Market, typeof pricingConfigs>();
	pricingConfigs?.forEach((config) => {
		const market = config.market as Market;
		if (!pricingByMarket.has(market)) {
			pricingByMarket.set(market, []);
		}
		pricingByMarket.get(market)!.push(config);
	});

	const availableMarkets = marketAvailability?.available || [];
	const marketsWithPricing = Array.from(pricingByMarket.keys());
	const marketsWithoutPricing = availableMarkets.filter(
		(m: Market) => !marketsWithPricing.includes(m)
	);

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h2 className="text-2xl font-display font-light">Market Pricing</h2>
					<p className="text-sm text-muted-foreground font-display font-light">
						Configure pricing for each market independently
					</p>
				</div>
				<Button onClick={() => setAddMarketOpen(true)} className="rounded-full">
					<Plus className="mr-2 h-4 w-4" />
					Add Market
				</Button>
			</div>

			{/* Quick Copy Actions */}
			{pricingByMarket.has("ROW") && marketsWithoutPricing.includes("US" as Market) && (
				<Alert>
					<AlertCircle className="h-4 w-4" />
					<AlertDescription className="font-display font-light">
						<strong>Quick Action:</strong> Copy ROW pricing to US market?
						<Button
							variant="outline"
							size="sm"
							className="ml-4 rounded-full"
							onClick={() => {
								const rowPricing = pricingByMarket.get("ROW")?.[0];
								if (rowPricing) handleCopyClick(rowPricing.id);
							}}
						>
							<Copy className="mr-2 h-3 w-3" />
							Copy ROW → US
						</Button>
					</AlertDescription>
				</Alert>
			)}

			{/* Market Availability Warning */}
			{marketAvailability?.excluded && marketAvailability.excluded.length > 0 && (
				<Alert variant="destructive">
					<AlertCircle className="h-4 w-4" />
					<AlertDescription className="font-display font-light">
						<div className="flex items-center justify-between">
							<div>
								<strong>Product excluded from:</strong>{" "}
								{marketAvailability.excluded.map((m: string) => m).join(", ")}
								<p className="text-xs mt-1">
									Enable these markets to add pricing configurations.
								</p>
							</div>
							<Button
								variant="outline"
								size="sm"
								className="ml-4 rounded-full"
								onClick={() => {
									if (confirm("Enable this product for all markets (US, ROW, CA, UK)?")) {
										removeExclusions.mutate({
											productId,
											markets: ["US", "ROW", "CA", "UK"],
										});
									}
								}}
								disabled={removeExclusions.isPending}
							>
								{removeExclusions.isPending ? (
									<Loader2 className="h-4 w-4 animate-spin" />
								) : (
									"Enable All Markets"
								)}
							</Button>
						</div>
					</AlertDescription>
				</Alert>
			)}

			{/* Pricing Cards Grid */}
			<div className="grid gap-6 md:grid-cols-2">
				{(["ROW", "US", "CA", "UK"] as Market[]).map((market) => {
					const marketPricing = pricingByMarket.get(market);

					if (!marketPricing || marketPricing.length === 0) {
						// Market exists but no pricing
						if (availableMarkets.includes(market)) {
							return (
								<Card key={market} className="border-dashed border-2">
									<CardHeader>
										<div className="flex items-center justify-between">
											<div className="flex items-center gap-2">
												<MarketBadge market={market} />
												<CardTitle className="text-sm font-display font-light text-muted-foreground">
													No Pricing
												</CardTitle>
											</div>
										</div>
									</CardHeader>
									<CardContent>
										<Button
											variant="outline"
											size="sm"
											onClick={() => setAddMarketOpen(true)}
											className="w-full rounded-full"
										>
											<Plus className="mr-2 h-4 w-4" />
											Add Pricing
										</Button>
									</CardContent>
								</Card>
							);
						}
						return null;
					}

					// Market has pricing config(s)
					return (
						<div key={market} className="space-y-4">
							{marketPricing.map((pricing) => (
								<PricingCard
									key={pricing.id}
									pricing={pricing}
									onSaved={handlePricingSaved}
									onDeleted={handlePricingDeleted}
									onCopyClick={() => handleCopyClick(pricing.id)}
									showCopyButton={market === "ROW"} // Only show copy for ROW pricing
								/>
							))}
						</div>
					);
				})}
			</div>

			{/* No Pricing Warning */}
			{pricingConfigs?.length === 0 && (
				<Card className="border-dashed border-2">
					<CardContent className="py-12 text-center space-y-4">
						<p className="text-lg font-display font-light text-muted-foreground">
							No pricing configurations yet
						</p>
						<Button onClick={() => setAddMarketOpen(true)} className="rounded-full">
							<Plus className="mr-2 h-4 w-4" />
							Add First Market
						</Button>
					</CardContent>
				</Card>
			)}

			{/* Dialogs */}
			<AddMarketDialog
				open={addMarketOpen}
				onOpenChange={setAddMarketOpen}
				productId={productId}
				productLine={productLine}
				existingMarkets={marketsWithPricing}
				onSuccess={handlePricingSaved}
			/>

			{sourcePricingId && (
				<CopyPricingDialog
					open={copyDialogOpen}
					onOpenChange={setCopyDialogOpen}
					sourcePricingId={sourcePricingId}
					productId={productId}
					onSuccess={handlePricingSaved}
				/>
			)}
		</div>
	);
}