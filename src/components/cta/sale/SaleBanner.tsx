// src/components/cta/sale/SaleBanner.tsx
"use client";

import { X } from "lucide-react";

interface SaleBannerProps {
	name: string;
	discountCode: string;
	discountPercent: number;
	backgroundColor?: string;
	textColor?: string;
	customMessage?: string;
	onDismiss?: () => void;
}

export function SaleBanner({
	name,
	discountCode,
	discountPercent,
	backgroundColor = "#000000",
	textColor = "#ffffff",
	customMessage,
	onDismiss,
}: SaleBannerProps) {
	return (
		<div
			style={{ backgroundColor, color: textColor }}
			className="relative w-full h-12"
		>
			<div className="max-w-7xl mx-auto px-4 h-full flex justify-between items-center">
				<div className="flex flex-row items-center justify-between w-full gap-x-4">

					<p className="font-display hidden lg:block text-sm">
						{customMessage || name}
					</p>

					<p className="text-center md:text-left text-sm">
						Use code <strong>{discountCode}</strong> for {discountPercent}% off
					</p>

					<div className="flex gap-x-2 items-center">
						<div className="text-xs font-medium bg-white/20 px-3 py-1 rounded-full">
							Limited time
						</div>

						{onDismiss && (
							<button
								onClick={onDismiss}
								className="hover:opacity-70 transition-opacity"
								aria-label="Dismiss banner"
							>
								<X className="w-4 h-4" />
							</button>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}