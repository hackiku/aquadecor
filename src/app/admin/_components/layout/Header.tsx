// src/app/admin/_components/layout/Header.tsx

"use client";

import { usePathname } from "next/navigation";
import { Button } from "~/components/ui/button";
import { Bell, Globe, Globe2, Settings, WholeWord } from "lucide-react";
import { ModeToggle } from "~/components/ui/mode-toggle";
import { getAdminPage } from "../../_data/admin-pages";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "~/components/ui/breadcrumb";
import Link from "next/link";

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
					<BreadcrumbList className="font-display font-light">
						{breadcrumbs.map((crumb, index) => (
							<div key={crumb.href} className="contents">
								{index > 0 && <BreadcrumbSeparator />}
								<BreadcrumbItem>
									{index === breadcrumbs.length - 1 ? (
										<BreadcrumbPage className="font-display font-normal">
											{crumb.label}
										</BreadcrumbPage>
									) : (
										<BreadcrumbLink href={crumb.href} className="font-display font-light">
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
					<ModeToggle />
					{/* <Button variant="ghost" size="icon" className="rounded-full">
						<Bell className="h-4 w-4" />
					</Button> */}
					<Link
						href={"/admin/settings"}
					>
						<Button variant="ghost" size="icon" className="rounded-full">
							<Settings className="h-4 w-4" />
						</Button>
					</Link>
					<Link
						href={"/"}
					>
						<Button variant="ghost" size="icon" className="rounded-full">
							<Globe className="h-4 w-4" />
						</Button>
					</Link>
				</div>
			</div>
		</header>
	);
}