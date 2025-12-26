// src/app/[locale]/(checkout)/layout.tsx
import { SessionProvider } from "next-auth/react";

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

		</SessionProvider>
	);
}