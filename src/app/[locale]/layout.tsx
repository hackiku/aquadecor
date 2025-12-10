// src/app/[locale]/layout.tsx
import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { locales } from '~/i18n/config';
import { Geist } from 'next/font/google';
// import { ThemeProvider } from '~/components/theme-provider';
import { TRPCReactProvider } from '~/trpc/react';
import { ConditionalNav } from '~/components/navigation/ConditionalNav';
import { NavWithBanner } from '~/components/navigation/NavWithBanner';


type Props = {
	children: React.ReactNode;
	params: Promise<{ locale: string }>; // ← Changed in Next.js 15!
};

export default async function LocaleLayout({
	children,
	params
}: Props) {
	const { locale } = await params; // ← MUST await params now!

	// Validate locale
	if (!locales.includes(locale as any)) {
		notFound();
	}

	// Get messages
	const messages = await getMessages();

	return (
		// <html className={geist.variable} lang={locale} suppressHydrationWarning>
			// <body>
				<TRPCReactProvider>
					{/* <ThemeProvider
						attribute="class"
						defaultTheme="system"
						enableSystem
						disableTransitionOnChange
					> */}
						<NextIntlClientProvider messages={messages}>
							<ConditionalNav navContent={<NavWithBanner />}>
								{children}
							</ConditionalNav>
						</NextIntlClientProvider>
					{/* </ThemeProvider> */}
				</TRPCReactProvider>
			// </body>
		// </html>
	);
}

export function generateStaticParams() {
	return locales.map((locale) => ({ locale }));
}