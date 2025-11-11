// src/app/admin/_components/layout/Sidebar.tsx

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "~/lib/utils";
import { adminPages, isPageActive } from "~/app/admin/_data/admin-pages";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "~/components/ui/collapsible";
import { ChevronDown } from "lucide-react";

export function Sidebar() {
	const pathname = usePathname();

	return (
		<aside className="fixed left-0 top-0 h-screen w-64 border-r bg-background">
			{/* Logo */}
			<div className="flex h-16 items-center border-b px-6">
				<Link href="/admin" className="flex items-center gap-2">
					<div className="text-xl font-bold">
						<span className="text-primary">AQUA</span>
						<span>DECOR</span>
					</div>
				</Link>
			</div>

			{/* Navigation */}
			<nav className="space-y-1 p-4">
				{adminPages.map((page) => {
					const isActive = isPageActive(page, pathname);
					const Icon = page.icon;

					// Page with children (collapsible)
					if (page.children) {
						return (
							<Collapsible key={page.href} defaultOpen={isActive}>
								<CollapsibleTrigger asChild>
									<Button
										variant="ghost"
										className={cn(
											"w-full justify-between",
											isActive && "bg-accent"
										)}
									>
										<div className="flex items-center gap-3">
											<Icon className="h-4 w-4" />
											<span>{page.title}</span>
										</div>
										<ChevronDown className="h-4 w-4 transition-transform duration-200 group-data-[state=open]:rotate-180" />
									</Button>
								</CollapsibleTrigger>
								<CollapsibleContent className="ml-4 space-y-1">
									{page.children.map((child) => {
										const ChildIcon = child.icon;
										return (
											<Button
												key={child.href}
												variant="ghost"
												asChild
												className={cn(
													"w-full justify-start",
													pathname === child.href && "bg-accent"
												)}
											>
												<Link href={child.href}>
													<ChildIcon className="mr-3 h-4 w-4" />
													{child.title}
												</Link>
											</Button>
										);
									})}
								</CollapsibleContent>
							</Collapsible>
						);
					}

					// Regular page
					return (
						<Button
							key={page.href}
							variant="ghost"
							asChild
							className={cn(
								"w-full justify-start",
								isActive && "bg-accent"
							)}
						>
							<Link href={page.href}>
								<Icon className="mr-3 h-4 w-4" />
								<span className="flex-1 text-left">{page.title}</span>
								{page.badge && (
									<Badge variant="secondary" className="ml-auto">
										{page.badge}
									</Badge>
								)}
							</Link>
						</Button>
					);
				})}
			</nav>

			{/* User Info */}
			<div className="absolute bottom-0 left-0 right-0 border-t p-4">
				<div className="flex items-center gap-3">
					<div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
						BN
					</div>
					<div className="flex-1 text-sm">
						<p className="font-medium">Branka Nemet</p>
						<p className="text-xs text-muted-foreground">Admin</p>
					</div>
				</div>
			</div>
		</aside>
	);
}