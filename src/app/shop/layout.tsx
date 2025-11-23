// src/app/shop/layout.tsx
"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Nav } from "~/components/navigation/Nav";
import { Footer } from "~/components/navigation/Footer";
import { Breadcrumbs } from "~/components/navigation/Breadcrumbs";

// Generate breadcrumb items from pathname
function getBreadcrumbsFromPath(pathname: string) {
	const segments = pathname.split("/").filter(Boolean);

	// Skip if just /shop
	if (segments.length === 1) return null;

	const items = [
		{ label: "Shop", href: "/shop" }
	];

	// Map segments to breadcrumbs
	// /shop/3d-backgrounds → Shop > 3D Backgrounds
	// /shop/3d-backgrounds/a-models → Shop > 3D Backgrounds > A Models
	// /shop/3d-backgrounds/a-models/f1 → Shop > 3D Backgrounds > A Models > Product Name

	let currentPath = "";
	segments.forEach((segment, index) => {
		if (index === 0) return; // Skip "shop"

		currentPath += `/${segment}`;

		// Format label (capitalize, replace hyphens)
		const label = segment
			.split("-")
			.map(word => word.charAt(0).toUpperCase() + word.slice(1))
			.join(" ");

		items.push({
			label,
			href: `/shop${currentPath}`
		});
	});

	return items;
}

export default function ShopLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const pathname = usePathname();
	const breadcrumbs = getBreadcrumbsFromPath(pathname);

	const [isVisible, setIsVisible] = useState(true);
	const [lastScrollY, setLastScrollY] = useState(0);

	// Scroll handler - matches Nav behavior
	useEffect(() => {
		const handleScroll = () => {
			const currentScrollY = window.scrollY;

			// Show when scrolling up, hide when scrolling down
			if (currentScrollY < lastScrollY || currentScrollY < 50) {
				setIsVisible(true);
			} else if (currentScrollY > lastScrollY && currentScrollY > 100) {
				setIsVisible(false);
			}

			setLastScrollY(currentScrollY);
		};

		window.addEventListener("scroll", handleScroll, { passive: true });
		return () => window.removeEventListener("scroll", handleScroll);
	}, [lastScrollY]);

	return (
		<>
			<Nav />

			{/* Breadcrumbs wrapper - follows Nav scroll behavior */}
			{breadcrumbs && (
				<div
					className={`
						sticky top-16 z-40 
						border-b bg-background/95 backdrop-blur
						transition-transform duration-300
						${isVisible ? "translate-y-0" : "-translate-y-full"}
					`}
				>
					<div className="px-4 py-4 max-w-7xl mx-auto">
						<Breadcrumbs items={breadcrumbs} />
					</div>
				</div>
			)}

			{children}

			<Footer />
		</>
	);
}