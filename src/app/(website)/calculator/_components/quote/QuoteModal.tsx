// src/app/(website)/calculator/_components/quote/QuoteModal.tsx

"use client";

import { useState } from "react";
import { Button } from "~/components/ui/button";
import type { QuoteConfig, PriceEstimate } from "../../calculator-types";
import { formatEUR } from "../../_hooks/useQuoteEstimate";

interface QuoteModalProps {
	config: QuoteConfig;
	estimate: PriceEstimate;
	isOpen: boolean;
	onClose: () => void;
	onSubmit: (data: { name: string; email: string; notes?: string }) => void;
}

export function QuoteModal({ config, estimate, isOpen, onClose, onSubmit }: QuoteModalProps) {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [notes, setNotes] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);

		try {
			await onSubmit({ name, email, notes });
			// Reset form
			setName("");
			setEmail("");
			setNotes("");
		} finally {
			setIsSubmitting(false);
		}
	};

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
			<div className="bg-background rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border-2">
				{/* Header */}
				<div className="sticky top-0 bg-background border-b px-6 py-4 flex items-center justify-between">
					<div>
						<h2 className="text-2xl font-display font-light">Request Custom Quote</h2>
						<p className="text-sm text-muted-foreground font-display font-light mt-1">
							We'll respond within 24 hours with your custom pricing
						</p>
					</div>
					<button
						onClick={onClose}
						className="w-8 h-8 rounded-full hover:bg-accent transition-colors flex items-center justify-center"
					>
						<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
							<path d="M18 6 6 18" />
							<path d="m6 6 12 12" />
						</svg>
					</button>
				</div>

				{/* Content */}
				<div className="p-6 space-y-6">
					{/* Configuration Summary */}
					<div className="p-4 bg-accent/5 rounded-xl space-y-3">
						<h3 className="text-sm font-display font-medium">Your Configuration</h3>
						<div className="grid grid-cols-2 gap-3 text-sm">
							<div>
								<p className="text-muted-foreground font-display font-light">Model</p>
								<p className="font-display font-medium">{config.modelCategory?.toUpperCase() ?? "—"}</p>
							</div>
							<div>
								<p className="text-muted-foreground font-display font-light">Dimensions</p>
								<p className="font-display font-medium">
									{config.dimensions.width}×{config.dimensions.height}×{config.dimensions.depth}cm
								</p>
							</div>
							<div>
								<p className="text-muted-foreground font-display font-light">Material</p>
								<p className="font-display font-medium capitalize">{config.flexibility}</p>
							</div>
							<div>
								<p className="text-muted-foreground font-display font-light">Side Panels</p>
								<p className="font-display font-medium capitalize">{config.sidePanels}</p>
							</div>
						</div>

						{/* Price */}
						<div className="pt-3 border-t flex justify-between items-center">
							<span className="text-sm text-muted-foreground font-display font-light">
								Estimated Total
							</span>
							<span className="text-2xl font-display font-bold text-primary">
								{formatEUR(estimate.total)}
							</span>
						</div>
					</div>

					{/* Form */}
					<form onSubmit={handleSubmit} className="space-y-5">
						{/* Name */}
						<div className="space-y-2">
							<label htmlFor="name" className="text-sm font-medium font-display">
								Name *
							</label>
							<input
								id="name"
								type="text"
								required
								value={name}
								onChange={(e) => setName(e.target.value)}
								className="w-full px-4 py-3 rounded-xl border-2 border-border bg-background font-display font-light focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors"
								placeholder="John Doe"
							/>
						</div>

						{/* Email */}
						<div className="space-y-2">
							<label htmlFor="email" className="text-sm font-medium font-display">
								Email *
							</label>
							<input
								id="email"
								type="email"
								required
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								className="w-full px-4 py-3 rounded-xl border-2 border-border bg-background font-display font-light focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors"
								placeholder="john@example.com"
							/>
						</div>

						{/* Notes */}
						<div className="space-y-2">
							<label htmlFor="notes" className="text-sm font-medium font-display">
								Additional Notes (Optional)
							</label>
							<textarea
								id="notes"
								value={notes}
								onChange={(e) => setNotes(e.target.value)}
								rows={4}
								className="w-full px-4 py-3 rounded-xl border-2 border-border bg-background font-display font-light focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors resize-none"
								placeholder="Any special requests, questions, or color preferences..."
							/>
						</div>

						{/* Disclaimer */}
						<div className="p-4 bg-muted/30 rounded-xl">
							<p className="text-xs text-muted-foreground font-display font-light">
								By submitting this request, you are not obligated to make a purchase.
								We'll send you a detailed quote with payment options within 24 hours.
							</p>
						</div>

						{/* Submit */}
						<div className="flex gap-3">
							<Button
								type="button"
								variant="outline"
								onClick={onClose}
								className="flex-1 font-display font-medium"
								disabled={isSubmitting}
							>
								Cancel
							</Button>
							<Button
								type="submit"
								className="flex-1 bg-primary text-white hover:bg-primary/90 font-display font-medium"
								disabled={isSubmitting}
							>
								{isSubmitting ? "Submitting..." : "Request Quote"}
							</Button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
}