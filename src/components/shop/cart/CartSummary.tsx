// src/components/shop/cart/CartSummary.tsx

interface CartSummaryProps {
	subtotal: number; // in cents
	shipping?: number; // in cents
	tax?: number; // in cents
}

export function CartSummary({ subtotal, shipping = 0, tax = 0 }: CartSummaryProps) {
	const total = subtotal + shipping + tax;

	return (
		<div className="space-y-3">
			{/* Subtotal */}
			<div className="flex items-center justify-between text-sm">
				<span className="text-muted-foreground font-display font-light">Subtotal</span>
				<span className="font-display font-medium">€{(subtotal / 100).toFixed(2)}</span>
			</div>

			{/* Shipping */}
			<div className="flex items-center justify-between text-sm">
				<span className="text-muted-foreground font-display font-light">Shipping</span>
				<span className="font-display font-medium text-primary">
					{shipping === 0 ? "Free" : `€${(shipping / 100).toFixed(2)}`}
				</span>
			</div>

			{/* Tax (if applicable) */}
			{tax > 0 && (
				<div className="flex items-center justify-between text-sm">
					<span className="text-muted-foreground font-display font-light">Tax</span>
					<span className="font-display font-medium">€{(tax / 100).toFixed(2)}</span>
				</div>
			)}

			{/* Total */}
			<div className="flex items-center justify-between pt-3 border-t">
				<span className="font-display font-medium">Total</span>
				<span className="text-xl font-display font-normal">€{(total / 100).toFixed(2)}</span>
			</div>
		</div>
	);
}