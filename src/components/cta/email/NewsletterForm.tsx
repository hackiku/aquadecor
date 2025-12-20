// src/components/cta/email/NewsletterForm.tsx

"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { api } from "~/trpc/react"; // ADD THIS

export function NewsletterForm() {
	const [email, setEmail] = useState("");
	const [discountCode, setDiscountCode] = useState<string | null>(null);
	const t = useTranslations('common.email.newsletter');

	// ADD THIS - tRPC mutation
	const subscribe = api.newsletter.subscribe.useMutation({
		onSuccess: (data) => {
			if (data.success) {
				setDiscountCode(data.discountCode || null);
				setEmail("");
			}
		},
	});

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		// REPLACE the old implementation with:
		subscribe.mutate({
			email,
			source: 'newsletter-form', // or 'footer', 'popup', etc.
		});
	};

	return (
		<div className="max-w-2xl mx-auto bg-primary/5">
			<div className="rounded-2xl border bg-card p-8 md:p-12 text-center space-y-6">
				<div className="space-y-3">
					<h2 className="text-3xl md:text-4xl font-display font-light tracking-tight">
						{t('heading')}
					</h2>
					<p className="text-lg text-muted-foreground font-display font-light">
						{t('description')}
					</p>
				</div>

				<form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
					<Input
						type="email"
						placeholder={t('placeholder')}
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
						disabled={subscribe.isPending}
						className="rounded-full text-base"
					/>
					<Button
						type="submit"
						size="lg"
						disabled={subscribe.isPending}
						className="rounded-full shrink-0"
					>
						{subscribe.isPending ? t('subscribing') : t('subscribe')}
					</Button>
				</form>

				{/* SUCCESS - Show discount code */}
				{discountCode && (
					<div className="p-4 bg-primary/10 rounded-lg">
						<p className="text-sm text-primary font-display font-medium mb-2">
							{t('success')}
						</p>
						<p className="text-2xl font-display font-bold text-primary">
							{discountCode}
						</p>
						<p className="text-xs text-muted-foreground mt-2">
							Use this code at checkout for 10% off your first order!
						</p>
					</div>
				)}

				{/* ERROR */}
				{subscribe.isError && (
					<p className="text-sm text-destructive font-display">
						{subscribe.error.message || t('error')}
					</p>
				)}

				<p className="text-xs text-muted-foreground font-display font-light">
					{t('subscribers')}
				</p>
			</div>
		</div>
	);
}
