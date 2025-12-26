// src/components/navigation/NavButtons.tsx
"use client"

import { Link } from '~/i18n/navigation'
import { useCheckout } from "~/app/_context/CheckoutContext"
import { Search, User, Heart, ShoppingCart } from "lucide-react"
import { useSession } from "next-auth/react"

interface NavButtonsProps {
	wishlistCount: number
	onWishlistClick: () => void
	showSearch?: boolean
	showAccount?: boolean
}

export function NavButtons({
	wishlistCount,
	onWishlistClick,
	showSearch = true,
	showAccount = true,
}: NavButtonsProps) {
	const { status } = useSession()
	const { cartItems, openCart } = useCheckout()
	const isLoggedIn = status === "authenticated"
	const cartCount = cartItems.length

	return (
		<>
			{showSearch && (
				<button
					className="flex items-center justify-center h-9 w-9 rounded-md hover:bg-white/10 transition-colors text-white"
					aria-label="Search"
				>
					<Search className="h-4 w-4" />
				</button>
			)}

			{showAccount && (
				<Link
					href="/account"
					className="relative flex items-center justify-center h-9 w-9 rounded-md hover:bg-white/10 transition-colors text-white"
					aria-label="Account"
				>
					<User className="h-4 w-4" />
					{isLoggedIn && (
						<span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-green-500 ring-2 ring-black" />
					)}
				</Link>
			)}

			<button
				onClick={onWishlistClick}
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
				onClick={openCart}
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
		</>
	)
}