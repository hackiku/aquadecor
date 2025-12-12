// src/app/layout.tsx
import "~/styles/globals.css";
import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { ThemeProvider } from '~/components/theme-provider';

export const metadata: Metadata = {
	title: "Aquadecor Backgrounds",
	description: "The most realistic 3D aquarium backgrounds and decorations",
	icons: [{ rel: "icon", url: "/favicon.png" }],
};

const geist = Geist({
	subsets: ["latin"],
	variable: "--font-geist-sans",
});

/**
 * Root layout - NO locale here, NO providers except ThemeProvider
 * This is just a shell for the HTML structure
 * All locale-specific stuff happens in [locale]/layout.tsx
 */
export default function RootLayout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	return (
		<html
			className={`${geist.variable}`}
			data-scroll-behavior="smooth"
			suppressHydrationWarning
		>
			<body>
				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					enableSystem
					disableTransitionOnChange
				>
					{children}
				</ThemeProvider>
			</body>
		</html>
	);
}