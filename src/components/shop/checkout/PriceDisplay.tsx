// src/components/shop/checkout/PriceDisplay.tsx
"use client";

import { cn } from "~/lib/utils";

interface PriceDisplayProps {
	totalEurCents: number;
	breakdown?: Array<{ label: string; amountEurCents: number }>;
	className?: string;
}

export function PriceDisplay({ totalEurCents, breakdown, className }: PriceDisplayProps) {
	const formatPrice = (cents: number) => `€${(cents / 100).toFixed(2)}`;

	return (
		<div className={cn("space-y-3 pt-2", className)}>
			{breakdown && breakdown.length > 0 && (
				<>
					{breakdown.map((item, idx) => (
						<div key={idx} className="flex items-baseline justify-between text-sm">
							<span className="text-muted-foreground font-display font-light">
								{item.label}
							</span>
							<span className="font-display font-medium">
								{formatPrice(item.amountEurCents)}
							</span>
						</div>
					))}
				</>
			)}

			<div className="flex items-baseline justify-between pt-3 border-t">
				<span className="text-base font-display font-medium">Total</span>
				<span className="text-4xl font-display font-light">
					{formatPrice(totalEurCents)}
				</span>
			</div>
		</div>
	);
}