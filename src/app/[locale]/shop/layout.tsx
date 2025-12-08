// src/app/[locale]/shop/layout.tsx

import { Footer } from "~/components/navigation/Footer";
import { Breadcrumbs } from "~/components/navigation/Breadcrumbs";

export default function ShopLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<>
			{/* Sticky breadcrumbs container */}
			<div
				className="sticky z-30 bg-background/95 backdrop-blur-sm"
				style={{ top: 'calc(var(--nav-height) - 64px)' }}
			>
				<div className="px-8 mx-auto py-3 bg-black">
					<Breadcrumbs darkMode />
				</div>
			</div>

			{children}
			<Footer />
		</>
	);
}