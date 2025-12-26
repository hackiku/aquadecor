// src/components/shop/cart/CartDrawer.tsx
"use client"

import { useEffect } from "react"
import { X, ShoppingCart, ArrowRight, Trash2 } from "lucide-react"
import { Button } from "~/components/ui/button"
import { CartItem } from "./CartItem"
import { CartSummary } from "./CartSummary"
import { SignupIncentive } from "~/components/cta/SignupIncentive"
import { useCheckout } from "~/app/_context/CheckoutContext"
import { api } from "~/trpc/react"
import { useState } from "react"
import { useRouter } from "next/navigation"

export function CartDrawer() {
	const router = useRouter()
	const [showSignup, setShowSignup] = useState(false)
	const { 
		cartItems, 
		updateQuantity, 
		removeItem, 
		clearCart,
		subtotal,
		isCartOpen,
		closeCart
	} = useCheckout()

	useEffect(() => {
		if (isCartOpen) {
			document.body.style.overflow = 'hidden'
		} else {
			document.body.style.overflow = 'unset'
		}

		// Cleanup on unmount
		return () => {
			document.body.style.overflow = 'unset'
		}
	}, [isCartOpen])

	
	// Fetch product details
	const productIds = cartItems.map(item => item.productId)
	const { data: products, isLoading } = api.product.getByIds.useQuery(
		{ ids: productIds, locale: "en" },
		{ enabled: productIds.length > 0 && isCartOpen }
	)

	// Enrich cart items with product data
	const enrichedItems = cartItems
		.map(cartItem => {
			const product = products?.find(p => p.id === cartItem.productId)
			if (!product) return null
			
			return {
				...cartItem,
				product: {
					id: product.id,
					slug: product.slug,
					sku: product.sku,
					stockStatus: product.stockStatus,
					categoryId: product.categoryId,
					name: product.name,
					shortDescription: product.shortDescription,
					heroImageUrl: product.heroImageUrl,
					categorySlug: product.categorySlug,
					productLineSlug: product.productLineSlug,
					basePriceEurCents: product.unitPriceEurCents ?? null,
					priceNote: null,
				}
			}
		})
		.filter((item): item is NonNullable<typeof item> => item !== null)

	const isEmpty = cartItems.length === 0

	const handleCheckout = () => {
		closeCart()
		router.push('/checkout')
	}

	return (
		<>
			{/* Backdrop */}
			{isCartOpen && (
				<div
					className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity overflow-clip"
					onClick={closeCart}
				/>
			)}

			{/* Drawer */}
			<div
				className={`fixed top-0 right-0 h-full w-full sm:w-[400px] bg-background border-l shadow-2xl z-50 transition-transform duration-300 flex flex-col ${
					isCartOpen ? "translate-x-0" : "translate-x-full"
				}`}
			>
				{/* Header */}
				<div className="flex items-center justify-between p-6 border-b">
					<div className="flex items-center gap-3">
						<ShoppingCart className="h-5 w-5 text-primary" />
						<h2 className="text-xl font-display font-normal">
							Cart ({cartItems.length})
						</h2>
					</div>
					<div className="flex items-center gap-2">
						{!isEmpty && (
							<Button 
								variant="ghost" 
								size="icon"
								onClick={clearCart}
								title="Clear cart"
							>
								<Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
							</Button>
						)}
						<Button variant="ghost" size="icon" onClick={closeCart}>
							<X className="h-5 w-5" />
						</Button>
					</div>
				</div>

				{/* Items */}
				<div className="flex-1 overflow-y-auto p-6 space-y-6">
					{isLoading ? (
						<div className="flex items-center justify-center h-full">
							<p className="text-muted-foreground font-display font-light">Loading...</p>
						</div>
					) : isEmpty ? (
						<div className="flex flex-col items-center justify-center h-full text-center space-y-4">
							<ShoppingCart className="h-16 w-16 text-muted-foreground/20" />
							<div className="space-y-2">
								<p className="text-lg text-muted-foreground font-display font-light">
									Your cart is empty
								</p>
								<p className="text-sm text-muted-foreground/70 font-display font-light">
									Add some aquarium magic
								</p>
							</div>
							<Button onClick={closeCart} variant="outline" className="rounded-full">
								Browse Products
							</Button>
						</div>
					) : (
						<>
							{/* Cart Items */}
							<div className="space-y-4">
								{enrichedItems.map((item) => (
									<CartItem
										key={item.id}
										item={item}
										onUpdateQuantity={(newQuantity) => updateQuantity(item.id, newQuantity)}
										onRemove={() => removeItem(item.id)}
									/>
								))}
							</div>

							{/* Signup Incentive */}
							{!showSignup && (
								<button
									onClick={() => setShowSignup(true)}
									className="w-full text-left"
								>
									<div className="p-4 border-2 border-dashed border-primary/30 rounded-xl hover:border-primary/50 hover:bg-primary/5 transition-colors">
										<p className="text-sm font-display font-medium text-primary">
											💰 Save 10% with an account
										</p>
										<p className="text-xs text-muted-foreground font-display font-light mt-1">
											Create account & get 10% off this order
										</p>
									</div>
								</button>
							)}

							{showSignup && (
								<SignupIncentive
									trigger="cart"
									onDismiss={() => setShowSignup(false)}
								/>
							)}
						</>
					)}
				</div>

				{/* Footer with Summary */}
				{!isEmpty && (
					<div className="border-t p-6 space-y-4">
						<CartSummary subtotal={subtotal} />

						<Button
							className="w-full rounded-full gap-2"
							size="lg"
							onClick={handleCheckout}
						>
							Checkout
							<ArrowRight className="h-4 w-4" />
						</Button>

						<p className="text-xs text-center text-muted-foreground font-display font-light">
							Free worldwide shipping · 10-12 day production
						</p>
					</div>
				)}
			</div>
		</>
	)
}