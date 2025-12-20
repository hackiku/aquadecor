// src/components/cta/email/SmallNewsletter.tsx
"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { api } from "~/trpc/react";

export function SmallNewsletter() {
	const [email, setEmail] = useState("");
	const [showCode, setShowCode] = useState(false);
	const [code, setCode] = useState<string | null>(null);
	const t = useTranslations('common.email.small');

	const subscribe = api.newsletter.subscribe.useMutation({
		onSuccess: (data) => {
			if (data.success && data.discountCode) {
				setCode(data.discountCode);
				setShowCode(true);
				setEmail("");
			}
		},
	});

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		subscribe.mutate({
			email,
			source: 'small-newsletter',
		});
	};

	if (showCode && code) {
		return (
			<div className="relative overflow-hidden rounded-3xl border border-primary/10 bg-gradient-to-tr from-primary/20 via-transparent to-primary/20 p-6 text-center">
				<h4 className="font-display text-lg font-light mb-2">Check your email! 📧</h4>
				<p className="text-sm text-muted-foreground mb-4">Your discount code:</p>
				<p className="text-2xl font-display font-bold text-primary">{code}</p>
			</div>
		);
	}

	return (
		<div className="relative overflow-hidden rounded-3xl border border-primary/10 bg-gradient-to-tr from-primary/20 via-transparent to-primary/20 p-6">
			<h4 className="font-display text-lg font-light">{t('heading')}</h4>
			<form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-2">
				<input
					type="email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					placeholder={t('placeholder')}
					required
					disabled={subscribe.isPending}
					className="flex h-10 w-full rounded-full border border-white/10 bg-black/50 px-4 py-6 text-base placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-black"
				/>
				<button
					type="submit"
					disabled={subscribe.isPending}
					className="inline-flex items-center justify-center rounded-full bg-primary px-8 py-3 font-display font-medium text-white transition-colors hover:bg-primary/80 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-black sm:w-auto disabled:opacity-50"
				>
					{subscribe.isPending ? 'Joining...' : t('cta')}
				</button>
				{subscribe.isError && (
					<p className="text-xs text-destructive">{subscribe.error.message}</p>
				)}
			</form>
		</div>
	);
}
