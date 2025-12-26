// src/app/[locale]/(checkout)/layout.tsx
import { notFound } from 'next/navigation';
import { SessionProvider } from "next-auth/react";
import { CheckoutProgressBar } from './_components/CheckoutProgressBar';
import { CheckoutProvider } from './_components/CheckoutContext';

type Props = {
	children: React.ReactNode;
	params: Promise<{ locale: string }>;
};

export default async function CheckoutLayout({ children, params }: Props) {
	const { locale } = await params;

	return (
		<SessionProvider>
			<CheckoutProvider>
				<div className="min-h-screen bg-gradient-to-b from-muted/30 to-background">
					{/* Progress Bar - Fixed at top on mobile, sticky on desktop */}
					<div className="sticky top-0 z-30 bg-background/95 backdrop-blur-sm border-b">
						<div className="container max-w-7xl mx-auto px-4 py-4">
							<CheckoutProgressBar />
						</div>
					</div>

					{/* Main Content */}
					<div className="container max-w-7xl mx-auto px-4 py-8 md:py-12">
						{children}
					</div>

					{/* Footer - Minimal */}
					<footer className="border-t mt-16 py-8">
						<div className="container max-w-7xl mx-auto px-4 text-center">
							<p className="text-sm text-muted-foreground font-display font-light">
								Need help? <a href="/support" className="text-primary hover:underline">Contact Support</a>
							</p>
						</div>
					</footer>
				</div>
			</CheckoutProvider>
		</SessionProvider>
	);
}