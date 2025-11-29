// src/app/ClientLayout.tsx
"use client";

import { usePathname } from "next/navigation";
import { ActiveSaleBanner } from "~/components/cta/sale/ActiveSaleBanner";
import { Nav } from "~/components/navigation/Nav";
import { Footer } from "~/components/navigation/Footer";

export function ClientLayout({ children }: { children: React.ReactNode }) {
	const pathname = usePathname();
	const isAdmin = pathname?.startsWith("/admin");

	if (isAdmin) return <>{children}</>;

	return (
		<>
			<ActiveSaleBanner />
			<Nav />
			{children}
			<Footer />
		</>
	);
}