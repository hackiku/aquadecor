// src/components/cta/email/NewsletterForm.tsx

"use client";

import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";

export function NewsletterForm() {
	const [email, setEmail] = useState("");
	const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setStatus("loading");

		// TODO: Integrate with Resend API
		try {
			// Simulate API call
			await new Promise(resolve => setTimeout(resolve, 1000));
			setStatus("success");
			setEmail("");
		} catch (error) {
			setStatus("error");
		}
	};

	return (
		<div className="max-w-2xl mx-auto bg-primary/5">
			<div className="rounded-2xl border bg-card p-8 md:p-12 text-center space-y-6">
				<div className="space-y-3">
					<h2 className="text-3xl md:text-4xl font-display font-light tracking-tight">
						Ready to transform your aquarium?
					</h2>
					<p className="text-lg text-muted-foreground font-display font-light">
						Get exclusive updates, custom design previews, and special offers delivered to your inbox.
					</p>
				</div>

				<form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
					<Input
						type="email"
						placeholder="Enter your email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
						disabled={status === "loading"}
						className="rounded-full text-base"
					/>
					<Button
						type="submit"
						size="lg"
						disabled={status === "loading"}
						className="rounded-full shrink-0"
					>
						{status === "loading" ? "Subscribing..." : "Subscribe"}
					</Button>
				</form>

				{status === "success" && (
					<p className="text-sm text-primary font-display">
						Thanks for subscribing! Check your inbox.
					</p>
				)}

				{status === "error" && (
					<p className="text-sm text-destructive font-display">
						Something went wrong. Please try again.
					</p>
				)}

				<p className="text-xs text-muted-foreground font-display font-light">
					Join 10,000+ aquarium enthusiasts. Unsubscribe anytime.
				</p>
			</div>
		</div>
	);
}