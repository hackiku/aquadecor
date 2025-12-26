// src/app/[locale]/(checkout)/layout.tsx
import { SessionProvider } from "next-auth/react";
import { CheckoutProvider } from './_context/CheckoutContext';

type Props = {
	children: React.ReactNode;
	params: Promise<{ locale: string }>;
};

export default async function CheckoutLayout({ children, params }: Props) {
	const { locale } = await params;

	return (
		<SessionProvider>
			<CheckoutProvider>
				<div className="min-h-screen">
					{children}
				</div>
			</CheckoutProvider>
		</SessionProvider>
	);
}