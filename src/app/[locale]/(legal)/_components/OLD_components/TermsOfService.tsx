// src/app/[locale]/(legal)/_components/TermsOfService.tsx

import { type Locale } from "~/lib/i18n/dictionaries";
import { termsAndConditions } from "~/lib/i18n/legal/terms";

export const TermsOfService = ({ locale }: { locale: Locale }) => {
	// Logic: US -> US, IT -> IT, Others -> Intl (fallback)
	const t =
		locale === "us"
			? termsAndConditions.us
			: locale === "it"
				? termsAndConditions.it
				: termsAndConditions.intl;

	return (
		<div className="space-y-12 animate-in fade-in duration-500">
			<div className="space-y-4 border-b pb-8">
				<h1 className="text-4xl md:text-5xl font-display font-light text-foreground">
					{t.title}
				</h1>
				<p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
					{t.lastUpdated}
				</p>
			</div>

			<div className="grid gap-12">
				{t.sections.map((section, i) => (
					<section key={i} className="space-y-4 group">
						<h2 className="text-2xl font-display font-normal flex items-center gap-3 text-foreground">
							<span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-sm font-bold group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
								{i + 1}
							</span>
							{section.heading}
						</h2>
						<div className="pl-11 text-lg text-muted-foreground leading-relaxed">
							{section.content}
						</div>
					</section>
				))}
			</div>
		</div>
	);
};