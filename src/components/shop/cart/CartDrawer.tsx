// src/components/shop/cart/CartDrawer.tsx
"use client";

import { useState, useEffect } from "react";
import { X, ShoppingCart, ArrowRight } from "lucide-react";
import { Button } from "~/components/ui/button";
import { CartItem } from "./CartItem";
import { CartSummary } from "./CartSummary";

interface CartDrawerProps {
	isOpen: boolean;
	onClose: () => void;
}

interface CartItemData {
	id: string;
	productId: string;
	name: string;
	slug: string;
	priceEurCents: number;
	quantity: number;
	imageUrl?: string;
	categorySlug: string;
	productLineSlug: string;
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
	const [items, setItems] = useState<CartItemData[]>([]);

	// Load cart from localStorage
	useEffect(() => {
		const cart = localStorage.getItem("cart");
		if (cart) {
			setItems(JSON.parse(cart));
		}
	}, []);

	// Listen for cart updates
	useEffect(() => {
		const handleCartUpdate = (e: CustomEvent) => {
			setItems(e.detail.items);
		};

		window.addEventListener("cart-updated", handleCartUpdate as EventListener);
		return () => window.removeEventListener("cart-updated", handleCartUpdate as EventListener);
	}, []);

	const updateQuantity = (itemId: string, newQuantity: number) => {
		const updatedItems = items.map(item =>
			item.id === itemId ? { ...item, quantity: newQuantity } : item
		).filter(item => item.quantity > 0);

		setItems(updatedItems);
		localStorage.setItem("cart", JSON.stringify(updatedItems));
		window.dispatchEvent(new CustomEvent("cart-updated", { detail: { items: updatedItems } }));
	};

	const removeItem = (itemId: string) => {
		updateQuantity(itemId, 0);
	};

	const subtotal = items.reduce((sum, item) => sum + (item.priceEurCents * item.quantity), 0);
	const isEmpty = items.length === 0;

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
							Cart ({items.length})
						</h2>
					</div>
					<Button variant="ghost" size="icon" onClick={onClose}>
						<X className="h-5 w-5" />
					</Button>
				</div>

				{/* Items */}
				<div className="flex-1 overflow-y-auto p-6">
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
						<div className="space-y-4">
							{items.map((item) => (
								<CartItem
									key={item.id}
									item={item}
									onUpdateQuantity={(newQuantity) => updateQuantity(item.id, newQuantity)}
									onRemove={() => removeItem(item.id)}
								/>
							))}
						</div>
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