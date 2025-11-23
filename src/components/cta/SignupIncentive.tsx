// src/components/cta/SignupIncentive.tsx
"use client";

import { ArrowRight, Heart, MapPin, CreditCard, Sparkles } from "lucide-react";
import { Button } from "~/components/ui/button";

interface SignupIncentiveProps {
	trigger?: "wishlist" | "cart" | "checkout";
	onDismiss?: () => void;
}

export function SignupIncentive({ trigger = "wishlist", onDismiss }: SignupIncentiveProps) {
	const handleSignup = () => {
		// TODO: Navigate to signup
		console.log("Navigate to signup with 10% off code");
	};

	return (
		<div className="relative overflow-hidden rounded-2xl border-2 border-primary/20 bg-linear-to-br from-primary/5 via-primary/10 to-primary/5 p-6 md:p-8">
			{/* Subtle background pattern */}
			<div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(55,129,194,0.1),transparent_50%)]" />

			<div className="relative space-y-6">
				{/* Header */}
				<div className="space-y-2">
					<div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/20 rounded-full">
						<Sparkles className="h-3.5 w-3.5 text-primary" />
						<span className="text-xs font-display font-medium text-primary uppercase tracking-wide">
							Save 10% Today
						</span>
					</div>
					<h3 className="text-2xl md:text-3xl font-display font-light leading-tight">
						Create an account and save
					</h3>
				</div>

				{/* Perks */}
				<div className="space-y-3">
					<div className="flex items-start gap-3">
						<div className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center mt-0.5">
							<Heart className="h-3 w-3 text-primary" />
						</div>
						<div>
							<p className="text-sm font-display font-medium">Save your wishlist</p>
							<p className="text-xs text-muted-foreground font-display font-light">
								Access from any device
							</p>
						</div>
					</div>

					<div className="flex items-start gap-3">
						<div className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center mt-0.5">
							<MapPin className="h-3 w-3 text-primary" />
						</div>
						<div>
							<p className="text-sm font-display font-medium">Faster checkout</p>
							<p className="text-xs text-muted-foreground font-display font-light">
								Saved addresses & payment methods
							</p>
						</div>
					</div>

					<div className="flex items-start gap-3">
						<div className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center mt-0.5">
							<CreditCard className="h-3 w-3 text-primary" />
						</div>
						<div>
							<p className="text-sm font-display font-medium">Order tracking</p>
							<p className="text-xs text-muted-foreground font-display font-light">
								Follow your custom builds in real-time
							</p>
						</div>
					</div>
				</div>

				{/* CTA */}
				<Button
					onClick={handleSignup}
					size="lg"
					className="w-full rounded-full gap-2"
				>
					Create Account & Get 10% Off
					<ArrowRight className="h-4 w-4" />
				</Button>

				{/* Already have account */}
				<p className="text-center text-xs text-muted-foreground font-display font-light">
					Already have an account?{" "}
					<button
						onClick={() => console.log("Navigate to signin")}
						className="text-primary hover:underline font-medium"
					>
						Sign in
					</button>
				</p>

				{/* Dismiss (optional) */}
				{onDismiss && (
					<button
						onClick={onDismiss}
						className="absolute top-3 right-3 text-muted-foreground hover:text-foreground transition-colors"
					>
						<span className="sr-only">Dismiss</span>
						×
					</button>
				)}
			</div>
		</div>
	);
}