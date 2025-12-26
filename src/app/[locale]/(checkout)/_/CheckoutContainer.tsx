// src/app/[locale]/(checkout)/_components/CheckoutContainer.tsx
'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Tag, Package, CreditCard } from 'lucide-react'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { useCheckout } from './CheckoutContext'
import { api } from '~/trpc/react'

export function CheckoutContainer() {
	const { cartItems, subtotal, discount, total } = useCheckout()
	const [discountCode, setDiscountCode] = useState('')
	const [isApplyingDiscount, setIsApplyingDiscount] = useState(false)

	// Fetch product details
	const productIds = cartItems.map(item => item.productId)
	const { data: products, isLoading } = api.product.getByIds.useQuery(
		{ ids: productIds, locale: 'en' },
		{ enabled: productIds.length > 0 }
	)

	const handleApplyDiscount = () => {
		setIsApplyingDiscount(true)
		// TODO: Validate discount code
		setTimeout(() => setIsApplyingDiscount(false), 1000)
	}

	if (isLoading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<p className="text-muted-foreground font-display font-light">Loading...</p>
			</div>
		)
	}

	return (
		<section className="max-w-7xl mx-auto px-4 py-24 lg:py-32">
			{/* Header */}
			<div className="space-y-4 mb-6">
				<h1 className="text-2xl md:text-5xl font-extralight font-display">
					Checkout
				</h1>
				<p className="md:text-lg font-display font-light text-base text-muted-foreground">
					Complete your purchase by providing shipping details.
				</p>
			</div>

			{/* Two Column Layout */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-16 relative">

				{/* LEFT: Cart Summary */}
				<div className="border rounded-2xl flex flex-col shadow-none justify-between h-max overflow-hidden">
					{/* Header */}
					<div className="flex flex-col space-y-1.5 p-6">
						<h3 className="tracking-tight font-display font-light text-lg flex gap-x-2 items-center">
							<Package className="w-5 h-5 text-muted-foreground" />
							Cart Summary
						</h3>
					</div>

					{/* Items */}
					<div className="p-6 pt-0 space-y-4 relative">
						{cartItems.length === 0 ? (
							<div className="pb-24 text-center">
								<Image
									alt="Empty cart"
									width={100}
									height={100}
									src="/empty-cart.webp"
									className="w-20 mx-auto opacity-70"
								/>
								<span className="text-base font-display font-light text-muted-foreground text-center pt-4 block">
									Your cart is empty.
								</span>
							</div>
						) : (
							<div className="space-y-4">
								{cartItems.map((cartItem) => {
									const product = products?.find(p => p.id === cartItem.productId)
									if (!product) return null

									const pricePerUnit = product.unitPriceEurCents ?? 0
									const itemTotal = (pricePerUnit * cartItem.quantity) / 100

									return (
										<div key={cartItem.id} className="flex gap-4 pb-4 border-b last:border-b-0">
											{/* Image */}
											<div className="relative w-16 h-16 rounded-lg overflow-hidden border flex-shrink-0">
												{product.heroImageUrl ? (
													<Image
														src={product.heroImageUrl}
														alt={product.name ?? 'Product'}
														fill
														className="object-cover"
														sizes="64px"
													/>
												) : (
													<div className="w-full h-full flex items-center justify-center bg-muted">
														<Package className="h-6 w-6 text-muted-foreground/30" />
													</div>
												)}
											</div>

											{/* Details */}
											<div className="flex-1 min-w-0">
												<h4 className="font-display font-medium text-sm line-clamp-1">
													{product.name ?? 'Unknown Product'}
												</h4>
												<p className="text-xs text-muted-foreground font-display font-light mt-1">
													Qty: {cartItem.quantity}
												</p>
												<p className="text-sm font-display font-semibold mt-1">
													€{itemTotal.toFixed(2)}
												</p>
											</div>
										</div>
									)
								})}
							</div>
						)}
					</div>

					{/* Divider */}
					<div className="h-px bg-border my-4" />

					{/* Discount Code */}
					<div className="space-y-2 flex-col items-start px-6 pt-3 pb-6">
						<Label className="text-sm font-display font-normal flex gap-x-2 items-center">
							<Tag className="w-5 h-5" />
							Discount code
						</Label>
						<div className="flex gap-x-2 items-center w-full">
							<Input
								id="discountCode"
								disabled={cartItems.length === 0}
								placeholder="Enter discount code"
								value={discountCode}
								onChange={(e) => setDiscountCode(e.target.value)}
								className="rounded-2xl px-3 py-6 text-base"
							/>
							<Button
								onClick={handleApplyDiscount}
								disabled={!discountCode || isApplyingDiscount || cartItems.length === 0}
								className="rounded-full px-9 py-3.5"
							>
								{isApplyingDiscount ? 'Applying...' : 'Apply'}
							</Button>
						</div>
					</div>

					{/* Divider */}
					<div className="h-px bg-border mt-4" />

					{/* Totals */}
					<div className="p-6 flex flex-col font-display gap-x-4 items-stretch pt-4">
						<div className="flex items-center justify-between text-muted-foreground mb-2">
							<span>Subtotal:</span>
							<span>€{(subtotal / 100).toFixed(2)}</span>
						</div>

						{discount > 0 && (
							<div className="flex items-center justify-between text-primary mb-2">
								<span>Discount:</span>
								<span>-€{(discount / 100).toFixed(2)}</span>
							</div>
						)}

						<div className="flex items-center justify-between text-muted-foreground mb-2">
							<span>Shipping:</span>
							<span className="text-primary">Free</span>
						</div>

						<div className="flex justify-between text-xl font-light pt-2 border-t">
							<span>Total:</span>
							<span>€{(total / 100).toFixed(2)}</span>
						</div>
					</div>
				</div>

				{/* RIGHT: Shipping Form */}
				<div className="border h-max rounded-2xl shadow-none">
					{/* Header */}
					<div className="flex flex-col space-y-1.5 p-6">
						<h3 className="tracking-tight font-display font-light text-xl">
							Shipping Information
						</h3>
						<p className="text-muted-foreground font-display font-light text-base">
							Enter your shipping details or select a saved address.
						</p>
					</div>

					{/* Form */}
					<div className="p-6 pt-0 space-y-4">
						<form className="grid grid-cols-1 md:grid-cols-2 gap-4">
							{/* First Name */}
							<div className="space-y-2">
								<Label htmlFor="firstName">
									First name<span className="text-red-400">*</span>
								</Label>
								<Input
									id="firstName"
									disabled={cartItems.length === 0}
									className="rounded-2xl px-3 py-6 text-base"
								/>
							</div>

							{/* Last Name */}
							<div className="space-y-2">
								<Label htmlFor="lastName">
									Last name<span className="text-red-400">*</span>
								</Label>
								<Input
									id="lastName"
									disabled={cartItems.length === 0}
									className="rounded-2xl px-3 py-6 text-base"
								/>
							</div>

							{/* Email */}
							<div className="space-y-2">
								<Label htmlFor="email">
									Email<span className="text-red-400">*</span>
								</Label>
								<Input
									id="email"
									type="email"
									disabled={cartItems.length === 0}
									className="rounded-2xl px-3 py-6 text-base"
								/>
							</div>

							{/* Phone */}
							<div className="space-y-2">
								<Label htmlFor="phoneNumber">
									Phone number<span className="text-red-400">*</span>
								</Label>
								<Input
									id="phoneNumber"
									type="tel"
									disabled={cartItems.length === 0}
									className="rounded-2xl px-3 py-6 text-base"
								/>
							</div>

							{/* Address */}
							<div className="space-y-2">
								<Label htmlFor="addressLine1">
									Address<span className="text-red-400">*</span>
								</Label>
								<Input
									id="addressLine1"
									disabled={cartItems.length === 0}
									className="rounded-2xl px-3 py-6 text-base"
								/>
							</div>

							{/* Apartment */}
							<div className="space-y-2">
								<Label htmlFor="addressLine2">
									Apartment, suite, etc. (optional)
								</Label>
								<Input
									id="addressLine2"
									disabled={cartItems.length === 0}
									className="rounded-2xl px-3 py-6 text-base"
								/>
							</div>

							{/* ZIP */}
							<div className="space-y-2">
								<Label htmlFor="postalCode">
									ZIP code<span className="text-red-400">*</span>
								</Label>
								<Input
									id="postalCode"
									disabled={cartItems.length === 0}
									className="rounded-2xl px-3 py-6 text-base"
								/>
							</div>

							{/* City */}
							<div className="space-y-2">
								<Label htmlFor="city">
									City<span className="text-red-400">*</span>
								</Label>
								<Input
									id="city"
									disabled={cartItems.length === 0}
									className="rounded-2xl px-3 py-6 text-base"
								/>
							</div>

							{/* State */}
							<div className="space-y-2">
								<Label htmlFor="state">State (optional)</Label>
								<Input
									id="state"
									disabled={cartItems.length === 0}
									className="rounded-2xl px-3 py-6 text-base"
								/>
							</div>

							{/* Country */}
							<div className="space-y-2 self-end">
								<Label htmlFor="country">
									Country<span className="text-red-400">*</span>
								</Label>
								<select
									id="country"
									disabled={cartItems.length === 0}
									className="flex h-10 w-full rounded-2xl border border-input bg-transparent px-3 py-6 text-base ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-muted-foreground"
								>
									<option value="">Select country</option>
									<option value="US">United States</option>
									<option value="RS">Serbia</option>
									<option value="DE">Germany</option>
									<option value="FR">France</option>
									<option value="GB">United Kingdom</option>
								</select>
							</div>

							{/* Submit Button */}
							<div className="mt-4 w-full md:col-span-2">
								<Button
									type="submit"
									disabled={cartItems.length === 0}
									className="rounded-full col-span-2 w-full px-9 py-3.5"
								>
									<CreditCard className="w-4 mr-2" />
									Pay with debit card
								</Button>

								{cartItems.length === 0 && (
									<p className="text-red-500 mt-2 text-center text-sm">
										Please enter valid shipping address to proceed
									</p>
								)}

								{/* PayPal Placeholder */}
								<div className="relative z-10 w-full mt-4 col-span-2 opacity-40 pointer-events-none">
									<div className="bg-[#FFC439] rounded-full h-[45px] flex items-center justify-center text-[#003087] font-semibold">
										PayPal
									</div>
								</div>
							</div>
						</form>
					</div>
				</div>
			</div>
		</section>
	)
}