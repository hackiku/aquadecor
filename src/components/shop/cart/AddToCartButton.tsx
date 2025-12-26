// src/components/shop/cart/AddToCartButton.tsx
"use client"

import { useState } from "react"
import Link from "next/link"
import { ShoppingCart, Calculator, ArrowRight } from "lucide-react"
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
	const [isLoading, setIsLoading] = useState(false)
	const [showGiftModal, setShowGiftModal] = useState(false)
	const { addToCart, subtotal } = useCheckout()

	const hasPrice = product.basePriceEurCents !== null
	const isQuoteProduct = !hasPrice

	// If product requires selection or is quote product, show navigation button
	if (requiresSelection && productUrl) {
		return (
			<Button asChild
				variant={isQuoteProduct ? "secondary" : "default"}
				size={size}
				className={cn("gap-2 shadow-sm transition-all", className)}
			>
				<Link href={productUrl}>
					{isQuoteProduct ? <Calculator className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
					{isQuoteProduct ? "View & Quote" : "View Product"}
				</Link>
			</Button>
		)
	}

	const handleClick = async (e: React.MouseEvent) => {
		e.preventDefault()
		e.stopPropagation()

		if (isQuoteProduct) {
			console.log("Redirecting to calculator/quote page for:", product.id)
			return
		}

		setIsLoading(true)

		// Add to cart via context
		addToCart(
			product.id,
			product.quantity || 1,
			product.selectedOptions
		)

		// Show gift modal
		setShowGiftModal(true)

		setTimeout(() => setIsLoading(false), 500)
	}

	return (
		<>
			<Button
				variant={variant}
				size={size}
				className={cn("gap-2 shadow-sm transition-all active:scale-95", className)}
				onClick={handleClick}
				disabled={isLoading || disabled}
			>
				{isLoading ? (
					<span className="animate-pulse">Adding...</span>
				) : isQuoteProduct ? (
					<>
						<Calculator className="h-4 w-4" />
						Request Quote
					</>
				) : (
					<>
						<ShoppingCart className="h-4 w-4" />
						Add to Cart
					</>
				)}
			</Button>

			{/* Gift Progress Modal */}
			<GiftModal
				isOpen={showGiftModal}
				onClose={() => setShowGiftModal(false)}
				cartTotal={subtotal}
			/>
		</>
	)
}