// src/app/[locale]/(website)/contact/_components/ContactInfo.tsx

"use client";

import { useTranslations } from 'next-intl';
import { MapPin, Mail, ExternalLink } from "lucide-react";

export function ContactInfo() {
	const t = useTranslations('contact');

	return (
		<div className="space-y-6">
			{/* Address */}
			<div className="bg-card/50 backdrop-blur-sm rounded-2xl p-6 border">
				<div className="flex items-start gap-4">
					<div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
						<MapPin className="h-5 w-5 text-primary" />
					</div>
					<div>
						<h3 className="text-lg font-display font-medium mb-2">
							{t('info.address.title')}
						</h3>
						<p className="text-sm text-muted-foreground font-display font-light leading-relaxed">
							{t('info.address.line1')}<br />
							{t('info.address.line2')}
						</p>
					</div>
				</div>
			</div>

			{/* Email */}
			<div className="bg-card/50 backdrop-blur-sm rounded-2xl p-6 border">
				<div className="flex items-start gap-4">
					<div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
						<Mail className="h-5 w-5 text-primary" />
					</div>
					<div className="flex-1">
						<h3 className="text-lg font-display font-medium mb-2">
							{t('info.email.title')}
						</h3>
						<a
							href="mailto:office@aquadecorbackgrounds.com"
							className="text-sm text-primary hover:underline font-display font-light inline-flex items-center gap-1"
						>
							office@aquadecorbackgrounds.com
							<ExternalLink className="h-3 w-3" />
						</a>
					</div>
				</div>
			</div>
		</div>
	);
}