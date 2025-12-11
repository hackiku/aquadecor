// src/app/admin/catalog/products/_components/pricing/CopyPricingDialog.tsx
"use client";

import { useState, useEffect } from "react";
import { api } from "~/trpc/react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "~/components/ui/select";
import { Alert, AlertDescription } from "~/components/ui/alert";
import { Badge } from "~/components/ui/badge";
import { Loader2, Copy, AlertCircle, ArrowRight } from "lucide-react";
import { MarketBadge } from "../MarketBadge";
import { toast } from "sonner";

interface CopyPricingDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	sourcePricingId: string;
	productId: string;
	onSuccess?: () => void;
}

type Market = "US" | "ROW" | "CA" | "UK";
type Currency = "USD" | "EUR" | "GBP" | "CAD";

const marketCurrencyMap: Record<Market, Currency> = {
	US: "USD",
	ROW: "EUR",
	CA: "CAD",
	UK: "GBP",
};

export function CopyPricingDialog({
	open,
	onOpenChange,
	sourcePricingId,
	productId,
	onSuccess,
}: CopyPricingDialogProps) {
	const [targetMarket, setTargetMarket] = useState<Market>("US");
	const [priceMultiplier, setPriceMultiplier] = useState(1.15); // 15% markup default
	const [convertToFixed, setConvertToFixed] = useState(false);

	const utils = api.useUtils();

	// Get source pricing details
	const { data: allPricing } = api.admin.pricing.getByProduct.useQuery(
		{ productId },
		{ enabled: open }
	);

	const sourcePricing = allPricing?.find((p) => p.id === sourcePricingId);

	// Get existing markets
	const existingMarkets = allPricing?.map((p) => p.market as Market) || [];
	const availableMarkets = (["US", "CA", "UK"] as Market[]).filter(
		(m) => !existingMarkets.includes(m) && m !== sourcePricing?.market
	);

	const copyPricing = api.admin.pricing.copyPricing.useMutation({
		onSuccess: async () => {
			toast.success(`Pricing copied to ${targetMarket} market`);
			await utils.admin.pricing.getByProduct.invalidate({ productId });
			onOpenChange(false);
			onSuccess?.();
		},
		onError: (error) => {
			toast.error(`Failed to copy pricing: ${error.message}`);
		},
	});

	// Auto-suggest conversion to fixed quantity for US market
	useEffect(() => {
		if (targetMarket === "US" && sourcePricing?.pricingType === "quantity_bundle") {
			setConvertToFixed(true);
		} else {
			setConvertToFixed(false);
		}
	}, [targetMarket, sourcePricing]);

	const handleCopy = () => {
		if (!sourcePricing) {
			toast.error("Source pricing not found");
			return;
		}

		copyPricing.mutate({
			sourcePricingId,
			targetMarket,
			targetCurrency: marketCurrencyMap[targetMarket],
			priceMultiplier,
		});
	};

	if (!sourcePricing) {
		return null;
	}

	const formatPrice = (cents: number) => `€${(cents / 100).toFixed(2)}`;
	const estimatedPrice = (cents: number) =>
		`≈ ${(cents / 100) * priceMultiplier}`;

	// Calculate suggested fixed quantity for US conversion
	const suggestedFixedQuantity =
		sourcePricing.bundles && sourcePricing.bundles.length > 0
			? sourcePricing.bundles[Math.floor(sourcePricing.bundles.length / 2)]?.quantity
			: 5;

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-2xl">
				<DialogHeader>
					<DialogTitle className="font-display font-normal flex items-center gap-2">
						<Copy className="h-5 w-5" />
						Copy Pricing Configuration
					</DialogTitle>
					<DialogDescription className="font-display font-light">
						Create a new pricing configuration based on {sourcePricing.market} market
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-6 py-4">
					{/* Source Info */}
					<div className="p-4 rounded-lg bg-muted/50 space-y-2">
						<p className="text-sm font-display font-light text-muted-foreground">
							Copying from:
						</p>
						<div className="flex items-center gap-2">
							<MarketBadge market={sourcePricing.market as Market} />
							<Badge variant="outline" className="font-display font-light">
								{sourcePricing.pricingType === "quantity_bundle"
									? "bundle"
									: sourcePricing.pricingType}
							</Badge>
						</div>
						{sourcePricing.pricingType === "simple" && (
							<p className="text-sm font-display font-light">
								Unit Price: {formatPrice(sourcePricing.unitPriceEurCents || 0)}
							</p>
						)}
						{sourcePricing.pricingType === "quantity_bundle" &&
							sourcePricing.bundles &&
							sourcePricing.bundles.length > 0 && (
								<div className="text-sm space-y-1">
									<p className="font-display font-light text-muted-foreground">
										Bundle tiers:
									</p>
									{sourcePricing.bundles.map((bundle: any) => (
										<p key={bundle.id} className="font-display font-light">
											{bundle.quantity} pieces → {formatPrice(bundle.totalPriceEurCents)}
										</p>
									))}
								</div>
							)}
					</div>

					{/* Target Market Selection */}
					<div className="space-y-2">
						<Label className="font-display font-light">Target Market</Label>
						<Select value={targetMarket} onValueChange={(v) => setTargetMarket(v as Market)}>
							<SelectTrigger className="font-display font-light">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								{availableMarkets.map((market) => (
									<SelectItem key={market} value={market} className="font-display font-light">
										<div className="flex items-center gap-2">
											<span>{market}</span>
											<span className="text-muted-foreground">
												({marketCurrencyMap[market]})
											</span>
										</div>
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					{/* Price Multiplier */}
					<div className="space-y-2">
						<Label htmlFor="multiplier" className="font-display font-light">
							Price Multiplier
						</Label>
						<Input
							id="multiplier"
							type="number"
							step="0.05"
							min="0.1"
							max="3"
							value={priceMultiplier}
							onChange={(e) => setPriceMultiplier(parseFloat(e.target.value) || 1)}
							className="font-display font-light"
						/>
						<p className="text-xs text-muted-foreground font-display font-light">
							{priceMultiplier === 1
								? "Same price"
								: priceMultiplier > 1
									? `${Math.round((priceMultiplier - 1) * 100)}% increase`
									: `${Math.round((1 - priceMultiplier) * 100)}% decrease`}
						</p>
					</div>

					{/* US Conversion Warning */}
					{targetMarket === "US" && sourcePricing.pricingType === "quantity_bundle" && (
						<Alert>
							<AlertCircle className="h-4 w-4" />
							<AlertDescription className="font-display font-light space-y-2">
								<p className="font-medium">
									Recommended: Convert to fixed quantity for US market
								</p>
								<p className="text-sm">
									US customers prefer single-price items rather than bundle selection. The
									system will convert this to "simple" pricing with a fixed quantity of{" "}
									<strong>{suggestedFixedQuantity} pieces</strong> (the median tier).
								</p>
								<p className="text-sm text-muted-foreground">
									You can edit this after copying if needed.
								</p>
							</AlertDescription>
						</Alert>
					)}

					{/* Preview */}
					<div className="p-4 rounded-lg border-2 border-dashed space-y-3">
						<div className="flex items-center gap-2">
							<p className="text-sm font-display font-light text-muted-foreground">Preview:</p>
							<MarketBadge market={sourcePricing.market as Market} />
							<ArrowRight className="h-4 w-4 text-muted-foreground" />
							<MarketBadge market={targetMarket} />
						</div>

						{sourcePricing.pricingType === "simple" && (
							<div className="space-y-1">
								<p className="text-sm font-display font-light">
									{formatPrice(sourcePricing.unitPriceEurCents || 0)} →{" "}
									<span className="text-primary font-medium">
										{estimatedPrice(sourcePricing.unitPriceEurCents || 0)}{" "}
										{marketCurrencyMap[targetMarket]}
									</span>
								</p>
							</div>
						)}

						{sourcePricing.pricingType === "quantity_bundle" && (
							<div className="space-y-1 text-sm font-display font-light">
								{targetMarket === "US" ? (
									<p>
										Will convert to:{" "}
										<span className="text-primary font-medium">
											{suggestedFixedQuantity} pieces
										</span>{" "}
										for{" "}
										<span className="text-primary font-medium">
											{estimatedPrice(
												sourcePricing.bundles?.find(
													(b: any) => b.quantity === suggestedFixedQuantity
												)?.totalPriceEurCents || 0
											)}{" "}
											USD
										</span>
									</p>
								) : (
									sourcePricing.bundles?.map((bundle: any) => (
										<p key={bundle.id}>
											{bundle.quantity} pieces: {formatPrice(bundle.totalPriceEurCents)} →{" "}
											<span className="text-primary font-medium">
												{estimatedPrice(bundle.totalPriceEurCents)}{" "}
												{marketCurrencyMap[targetMarket]}
											</span>
										</p>
									))
								)}
							</div>
						)}
					</div>
				</div>

				<DialogFooter>
					<Button
						variant="outline"
						onClick={() => onOpenChange(false)}
						className="rounded-full"
					>
						Cancel
					</Button>
					<Button
						onClick={handleCopy}
						disabled={copyPricing.isPending || availableMarkets.length === 0}
						className="rounded-full"
					>
						{copyPricing.isPending ? (
							<Loader2 className="h-4 w-4 animate-spin" />
						) : (
							<>
								<Copy className="mr-2 h-4 w-4" />
								Copy to {targetMarket}
							</>
						)}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}