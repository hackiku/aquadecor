// src/components/cta/email/EmailForm.tsx

"use client";

import { useState } from "react";
import { Button } from "~/components/ui/button";

export function EmailForm() {
	const [email, setEmail] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);

		// TODO: Implement newsletter signup via tRPC
		console.log("Newsletter signup:", email);

		// Simulate API call
		await new Promise((resolve) => setTimeout(resolve, 1000));

		setIsLoading(false);
		setEmail("");
		alert("Thanks for subscribing!"); // TODO: Replace with toast notification
	};

	return (
		<div className="w-full max-w-xl mx-auto bg-gradient-to-tr from-primary/20 via-transparent to-primary/20 rounded-3xl relative overflow-hidden p-6 border border-primary/10">
			<h4 className="text-lg font-light">Join Our Newsletter</h4>
			<p className="text-sm text-muted-foreground mt-2">
				Join thousands of subscribers and get exclusive insights
			</p>

			<form onSubmit={handleSubmit} className="mt-4 flex flex-col sm:flex-row gap-2 items-center">
				<input
					type="email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					placeholder="Email address..."
					required
					disabled={isLoading}
					className="flex h-12 w-full border border-input bg-background ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 rounded-full px-4 text-base"
				/>
				<Button
					type="submit"
					disabled={isLoading}
					className="w-full sm:w-auto rounded-full px-8 h-12"
				>
					{isLoading ? "Joining..." : "Join now"}
				</Button>
			</form>
		</div>
	);
}