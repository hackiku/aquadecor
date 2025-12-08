// src/app/[locale]/(website)/layout.tsx

import { Footer } from "~/components/navigation/Footer";

export default function WebsiteLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<>
			{children}
			<Footer />
		</>
	);
}