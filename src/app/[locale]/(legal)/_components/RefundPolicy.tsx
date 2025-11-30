// src/app/[locale]/(legal)/_components/RefundPolicy.tsx

import { type Locale } from "~/lib/i18n/dictionaries";
import { refundPolicy } from "~/lib/i18n/legal/refund";
import { AlertTriangle, Ban } from "lucide-react";

export const RefundPolicy = ({ locale }: { locale: Locale }) => {
	const t =
		locale === "us"
			? refundPolicy.us
			: locale === "it"
				? refundPolicy.it
				: refundPolicy.intl;

	return (
		<div className="space-y-12 animate-in fade-in duration-500">
			<div className="space-y-4 border-b pb-8">
				<h1 className="text-4xl md:text-5xl font-display font-light text-foreground">
					{t.title}
				</h1>
				<p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
					{t.lastUpdated}
				</p>
				<p className="text-xl text-muted-foreground font-display font-light leading-relaxed max-w-3xl">
					{t.intro}
				</p>
			</div>

			<div className="grid gap-10">
				{t.sections.map((section, i) => {
					// Check for Cancellation section to add Red Alert Box
					const isCancellation =
						section.heading.includes("Cancellation") ||
						section.heading.includes("Cancellazione");

					const isReturns =
						section.heading.includes("Returns") ||
						section.heading.includes("Resi");

					if (isCancellation) {
						return (
							<section key={i} className="space-y-4">
								<h2 className="text-2xl font-display font-normal">
									{section.heading}
								</h2>
								<div className="p-8 rounded-xl bg-red-500/5 border border-red-500/20 max-w-2xl">
									<div className="flex items-center gap-3 mb-4">
										<AlertTriangle className="h-6 w-6 text-red-600" />
										<h3 className="text-xl font-medium text-red-700 dark:text-red-400">
											Important Notice
										</h3>
									</div>
									<p className="text-lg text-muted-foreground leading-relaxed">
										{section.content}
									</p>
								</div>
							</section>
						);
					}

					return (
						<section key={i} className="space-y-4">
							<h2 className="text-2xl font-display font-normal flex items-center gap-3">
								{isReturns && <Ban className="h-6 w-6 text-muted-foreground" />}
								{section.heading}
							</h2>
							<p className="text-lg text-muted-foreground leading-relaxed">
								{section.content}
							</p>
						</section>
					);
				})}
			</div>
		</div>
	);
};