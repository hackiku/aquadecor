// src/app/shop/layout.tsx

import { Footer } from "~/components/navigation/Footer";

export default function ShopLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<>
			{/* Sticky breadcrumbs container - no gap, positioned right below nav */}
			<div
				className="sticky z-30 bg-background/95 backdrop-blur-sm border-b"
				style={{ top: 'calc(var(--nav-height) - 64px)' }}
			>
				<div className="px-4 max-w-7xl mx-auto py-3">
					{/* TODO: Add Breadcrumbs component here when needed */}
					{/* <Breadcrumbs items={breadcrumbItems} /> */}
				</div>
			</div>

			{children}
			<Footer />
		</>
	);
}