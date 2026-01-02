// src/app/(website)/calculator/_components/quote/QuoteSection.tsx

"use client";

import { useState, type FormEvent } from "react";
import { Button } from "~/components/ui/button";
import type { QuoteConfig, PriceEstimate } from "../../calculator-types";
import { formatEUR } from "../../_hooks/useQuoteEstimate";
import { Loader2 } from "lucide-react";

interface QuoteSectionProps {
	config: QuoteConfig;
	estimate: PriceEstimate;
	onSubmit: (data: { firstName: string; lastName: string; email: string; notes?: string }) => Promise<void>;
}

export function QuoteSection({ config, estimate, onSubmit }: QuoteSectionProps) {
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [email, setEmail] = useState("");
	const [notes, setNotes] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isSuccess, setIsSuccess] = useState(false);

	const handleSubmit = async (e: FormEvent) => { 
		e.preventDefault();
		setIsSubmitting(true);

		try {
			await onSubmit({ firstName, lastName, email, notes });
			setIsSuccess(true);
			// Reset form
			setFirstName("");
			setLastName("");
			setEmail("");
			setNotes("");
		} catch (error) {
			console.error("Quote submission error:", error);
			alert("Failed to submit quote. Please try again.");
		} finally {
			setIsSubmitting(false);
		}
	};

	if (isSuccess) {
		return (
			<section className="py-16 bg-gradient-to-br from-primary/5 to-primary/10">
				<div className="container max-w-4xl mx-auto px-4">
					<div className="text-center space-y-4 p-8 bg-background rounded-2xl border-2 border-primary/20 shadow-lg">
						<div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="32"
								height="32"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
								className="text-primary"
							>
								<path d="M20 6 9 17l-5-5" />
							</svg>
						</div>
						<h2 className="text-3xl font-display font-light">Request Sent!</h2>
						<p className="text-muted-foreground font-display font-light text-lg">
							We'll review your configuration and email you within 24 hours with a detailed quote.
						</p>
						<p className="text-sm text-muted-foreground">
							Check your inbox at <strong>{email}</strong>
						</p>
					</div>
				</div>
			</section>
		);
	}

	return (
		<section className="py-16 bg-gradient-to-br from-primary/5 to-primary/10">
			<div className="container max-w-4xl mx-auto px-4">
				<div className="bg-background rounded-2xl border-2 border-primary/20 shadow-lg overflow-hidden">
					{/* Header */}
					<div className="px-8 py-6 border-b">
						<h2 className="text-3xl font-display font-light mb-2">
							Send Request and Reach Out to Us
						</h2>
						<p className="text-muted-foreground font-display font-light">
							Complete the form below and we'll respond within 24 hours.{" "}
							<span className="font-semibold">By sending the request, you are not obliged to make a purchase.</span>
						</p>
					</div>

					{/* Configuration Summary */}
					<div className="px-8 py-6 bg-accent/5 border-b">
						<h3 className="text-lg font-display font-medium mb-4">Your Configuration</h3>
						<div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
							<div>
								<p className="text-muted-foreground font-display font-light">Model</p>
								<p className="font-display font-medium">
									{config.modelCategory?.name || config.modelCategory?.slug || "—"}
								</p>
							</div>
							<div>
								<p className="text-muted-foreground font-display font-light">Dimensions</p>
								<p className="font-display font-medium">
									{config.dimensions.width}×{config.dimensions.height}cm
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
						<div className="mt-6 pt-4 border-t flex justify-between items-center">
							<span className="text-sm text-muted-foreground font-display font-light">
								Estimated Total
							</span>
							<span className="text-3xl font-display font-bold text-primary">
								{formatEUR(estimate.total)}
							</span>
						</div>
					</div>

					{/* Form */}
					<form onSubmit={handleSubmit} className="px-8 py-8">
						<div className="grid sm:grid-cols-2 gap-6">
							{/* First Name */}
							<div className="space-y-2">
								<label htmlFor="firstName" className="text-sm font-medium font-display">
									First Name <span className="text-destructive">*</span>
								</label>
								<input
									id="firstName"
									type="text"
									required
									value={firstName}
									onChange={(e) => setFirstName(e.target.value)}
									className="w-full px-4 py-3 rounded-lg border-2 border-border bg-background font-display font-light focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors"
									placeholder="John"
								/>
							</div>

							{/* Last Name */}
							<div className="space-y-2">
								<label htmlFor="lastName" className="text-sm font-medium font-display">
									Last Name <span className="text-destructive">*</span>
								</label>
								<input
									id="lastName"
									type="text"
									required
									value={lastName}
									onChange={(e) => setLastName(e.target.value)}
									className="w-full px-4 py-3 rounded-lg border-2 border-border bg-background font-display font-light focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors"
									placeholder="Doe"
								/>
							</div>

							{/* Email - Full Width */}
							<div className="space-y-2 sm:col-span-2">
								<label htmlFor="email" className="text-sm font-medium font-display">
									Email <span className="text-destructive">*</span>
								</label>
								<input
									id="email"
									type="email"
									required
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									className="w-full px-4 py-3 rounded-lg border-2 border-border bg-background font-display font-light focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors"
									placeholder="john@example.com"
								/>
							</div>

							{/* Notes - Full Width */}
							<div className="space-y-2 sm:col-span-2">
								<label htmlFor="notes" className="text-sm font-medium font-display">
									Additional Notes (Optional)
								</label>
								<textarea
									id="notes"
									value={notes}
									onChange={(e) => setNotes(e.target.value)}
									rows={4}
									className="w-full px-4 py-3 rounded-lg border-2 border-border bg-background font-display font-light focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors resize-none"
									placeholder="Color preferences, filter cutouts, special requests..."
								/>
							</div>
						</div>

						{/* Submit Button */}
						<div className="mt-8 flex flex-col items-center gap-4">
							<Button
								type="submit"
								disabled={isSubmitting}
								className="w-full sm:w-auto px-12 py-6 bg-primary text-white hover:bg-primary/90 font-display font-medium text-lg rounded-full shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
							>
								{isSubmitting ? (
									<>
										<Loader2 className="mr-2 h-5 w-5 animate-spin" />
										Sending...
									</>
								) : (
									"Send Request"
								)}
							</Button>

							{/* Terms */}
							<p className="text-xs text-muted-foreground text-center">
								By clicking "Send Request" you agree to our{" "}
								<a href="/terms" className="underline hover:text-foreground transition-colors">
									terms and conditions
								</a>
							</p>
						</div>
					</form>
				</div>
			</div>
		</section>
	);
}