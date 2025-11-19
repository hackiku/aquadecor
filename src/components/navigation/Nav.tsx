// src/components/navigation/Nav.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ModeToggle } from "../ui/mode-toggle";
import { LanguageSwitcher } from "../i18n/LanguageSwitcher";
import { ShoppingCart, Search, User, Menu, X } from "lucide-react";
import { enabledNavLinks } from "~/data/navigation";
import { Button } from "../ui/button";

export function Nav() {
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

	return (
		<header className="fixed top-0 left-0 right-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
			<div className="container mx-auto px-4">
				<div className="flex h-16 items-center justify-between">
					{/* Logo */}
					<Link href="/" className="flex items-start space-x-2 relative z-50 h-full w-52">
						<Image
							src="/logos/logo.svg"
							fill={true}
							alt="Aquadecor Logo"
							priority
						/>
					</Link>

					{/* Desktop Navigation */}
					<nav className="hidden md:flex items-center space-x-6">
						{enabledNavLinks.map((link) => (
							<Link
								key={link.href}
								href={link.href}
								className="text-sm font-medium transition-colors hover:text-primary font-display"
							>
								{link.label}
							</Link>
						))}
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
				<div className="md:hidden absolute top-16 left-0 right-0 bg-background border-b shadow-lg">
					<nav className="container px-4 py-6 space-y-4">
						{/* Navigation Links */}
						{enabledNavLinks.map((link) => (
							<Link
								key={link.href}
								href={link.href}
								onClick={() => setMobileMenuOpen(false)}
								className="block py-2 text-base font-medium transition-colors hover:text-primary font-display"
							>
								{link.label}
								{link.description && (
									<span className="block text-sm text-muted-foreground font-light mt-0.5">
										{link.description}
									</span>
								)}
							</Link>
						))}

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