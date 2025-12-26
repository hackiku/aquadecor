// src/app/[locale]/layout.tsx
import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { routing } from '~/i18n/routing';
import { TRPCReactProvider } from '~/trpc/react';
import { ConditionalNav } from '~/components/navigation/ConditionalNav';
import { NavWithBanner } from '~/components/navigation/NavWithBanner';
import { SessionProvider } from "next-auth/react";
import { CheckoutProvider } from '~/app/_context/CheckoutContext'

import { ViewportSize } from '~/components/dev/ViewportSize';

type Props = {
	children: React.ReactNode;
	params: Promise<{ locale: string }>;
};

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