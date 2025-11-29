// src/components/navigation/NavWithBanner.tsx
import { NavWithBannerClient } from "./NavWithBannerClient";
import { getActiveSale } from "~/server/queries/sales";

export async function NavWithBanner() {
	const activeSale = await getActiveSale();

	return <NavWithBannerClient activeSale={activeSale} />;
}