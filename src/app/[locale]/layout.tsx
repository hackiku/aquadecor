// src/app/[locale]/layout.tsx
import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { routing } from '~/i18n/routing';
import { TRPCReactProvider } from '~/trpc/react';
import { ConditionalNav } from '~/components/navigation/ConditionalNav';
import { NavWithBanner } from '~/components/navigation/NavWithBanner';
import { SessionProvider } from "next-auth/react";
import { CheckoutProvider } from '~/app/_context/CheckoutContext';
import { ThemeProvider } from '~/components/theme-provider';
import { Geist } from "next/font/google";
import { ViewportSize } from '~/components/dev/ViewportSize';
import { generateHreflang } from '~/i18n/seo/hreflang';

import "~/styles/globals.css";

const geist = Geist({
	subsets: ["latin"],
	variable: "--font-geist-sans",
});

type Props = {
	children: React.ReactNode;
	params: Promise<{ locale: string }>;
};

// ========================================
// METADATA - HREFLANG FOR ALL PAGES
// ========================================
export async function generateMetadata({ params }: Props) {
	const { locale } = await params;

	// Generate hreflang alternates for all pages
	// Individual pages will merge their specific metadata with these
	const hreflang = generateHreflang({
		currentLocale: locale,
		path: '/', // Base path - pages override with their actual path
	});

	return {
		...hreflang,
		// Other metadata from root layout cascades down
		// Pages can override title/description but keep hreflang
	};
}

export default async function LocaleLayout({ children, params }: Props) {
	const { locale } = await params;

	// Validate that the incoming locale is valid
	if (!routing.locales.includes(locale as any)) {
		notFound();
	}

	// Enable static rendering
	setRequestLocale(locale);

	// Get messages for this locale
	const messages = await getMessages();

	// Map locale to valid HTML lang attribute
	// 'us' → 'en-US', others stay as-is ('en', 'de', 'nl', 'it')
	const htmlLang = locale === 'us' ? 'en-US' : locale;

	return (
		<html
			lang={htmlLang}
			className={geist.variable}
			data-scroll-behavior="smooth"
			suppressHydrationWarning
		>
			<body>
				<ThemeProvider
					attribute="class"
					defaultTheme="dark"
					enableSystem
					disableTransitionOnChange
				>
					<SessionProvider>
						<TRPCReactProvider>
							<CheckoutProvider>
								<NextIntlClientProvider messages={messages}>
									<ConditionalNav navContent={<NavWithBanner />}>
										{process.env.NODE_ENV === "development" && <ViewportSize />}
										{children}
									</ConditionalNav>
								</NextIntlClientProvider>
							</CheckoutProvider>
						</TRPCReactProvider>
					</SessionProvider>
				</ThemeProvider>
			</body>
		</html>
	);
}

// Generate static params for all locales
export function generateStaticParams() {
	return routing.locales.map((locale) => ({ locale }));
}