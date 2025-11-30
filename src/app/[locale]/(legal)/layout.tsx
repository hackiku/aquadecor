// src/app/[locale]/(legal)/layout.tsx

import Link from "next/link";
import { dictionaries, type Locale } from "~/lib/i18n/dictionaries";
import { cn } from "~/lib/utils";

export default async function LegalLayout({
	children,
	params,
}: {
	children: React.ReactNode;
	// Fix: Change 'Locale' to 'string' here to match Next.js types
	params: Promise<{ locale: string }>;
}) {
	const { locale: rawLocale } = await params;
	// Fix: Cast string to Locale for internal use
	const locale = rawLocale as Locale;

	const t = dictionaries[locale] || dictionaries.us;

	const navItems = [
		{ href: "terms", label: t.legal.nav.terms },
		{ href: "privacy", label: t.legal.nav.privacy },
		{ href: "shipping", label: t.legal.nav.shipping },
		{ href: "refund", label: t.legal.nav.refund },
	];

	return (
		<div className="min-h-screen bg-background pt-32 pb-24">
			<div className="container max-w-7xl px-4 mx-auto">
				<div className="flex flex-col lg:flex-row gap-12">

					{/* Sidebar */}
					<aside className="lg:w-64 shrink-0">
						<div className="sticky top-32 space-y-6">
							<div>
								<h3 className="font-display font-medium text-lg mb-4 px-3 text-primary">
									{t.legal.title}
								</h3>
								<nav className="space-y-1">
									{navItems.map((item) => (
										<Link
											key={item.href}
											href={`/${locale}/${item.href}`}
											className={cn(
												"block px-3 py-2 text-sm rounded-md transition-colors",
												"text-muted-foreground hover:text-foreground hover:bg-muted/50 border-l-2 border-transparent hover:border-primary/20"
											)}
										>
											{item.label}
										</Link>
									))}
								</nav>
							</div>
						</div>
					</aside>

					{/* Content */}
					<main className="flex-1 max-w-3xl min-w-0">
						<div className="prose prose-slate dark:prose-invert max-w-none 
              prose-headings:font-display prose-headings:font-light 
              prose-h1:text-4xl prose-h2:text-2xl prose-a:text-primary 
              prose-li:marker:text-primary">
							{children}
						</div>
					</main>
				</div>
			</div>
		</div>
	);
}