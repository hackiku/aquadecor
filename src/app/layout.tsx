// src/app/layout.tsx
import "~/styles/globals.css";
import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { ThemeProvider } from '~/components/theme-provider';
import { headers } from 'next/headers';

export const metadata: Metadata = {
	title: {
		default: "Aquadecor Backgrounds",
		template: "%s | Aquadecor"
	},
	description: "The most realistic 3D aquarium backgrounds and decorations",
	icons: [{ rel: "icon", url: "/favicon.png" }],
	metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://aquadecorbackgrounds.com'),
};

const geist = Geist({
	subsets: ["latin"],
	variable: "--font-geist-sans",
});

export default async function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	// Read locale from middleware header
	const headersList = await headers();
	const locale = headersList.get('x-locale') || 'en';

	// Map locale to valid HTML lang attribute
	// 'us' → 'en-US' for proper BCP 47 language tag
	// Other locales ('en', 'de', 'nl', 'it') stay as-is
	const htmlLang = locale === 'us' ? 'en-US' : locale;

	console.log('🔍 ROOT LAYOUT - Setting lang to:', htmlLang, '(from header)');

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
					{children}
				</ThemeProvider>
			</body>
		</html>
	);
}