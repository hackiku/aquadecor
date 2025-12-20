// src/components/navigation/Nav.tsx
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Link } from '~/i18n/navigation';
import { useNavigationTranslations } from '~/i18n/useNavigationTranslations';
import { ModeToggle } from "../ui/mode-toggle";
import { LanguageSwitcher } from "~/i18n/LanguageSwitcher";
import { Menu, X } from "lucide-react";
import { CartDrawer } from "~/components/shop/cart/CartDrawer";
import { WishlistDrawer } from "~/components/shop/wishlist/WishlistDrawer";
import { ShopMegaMenu } from "./ShopMegaMenu";
import { ResourcesMegaMenu } from "./ResourcesMegaMenu";
import { MobileNav } from "./MobileNav";
import { NavButtons } from "./NavButtons";
import { enabledNavLinks } from "~/data/navigation";
import { Button } from "../ui/button";

export function Nav() {
	const router = useRouter();
	const { translateNavLink } = useNavigationTranslations();

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

	// Translate and filter nav links
	const translatedLinks = enabledNavLinks.map(translateNavLink);
	const regularLinks = translatedLinks.filter(link => link.labelKey !== "shop");

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
							<div className="hidden lg:flex items-center space-x-6">
								{regularLinks.map((link) => (
									<Link
										key={link.href}
										href={link.href as any}
										className="text-md font-light transition-colors hover:text-blue-400 text-white font-display relative group"
									>
										{link.label}
										{link.badge && (
											<span className="absolute -top-2 -right-6 px-1.5 py-0.5 text-[10px] bg-blue-500/20 text-blue-400 rounded-full font-normal">
												{link.badge}
											</span>
										)}
									</Link>
								))}
							</div>
							{/* Resources Mega Menu */}
							<ResourcesMegaMenu router={router} />
						</nav>

						{/* Right Side Actions - Desktop */}
						<div className="hidden md:flex items-center space-x-4">
							<LanguageSwitcher />
							<ModeToggle />
							<NavButtons
								cartCount={cartCount}
								wishlistCount={wishlistCount}
								onCartClick={() => setCartOpen(true)}
								onWishlistClick={() => setWishlistOpen(true)}
							/>
						</div>

						{/* Mobile Actions */}
						<div className="flex md:hidden items-center space-x-2">
							<LanguageSwitcher />
							<NavButtons
								cartCount={cartCount}
								wishlistCount={wishlistCount}
								onCartClick={() => setCartOpen(true)}
								onWishlistClick={() => setWishlistOpen(true)}
								showSearch={false}
								showAccount={false}
							/>

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