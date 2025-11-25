// src/app/admin/layout.tsx

"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "./_components/layout/Sidebar";
import { Header } from "./_components/layout/Header";
import { motion } from "framer-motion";

export default function AdminLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const [sidebarWidth, setSidebarWidth] = useState(256);

	// Listen for sidebar width changes
	useEffect(() => {
		const handleResize = () => {
			// This is a simple implementation - you might want to use context or other state management
			const sidebar = document.querySelector("aside");
			if (sidebar) {
				setSidebarWidth(sidebar.offsetWidth);
			}
		};

		// Initial check
		handleResize();

		// Watch for sidebar animations
		const observer = new ResizeObserver(handleResize);
		const sidebar = document.querySelector("aside");
		if (sidebar) {
			observer.observe(sidebar);
		}

		return () => observer.disconnect();
	}, []);

	return (
		<div className="flex min-h-screen bg-background">
			<Sidebar />
			<motion.div
				initial={false}
				animate={{
					marginLeft: sidebarWidth,
				}}
				transition={{ duration: 0.3, ease: "easeInOut" }}
				className="flex-1 flex flex-col min-h-screen"
			>
				<Header />
				<main className="flex-1 p-8">
					<div className="max-w-[1600px] mx-auto">
						{children}
					</div>
				</main>
			</motion.div>
		</div>
	);
}