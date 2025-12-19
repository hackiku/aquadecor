// src/app/[locale]/(legal)/_components/PolicyRenderer.tsx
import { useTranslations } from 'next-intl';
import { AlertTriangle, Info, Truck } from 'lucide-react';

export const PolicyRenderer = ({ namespace }: { namespace: string }) => {
	const t = useTranslations(`legal.${namespace}`);

	const sections = t.raw('sections') as Array<{
		heading: string;
		badge?: string;
		content: string | string[];
		variant?: 'danger' | 'warning' | 'info';
	}>;

	return (
		<div className="space-y-12">
			<header className="space-y-4 border-b pb-8">
				<h1 className="text-4xl md:text-5xl font-display font-light text-foreground !m-0">
					{t('title')}
				</h1>
				<p className="text-sm font-medium text-muted-foreground uppercase tracking-widest">
					{t('lastUpdated')}
				</p>
			</header>

			<div className="grid gap-10">
				{sections.map((section, i) => {
					// RED BOX (Danger)
					if (section.variant === 'danger') {
						return (
							<section key={i} className="p-8 rounded-xl bg-red-500/5 border border-red-500/20 max-w-2xl">
								<div className="flex items-center gap-3 mb-4">
									<AlertTriangle className="h-6 w-6 text-red-600" />
									<h3 className="text-xl font-medium text-red-700 dark:text-red-400 !m-0">
										{section.badge || section.heading}
									</h3>
								</div>
								<p className="text-lg text-muted-foreground leading-relaxed !m-0">
									{section.content}
								</p>
							</section>
						);
					}

					// YELLOW BOX (Warning)
					if (section.variant === 'warning') {
						return (
							<section key={i} className="p-8 rounded-xl bg-amber-500/5 border border-amber-500/20 max-w-2xl">
								<div className="flex items-center gap-3 mb-4">
									<AlertTriangle className="h-6 w-6 text-amber-600" />
									<h3 className="text-xl font-medium text-amber-800 dark:text-amber-400 !m-0">
										{section.heading}
									</h3>
								</div>
								<p className="text-lg text-muted-foreground leading-relaxed !m-0">
									{section.content}
								</p>
							</section>
						);
					}

					// STANDARD HIGHLIGHT
					if (section.variant === 'info') {
						return (
							<section key={i} className="p-6 rounded-xl border-l-4 bg-primary/5 border-primary">
								<h3 className="font-medium text-primary mb-2 !m-0">{section.heading}</h3>
								<p className="text-lg text-foreground/80 !m-0">{section.content}</p>
							</section>
						);
					}

					// DEFAULT SECTION
					return (
						<section key={i} className="space-y-4">
							<h2 className="text-2xl font-display font-normal text-foreground !m-0">
								{section.heading}
							</h2>
							<div className="text-lg text-muted-foreground leading-relaxed">
								{Array.isArray(section.content) ? (
									<ul className="list-disc pl-5 space-y-2">
										{section.content.map((p, idx) => <li key={idx}>{p}</li>)}
									</ul>
								) : (
									<p>{section.content}</p>
								)}
							</div>
						</section>
					);
				})}
			</div>
		</div>
	);
};