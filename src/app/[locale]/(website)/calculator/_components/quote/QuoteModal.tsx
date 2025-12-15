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
	onDepositPayment?: (data: { name: string; email: string; notes?: string }) => void;
}

// Scarcity Component - Production Slots
function ProductionSlotsBanner({ slotsRemaining = 4 }: { slotsRemaining?: number }) {
	return (
		<div className="px-4 py-3 bg-orange-500/10 rounded-xl border border-orange-500/20">
			<div className="flex items-start gap-3">
				<div className="text-orange-500 mt-0.5">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="18"
						height="18"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
					>
						<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
						<line x1="12" x2="12" y1="9" y2="13" />
						<line x1="12" x2="12.01" y1="17" y2="17" />
					</svg>
				</div>
				<div className="space-y-1">
					<p className="text-sm font-display font-medium text-orange-700 dark:text-orange-400">
						Only {slotsRemaining} production slots left this month
					</p>
					<p className="text-xs font-display font-light text-orange-600/80 dark:text-orange-400/80">
						Deposit secures your spot and starts production immediately
					</p>
				</div>
			</div>
		</div>
	);
}

// Scarcity Component - Real-time Viewers
function LiveViewersBadge({ viewerCount = 7, location = "Germany" }: { viewerCount?: number; location?: string }) {
	return (
		<div className="flex items-center gap-2 text-xs text-muted-foreground font-display font-light">
			<span className="relative flex h-2 w-2">
				<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
				<span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
			</span>
			{viewerCount} people from {location} viewing this calculator now
		</div>
	);
}

// Benefits Component - Why Pay Deposit
function DepositBenefits({ depositAmount }: { depositAmount: number }) {
	return (
		<div className="space-y-2 px-4 py-3 bg-primary/5 rounded-xl border border-primary/20">
			<p className="text-sm font-display font-medium text-primary">
				💳 Pay 30% deposit now and get:
			</p>
			<ul className="space-y-1.5 text-xs font-display font-light text-muted-foreground">
				<li className="flex items-start gap-2">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="14"
						height="14"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
						className="text-primary shrink-0 mt-0.5"
					>
						<path d="M20 6 9 17l-5-5" />
					</svg>
					<span>5% discount (save €{Math.round(depositAmount * 0.05)})</span>
				</li>
				<li className="flex items-start gap-2">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="14"
						height="14"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
						className="text-primary shrink-0 mt-0.5"
					>
						<path d="M20 6 9 17l-5-5" />
					</svg>
					<span>Priority queue - jump ahead</span>
				</li>
				<li className="flex items-start gap-2">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="14"
						height="14"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
						className="text-primary shrink-0 mt-0.5"
					>
						<path d="M20 6 9 17l-5-5" />
					</svg>
					<span>Production starts immediately</span>
				</li>
				<li className="flex items-start gap-2">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="14"
						height="14"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
						className="text-primary shrink-0 mt-0.5"
					>
						<path d="M20 6 9 17l-5-5" />
					</svg>
					<span>Still discuss customizations</span>
				</li>
			</ul>
		</div>
	);
}

// Testimonial Component - Joey Mullen
function JoeyTestimonial() {
	return (
		<div className="px-4 py-3 bg-accent/5 rounded-xl border">
			<div className="flex items-start gap-3">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="20"
					height="20"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
					className="text-primary shrink-0 mt-1"
				>
					<path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z" />
					<path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z" />
				</svg>
				<div className="space-y-2">
					<p className="text-sm font-display font-light text-muted-foreground leading-relaxed">
						"The hand-painted details really stand out and make this background a work of art. It has a Styrofoam core, but on the surface it feels just like a rock. Every classic rock aquarium background is entirely customized to the build of your fish tank and matches perfectly the exact dimensions."
					</p>
					<p className="text-xs font-display font-medium">
						— Joey Mullen (King of DIY), YouTube
					</p>
				</div>
			</div>
		</div>
	);
}

export function QuoteModal({
	config,
	estimate,
	isOpen,
	onClose,
	onSubmit,
	onDepositPayment
}: QuoteModalProps) {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [notes, setNotes] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);

	const depositAmount = Math.round(estimate.total * 0.3);

	const handleQuoteRequest = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);

		try {
			await onSubmit({ name, email, notes });
			setName("");
			setEmail("");
			setNotes("");
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleDepositClick = async () => {
		if (!name || !email) {
			alert("Please fill in your name and email first");
			return;
		}

		setIsSubmitting(true);
		try {
			if (onDepositPayment) {
				await onDepositPayment({ name, email, notes });
			} else {
				console.log("Redirect to Stripe for deposit:", { depositAmount, name, email });
			}
		} finally {
			setIsSubmitting(false);
		}
	};

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
			<div className="bg-background rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto border-2">
				{/* Header */}
				<div className="sticky top-0 bg-background border-b px-6 py-4 flex items-center justify-between z-10">
					<div>
						<h2 className="text-2xl font-display font-light">Get Your Custom Quote</h2>
						<p className="text-sm text-muted-foreground font-display font-light mt-1">
							Choose how you'd like to proceed
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

				{/* Content - 2 Column Layout on Desktop */}
				<div className="p-6">
					<div className="grid lg:grid-cols-2 gap-6">
						{/* Left Column - Form */}
						<div className="space-y-5">
							{/* Configuration Summary */}
							<div className="p-4 bg-accent/5 rounded-xl space-y-3">
								<h3 className="text-sm font-display font-medium">Your Configuration</h3>
								<div className="grid grid-cols-2 gap-3 text-sm">
									<div>
										<p className="text-muted-foreground font-display font-light">Model</p>
										<p className="font-display font-medium">
											{config.modelCategory?.name?.toUpperCase() ?? config.modelCategory?.slug?.toUpperCase() ?? "—"}
										</p>
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

							{/* Form Fields */}
							<form onSubmit={handleQuoteRequest} className="space-y-4">
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
										placeholder="Color preferences, filter cutouts, matching curtains, etc..."
									/>
								</div>

								{/* Mobile-only CTAs (hidden on desktop) */}
								<div className="lg:hidden space-y-3">
									<Button
										type="button"
										onClick={handleDepositClick}
										className="w-full bg-primary text-white hover:bg-primary/90 font-display font-medium py-6 text-base"
										disabled={isSubmitting}
									>
										<div className="flex flex-col items-center gap-1">
											<span>Pay 30% Deposit - Start Now</span>
											<span className="text-xs opacity-90">
												{formatEUR(depositAmount)} • Save 5%
											</span>
										</div>
									</Button>

									<Button
										type="submit"
										variant="outline"
										className="w-full font-display font-medium py-6"
										disabled={isSubmitting}
									>
										Request Quote (No payment)
									</Button>
								</div>
							</form>
						</div>

						{/* Right Column - Benefits & CTAs (Desktop) */}
						<div className="space-y-5">
							{/* Scarcity: Production slots */}
							<ProductionSlotsBanner slotsRemaining={4} />

							{/* Deposit Benefits */}
							<DepositBenefits depositAmount={estimate.total} />

							{/* Testimonial */}
							<JoeyTestimonial />

							{/* Desktop CTAs */}
							<div className="hidden lg:block space-y-3">
								{/* Primary CTA - Pay Deposit */}
								<Button
									type="button"
									onClick={handleDepositClick}
									className="w-full bg-primary text-white hover:bg-primary/90 font-display font-medium py-6 text-base"
									disabled={isSubmitting}
								>
									<div className="flex flex-col items-center gap-1">
										<span>Pay 30% Deposit - Start Production Now</span>
										<span className="text-xs opacity-90">
											{formatEUR(depositAmount)} • Save 5% + Priority Queue
										</span>
									</div>
								</Button>

								{/* Secondary CTA - Request Quote */}
								<Button
									type="button"
									onClick={handleQuoteRequest}
									variant="outline"
									className="w-full font-display font-medium py-6"
									disabled={isSubmitting}
								>
									Request Custom Quote (No payment required)
								</Button>
							</div>

							{/* Live viewers */}
							<div className="flex justify-center">
								<LiveViewersBadge viewerCount={7} location="Germany" />
							</div>

							{/* Disclaimer */}
							<div className="p-4 bg-muted/30 rounded-xl">
								<p className="text-xs text-muted-foreground font-display font-light text-center">
									💡 <strong>Both options:</strong> We'll email you within 24 hours to discuss customizations.
									Deposit simply secures your production slot.
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}