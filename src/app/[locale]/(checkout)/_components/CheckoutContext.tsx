// src/app/[locale]/(checkout)/_components/CheckoutContext.tsx
'use client'

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { api } from '~/trpc/react'

// ============================================================================
// TYPES
// ============================================================================

interface CartItemData {
	id: string
	productId: string
	quantity: number
	addedAt: Date
}

interface ShippingAddress {
	firstName: string
	lastName: string
	email: string
	phone: string
	address1: string
	address2?: string
	city: string
	state?: string
	postalCode: string
	countryCode: string
}

interface CheckoutState {
	// Cart
	cartItems: CartItemData[]
	updateQuantity: (itemId: string, quantity: number) => void
	removeItem: (itemId: string) => void

	// Shipping
	shippingAddress: ShippingAddress | null
	setShippingAddress: (address: ShippingAddress) => void

	// Discount
	discountCode: string | null
	applyDiscount: (code: string) => void

	// Payment
	orderId: string | null
	setOrderId: (id: string) => void

	// Totals (cents)
	subtotal: number
	discount: number
	shipping: number
	tax: number
	total: number
}

const CheckoutContext = createContext<CheckoutState | null>(null)

// ============================================================================
// PROVIDER
// ============================================================================

export function CheckoutProvider({ children }: { children: ReactNode }) {
	const [cartItems, setCartItems] = useState<CartItemData[]>([])
	const [shippingAddress, setShippingAddress] = useState<ShippingAddress | null>(null)
	const [discountCode, setDiscountCode] = useState<string | null>(null)
	const [orderId, setOrderId] = useState<string | null>(null)

	// Load cart from localStorage
	useEffect(() => {
		const cart = localStorage.getItem('cart')
		if (cart) {
			try {
				const parsed = JSON.parse(cart)
				const items = parsed.map((item: any) => ({
					...item,
					addedAt: new Date(item.addedAt),
				}))
				setCartItems(items)
			} catch (error) {
				console.error('Failed to parse cart:', error)
			}
		}
	}, [])

	// Fetch product details
	const productIds = cartItems.map(item => item.productId)
	const { data: products } = api.product.getByIds.useQuery(
		{ ids: productIds, locale: 'en' },
		{ enabled: productIds.length > 0 }
	)

	// Calculate totals
	const subtotal = cartItems.reduce((sum, item) => {
		const product = products?.find(p => p.id === item.productId)
		const price = product?.unitPriceEurCents ?? 0
		return sum + (price * item.quantity)
	}, 0)

	const discount = 0 // TODO: Calculate based on discountCode
	const shipping = 0 // TODO: Calculate based on shippingAddress.countryCode
	const tax = 0 // TODO: Calculate based on shippingAddress.countryCode
	const total = subtotal - discount + shipping + tax

	// Cart actions
	const updateQuantity = (itemId: string, newQuantity: number) => {
		const updated = cartItems
			.map(item => (item.id === itemId ? { ...item, quantity: newQuantity } : item))
			.filter(item => item.quantity > 0)

		setCartItems(updated)
		localStorage.setItem('cart', JSON.stringify(updated))
	}

	const removeItem = (itemId: string) => {
		updateQuantity(itemId, 0)
	}

	const applyDiscount = (code: string) => {
		// TODO: Validate code with tRPC
		setDiscountCode(code)
	}

	return (
		<CheckoutContext.Provider
			value={{
				cartItems,
				updateQuantity,
				removeItem,
				shippingAddress,
				setShippingAddress,
				discountCode,
				applyDiscount,
				orderId,
				setOrderId,
				subtotal,
				discount,
				shipping,
				tax,
				total,
			}}
		>
			{children}
		</CheckoutContext.Provider>
	)
}

// ============================================================================
// HOOK
// ============================================================================

export function useCheckout() {
	const context = useContext(CheckoutContext)
	if (!context) {
		throw new Error('useCheckout must be used within CheckoutProvider')
	}
	return context
}