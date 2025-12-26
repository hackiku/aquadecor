// src/app/[locale]/(checkout)/layout.tsx
import { SessionProvider } from "next-auth/react";
import { Footer } from "~/components/navigation/Footer";

type Props = {
	children: React.ReactNode;
	params: Promise<{ locale: string }>;
};

export default async function CheckoutLayout({ children, params }: Props) {
	const { locale } = await params;

	return (
		<SessionProvider>
			<div className="min-h-screen">
				{children}
			</div>
		<Footer />
		</SessionProvider>
	);
}