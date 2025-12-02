// src/app/shop/layout.tsx

import { Footer } from "~/components/navigation/Footer";

export default function ShopLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<>
			{/* Sticky breadcrumbs - positioned below nav using CSS variable */}
			<div
				className="sticky z-40 bg-background border-b"
				style={{ top: 'var(--nav-height)' }}
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