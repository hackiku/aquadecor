// src/app/layout.tsx
import "~/styles/globals.css";

import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { ThemeProvider } from "~/components/theme-provider";
import { TRPCReactProvider } from "~/trpc/react";
import { NavWithBanner } from "~/components/navigation/NavWithBanner";

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
						{/* Nav with dynamic banner */}
						<NavWithBanner />

						{/* Content respects nav height via CSS variable */}
						<div style={{ paddingTop: 'var(--nav-height)' }}>
							{children}
						</div>
					</ThemeProvider>
				</TRPCReactProvider>
			</body>
		</html>
	);
}