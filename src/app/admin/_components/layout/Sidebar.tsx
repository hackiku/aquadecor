// src/app/admin/_components/layout/Sidebar.tsx

"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "~/lib/utils";
import { adminPages, isPageActive } from "~/app/admin/_data/admin-pages";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "~/components/ui/collapsible";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";

export function Sidebar() {
	const pathname = usePathname();
	const [isCollapsed, setIsCollapsed] = useState(false);
	const [isHovered, setIsHovered] = useState(false);

	const showExpanded = !isCollapsed || isHovered;

	return (
		<motion.aside
			initial={false}
			animate={{
				width: showExpanded ? 256 : 64,
			}}
			transition={{ duration: 0.3, ease: "easeInOut" }}
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
			className="fixed left-0 top-0 h-screen border-r bg-background z-50"
		>
			{/* Logo */}
			<div className="flex h-16 items-center border-b px-4 justify-between">
				<AnimatePresence mode="wait">
					{showExpanded ? (
						<motion.div
							key="expanded"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							transition={{ duration: 0.2 }}
						>
							<Link href="/admin" className="flex items-center gap-2">
								<div className="text-xl font-display font-light">
									<span className="text-primary">AQUA</span>
									<span>DECOR</span>
								</div>
							</Link>
						</motion.div>
					) : (
						<motion.div
							key="collapsed"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							transition={{ duration: 0.2 }}
							className="text-xl font-display font-light"
						>
							<span className="text-primary">A</span>
						</motion.div>
					)}
				</AnimatePresence>

				{showExpanded && (
					<Button
						variant="ghost"
						size="icon"
						onClick={() => setIsCollapsed(!isCollapsed)}
						className="h-8 w-8 rounded-full"
					>
						{isCollapsed ? (
							<ChevronRight className="h-4 w-4" />
						) : (
							<ChevronLeft className="h-4 w-4" />
						)}
					</Button>
				)}
			</div>

			{/* Navigation */}
			<nav className="space-y-1 p-2">
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
											"w-full font-display font-light hover:bg-muted/50",
											showExpanded ? "justify-between" : "justify-center",
											isActive && "bg-muted"
										)}
									>
										<div className="flex items-center gap-3">
											<Icon className="h-4 w-4 shrink-0" />
											{showExpanded && <span>{page.title}</span>}
										</div>
										{showExpanded && (
											<ChevronDown className="h-4 w-4 transition-transform duration-200 group-data-[state=open]:rotate-180" />
										)}
									</Button>
								</CollapsibleTrigger>
								{showExpanded && (
									<CollapsibleContent className="ml-4 mt-1 space-y-1">
										{page.children.map((child) => {
											const ChildIcon = child.icon;
											const isChildActive = pathname === child.href;
											return (
												<Button
													key={child.href}
													variant="ghost"
													asChild
													className={cn(
														"w-full justify-start font-display font-light hover:bg-muted/50",
														isChildActive && "bg-muted"
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
								)}
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
								"w-full font-display font-light hover:bg-muted/50",
								showExpanded ? "justify-start" : "justify-center",
								isActive && "bg-muted"
							)}
						>
							<Link href={page.href}>
								<Icon className={cn("h-4 w-4 shrink-0", showExpanded && "mr-3")} />
								{showExpanded && (
									<>
										<span className="flex-1 text-left">{page.title}</span>
										{page.badge && (
											<Badge variant="secondary" className="ml-auto font-display font-light">
												{page.badge}
											</Badge>
										)}
									</>
								)}
							</Link>
						</Button>
					);
				})}
			</nav>

			{/* User Info */}
			{showExpanded && (
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					transition={{ duration: 0.2 }}
					className="absolute bottom-0 left-0 right-0 border-t p-4"
				>
					<div className="flex items-center gap-3">
						<div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-display font-light text-xs shrink-0">
							BN
						</div>
						<div className="flex-1 text-sm overflow-hidden">
							<p className="font-display font-normal truncate">Branka Nemet</p>
							<p className="text-xs text-muted-foreground font-display font-light">Admin</p>
						</div>
					</div>
				</motion.div>
			)}

			{/* Collapsed user avatar */}
			{!showExpanded && (
				<div className="absolute bottom-0 left-0 right-0 border-t p-4 flex justify-center">
					<div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-display font-light text-xs">
						BN
					</div>
				</div>
			)}
		</motion.aside>
	);
}