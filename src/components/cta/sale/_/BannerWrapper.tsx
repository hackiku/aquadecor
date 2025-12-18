// @ts-nocheck
// src/components/cta/sale/BannerWrapper.tsx
"use client";
import React from "react";
import { usePathname } from "next/navigation";
import { ActiveSaleBanner } from "./ActiveSaleBanner";

interface BannerWrapperProps {
	children: React.ReactNode;
}

export function BannerWrapper({ children }: BannerWrapperProps) {
	const pathname = usePathname();
	if (pathname?.startsWith("/admin")) return <>{children}</>;
	return (
		<>
			<ActiveSaleBanner />
			{children}
		</>
	);
}