// src/app/admin/_components/layout/SidebarProvider.tsx
"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

interface SidebarContextType {
	isCollapsed: boolean;
	setIsCollapsed: (collapsed: boolean) => void;
	openDropdowns: string[];
	setOpenDropdowns: (dropdowns: string[]) => void;
	toggleDropdown: (href: string) => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function SidebarProvider({ children }: { children: ReactNode }) {
	const [isCollapsed, setIsCollapsed] = useState(false);
	const [openDropdowns, setOpenDropdowns] = useState<string[]>([]);

	const toggleDropdown = (href: string) => {
		setOpenDropdowns((prev) =>
			prev.includes(href) ? prev.filter((h) => h !== href) : [...prev, href]
		);
	};

	return (
		<SidebarContext.Provider
			value={{
				isCollapsed,
				setIsCollapsed,
				openDropdowns,
				setOpenDropdowns,
				toggleDropdown,
			}}
		>
			{children}
		</SidebarContext.Provider>
	);
}

export function useSidebar() {
	const context = useContext(SidebarContext);
	if (!context) {
		throw new Error("useSidebar must be used within SidebarProvider");
	}
	return context;
}