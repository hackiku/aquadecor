// src/components/cta/sale/MinimalBanner.tsx
"use client";

import { X } from "lucide-react";

interface MinimalBannerProps {
	name: string;
	discountCode: string;
	discountPercent: number;
	backgroundColor?: string;
	textColor?: string;
	customMessage?: string;
	onDismiss?: () => void;
}

export function MinimalBanner({
	name,
	discountCode,
	discountPercent,
	backgroundColor = "#6366f1",
	textColor = "#ffffff",
	customMessage,
	onDismiss,
}: MinimalBannerProps) {
	return (
		<div
			style={{ backgroundColor, color: textColor }}
			className="relative w-full h-12"
		>
			<div className="max-w-7xl mx-auto px-4 h-full flex justify-between items-center">
				<div className="flex items-center justify-center w-full gap-2 text-sm">
					<p className="font-display font-light">
						{customMessage || `${name} - ${discountPercent}% off with code`}
					</p>
					<code className="font-mono font-bold bg-white/20 px-2 py-0.5 rounded text-xs">
						{discountCode}
					</code>
				</div>

				{onDismiss && (
					<button
						onClick={onDismiss}
						className="hover:opacity-70 transition-opacity ml-4"
						aria-label="Dismiss banner"
					>
						<X className="w-4 h-4" />
					</button>
				)}
			</div>
		</div>
	);
}