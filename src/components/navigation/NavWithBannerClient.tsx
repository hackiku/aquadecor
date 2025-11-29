// src/components/navigation/NavWithBannerClient.tsx
"use client";

import { useState, useEffect } from "react";
import { Nav } from "./Nav";
import { SaleBanner } from "~/components/cta/sale/SaleBanner";
import { CountdownBanner } from "~/components/cta/sale/CountdownBanner";
import { FlashSaleBanner } from "~/components/cta/sale/FlashSaleBanner";
import { MinimalBanner } from "~/components/cta/sale/MinimalBanner";

interface NavWithBannerClientProps {
	activeSale: any; // From server
}

export function NavWithBannerClient({ activeSale }: NavWithBannerClientProps) {
	const [isVisible, setIsVisible] = useState(true);
	const [lastScrollY, setLastScrollY] = useState(0);

	// Unified scroll handler for banner + nav
	useEffect(() => {
		const handleScroll = () => {
			const currentScrollY = window.scrollY;

			if (currentScrollY < lastScrollY || currentScrollY < 50) {
				setIsVisible(true);
			} else if (currentScrollY > lastScrollY && currentScrollY > 100) {
				setIsVisible(false);
			}

			setLastScrollY(currentScrollY);
		};

		window.addEventListener("scroll", handleScroll, { passive: true });
		return () => window.removeEventListener("scroll", handleScroll);
	}, [lastScrollY]);

	const renderBanner = () => {
		if (!activeSale) return null;

		const props = {
			name: activeSale.name,
			discountCode: activeSale.discountCode,
			discountPercent: activeSale.discountPercent,
			backgroundColor: activeSale.bannerConfig?.backgroundColor,
			textColor: activeSale.bannerConfig?.textColor,
			customMessage: activeSale.bannerConfig?.customMessage,
		};

		switch (activeSale.bannerType) {
			case "CountdownBanner":
				return <CountdownBanner {...props} endsAt={new Date(activeSale.endsAt)} />;
			case "FlashSaleBanner":
				return <FlashSaleBanner {...props} endsAt={new Date(activeSale.endsAt)} />;
			case "MinimalBanner":
				return <MinimalBanner {...props} />;
			case "SaleBanner":
			default:
				return <SaleBanner {...props} />;
		}
	};

	const banner = renderBanner();
	const hasBanner = !!banner;

	return (
		<>
			{/* Banner + Nav container (scroll together) */}
			<div
				className={`fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ${isVisible ? "translate-y-0" : "-translate-y-full"
					}`}
			>
				{banner}
				<Nav disableScroll /> {/* Pass prop to disable Nav's own scroll logic */}
			</div>

			{/* Spacer to push content down */}
			<div className={hasBanner ? "h-28" : "h-16"} />
		</>
	);
}