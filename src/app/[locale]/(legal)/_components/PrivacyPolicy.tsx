// src/app/[locale]/(legal)/_components/PrivacyPolicy.tsx

import { type Locale } from "~/lib/i18n/dictionaries";
import { privacyPolicy } from "~/lib/i18n/legal/privacy";

export const PrivacyPolicy = ({ locale }: { locale: Locale }) => {
	const t =
		locale === "us"
			? privacyPolicy.us
			: locale === "it"
				? privacyPolicy.it
				: privacyPolicy.intl;

	return (
		<div className="space-y-12 animate-in fade-in duration-500">
			<div className="space-y-4 border-b pb-8">
				<h1 className="text-4xl md:text-5xl font-display font-light text-foreground">
					{t.title}
				</h1>
				<p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
					{t.lastUpdated}
				</p>
				<div className="pt-4 space-y-4">
					{t.intro.map((paragraph, i) => (
						<p
							key={i}
							className="text-xl text-muted-foreground font-display font-light leading-relaxed"
						>
							{paragraph}
						</p>
					))}
				</div>
			</div>

			<div className="grid gap-10">
				{t.sections.map((section, i) => (
					<section key={i} className="space-y-3">
						<h2 className="text-2xl font-display font-normal text-foreground">
							{section.heading}
						</h2>
						<p className="text-lg text-muted-foreground leading-relaxed">
							{section.content}
						</p>
					</section>
				))}
			</div>

			{t.contact && (
				<div className="pt-8 border-t mt-12">
					<h3 className="text-xl font-display font-medium mb-2">
						{t.contact.heading}
					</h3>
					<p className="text-muted-foreground">{t.contact.content}</p>
				</div>
			)}
		</div>
	);
};