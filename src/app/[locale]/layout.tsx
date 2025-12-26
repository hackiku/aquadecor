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
import { ViewportSize } from '~/components/dev/ViewportSize';
import { generateHreflang } from '~/i18n/seo/hreflang';

type Props = {
	children: React.ReactNode;
	params: Promise<{ locale: string }>;
};

// ========================================
// METADATA GENERATION - HREFLANG FOR ALL PAGES
// ========================================

/**
 * Generate hreflang alternates for ALL pages under [locale]
 * 
 * Individual pages will MERGE their specific metadata (title, description, images)
 * with these hreflang alternates automatically via Next.js metadata cascade.
 * 
 * This prevents duplicate hreflang code across every page.
 */
export async function generateMetadata({ params }: Props) {
	const { locale } = await params;

	// Generate base hreflang alternates
	// Individual pages override with their specific path
	const hreflang = generateHreflang({
		currentLocale: locale,
		path: '/', // Base path - pages override this
	});

	return {
		...hreflang,
		// Pages merge their metadata with these alternates:
		// - title, description, images come from page
		// - alternates (hreflang + canonical) come from here
	};
}

// ========================================
// LAYOUT COMPONENT
// ========================================

export default async function LocaleLayout({ children, params }: Props) {
	const { locale } = await params;

	// Validate that the incoming locale is valid
	if (!routing.locales.includes(locale as any)) {
		notFound();
	}

	// Enable static rendering (next-intl requirement)
	setRequestLocale(locale);

	// Get messages for this locale
	// Note: Your messages come from src/messages/{locale}/*.json
	// and are loaded via src/i18n/request.ts configuration
	const messages = await getMessages();

	return (
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
	);
}

// Generate static params for all locales
export function generateStaticParams() {
	return routing.locales.map((locale) => ({ locale }));
}