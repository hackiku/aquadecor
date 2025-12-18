// @ts-nocheck
// src/components/cta/sale/ActiveSaleBanner.tsx
"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { api } from "~/trpc/react";
import { SaleBanner } from "./SaleBanner";
import { CountdownBanner } from "./CountdownBanner";
import { FlashSaleBanner } from "./FlashSaleBanner";
import { MinimalBanner } from "./MinimalBanner";

const BANNER_DISMISSED_KEY = "aquadecor_banner_dismissed";

export function ActiveSaleBanner() {
	const pathname = usePathname();
	const [isDismissed, setIsDismissed] = useState(false);

	// Fetch active sale
	const { data: activeSale } = api.admin.sale.getActive.useQuery();

	// Check localStorage on mount
	useEffect(() => {
		if (typeof window !== "undefined") {
			const dismissed = localStorage.getItem(BANNER_DISMISSED_KEY);
			if (dismissed) {
				const dismissedData = JSON.parse(dismissed);
				// Check if it's the same sale
				if (dismissedData.saleId === activeSale?.id) {
					setIsDismissed(true);
				}
			}
		}
	}, [activeSale?.id]);

	const handleDismiss = () => {
		if (activeSale) {
			localStorage.setItem(
				BANNER_DISMISSED_KEY,
				JSON.stringify({ saleId: activeSale.id, dismissedAt: new Date() })
			);
			setIsDismissed(true);
		}
	};

	// Don't show banner if:
	// 1. No active sale
	// 2. User dismissed it
	// 3. Current page not in visibleOn list
	if (!activeSale || isDismissed) {
		return null;
	}

	// Check if current page should show banner
	const shouldShowOnCurrentPage = activeSale.visibleOn.some((pattern) => {
		// Exact match
		if (pattern === pathname) return true;

		// Wildcard match (e.g., "/shop/*" matches "/shop/anything")
		if (pattern.endsWith("/*")) {
			const basePattern = pattern.slice(0, -2);
			return pathname.startsWith(basePattern);
		}

		return false;
	});

	if (!shouldShowOnCurrentPage) {
		return null;
	}

	// Extract banner config
	const config = activeSale.bannerConfig as any || {};

	const sharedProps = {
		name: activeSale.name,
		discountCode: activeSale.discountCode,
		discountPercent: activeSale.discountPercent,
		backgroundColor: config.backgroundColor,
		textColor: config.textColor,
		customMessage: config.customMessage,
		onDismiss: handleDismiss,
	};

	// Render appropriate banner type
	switch (activeSale.bannerType) {
		case "CountdownBanner":
			return (
				<CountdownBanner
					{...sharedProps}
					endsAt={new Date(activeSale.endsAt)}
				/>
			);

		case "FlashSaleBanner":
			return (
				<FlashSaleBanner
					{...sharedProps}
					endsAt={new Date(activeSale.endsAt)}
				/>
			);

		case "MinimalBanner":
			return <MinimalBanner {...sharedProps} />;

		case "SaleBanner":
		default:
			return <SaleBanner {...sharedProps} />;
	}
}