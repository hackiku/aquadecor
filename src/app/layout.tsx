// src/app/layout.tsx
import "~/styles/globals.css";
import type { Metadata } from "next";

/**
 * Root Layout - Minimal Shell
 * 
 * The <html> tag is now in [locale]/layout.tsx so we can set lang={locale}
 * This root layout just provides global metadata defaults
 */
export const metadata: Metadata = {
	title: {
		default: "Aquadecor Backgrounds",
		template: "%s | Aquadecor"
	},
	description: "The most realistic 3D aquarium backgrounds and decorations",
	icons: [{ rel: "icon", url: "/favicon.png" }],
	metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://aquadecorbackgrounds.com'),
};

export default function RootLayout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	// Just pass through - locale layout handles HTML tag
	return children;
}