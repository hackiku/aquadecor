// src/components/navigation/ConditionalNav.tsx
"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

interface ConditionalNavProps {
	children: ReactNode;
	navContent: ReactNode;
}

export function ConditionalNav({ children, navContent }: ConditionalNavProps) {
	const pathname = usePathname();

	// Check if we're in admin routes
	const isAdmin = pathname?.startsWith("/admin");

	return (
		<>
			{/* Only render nav for non-admin routes */}
			{!isAdmin && navContent}

			{/* Content spacing only for non-admin routes */}
			<div style={!isAdmin ? { paddingTop: 'var(--nav-height)' } : undefined}>
				{children}
			</div>
		</>
	);
}