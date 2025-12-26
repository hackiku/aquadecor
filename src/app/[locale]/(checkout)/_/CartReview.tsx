// src/app/[locale]/(checkout)/_components/CartReview.tsx
'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Minus, Plus, X, Package, ArrowRight, ShoppingCart } from 'lucide-react'
import { Button } from '~/components/ui/button'
import { useCheckout } from './CheckoutContext'
import { api } from '~/trpc/react'
import { cn } from '~/lib/utils'

export function CartReview() {
	const { cartItems, updateQuantity, removeItem, subtotal, total } = useCheckout()

	// Fetch product details
	const productIds = cartItems.map(item => item.productId)
	const { data: products, isLoading } = api.product.getByIds.useQuery(
		{ ids: productIds, locale: 'en' },
		{ enabled: productIds.length > 0 }
	)

	if (isLoading) {
		return (
			<div className="flex items-center justify-center py-24">
				<div className="flex flex-col items-center gap-4">
					<div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
					<p className="text-muted-foreground font-display font-light">Loading cart...</p>
				</div>
			</div>
		)
	}

	if (cartItems.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center py-24 text-center">
				<ShoppingCart className="h-16 w-16 text-muted-foreground/20 mb-6" />
				<h2 className="text-2xl font-display font-light mb-2">Your cart is empty</h2>
				<p className="text-muted-foreground font-display font-light mb-6">
					Start adding some aquarium magic
				</p>
				<Button asChild className="rounded-full">
					<Link href="/shop">Browse Products</Link>
				</Button>
			</div>
		)
	}

	return (
		<div className="grid lg:grid-cols-3 gap-8">
			{/* Items List */}
			<div className="lg:col-span-2 space-y-6">
				<div className="bg-card rounded-2xl border p-6 space-y-6">
					{cartItems.map((cartItem) => {
						const product = products?.find(p => p.id === cartItem.productId)
						if (!product) return null

						const productUrl = `/shop/${product.productLineSlug}/${product.categorySlug}/${product.slug}`
						const pricePerUnit = product.unitPriceEurCents ?? 0
						const itemTotal = (pricePerUnit * cartItem.quantity) / 100

						return (
							<div key={cartItem.id} className="flex gap-4 group pb-6 border-b last:border-b-0 last:pb-0">
								{/* Image */}
								<Link
									href={productUrl}
									className="relative w-24 h-24 rounded-xl overflow-hidden bg-muted flex-shrink-0 border"
								>
									{product.heroImageUrl ? (
										<Image
											src={product.heroImageUrl}
											alt={product.name ?? 'Product'}
											fill
											className="object-cover"
											sizes="96px"
										/>
									) : (
										<div className="w-full h-full flex items-center justify-center">
											<Package className="h-10 w-10 text-muted-foreground/30" />
										</div>
									)}
								</Link>

								{/* Details */}
								<div className="flex-1 min-w-0 space-y-3">
									<div className="flex justify-between items-start gap-4">
										<Link href={productUrl}>
											<h3 className="font-display font-medium text-base leading-tight hover:text-primary transition-colors">
												{product.name ?? 'Unknown Product'}
											</h3>
										</Link>
										<Button
											variant="ghost"
											size="icon"
											className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
											onClick={() => removeItem(cartItem.id)}
										>
											<X className="h-4 w-4" />
										</Button>
									</div>

									{product.shortDescription && (
										<p className="text-sm text-muted-foreground font-display font-light line-clamp-1">
											{product.shortDescription}
										</p>
									)}

									<div className="flex items-center justify-between">
										{/* Quantity */}
										<div className="flex items-center border rounded-full h-9">
											<Button
												variant="ghost"
												size="icon"
												className="h-9 w-9 rounded-l-full"
												onClick={() => updateQuantity(cartItem.id, Math.max(1, cartItem.quantity - 1))}
											>
												<Minus className="h-3.5 w-3.5" />
											</Button>
											<span className="text-sm font-display font-medium w-10 text-center">
												{cartItem.quantity}
											</span>
											<Button
												variant="ghost"
												size="icon"
												className="h-9 w-9 rounded-r-full"
												onClick={() => updateQuantity(cartItem.id, cartItem.quantity + 1)}
											>
												<Plus className="h-3.5 w-3.5" />
											</Button>
										</div>

										{/* Price */}
										<div className="text-right">
											{cartItem.quantity > 1 && (
												<p className="text-xs text-muted-foreground font-display font-light">
													€{(pricePerUnit / 100).toFixed(2)} each
												</p>
											)}
											<p className="text-lg font-display font-semibold">
												€{itemTotal.toFixed(2)}
											</p>
										</div>
									</div>
								</div>
							</div>
						)
					})}
				</div>
			</div>

			{/* Summary Sidebar */}
			<div className="lg:col-span-1">
				<div className="bg-card rounded-2xl border p-6 space-y-6 sticky top-24">
					<h2 className="text-xl font-display font-medium">Order Summary</h2>

					<div className="space-y-3">
						<div className="flex justify-between text-sm">
							<span className="text-muted-foreground font-display">Subtotal</span>
							<span className="font-display font-medium">€{(subtotal / 100).toFixed(2)}</span>
						</div>
						<div className="flex justify-between text-sm">
							<span className="text-muted-foreground font-display">Shipping</span>
							<span className="font-display font-medium text-primary">Calculated at checkout</span>
						</div>
					</div>

					<div className="h-px bg-border" />

					<div className="flex justify-between items-baseline">
						<span className="text-lg font-display font-medium">Total</span>
						<span className="text-2xl font-display font-semibold">€{(total / 100).toFixed(2)}</span>
					</div>

					<Button
						className="w-full rounded-full gap-2"
						size="lg"
						asChild
					>
						<Link href="/shipping">
							Continue to Shipping
							<ArrowRight className="h-4 w-4" />
						</Link>
					</Button>

					<p className="text-xs text-center text-muted-foreground font-display font-light">
						Free worldwide shipping • Secure checkout
					</p>
				</div>
			</div>
		</div>
	)
}