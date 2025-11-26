// src/components/shop/cart/CartDrawer.tsx
"use client";

import { useState, useEffect } from "react";
import { X, ShoppingCart, ArrowRight } from "lucide-react";
import { Button } from "~/components/ui/button";
import { CartItem } from "./CartItem";
import { CartSummary } from "./CartSummary";
import { SignupIncentive } from "~/components/cta/SignupIncentive";
import { api } from "~/trpc/react";

interface CartDrawerProps {
	isOpen: boolean;
	onClose: () => void;
}

interface CartItemData {
	id: string;
	productId: string;
	quantity: number;
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
	const [cartItems, setCartItems] = useState<CartItemData[]>([]);
	const [showSignup, setShowSignup] = useState(false);

	// Load cart from localStorage
	useEffect(() => {
		const loadCart = () => {
			const cart = localStorage.getItem("cart");
			if (cart) {
				setCartItems(JSON.parse(cart));
			}
		};

		if (isOpen) {
			loadCart();
		}
	}, [isOpen]);

	// Listen for cart updates
	useEffect(() => {
		const handleCartUpdate = (e: CustomEvent) => {
			setCartItems(e.detail.items);
		};

		window.addEventListener("cart-updated", handleCartUpdate as EventListener);
		return () => window.removeEventListener("cart-updated", handleCartUpdate as EventListener);
	}, []);

	// Fetch product details for cart items
	const productIds = cartItems.map(item => item.productId);
	const { data: products } = api.product.getByIds.useQuery(
		{ ids: productIds },
		{ enabled: productIds.length > 0 && isOpen }
	);

	// Merge cart items with product data
	const enrichedItems = cartItems.map(cartItem => {
		const product = products?.find(p => p.id === cartItem.productId);
		return {
			...cartItem,
			name: product?.name || "Unknown Product",
			slug: product?.slug || "",
			priceEurCents: product?.basePriceEurCents || 0,
			// Fix: Convert null to undefined
			imageUrl: product?.featuredImageUrl ?? undefined,
			categorySlug: product?.categorySlug || "",
			productLineSlug: product?.productLineSlug || "",
		};
	});

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

	const subtotal = enrichedItems.reduce((sum, item) => sum + (item.priceEurCents * item.quantity), 0);
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
					{isEmpty ? (
						<div className="flex flex-col items-center justify-center h-full text-center space-y-4">
							<ShoppingCart className="h-16 w-16 text-muted-foreground/20" />
							<p className="text-lg text-muted-foreground font-display font-light">
								Your cart is empty
							</p>
							<Button onClick={onClose} variant="outline" className="rounded-full">
								Continue Shopping
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
								// TODO: Navigate to checkout
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