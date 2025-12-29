// src/components/shop/cart/AddToCartButton.tsx
"use client"

import { useState } from "react"
import Link from "next/link"
import { useTranslations } from "next-intl"
import { ShoppingCart, Calculator, ArrowRight, Loader2, Check } from "lucide-react"
import { Button } from "~/components/ui/button"
import { GiftModal } from "~/components/shop/GiftModal"
import { useCheckout } from "~/app/_context/CheckoutContext"
import { cn } from "~/lib/utils"

type ProductForAddToCart = {
	id: string
	slug: string
	name: string
	sku: string
	basePriceEurCents: number | null
	quantity?: number
	selectedOptions?: any[]
}

interface AddToCartButtonProps {
	product: ProductForAddToCart
	variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
	size?: "default" | "sm" | "lg" | "icon"
	className?: string
	disabled?: boolean
	requiresSelection?: boolean
	productUrl?: string
}

export function AddToCartButton({
	product,
	variant = "default",
	size = "default",
	className,
	disabled = false,
	requiresSelection = false,
	productUrl
}: AddToCartButtonProps) {

	const t = useTranslations('shop.productCard')

	const [isLoading, setIsLoading] = useState(false)
	const [showGiftModal, setShowGiftModal] = useState(false)
	const { cartItems, addToCart, removeItem, subtotal } = useCheckout()

	const hasPrice = product.basePriceEurCents !== null
	const isQuoteProduct = !hasPrice

	// Check if product is already in cart
	const cartItem = cartItems.find(item => item.productId === product.id)
	const isInCart = !!cartItem

	// If product requires selection or is quote product, link to product page
	if (requiresSelection && productUrl) {
		return (
			<Button asChild
				variant="default"
				size={size}
				className={cn("gap-2 shadow-sm transition-all cursor-pointer hover:scale-105 hover:bg-foreground hover:text-background", className)}
			>
				<Link href={productUrl}>
					<ArrowRight className="h-4 w-4" />
					{t('customize')}
				</Link>
			</Button>
		)
	}

	const handleClick = async (e: React.MouseEvent) => {
		e.preventDefault()
		e.stopPropagation()

		if (isQuoteProduct && productUrl) {
			window.location.href = productUrl
			return
		}

		setIsLoading(true)

		// If already in cart, remove it. Otherwise add it.
		if (isInCart && cartItem) {
			removeItem(cartItem.id)
		} else {
			// Add to cart via context
			addToCart(
				product.id,
				product.quantity || 1,
				product.selectedOptions
			)

			// Show gift modal with product name
			setShowGiftModal(true)
		}

		setTimeout(() => setIsLoading(false), 500)
	}

	return (
		<>
			<Button
				variant={isInCart ? "secondary" : variant}
				size={size}
				className={cn(
					"gap-2 shadow-sm transition-all cursor-pointer hover:scale-105 active:scale-95",
					isInCart
						? "bg-muted/50 text-foreground hover:bg-muted hover:text-foreground"
						: "text-white hover:bg-foreground hover:text-background",
					className
				)}
				onClick={handleClick}
				disabled={isLoading || disabled}
			>
				{isLoading ? (
					<>
						<Loader2 className="h-4 w-4 animate-spin" />
						{isInCart ? t('addToCart') : t('addToCart')}
					</>
				) : isQuoteProduct ? (
					<>
						<ArrowRight className="h-4 w-4" />
						{t('customize')}
					</>
				) : isInCart ? (
					<>
						<Check className="h-4 w-4" />
						{t('addToCart')}
					</>
				) : (
					<>
						<ShoppingCart className="h-4 w-4" />
						{t('addToCart')}
					</>
				)}
			</Button>

			{/* Gift Progress Modal */}
			<GiftModal
				isOpen={showGiftModal}
				onClose={() => setShowGiftModal(false)}
				cartTotal={subtotal}
				justAdded={product.name} // Pass product name
			/>
		</>
	)
}