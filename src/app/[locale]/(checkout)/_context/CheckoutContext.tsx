// src/app/[locale]/(checkout)/_context/CheckoutContext.tsx
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
	selectedOptions?: any
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

interface DiscountInfo {
	code: string
	amount: number
	type: 'promoter' | 'sale' | 'signup' | null
	message: string | null
}

interface CheckoutState {
	// Cart
	cartItems: CartItemData[]
	addToCart: (productId: string, quantity?: number, options?: any) => void
	updateQuantity: (itemId: string, quantity: number) => void
	removeItem: (itemId: string) => void
	clearCart: () => void

	// Shipping
	shippingAddress: ShippingAddress | null
	setShippingAddress: (address: ShippingAddress) => void

	// Discount
	discountCode: string | null
	discountAmount: number
	discountType: 'promoter' | 'sale' | 'signup' | null
	discountMessage: string | null
	applyDiscount: (code: string) => Promise<void>
	clearDiscount: () => void

	// Payment
	orderId: string | null
	setOrderId: (id: string) => void

	// Totals (cents)
	subtotal: number
	discount: number
	shipping: number
	tax: number
	total: number

	// UI state
	isCartOpen: boolean
	openCart: () => void
	closeCart: () => void
}

const CheckoutContext = createContext<CheckoutState | null>(null)

// ============================================================================
// PROVIDER
// ============================================================================

export function CheckoutProvider({ children }: { children: ReactNode }) {
	const [cartItems, setCartItems] = useState<CartItemData[]>([])
	const [isCartOpen, setIsCartOpen] = useState(false)
	const [shippingAddress, setShippingAddress] = useState<ShippingAddress | null>(null)
	const [discountCode, setDiscountCode] = useState<string | null>(null)
	const [discountAmount, setDiscountAmount] = useState(0)
	const [discountType, setDiscountType] = useState<'promoter' | 'sale' | 'signup' | null>(null)
	const [discountMessage, setDiscountMessage] = useState<string | null>(null)
	const [orderId, setOrderId] = useState<string | null>(null)

	// Load cart from localStorage on mount
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
				localStorage.removeItem('cart')
			}
		}
	}, [])

	// Save cart to localStorage whenever it changes
	useEffect(() => {
		if (cartItems.length > 0) {
			localStorage.setItem('cart', JSON.stringify(cartItems))
		} else {
			localStorage.removeItem('cart')
		}

		// Dispatch event for other components
		window.dispatchEvent(new CustomEvent('cart-updated', {
			detail: { items: cartItems }
		}))
	}, [cartItems])

	// Fetch product details
	const productIds = cartItems.map(item => item.productId)
	const { data: products } = api.product.getByIds.useQuery(
		{ ids: productIds, locale: 'en' },
		{ enabled: productIds.length > 0 }
	)

	// Calculate subtotal
	const subtotal = cartItems.reduce((sum, item) => {
		const product = products?.find(p => p.id === item.productId)
		const price = product?.unitPriceEurCents ?? 0
		return sum + (price * item.quantity)
	}, 0)

	// Gift logic - auto-add/remove gift product
	useEffect(() => {
		const GIFT_THRESHOLD = 100000 // €1000 in cents
		const GIFT_PRODUCT_ID = 'gift-premium-moss'

		const hasGift = cartItems.some(i => i.productId === GIFT_PRODUCT_ID)
		const qualifies = subtotal >= GIFT_THRESHOLD

		if (qualifies && !hasGift) {
			// Add gift
			const newItem: CartItemData = {
				id: crypto.randomUUID(),
				productId: GIFT_PRODUCT_ID,
				quantity: 1,
				addedAt: new Date()
			}
			setCartItems(prev => [...prev, newItem])
		} else if (!qualifies && hasGift) {
			// Remove gift
			setCartItems(prev => prev.filter(i => i.productId !== GIFT_PRODUCT_ID))
		}
	}, [subtotal, cartItems])

	const discount = discountAmount
	const shipping = 0 // TODO: Calculate based on shippingAddress.countryCode
	const tax = 0 // TODO: Calculate based on shippingAddress.countryCode
	const total = subtotal - discount + shipping + tax

	// Cart actions
	const addToCart = (productId: string, quantity = 1, options?: any) => {
		const newItem: CartItemData = {
			id: crypto.randomUUID(),
			productId,
			quantity,
			addedAt: new Date(),
			selectedOptions: options
		}
		setCartItems(prev => [...prev, newItem])
		setIsCartOpen(true) // Auto-open cart on add
	}

	const updateQuantity = (itemId: string, newQuantity: number) => {
		if (newQuantity <= 0) {
			removeItem(itemId)
			return
		}

		setCartItems(prev =>
			prev.map(item =>
				item.id === itemId ? { ...item, quantity: newQuantity } : item
			)
		)
	}

	const removeItem = (itemId: string) => {
		setCartItems(prev => prev.filter(item => item.id !== itemId))
	}

	const clearCart = () => {
		setCartItems([])
		clearDiscount()
	}

	// Discount actions
	const applyDiscount = async (code: string) => {
		if (!code.trim()) {
			setDiscountMessage('Please enter a discount code')
			return
		}

		try {
			const response = await fetch('/api/validate-discount', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					code,
					subtotal,
					market: 'ROW', // TODO: Get from locale/user location
					email: shippingAddress?.email
				})
			})

			const result = await response.json()

			if (result.success) {
				setDiscountCode(code)
				setDiscountAmount(result.discountAmount)
				setDiscountType(result.type)
				setDiscountMessage(`✓ ${result.discountPercent || 'Discount'}% applied!`)
			} else {
				setDiscountMessage(result.message || 'Invalid discount code')
				clearDiscount()
			}
		} catch (error) {
			console.error('Failed to validate discount:', error)
			setDiscountMessage('Failed to validate code. Please try again.')
		}
	}

	const clearDiscount = () => {
		setDiscountCode(null)
		setDiscountAmount(0)
		setDiscountType(null)
		setDiscountMessage(null)
	}

	const openCart = () => setIsCartOpen(true)
	const closeCart = () => setIsCartOpen(false)

	return (
		<CheckoutContext.Provider
			value={{
				cartItems,
				addToCart,
				updateQuantity,
				removeItem,
				clearCart,
				shippingAddress,
				setShippingAddress,
				discountCode,
				discountAmount,
				discountType,
				discountMessage,
				applyDiscount,
				clearDiscount,
				orderId,
				setOrderId,
				subtotal,
				discount,
				shipping,
				tax,
				total,
				isCartOpen,
				openCart,
				closeCart,
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