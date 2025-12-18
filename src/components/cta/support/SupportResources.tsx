// src/components/cta/support/SupportResources.tsx

"use client";

import { useTranslations } from 'next-intl';
import { Clock, AlertCircle } from "lucide-react";

export function SupportResources() {
	const t = useTranslations('contact');

	return (
		<div className="mt-8 space-y-4">
			{/* Response Time */}
			<div className="bg-gradient-to-br from-primary/5 to-primary/10 backdrop-blur-sm rounded-2xl p-6 border-2 border-primary/20">
				<div className="flex items-start gap-3">
					<Clock className="h-5 w-5 text-primary mt-0.5 shrink-0" />
					<div>
						<h3 className="text-lg font-display font-medium mb-2">
							{t('support.responseTime.title')}
						</h3>
						<p className="text-sm text-muted-foreground font-display font-light">
							{t('support.responseTime.description')}
						</p>
					</div>
				</div>
			</div>

			{/* Before Contacting */}
			<div className="bg-card/50 backdrop-blur-sm rounded-2xl p-6 border">
				<div className="flex items-start gap-3">
					<AlertCircle className="h-5 w-5 text-primary mt-0.5 shrink-0" />
					<div>
						<h3 className="text-lg font-display font-medium mb-2">
							{t('support.beforeContact.title')}
						</h3>
						<p className="text-sm text-muted-foreground font-display font-light">
							{t('support.beforeContact.description')}{' '}
							<a href="/faq" className="text-primary hover:underline">
								{t('support.beforeContact.faqLink')}
							</a>
							.
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}