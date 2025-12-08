// src/app/layout.tsx
import "~/styles/globals.css";
import type { Metadata } from "next";
import { Geist } from "next/font/google";

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
 * Root layout - NO locale here, NO providers
 * This is just a shell for the HTML structure
 * All locale-specific stuff happens in [locale]/layout.tsx
 */
// export default function RootLayout({
// 	children,
// }: Readonly<{ children: React.ReactNode }>) {
// 	return children;
// }

export default function RootLayout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	return (
		<html
			className={`${geist.variable}`}
			// lang="en"
			suppressHydrationWarning
		>
			<body>
				{children}
			</body>
		</html>
	);
}


/*
import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { ThemeProvider } from "~/components/theme-provider";
import { TRPCReactProvider } from "~/trpc/react";
import { ConditionalNav } from "~/components/navigation/ConditionalNav";
import { NavWithBanner } from "~/components/navigation/NavWithBanner";
import { ViewportSize } from "~/components/dev/ViewportSize";

export const metadata: Metadata = {
	title: "Aquadecor Backgrounds",
	description: "The most realistic 3D aquarium backgrounds and decorations",
	icons: [{ rel: "icon", url: "/favicon.png" }],
};

const geist = Geist({
	subsets: ["latin"],
	variable: "--font-geist-sans",
});

export default function RootLayout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	return (
		<html
			className={`${geist.variable}`}
			lang="en"
			suppressHydrationWarning
		>
			<body>
				<TRPCReactProvider>
					<ThemeProvider
						attribute="class"
						defaultTheme="system"
						enableSystem
						disableTransitionOnChange
					>
						<ViewportSize />
						<ConditionalNav navContent={<NavWithBanner />}>
							{children}
						</ConditionalNav>
					</ThemeProvider>
				</TRPCReactProvider>
			</body>
		</html>
	);
}
*/