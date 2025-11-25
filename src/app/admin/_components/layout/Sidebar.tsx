// src/app/admin/_components/layout/Sidebar.tsx

"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { adminPages, isPageActive, type AdminPage } from "../../_data/admin-pages";
import { ChevronDown, ChevronLeft, Menu } from "lucide-react";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

export function Sidebar() {
	const pathname = usePathname();
	const [isCollapsed, setIsCollapsed] = useState(false);
	const [isHovered, setIsHovered] = useState(false);
	const [openDropdowns, setOpenDropdowns] = useState<string[]>([]);

	const isExpanded = !isCollapsed || isHovered;

	const toggleDropdown = (href: string) => {
		setOpenDropdowns((prev) =>
			prev.includes(href) ? prev.filter((h) => h !== href) : [...prev, href]
		);
	};

	return (
		<motion.aside
			initial={false}
			animate={{
				width: isExpanded ? 256 : 64,
			}}
			transition={{ duration: 0.3, ease: "easeInOut" }}
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
			className="fixed left-0 top-0 h-screen bg-card border-r border-border z-50 overflow-hidden"
		>
			<div className="flex flex-col h-full">
				{/* Header */}
				<div className="h-16 flex items-center justify-between px-4 border-b border-border">
					<AnimatePresence>
						{isExpanded && (
							<motion.div
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0 }}
								transition={{ duration: 0.2 }}
								className="flex items-center gap-2"
							>
								<div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
									<span className="text-primary font-bold text-lg">A</span>
								</div>
								<span className="font-display font-normal text-lg">Aquadecor</span>
							</motion.div>
						)}
					</AnimatePresence>
					<Button
						variant="ghost"
						size="icon"
						onClick={() => setIsCollapsed(!isCollapsed)}
						className="rounded-full"
					>
						{isCollapsed ? (
							<Menu className="h-4 w-4" />
						) : (
							<ChevronLeft className="h-4 w-4" />
						)}
					</Button>
				</div>

				{/* Navigation */}
				<nav className="flex-1 overflow-y-auto py-4 px-2">
					<div className="space-y-1">
						{adminPages.map((page) => (
							<NavItem
								key={page.href}
								page={page}
								pathname={pathname}
								isExpanded={isExpanded}
								openDropdowns={openDropdowns}
								toggleDropdown={toggleDropdown}
							/>
						))}
					</div>
				</nav>

				{/* User Avatar */}
				<div className="h-16 border-t border-border flex items-center justify-center px-4">
					<motion.div
						initial={false}
						animate={{
							width: isExpanded ? "100%" : "40px",
						}}
						className="flex items-center gap-3"
					>
						<div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
							<span className="text-primary font-display font-normal text-sm">AD</span>
						</div>
						<AnimatePresence>
							{isExpanded && (
								<motion.div
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									exit={{ opacity: 0 }}
									className="flex-1 min-w-0"
								>
									<p className="text-sm font-display font-normal truncate">Admin</p>
									<p className="text-xs text-muted-foreground truncate">admin@aquadecor.com</p>
								</motion.div>
							)}
						</AnimatePresence>
					</motion.div>
				</div>
			</div>
		</motion.aside>
	);
}

interface NavItemProps {
	page: AdminPage;
	pathname: string;
	isExpanded: boolean;
	openDropdowns: string[];
	toggleDropdown: (href: string) => void;
	isChild?: boolean;
}

function NavItem({
	page,
	pathname,
	isExpanded,
	openDropdowns,
	toggleDropdown,
	isChild = false,
}: NavItemProps) {
	const isActive = isPageActive(page, pathname);
	const isOpen = openDropdowns.includes(page.href);
	const hasChildren = page.children && page.children.length > 0;

	const handleClick = (e: React.MouseEvent) => {
		if (hasChildren) {
			e.preventDefault();
			toggleDropdown(page.href);
		}
	};

	const Icon = page.icon;

	return (
		<div>
			<Link
				href={page.href}
				onClick={handleClick}
				className={cn(
					"flex items-center gap-3 px-3 py-2 rounded-lg transition-colors group",
					isActive && !hasChildren
						? "bg-primary/10 text-primary"
						: "text-muted-foreground hover:bg-muted hover:text-foreground",
					page.inactive && "opacity-70",
					isChild && "pl-12"
				)}
			>
				<Icon className="h-5 w-5 flex-shrink-0" />
				<AnimatePresence>
					{isExpanded && (
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							className="flex-1 flex items-center justify-between min-w-0"
						>
							<span className="font-display font-light truncate">{page.title}</span>
							<div className="flex items-center gap-2">
								{page.badge && (
									<Badge variant="secondary" className="text-xs">
										{page.badge}
									</Badge>
								)}
								{hasChildren && (
									<ChevronDown
										className={cn(
											"h-4 w-4 transition-transform",
											isOpen && "rotate-180"
										)}
									/>
								)}
							</div>
						</motion.div>
					)}
				</AnimatePresence>
			</Link>

			{/* Dropdown Children */}
			{hasChildren && isExpanded && (
				<AnimatePresence>
					{isOpen && (
						<motion.div
							initial={{ height: 0, opacity: 0 }}
							animate={{ height: "auto", opacity: 1 }}
							exit={{ height: 0, opacity: 0 }}
							transition={{ duration: 0.2 }}
							className="overflow-hidden"
						>
							<div className="py-1">
								{page.children!.map((child) => (
									<NavItem
										key={child.href}
										page={child}
										pathname={pathname}
										isExpanded={isExpanded}
										openDropdowns={openDropdowns}
										toggleDropdown={toggleDropdown}
										isChild={true}
									/>
								))}
							</div>
						</motion.div>
					)}
				</AnimatePresence>
			)}
		</div>
	);
}