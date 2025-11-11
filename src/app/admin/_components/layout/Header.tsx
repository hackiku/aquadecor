// src/app/admin/_components/layout/Header.tsx

"use client";

import { usePathname } from "next/navigation";
import { Button } from "~/components/ui/button";
import { Bell, Settings } from "lucide-react";
import { getAdminPage } from "~/app/admin/_data/admin-pages";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "~/components/ui/breadcrumb";

export function Header() {
	const pathname = usePathname();
	const currentPage = getAdminPage(pathname);

	// Generate breadcrumbs
	const pathSegments = pathname.split("/").filter(Boolean);
	const breadcrumbs = pathSegments.map((segment, index) => {
		const href = "/" + pathSegments.slice(0, index + 1).join("/");
		const label = segment
			.split("-")
			.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
			.join(" ");
		return { href, label };
	});

	return (
		<header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
			<div className="flex h-16 items-center justify-between px-6">
				{/* Breadcrumbs */}
				<Breadcrumb>
					<BreadcrumbList>
						{breadcrumbs.map((crumb, index) => (
							<div key={crumb.href} className="contents">
								{index > 0 && <BreadcrumbSeparator />}
								<BreadcrumbItem>
									{index === breadcrumbs.length - 1 ? (
										<BreadcrumbPage>{crumb.label}</BreadcrumbPage>
									) : (
										<BreadcrumbLink href={crumb.href}>
											{crumb.label}
										</BreadcrumbLink>
									)}
								</BreadcrumbItem>
							</div>
						))}
					</BreadcrumbList>
				</Breadcrumb>

				{/* Actions */}
				<div className="flex items-center gap-2">
					<Button variant="ghost" size="icon">
						<Bell className="h-4 w-4" />
					</Button>
					<Button variant="ghost" size="icon">
						<Settings className="h-4 w-4" />
					</Button>
				</div>
			</div>
		</header>
	);
}