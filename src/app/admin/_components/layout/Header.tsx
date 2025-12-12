// src/app/admin/_components/layout/Header.tsx
"use client";

import { Button } from "~/components/ui/button";
import { Globe, Settings } from "lucide-react";
import { ModeToggle } from "~/components/ui/mode-toggle";
import { AdminBreadcrumbs } from "./AdminBreadcrumbs";
import Link from "next/link";

export function Header() {
	return (
		<header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
			<div className="flex h-16 items-center justify-between px-6">
				{/* Breadcrumbs */}
				<AdminBreadcrumbs />

				{/* Actions */}
				<div className="flex items-center gap-2">
					<ModeToggle />
					<Link href="/admin/settings">
						<Button variant="ghost" size="icon" className="rounded-full">
							<Settings className="h-4 w-4" />
						</Button>
					</Link>
					<Link href="/">
						<Button variant="ghost" size="icon" className="rounded-full">
							<Globe className="h-4 w-4" />
						</Button>
					</Link>
				</div>
			</div>
		</header>
	);
}