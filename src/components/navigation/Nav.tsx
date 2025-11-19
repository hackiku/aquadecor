// src/components/navigation/Nav.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ModeToggle } from "../ui/mode-toggle";
import { LanguageSwitcher } from "../i18n/LanguageSwitcher";
import { ShoppingCart, Search, User, Menu, X, ChevronDown } from "lucide-react";
import { enabledNavLinks, resourceLinks } from "~/data/navigation";
import { Button } from "../ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

export function Nav() {
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const [mobileResourcesOpen, setMobileResourcesOpen] = useState(false);

	return (
		<header className="fixed top-0 left-0 right-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
			<div className="container mx-auto px-4">
				<div className="flex h-16 items-center justify-between">
					{/* Logo */}
					<Link href="/" className="flex items-center relative h-12 w-48 flex-shrink-0">
						<Image
							src="/logos/logo.svg"
							fill
							alt="Aquadecor Logo"
							className="object-contain"
							priority
						/>
					</Link>

					{/* Desktop Navigation */}
					<nav className="hidden md:flex items-center space-x-6">
						{enabledNavLinks.map((link) => (
							<Link
								key={link.href}
								href={link.href}
								className="text-sm font-medium transition-colors hover:text-primary font-display relative group"
							>
								{link.label}
								{link.badge && (
									<span className="absolute -top-2 -right-6 px-1.5 py-0.5 text-[10px] bg-primary/10 text-primary rounded-full font-medium">
										{link.badge}
									</span>
								)}
							</Link>
						))}

						{/* Resources Dropdown */}
						<DropdownMenu>
							<DropdownMenuTrigger className="flex items-center gap-1 text-sm font-medium transition-colors hover:text-primary font-display outline-none">
								Resources
								<ChevronDown className="h-3.5 w-3.5" />
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end" className="w-64">
								{resourceLinks.map((resource) => (
									<DropdownMenuItem key={resource.href} asChild>
										<Link href={resource.href} className="flex flex-col items-start py-3 cursor-pointer">
											<span className="font-display font-medium text-sm">
												{resource.label}
											</span>
											<span className="font-display font-light text-xs text-muted-foreground mt-0.5">
												{resource.description}
											</span>
										</Link>
									</DropdownMenuItem>
								))}
							</DropdownMenuContent>
						</DropdownMenu>
					</nav>

					{/* Right Side Actions - Desktop */}
					<div className="hidden md:flex items-center space-x-4">
						<LanguageSwitcher />
						<ModeToggle />

						<button
							className="flex items-center justify-center h-9 w-9 rounded-md hover:bg-accent transition-colors"
							aria-label="Search"
						>
							<Search className="h-4 w-4" />
						</button>

						<Link
							href="/account"
							className="flex items-center justify-center h-9 w-9 rounded-md hover:bg-accent transition-colors"
							aria-label="Account"
						>
							<User className="h-4 w-4" />
						</Link>

						<button
							className="relative flex items-center justify-center h-9 w-9 rounded-md hover:bg-accent transition-colors"
							aria-label="Shopping cart"
						>
							<ShoppingCart className="h-4 w-4" />
							<span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-[10px] font-semibold text-primary-foreground flex items-center justify-center">
								0
							</span>
						</button>
					</div>

					{/* Mobile Actions */}
					<div className="flex md:hidden items-center space-x-2">
						<LanguageSwitcher />

						<Link
							href="/account"
							className="flex items-center justify-center h-9 w-9 rounded-md hover:bg-accent transition-colors"
							aria-label="Account"
						>
							<User className="h-4 w-4" />
						</Link>

						<button
							className="relative flex items-center justify-center h-9 w-9 rounded-md hover:bg-accent transition-colors"
							aria-label="Shopping cart"
						>
							<ShoppingCart className="h-4 w-4" />
							<span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-[10px] font-semibold text-primary-foreground flex items-center justify-center">
								0
							</span>
						</button>

						<Button
							variant="ghost"
							size="icon"
							onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
							aria-label="Toggle menu"
							className="relative z-50"
						>
							{mobileMenuOpen ? (
								<X className="h-5 w-5" />
							) : (
								<Menu className="h-5 w-5" />
							)}
						</Button>
					</div>
				</div>
			</div>

			{/* Mobile Menu */}
			{mobileMenuOpen && (
				<div className="md:hidden absolute top-16 left-0 right-0 bg-background border-b shadow-lg max-h-[calc(100vh-4rem)] overflow-y-auto">
					<nav className="container px-4 py-6 space-y-4">
						{/* Navigation Links */}
						{enabledNavLinks.map((link) => (
							<Link
								key={link.href}
								href={link.href}
								onClick={() => setMobileMenuOpen(false)}
								className="block py-2 text-base font-medium transition-colors hover:text-primary font-display"
							>
								<span className="flex items-center gap-2">
									{link.label}
									{link.badge && (
										<span className="px-2 py-0.5 text-[10px] bg-primary/10 text-primary rounded-full font-medium">
											{link.badge}
										</span>
									)}
								</span>
								{link.description && (
									<span className="block text-sm text-muted-foreground font-light mt-0.5">
										{link.description}
									</span>
								)}
							</Link>
						))}

						{/* Resources Collapsible */}
						<div className="pt-2 border-t">
							<button
								onClick={() => setMobileResourcesOpen(!mobileResourcesOpen)}
								className="flex items-center justify-between w-full py-2 text-base font-medium transition-colors hover:text-primary font-display"
							>
								Resources
								<ChevronDown
									className={`h-4 w-4 transition-transform ${mobileResourcesOpen ? "rotate-180" : ""
										}`}
								/>
							</button>

							{mobileResourcesOpen && (
								<div className="pl-4 space-y-3 mt-2">
									{resourceLinks.map((resource) => (
										<Link
											key={resource.href}
											href={resource.href}
											onClick={() => setMobileMenuOpen(false)}
											className="block py-2"
										>
											<span className="text-sm font-display font-medium">
												{resource.label}
											</span>
											<span className="block text-xs text-muted-foreground font-display font-light mt-0.5">
												{resource.description}
											</span>
										</Link>
									))}
								</div>
							)}
						</div>

						{/* Search */}
						<div className="pt-4 border-t">
							<button
								className="flex items-center gap-2 py-2 text-base font-medium transition-colors hover:text-primary font-display"
								onClick={() => {
									setMobileMenuOpen(false);
									// TODO: Open search modal
								}}
							>
								<Search className="h-4 w-4" />
								Search
							</button>
						</div>

						{/* Theme Toggle */}
						<div className="pt-2 flex items-center gap-2">
							<span className="text-sm text-muted-foreground font-display">Theme:</span>
							<ModeToggle />
						</div>
					</nav>
				</div>
			)}
		</header>
	);
}