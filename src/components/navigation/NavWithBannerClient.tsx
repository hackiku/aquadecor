// src/components/navigation/NavWithBannerClient.tsx
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Nav } from "./Nav";
import { SaleBanner } from "~/components/cta/sale/SaleBanner";
import { CountdownBanner } from "~/components/cta/sale/CountdownBanner";
import { FlashSaleBanner } from "~/components/cta/sale/FlashSaleBanner";
import { MinimalBanner } from "~/components/cta/sale/MinimalBanner";

interface Sale {
	id: string;
	name: string;
	discountCode: string;
	discountPercent: number | null;
	endsAt: Date;
	bannerType: string;
	bannerConfig?: {
		backgroundColor?: string;
		textColor?: string;
		customMessage?: string;
		showCountdown?: boolean;
		ctaText?: string;
		ctaLink?: string;
	} | null;
}

interface NavWithBannerClientProps {
	activeSale: Sale | null;
	bannerHeight: number;
}

export function NavWithBannerClient({ activeSale, bannerHeight }: NavWithBannerClientProps) {
	const [isNavVisible, setIsNavVisible] = useState(true);
	const [lastScrollY, setLastScrollY] = useState(0);
	const [showBanner, setShowBanner] = useState(false);

	// Animate banner in after mount (prevents hydration mismatch)
	useEffect(() => {
		if (activeSale) {
			// Slight delay for dramatic effect
			const timer = setTimeout(() => setShowBanner(true), 100);
			return () => clearTimeout(timer);
		}
	}, [activeSale]);

	// Nav scroll behavior (banner stays fixed)
	useEffect(() => {
		const handleScroll = () => {
			const currentScrollY = window.scrollY;

			// Show nav when scrolling up or near top
			if (currentScrollY < lastScrollY || currentScrollY < 50) {
				setIsNavVisible(true);
			}
			// Hide nav when scrolling down past threshold
			else if (currentScrollY > lastScrollY && currentScrollY > 50) {
				setIsNavVisible(false);
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
			discountPercent: activeSale.discountPercent ?? 0,
			backgroundColor: activeSale.bannerConfig?.backgroundColor,
			textColor: activeSale.bannerConfig?.textColor,
			customMessage: activeSale.bannerConfig?.customMessage,
		};


		switch (activeSale.bannerType) {
			case "CountdownBanner":
				return (
					<CountdownBanner
						{...props}
						endsAt={new Date(activeSale.endsAt)}
					/>
				);
			case "FlashSaleBanner":
				return (
					<FlashSaleBanner
						{...props}
						endsAt={new Date(activeSale.endsAt)}
					/>
				);
			case "MinimalBanner":
				return <MinimalBanner {...props} />;
			case "SaleBanner":
			default:
				return <SaleBanner {...props} />;
		}
	};

	return (
		<>
			{/* Banner - Always visible at top - z-50 */}
			{activeSale && (
				<div className="fixed top-0 left-0 right-0 z-50">
					<AnimatePresence>
						{showBanner && (
							<motion.div
								initial={{ height: 0, opacity: 0 }}
								animate={{ height: bannerHeight, opacity: 1 }}
								exit={{ height: 0, opacity: 0 }}
								transition={{ duration: 0.3, ease: "easeOut" }}
								className="overflow-hidden"
							>
								{renderBanner()}
							</motion.div>
						)}
					</AnimatePresence>
				</div>
			)}

			{/* Nav - Slides up ABOVE viewport, positioned below banner - z-40 */}
			<motion.div
				className="fixed left-0 right-0 z-40"
				style={{ top: bannerHeight }}
				animate={{
					y: isNavVisible ? 0 : -80, // Slide completely off-screen (64px + 16px buffer)
				}}
				transition={{
					type: "spring",
					stiffness: 300,
					damping: 30,
				}}
			>
				<Nav />
			</motion.div>
		</>
	);
}