// Update src/app/[locale]/(checkout)/_components/CartSummary.tsx
'use client'

import Image from 'next/image'
import { X, Package, Gift, PlusCircle, Trash2 } from 'lucide-react'
import { Button } from '~/components/ui/button'
import { useCheckout } from '~/app/_context/CheckoutContext'
import { api } from '~/trpc/react'
import { useTranslations } from 'next-intl'

export function CartSummary() {
	const t = useTranslations('checkout.cart')
	const { cartItems, removeItem, clearCart, subtotal, discount, total } = useCheckout()

	// Fetch product details
	const productIds = cartItems.map(item => item.productId)
	const { data: products } = api.product.getByIds.useQuery(
		{ ids: productIds, locale: 'en' },
		{ enabled: productIds.length > 0 }
	)

	// Check if qualifies for gift (over €1000)
	const qualifiesForGift = subtotal >= 100000

	return (
		<div className="border rounded-3xl h-max">
			{/* Header */}
			<div className="p-6 border-b flex items-center justify-between">
				<h3 className="font-display font-light text-lg flex gap-x-2 items-center">
					{t('title')}
					<span className="font-display text-sm text-muted-foreground">
						({cartItems.length})
					</span>
				</h3>
				{cartItems.length > 0 && (
					<Button
						variant="ghost"
						size="sm"
						onClick={clearCart}
						className="text-muted-foreground hover:text-destructive"
					>
						<Trash2 className="w-4 h-4 mr-2" />
						{t('clear')}
					</Button>
				)}
			</div>

			{/* Items List */}
			<ul className="flex flex-col gap-y-6 p-6 max-h-[500px] overflow-y-auto">
				{cartItems.map((cartItem) => {
					const product = products?.find(p => p.id === cartItem.productId)
					if (!product) return null

					const pricePerUnit = product.unitPriceEurCents ?? 0
					const itemTotal = (pricePerUnit * cartItem.quantity) / 100

					return (
						<li key={cartItem.id} className="font-display font-light">
							<div className="flex gap-4 w-full">
								{/* Image */}
								<div className="relative w-44 flex-shrink-0">
									{product.heroImageUrl ? (
										<Image
											src={product.heroImageUrl}
											alt={product.name ?? 'Product'}
											width={200}
											height={200}
											className="object-cover rounded-lg"
										/>
									) : (
										<div className="w-full h-full flex items-center justify-center bg-muted rounded-lg">
											<Package className="h-10 w-10 text-muted-foreground/30" />
										</div>
									)}
								</div>

								{/* Details */}
								<div className="flex flex-col w-full">
									<div className="flex justify-between gap-x-6 items-start">
										<p className="font-light w-full text-base">
											{product.name ?? t('unknownProduct')}
										</p>
										<Button
											variant="ghost"
											size="icon"
											className="p-0 w-4 h-4 hover:bg-transparent"
											onClick={() => removeItem(cartItem.id)}
										>
											<X className="w-4 h-4" />
										</Button>
									</div>

									{/* Options/Variants */}
									<ul className="flex flex-col text-xs mt-2 space-y-1">
										<li className="text-muted-foreground">
											<span>{t('quantity')} </span>
											<b className="font-normal text-foreground">{cartItem.quantity}</b>
										</li>
									</ul>

									{/* Price */}
									<div className="flex w-full justify-end gap-x-6 items-center mt-4">
										<p className="text-lg font-light font-display">
											€{itemTotal.toFixed(2)}
										</p>
									</div>
								</div>
							</div>
						</li>
					)
				})}
			</ul>

			{/* Gift Badge */}
			{qualifiesForGift && (
				<div className="mx-6 mb-6">
					<div className="border flex items-center gap-x-2 px-4 py-2 rounded-full relative justify-between w-full">
						<div className="p-1 absolute left-1/2 -translate-x-1/2 -top-5 bg-background">
							<PlusCircle className="w-6 h-6 text-foreground" />
						</div>
						<div className="flex items-center gap-x-2">
							<Gift className="text-primary w-5 h-5 flex-shrink-0" />
							<span className="text-sm">{t('gift.badge')}</span>
						</div>
						<span className="text-xs text-muted-foreground">{t('gift.label')}</span>
					</div>
				</div>
			)}

			{/* Divider */}
			<div className="h-px bg-border mx-6 mb-4" />

			{/* Totals */}
			<div className="p-6 flex flex-col font-display gap-y-2 bg-muted/30">
				<div className="flex items-center justify-between text-muted-foreground">
					<span>{t('subtotal')}</span>
					<span>€{(subtotal / 100).toFixed(2)}</span>
				</div>

				{discount > 0 && (
					<div className="flex items-center justify-between text-green-600">
						<span>{t('discount')}</span>
						<span>-€{(discount / 100).toFixed(2)}</span>
					</div>
				)}

				<div className="flex justify-between text-xl font-light pt-2 border-t">
					<span>{t('total')}</span>
					<span>€{(total / 100).toFixed(2)}</span>
				</div>
			</div>
		</div>
	)
}