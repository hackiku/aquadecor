// src/components/navigation/Nav.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ModeToggle } from "../ui/mode-toggle";
import { LanguageSwitcher } from "~/i18n/LanguageSwitcher";
import { ShoppingCart, Search, User, Menu, X, Heart } from "lucide-react";
import { CartDrawer } from "~/components/shop/cart/CartDrawer";
import { WishlistDrawer } from "~/components/shop/wishlist/WishlistDrawer";
import { ShopMegaMenu } from "./ShopMegaMenu";
import { ResourcesMegaMenu } from "./ResourcesMegaMenu";
import { MobileNav } from "./MobileNav";
import { enabledNavLinks } from "~/data/navigation";
import { Button } from "../ui/button";

export function Nav() {
	const router = useRouter();
	const [cartOpen, setCartOpen] = useState(false);
	const [wishlistOpen, setWishlistOpen] = useState(false);
	const [cartCount, setCartCount] = useState(0);
	const [wishlistCount, setWishlistCount] = useState(0);
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

	// Listen for cart updates
	useEffect(() => {
		const updateCartCount = () => {
			const cart = localStorage.getItem("cart");
			if (cart) {
				const items = JSON.parse(cart);
				setCartCount(items.length);
			} else {
				setCartCount(0);
			}
		};

		updateCartCount();
		window.addEventListener("cart-updated", updateCartCount);
		return () => window.removeEventListener("cart-updated", updateCartCount);
	}, []);

	// Listen for wishlist updates
	useEffect(() => {
		const updateWishlistCount = () => {
			const wishlist = localStorage.getItem("wishlist");
			if (wishlist) {
				const items = JSON.parse(wishlist);
				setWishlistCount(items.length);
			} else {
				setWishlistCount(0);
			}
		};

		updateWishlistCount();
		window.addEventListener("wishlist-updated", updateWishlistCount);
		return () => window.removeEventListener("wishlist-updated", updateWishlistCount);
	}, []);

	// Filter out Shop from regular links (handled by mega menu)
	const regularLinks = enabledNavLinks.filter(link => link.label !== "Shop");

	return (
		<>
			<header className="border-b border-white/10 bg-black h-16">
				<div className="px-4 max-w-7xl mx-auto">
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
							{/* Shop Mega Menu */}
							<ShopMegaMenu router={router} />

							{/* Regular Links */}
							{regularLinks.map((link) => (
								<Link
									key={link.href}
									href={link.href}
									className="text-sm font-normal transition-colors hover:text-blue-400 text-white font-display relative group"
								>
									{link.label}
									{link.badge && (
										<span className="absolute -top-2 -right-6 px-1.5 py-0.5 text-[10px] bg-blue-500/20 text-blue-400 rounded-full font-normal">
											{link.badge}
										</span>
									)}
								</Link>
							))}

							{/* Resources Mega Menu */}
							<ResourcesMegaMenu router={router} />
						</nav>

						{/* Right Side Actions - Desktop */}
						<div className="hidden md:flex items-center space-x-4">
							<LanguageSwitcher />
							<ModeToggle />

							<button
								className="flex items-center justify-center h-9 w-9 rounded-md hover:bg-white/10 transition-colors text-white"
								aria-label="Search"
							>
								<Search className="h-4 w-4" />
							</button>

							<Link
								href="/account"
								className="flex items-center justify-center h-9 w-9 rounded-md hover:bg-white/10 transition-colors text-white"
								aria-label="Account"
							>
								<User className="h-4 w-4" />
							</Link>

							<button
								onClick={() => setWishlistOpen(true)}
								className="relative flex items-center justify-center h-9 w-9 rounded-md hover:bg-white/10 transition-colors text-white"
								aria-label="Wishlist"
							>
								<Heart className="h-4 w-4" />
								{wishlistCount > 0 && (
									<span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-blue-500 text-[10px] font-semibold text-white flex items-center justify-center">
										{wishlistCount}
									</span>
								)}
							</button>

							<button
								onClick={() => setCartOpen(true)}
								className="relative flex items-center justify-center h-9 w-9 rounded-md hover:bg-white/10 transition-colors text-white"
								aria-label="Shopping cart"
							>
								<ShoppingCart className="h-4 w-4" />
								{cartCount > 0 && (
									<span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-blue-500 text-[10px] font-semibold text-white flex items-center justify-center">
										{cartCount}
									</span>
								)}
							</button>
						</div>

						{/* Mobile Actions */}
						<div className="flex md:hidden items-center space-x-2">
							<LanguageSwitcher />

							<Link
								href="/account"
								className="flex items-center justify-center h-9 w-9 rounded-md hover:bg-white/10 transition-colors text-white"
								aria-label="Account"
							>
								<User className="h-4 w-4" />
							</Link>

							<button
								onClick={() => setWishlistOpen(true)}
								className="relative flex items-center justify-center h-9 w-9 rounded-md hover:bg-white/10 transition-colors text-white"
								aria-label="Wishlist"
							>
								<Heart className="h-4 w-4" />
								{wishlistCount > 0 && (
									<span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-blue-500 text-[10px] font-semibold text-white flex items-center justify-center">
										{wishlistCount}
									</span>
								)}
							</button>

							<button
								onClick={() => setCartOpen(true)}
								className="relative flex items-center justify-center h-9 w-9 rounded-md hover:bg-white/10 transition-colors text-white"
								aria-label="Shopping cart"
							>
								<ShoppingCart className="h-4 w-4" />
								{cartCount > 0 && (
									<span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-blue-500 text-[10px] font-semibold text-white flex items-center justify-center">
										{cartCount}
									</span>
								)}
							</button>

							<Button
								variant="ghost"
								size="icon"
								onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
								aria-label="Toggle menu"
								className="relative z-50 text-white hover:bg-white/10"
							>
								{mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
							</Button>
						</div>
					</div>
				</div>
			</header>

			{/* Mobile Menu */}
			<MobileNav
				isOpen={mobileMenuOpen}
				onClose={() => setMobileMenuOpen(false)}
			/>

			{/* Drawers */}
			<CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
			<WishlistDrawer isOpen={wishlistOpen} onClose={() => setWishlistOpen(false)} />
		</>
	);
}