// src/components/navigation/NavWithBanner.tsx
import { getActiveSale } from "~/server/queries/sales";
import { NavWithBannerClient } from "./NavWithBannerClient";

export async function NavWithBanner() {
	const activeSale = await getActiveSale();

	// Calculate heights based on banner type
	const getBannerHeight = () => {
		if (!activeSale) return 0;

		switch (activeSale.bannerType) {
			case "FlashSaleBanner":
				return 56; // h-14 - taller for urgency
			case "MinimalBanner":
				return 40; // h-10 - shorter for subtlety
			case "CountdownBanner":
				return 52; // h-13 - countdown needs space
			default:
				return 48; // h-12 - standard
		}
	};

	const navHeight = 64; // h-16
	const bannerHeight = getBannerHeight();
	const totalHeight = navHeight + bannerHeight;

	return (
		<>
			{/* Set CSS variable synchronously before paint - prevents CLS */}
			<style dangerouslySetInnerHTML={{
				__html: `:root { --nav-height: ${totalHeight}px; --banner-height: ${bannerHeight}px; }`
			}} />

			<NavWithBannerClient
				activeSale={activeSale}
				bannerHeight={bannerHeight}
			/>
		</>
	);
}