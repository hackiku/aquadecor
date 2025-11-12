// src/components/navigation/Nav.tsx

import Link from "next/link";
import { ModeToggle } from "../ui/mode-toggle";
import { LanguageSwitcher } from "../i18n/LanguageSwitcher";
import { ShoppingCart, Search, User } from "lucide-react";

export function Nav() {
	return (
		<header className="fixed top-0 left-0 right-0 z-50 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
			<div className="container mx-auto px-4">
				<div className="flex h-16 items-center justify-between">
					{/* Logo */}
					<Link href="/" className="flex items-center space-x-2">
						<div className="text-2xl font-bold">
							<span className="text-primary">AQUA</span>
							<span className="text-foreground">DECOR</span>
						</div>
					</Link>

					{/* Desktop Navigation */}
					<nav className="hidden md:flex items-center space-x-6">
						<Link
							href="/store"
							className="text-sm font-medium transition-colors hover:text-primary"
						>
							Shop
						</Link>
						<Link
							href="/about"
							className="text-sm font-medium transition-colors hover:text-primary"
						>
							About
						</Link>
						<Link
							href="/blog"
							className="text-sm font-medium transition-colors hover:text-primary"
						>
							Blog
						</Link>
						<Link
							href="/admin"
							className="text-sm font-medium transition-colors hover:text-primary"
						>
							Admin
						</Link>
					</nav>

					{/* Right Side Actions */}
					<div className="flex items-center space-x-4">
						<LanguageSwitcher />
						<ModeToggle />

						<button
							className="hidden md:flex items-center justify-center h-9 w-9 rounded-md hover:bg-accent transition-colors"
							aria-label="Search"
						>
							<Search className="h-4 w-4" />
						</button>

						<Link
							href="/account"
							className="hidden md:flex items-center justify-center h-9 w-9 rounded-md hover:bg-accent transition-colors"
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
				</div>
			</div>
		</header>
	);
}