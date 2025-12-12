// src/components/shop/product/CustomOnlyBadge.tsx
"use client";

import { AlertTriangle } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";

interface CustomOnlyBadgeProps {
	variant?: "inline" | "banner";
	showCalculatorLink?: boolean;
}

export function CustomOnlyBadge({
	variant = "inline",
	showCalculatorLink = true
}: CustomOnlyBadgeProps) {
	const t = useTranslations('shop.productDetail');

	if (variant === "banner") {
		return (
			<div className="rounded-xl border-2 border-yellow-500/20 bg-yellow-500/5 p-4 md:p-6">
				<div className="flex items-start gap-4">
					<div className="shrink-0 w-10 h-10 rounded-full bg-yellow-500/10 flex items-center justify-center">
						<AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-500" />
					</div>
					<div className="space-y-2 flex-1">
						<h3 className="font-display font-medium text-yellow-900 dark:text-yellow-200">
							{t('customOnlyBanner.title')}
						</h3>
						<p className="text-sm text-yellow-800/80 dark:text-yellow-300/80 font-display font-light">
							{t('customOnlyBanner.description')}
						</p>
						{showCalculatorLink && (
							<Link
								href="/calculator"
								className="inline-flex items-center gap-2 text-sm font-display font-medium text-yellow-700 dark:text-yellow-400 hover:text-yellow-600 dark:hover:text-yellow-300 transition-colors"
							>
								{t('customOnlyBanner.calculatorLink')}
							</Link>
						)}
					</div>
				</div>
			</div>
		);
	}

	// Inline variant
	return (
		<div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-yellow-500/10 border border-yellow-500/20">
			<AlertTriangle className="h-3.5 w-3.5 text-yellow-600 dark:text-yellow-500" />
			<span className="text-xs font-display font-medium text-yellow-700 dark:text-yellow-400">
				{t('badges.customSizesOnly')}
			</span>
		</div>
	);
}