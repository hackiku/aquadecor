// src/app/shop/layout.tsx

import { Nav } from "~/components/navigation/Nav";

import { Footer } from "~/components/navigation/Footer";
import { NavWithBanner } from "~/components/navigation/NavWithBanner";

export default function WebsiteLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<>
			<NavWithBanner /> {/* Server component, fetches sale */}
			{/* <Nav /> */}
			{children}
			<Footer />
		</>
	);
}