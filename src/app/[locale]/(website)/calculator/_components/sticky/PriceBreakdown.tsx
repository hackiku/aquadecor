// src/app/(website)/calculator/_components/sticky/PriceBreakdown.tsx

"use client";

import type { PriceEstimate, QuoteConfig } from "../../calculator-types";
import { formatEUR } from "../../_hooks/useQuoteEstimate";

interface PriceBreakdownProps {
	estimate: PriceEstimate;
	config: QuoteConfig | null;
}

export function PriceBreakdown({ estimate, config }: PriceBreakdownProps) {
	if (estimate.total === 0) {
		return (
			<div className="px-6 py-8 bg-card/50 backdrop-blur-sm border rounded-xl">
				<div className="text-center space-y-2">
					<p className="text-sm text-muted-foreground font-display font-light">
						Select a model to see price estimate
					</p>
				</div>
			</div>
		);
	}

	// Get the actual background name
	const backgroundName = config?.modelCategory?.name || config?.modelCategory?.slug || "Background";
	const hasAdditionalItems = (config?.additionalItems?.length ?? 0) > 0;
	const additionalItemsCount = config?.additionalItems?.length ?? 0;

	return (
		<div className="px-6 py-6 bg-card/50 backdrop-blur-sm border rounded-xl space-y-4">
			{/* Header */}
			<div className="text-center pb-4 border-b">
				<p className="text-sm text-muted-foreground font-display font-light mb-2">
					Estimated Price
				</p>
				<p className="text-4xl font-bold text-primary font-display">
					{formatEUR(estimate.total)}
				</p>
				<p className="text-xs text-muted-foreground font-display font-light mt-1">
					Based on {estimate.surfaceAreaM2}m² surface area
				</p>
			</div>

			{/* Breakdown */}
			<div className="space-y-3">
				{/* Base price - Show actual background name */}
				<div className="flex justify-between items-center text-sm">
					<span className="text-muted-foreground font-display font-light">
						{backgroundName}
					</span>
					<span className="font-display font-medium">{formatEUR(estimate.base)}</span>
				</div>

				{/* Flexibility upcharge */}
				{estimate.flexibility > 0 && (
					<div className="flex justify-between items-center text-sm">
						<span className="text-muted-foreground font-display font-light">
							Flexible material
						</span>
						<span className="font-display font-medium">+{formatEUR(estimate.flexibility)}</span>
					</div>
				)}

				{/* Side panels */}
				{estimate.sidePanels > 0 && (
					<div className="flex justify-between items-center text-sm">
						<span className="text-muted-foreground font-display font-light">
							Side panels ({config?.sidePanels})
						</span>
						<span className="font-display font-medium">+{formatEUR(estimate.sidePanels)}</span>
					</div>
				)}

				{/* Filtration cutout */}
				{estimate.filtration > 0 && (
					<div className="flex justify-between items-center text-sm">
						<span className="text-muted-foreground font-display font-light">
							Filtration cutout
						</span>
						<span className="font-display font-medium">+{formatEUR(estimate.filtration)}</span>
					</div>
				)}

				{/* Additional items */}
				{hasAdditionalItems && (
					<div className="flex justify-between items-center text-sm">
						<span className="text-muted-foreground font-display font-light">
							Additional items ({additionalItemsCount})
						</span>
						<span className="font-display font-medium">
							{estimate.additionalItems > 0 ? `+${formatEUR(estimate.additionalItems)}` : "TBD"}
						</span>
					</div>
				)}

				{/* Subtotal (if there are extras) */}
				{(estimate.flexibility > 0 || estimate.sidePanels > 0 || estimate.filtration > 0 || hasAdditionalItems) && (
					<div className="pt-3 border-t flex justify-between items-center text-sm">
						<span className="font-display font-medium">Subtotal</span>
						<span className="font-display font-semibold">{formatEUR(estimate.subtotal)}</span>
					</div>
				)}
			</div>

			{/* Fine print */}
			<div className="pt-2 text-xs text-muted-foreground font-display font-light text-center">
				Final price confirmed within 24h
			</div>
		</div>
	);
}