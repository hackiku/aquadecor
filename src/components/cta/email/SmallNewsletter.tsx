// src/components/cta/email/SmallNewsletter.tsx
"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

export function SmallNewsletter() {
	const [email, setEmail] = useState("");
	const t = useTranslations('common.email.small');

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		// TODO: Implement newsletter signup
		console.log("Newsletter signup:", email);
		setEmail("");
	};

	return (
		<div className="relative overflow-hidden rounded-3xl border border-primary/10 bg-linear-to-tr from-primary/20 via-transparent to-primary/20 p-6">
			<h4 className="font-display text-lg font-light">{t('heading')}</h4>
			<form onSubmit={handleSubmit} className="mt-4 flex flex-col _sm:flex-row gap-2">
				<input
					type="email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					placeholder={t('placeholder')}
					required
					className="flex h-10 w-full rounded-full border border-white/10 bg-black/50 px-4 py-6 text-base placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-black"
				/>
				<button
					type="submit"
					className="inline-flex items-center justify-center rounded-full bg-primary px-8 py-3 font-display font-medium text-white transition-colors hover:bg-primary/80 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-black sm:w-auto"
				>
					{t('cta')}
				</button>
			</form>
		</div>
	);
}