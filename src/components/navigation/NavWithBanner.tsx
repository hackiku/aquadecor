// src/components/navigation/NavWithBanner.tsx
import { getActiveSale } from "~/server/queries/sales";
import { NavWithBannerClient } from "./NavWithBannerClient";

export async function NavWithBanner() {
	const activeSale = await getActiveSale();

	// All banners are roughly same height - keep it simple
	const navHeight = 64; // h-16
	const bannerHeight = activeSale ? 48 : 0; // h-12 or nothing
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