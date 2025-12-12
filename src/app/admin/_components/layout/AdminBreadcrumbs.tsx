// src/app/admin/_components/layout/AdminBreadcrumbs.tsx
"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "~/components/ui/breadcrumb";

export function AdminBreadcrumbs() {
	const pathname = usePathname();

	// Generate breadcrumbs from path segments
	const pathSegments = pathname.split("/").filter(Boolean);
	const breadcrumbs = pathSegments.map((segment, index) => {
		const href = "/" + pathSegments.slice(0, index + 1).join("/");

		// Format the label - convert slugs to readable text
		const label = segment
			.split("-")
			.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
			.join(" ");

		return { href, label };
	});

	return (
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
								<BreadcrumbLink asChild>
									<Link href={crumb.href} className="font-display font-light">
										{crumb.label}
									</Link>
								</BreadcrumbLink>
							)}
						</BreadcrumbItem>
					</div>
				))}
			</BreadcrumbList>
		</Breadcrumb>
	);
}