// src/components/navigation/NavWithBanner.tsx
import { Nav } from "./Nav";
import { getActiveSale } from "~/server/queries/sales";
import { SaleBanner } from "~/components/cta/sale/SaleBanner";
import { CountdownBanner } from "~/components/cta/sale/CountdownBanner";
import { FlashSaleBanner } from "~/components/cta/sale/FlashSaleBanner";
import { MinimalBanner } from "~/components/cta/sale/MinimalBanner";

export async function NavWithBanner() {
	const activeSale = await getActiveSale();

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
			{/* Banner (fixed position) */}
			{banner && (
				<div className="fixed top-0 left-0 right-0 z-50">
					{banner}
				</div>
			)}

			{/* Nav (fixed, below banner) */}
			<div className={hasBanner ? "fixed top-12 left-0 right-0 z-50" : ""}>
				<Nav />
			</div>

			{/* Spacer to push content down */}
			<div className={hasBanner ? "h-28" : "h-16"} />
		</>
	);
}