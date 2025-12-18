// src/app/[locale]/(auth)/layout.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Sign In | Aquadecor",
	description: "Sign in to your Aquadecor account",
	robots: "noindex, nofollow", // Don't index auth pages
};

export default function AuthLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="flex min-h-screen items-center justify-center p-4 bg-gradient-to-b from-background to-muted/20">
			{children}
		</div>
	);
}