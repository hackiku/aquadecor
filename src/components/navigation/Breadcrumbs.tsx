// src/components/navigation/Breadcrumbs.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "~/lib/utils";

interface BreadcrumbItem {
	label: string;
	href: string;
}

interface BreadcrumbsProps {
	darkMode?: boolean;
}

export function Breadcrumbs({ darkMode = false }: BreadcrumbsProps) {
	const pathname = usePathname();

	const segments = pathname.split("/").filter(Boolean);

	// Build breadcrumb items
	const items: BreadcrumbItem[] = [];

	let currentPath = "";

	segments.forEach((segment) => {
		currentPath += `/${segment}`;

		// Format the label - convert slugs to readable text
		const label = segment
			.split("-")
			.map(word => word.charAt(0).toUpperCase() + word.slice(1))
			.join(" ");

		items.push({
			label,
			href: currentPath,
		});
	});

	return (
		<nav className="flex items-center gap-2 text-sm" aria-label="Breadcrumb">
			{/* Home Icon */}
			<Link
				href="/shop"
				className={cn(
					"transition-colors",
					darkMode
						? "text-white/60 hover:text-white"
						: "text-muted-foreground hover:text-foreground"
				)}
				aria-label="Shop Home"
			>
				<Home className="h-4 w-4" />
			</Link>

			{items.map((item, index) => {
				const isLast = index === items.length - 1;

				return (
					<div key={item.href} className="flex items-center gap-2">
						<ChevronRight className={cn(
							"h-4 w-4",
							darkMode ? "text-white/40" : "text-muted-foreground"
						)} />
						{isLast ? (
							<span className={cn(
								"font-display font-medium",
								darkMode ? "text-white" : "text-foreground"
							)}>
								{item.label}
							</span>
						) : (
							<Link
								href={item.href}
								className={cn(
									"font-display font-light transition-colors",
									darkMode
										? "text-white/70 hover:text-white"
										: "text-muted-foreground hover:text-foreground"
								)}
							>
								{item.label}
							</Link>
						)}
					</div>
				);
			})}
		</nav>
	);
}