// src/app/admin/catalog/products/_components/pricing/AddMarketDialog.tsx
"use client";

import { useState } from "react";
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
import { Loader2, Plus } from "lucide-react";
import { MarketBadge } from "../MarketBadge";
import { toast } from "sonner";

interface AddMarketDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	productId: string;
	productLine: "3d-backgrounds" | "aquarium-decorations";
	existingMarkets: string[];
	onSuccess?: () => void;
}

// ✅ FIXED: Restricted types to match backend schema (ROW/US only)
type Market = "US" | "ROW";
type Currency = "USD" | "EUR";
type PricingType = "simple" | "bundle" | "configuration";

const marketCurrencyMap: Record<Market, Currency> = {
	US: "USD",
	ROW: "EUR",
	// CA/UK removed to prevent backend type errors
};

// Available markets list
const SUPPORTED_MARKETS: Market[] = ["US", "ROW"];

export function AddMarketDialog({
	open,
	onOpenChange,
	productId,
	productLine,
	existingMarkets,
	onSuccess,
}: AddMarketDialogProps) {
	// Defaults to US if available, otherwise ROW, otherwise undefined logic handled below
	const [market, setMarket] = useState<Market>("US");
	const [pricingType, setPricingType] = useState<PricingType>("simple");
	const [unitPrice, setUnitPrice] = useState("");

	const utils = api.useUtils();

	// ✅ FIXED: Filter supported markets
	const availableMarkets = SUPPORTED_MARKETS.filter(
		(m) => !existingMarkets.includes(m)
	);

	const createPricing = api.admin.pricing.create.useMutation({
		onSuccess: async () => {
			toast.success(`${market} pricing added successfully`);
			await utils.admin.pricing.getByProduct.invalidate({ productId });
			onOpenChange(false);
			resetForm();
			onSuccess?.();
		},
		onError: (error) => {
			toast.error(`Failed to add pricing: ${error.message}`);
		},
	});

	const resetForm = () => {
		// Reset to first available or default
		const nextAvailable = SUPPORTED_MARKETS.find(m => !existingMarkets.includes(m)) || "US";
		setMarket(nextAvailable);
		setPricingType("simple");
		setUnitPrice("");
	};

	const handleCreate = () => {
		// Validation for simple pricing
		if (pricingType === "simple" && (!unitPrice || parseFloat(unitPrice) <= 0)) {
			toast.error("Please enter a valid unit price");
			return;
		}

		createPricing.mutate({
			productId,
			market,
			currency: marketCurrencyMap[market],
			pricingType,
			unitPriceEurCents:
				pricingType === "simple" ? Math.round(parseFloat(unitPrice) * 100) : undefined,
			allowQuantity: pricingType === "simple",
			maxQuantity: pricingType === "simple" ? 100 : undefined,
			isActive: true,
		});
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle className="font-display font-normal flex items-center gap-2">
						<Plus className="h-5 w-5" />
						Add Market Pricing
					</DialogTitle>
					<DialogDescription className="font-display font-light">
						Configure pricing for a new market
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-6 py-4">
					{availableMarkets.length === 0 ? (
						<p className="text-sm text-muted-foreground font-display font-light text-center py-4">
							All supported markets already have pricing configurations
						</p>
					) : (
						<>
							{/* Market Selection */}
							<div className="space-y-2">
								<Label className="font-display font-light">Market</Label>
								<Select value={market} onValueChange={(v) => setMarket(v as Market)}>
									<SelectTrigger className="font-display font-light">
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										{availableMarkets.map((m) => (
											<SelectItem key={m} value={m} className="font-display font-light">
												<div className="flex items-center gap-2">
													<span>{m}</span>
													<span className="text-muted-foreground">
														({marketCurrencyMap[m]})
													</span>
												</div>
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>

							{/* Pricing Type */}
							<div className="space-y-2">
								<Label className="font-display font-light">Pricing Type</Label>
								<Select
									value={pricingType}
									onValueChange={(v) => setPricingType(v as PricingType)}
								>
									<SelectTrigger className="font-display font-light">
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="simple" className="font-display font-light">
											Simple - Single unit price
										</SelectItem>
										<SelectItem value="bundle" className="font-display font-light">
											Bundle - Quantity tiers
										</SelectItem>
										{productLine === "3d-backgrounds" && (
											<SelectItem value="configuration" className="font-display font-light">
												Configuration - Calculator
											</SelectItem>
										)}
									</SelectContent>
								</Select>
								<p className="text-xs text-muted-foreground font-display font-light">
									{pricingType === "simple" &&
										"Set a single price per unit. Best for US market."}
									{pricingType === "bundle" &&
										"Add bundle tiers (3/5/10 pieces) after creation"}
									{pricingType === "configuration" &&
										"For custom-sized backgrounds with calculator"}
								</p>
							</div>

							{/* Initial Price (for simple type only) */}
							{pricingType === "simple" && (
								<div className="space-y-2">
									<Label htmlFor="unitPrice" className="font-display font-light">
										Unit Price ({marketCurrencyMap[market]})
									</Label>
									<Input
										id="unitPrice"
										type="number"
										step="0.01"
										min="0"
										value={unitPrice}
										onChange={(e) => setUnitPrice(e.target.value)}
										placeholder="29.99"
										className="font-display font-light"
									/>
								</div>
							)}

							{/* Preview Badge */}
							<div className="p-4 rounded-lg bg-muted/50">
								<p className="text-xs text-muted-foreground font-display font-light mb-2">
									Preview:
								</p>
								<div className="flex items-center gap-2">
									<MarketBadge market={market} />
									{pricingType === "simple" && unitPrice && (
										<span className="font-display font-light">
											{parseFloat(unitPrice).toFixed(2)} {marketCurrencyMap[market]}
										</span>
									)}
								</div>
							</div>
						</>
					)}
				</div>

				<DialogFooter>
					<Button variant="outline" onClick={() => onOpenChange(false)} className="rounded-full">
						Cancel
					</Button>
					<Button
						onClick={handleCreate}
						disabled={createPricing.isPending || availableMarkets.length === 0}
						className="rounded-full"
					>
						{createPricing.isPending ? (
							<Loader2 className="h-4 w-4 animate-spin" />
						) : (
							<>
								<Plus className="mr-2 h-4 w-4" />
								Add Pricing
							</>
						)}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}