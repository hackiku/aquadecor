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
			className="relative w-full"
		>
			<div className="max-w-7xl mx-auto px-4 py-2 flex justify-between items-center gap-y-2 md:flex-row transition-all duration-150">
				<div className="flex flex-col md:flex-row md:items-center md:justify-between w-full gap-y-2">

					<p className="font-display hidden lg:block text-center">
						{customMessage || name}
					</p>

					<p className="text-center md:text-left">
						Use code <strong>{discountCode}</strong> for {discountPercent}% off
					</p>

					<div className="flex gap-x-2 items-center justify-center md:justify-end">
						<div className="text-sm text-center font-medium bg-white/20 px-3 py-1 rounded-full">
							Limited time offer
						</div>

						{onDismiss && (
							<button
								onClick={onDismiss}
								className="hidden md:inline-block hover:opacity-70 transition-opacity"
								aria-label="Dismiss banner"
							>
								<X className="w-5 h-5" />
							</button>
						)}
					</div>
				</div>

				{/* Mobile close button */}
				{onDismiss && (
					<button
						onClick={onDismiss}
						className="md:hidden hover:opacity-70 transition-opacity"
						aria-label="Dismiss banner"
					>
						<X className="w-5 h-5" />
					</button>
				)}
			</div>
		</div>
	);
}