// src/components/shop/cart/CartDrawer.tsx
"use client";

import { useState, useEffect } from "react";
import { X, ShoppingCart, ArrowRight } from "lucide-react";
import { Button } from "~/components/ui/button";
import { CartItem } from "./CartItem";
import { CartSummary } from "./CartSummary";
import { SignupIncentive } from "~/components/cta/SignupIncentive";
import { api } from "~/trpc/react";
import type { Product } from "~/server/db/schema/shop";

// ============================================================================
// CLIENT-ONLY TYPES (localStorage cart state)
// ============================================================================

// Raw cart item stored in localStorage
interface CartItemData {
	id: string;           // Unique cart item ID (generated client-side)
	productId: string;    // Reference to Product.id
	quantity: number;
	addedAt: Date;
}

// Product data from tRPC getByIds endpoint
type ProductForCart = Pick<Product, 'id' | 'slug' | 'sku' | 'basePriceEurCents' | 'priceNote' | 'stockStatus'> & {
	categoryId: string;
	name: string | null;
	shortDescription: string | null;
	heroImageUrl: string | null; // UPDATED to match schema
	categorySlug: string | null;
	productLineSlug: string | null;
};

// Enriched cart item (after fetching product data)
interface EnrichedCartItem extends CartItemData {
	product: ProductForCart;
}

// ============================================================================
// COMPONENT
// ============================================================================

interface CartDrawerProps {
	isOpen: boolean;
	onClose: () => void;
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
	const [cartItems, setCartItems] = useState<CartItemData[]>([]);
	const [showSignup, setShowSignup] = useState(false);

	// Load cart from localStorage on mount
	useEffect(() => {
		const loadCart = () => {
			const cart = localStorage.getItem("cart");
			if (cart) {
				try {
					const parsed = JSON.parse(cart);
					// Convert date strings back to Date objects
					const items = parsed.map((item: any) => ({
						...item,
						addedAt: new Date(item.addedAt),
					}));
					setCartItems(items);
				} catch (error) {
					console.error("Failed to parse cart:", error);
					localStorage.removeItem("cart");
				}
			}
		};

		if (isOpen) {
			loadCart();
		}
	}, [isOpen]);

	// Listen for cart updates from other components
	useEffect(() => {
		const handleCartUpdate = (e: CustomEvent<{ items: CartItemData[] }>) => {
			setCartItems(e.detail.items);
		};

		window.addEventListener("cart-updated", handleCartUpdate as EventListener);
		return () => window.removeEventListener("cart-updated", handleCartUpdate as EventListener);
	}, []);

	// Fetch product details for all cart items
	const productIds = cartItems.map(item => item.productId);
	const { data: products, isLoading } = api.product.getByIds.useQuery(
		{ ids: productIds, locale: "en" },
		{ enabled: productIds.length > 0 && isOpen }
	);

	// Merge cart items with product data
	const enrichedItems: EnrichedCartItem[] = cartItems
		.map(cartItem => {
			const product = products?.find(p => p.id === cartItem.productId);
			if (!product) return null;

			return {
				...cartItem,
				product: product as ProductForCart
			};
		})
		.filter((item): item is EnrichedCartItem => item !== null);

	// Cart actions
	const updateQuantity = (itemId: string, newQuantity: number) => {
		const updatedItems = cartItems
			.map(item => (item.id === itemId ? { ...item, quantity: newQuantity } : item))
			.filter(item => item.quantity > 0);

		setCartItems(updatedItems);
		localStorage.setItem("cart", JSON.stringify(updatedItems));
		window.dispatchEvent(new CustomEvent("cart-updated", { detail: { items: updatedItems } }));
	};

	const removeItem = (itemId: string) => {
		updateQuantity(itemId, 0);
	};

	const clearCart = () => {
		setCartItems([]);
		localStorage.removeItem("cart");
		window.dispatchEvent(new CustomEvent("cart-updated", { detail: { items: [] } }));
	};

	// Calculate totals (prices in cents)
	const subtotal = enrichedItems.reduce(
		(sum, item) => sum + ((item.product.basePriceEurCents ?? 0) * item.quantity),
		0
	);

	const isEmpty = cartItems.length === 0;

	return (
		<>
			{/* Backdrop */}
			{isOpen && (
				<div
					className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity"
					onClick={onClose}
				/>
			)}

			{/* Drawer */}
			<div
				className={`fixed top-0 right-0 h-full w-full sm:w-[400px] bg-background border-l shadow-2xl z-50 transition-transform duration-300 flex flex-col ${isOpen ? "translate-x-0" : "translate-x-full"
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
					<Button variant="ghost" size="icon" onClick={onClose}>
						<X className="h-5 w-5" />
					</Button>
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
							<Button onClick={onClose} variant="outline" className="rounded-full">
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
							onClick={() => {
								console.log("Proceed to checkout");
							}}
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
	);
}