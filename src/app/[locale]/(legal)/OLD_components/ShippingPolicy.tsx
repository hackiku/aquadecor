	// src/app/[locale]/(legal)/_components/ShippingPolicy.tsx

import { type Locale } from "~/lib/i18n/dictionaries";
import { shippingPolicy } from "~/lib/i18n/legal/shipping";
import { Truck, AlertCircle, CheckCircle2, Info } from "lucide-react";

export const ShippingPolicy = ({ locale }: { locale: Locale }) => {
	const t =
		locale === "us"
			? shippingPolicy.us
			: locale === "it"
				? shippingPolicy.it
				: shippingPolicy.intl;

	const isUS = locale === "us";

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

			<div className="grid gap-10">
				{t.sections.map((section, i) => {
					// Visual Highlighting Logic
					const isCustoms =
						section.heading.includes("Import") ||
						section.heading.includes("Customs") ||
						section.heading.includes("Dogana");

					const isDelivery =
						section.heading.includes("Delivery") ||
						section.heading.includes("Tempi");

					if (isCustoms) {
						return (
							<section key={i} className="space-y-4">
								<h2 className="text-2xl font-display font-normal">
									{section.heading}
								</h2>
								<div
									className={`p-6 rounded-xl border-l-4 ${isUS
											? "bg-emerald-500/5 border-emerald-500"
											: "bg-amber-500/5 border-amber-500"
										}`}
								>
									<div className="flex items-center gap-2 mb-3">
										{isUS ? (
											<CheckCircle2 className="h-5 w-5 text-emerald-600" />
										) : (
											<AlertCircle className="h-5 w-5 text-amber-600" />
										)}
										<h3
											className={`font-medium ${isUS
													? "text-emerald-900 dark:text-emerald-200"
													: "text-amber-900 dark:text-amber-200"
												}`}
										>
											{section.heading}
										</h3>
									</div>
									<p className="text-lg text-foreground/80 leading-relaxed">
										{section.content}
									</p>
								</div>
							</section>
						);
					}

					return (
						<section key={i} className="space-y-4">
							<h2 className="text-2xl font-display font-normal flex items-center gap-3">
								{isDelivery && <Truck className="h-6 w-6 text-primary" />}
								{!isDelivery && i === 0 && <Info className="h-6 w-6 text-primary" />}
								{section.heading}
							</h2>

							{/* Handle Array Content (Lists) vs String Content */}
							{Array.isArray(section.content) ? (
								<ul className="space-y-3 pl-2">
									{section.content.map((point, idx) => (
										<li
											key={idx}
											className="flex items-start gap-3 text-lg text-muted-foreground"
										>
											<span className="w-1.5 h-1.5 rounded-full bg-primary mt-2.5 shrink-0" />
											<span>{point}</span>
										</li>
									))}
								</ul>
							) : (
								<p className="text-lg text-muted-foreground leading-relaxed">
									{section.content}
								</p>
							)}
						</section>
					);
				})}
			</div>
		</div>
	);
};