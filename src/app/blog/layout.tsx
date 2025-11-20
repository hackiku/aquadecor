// src/app/blog/layout.tsx

import { Nav } from "~/components/navigation/Nav";
import { Footer } from "~/components/navigation/Footer";

export default function WebsiteLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<>
			<Nav />
			{children}
			<Footer />
		</>
	);
}