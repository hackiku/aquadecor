// src/app/[locale]/(legal)/layout.tsx
"use client";

import { useTranslations } from "next-intl";
import { Footer } from "~/components/navigation/Footer";
import { Link, usePathname } from "~/i18n/navigation";
import { cn } from "~/lib/utils";

export default function LegalLayout({ children }: { children: React.ReactNode }) {
	const t = useTranslations("legal");
	const pathname = usePathname();

	const navItems = [
		{ href: "/terms", label: t("nav.terms") },
		{ href: "/privacy", label: t("nav.privacy") },
		{ href: "/shipping", label: t("nav.shipping") },
		{ href: "/refund", label: t("nav.refund") },
	] as const;

	return (
		<>
		<div className="min-h-screen bg-background pt-16 pb-24">
			<div className="container max-w-7xl px-4 mx-auto">
				<div className="flex flex-col lg:flex-row gap-12">

					{/* Sidebar Navigation */}
					<aside className="lg:w-64 shrink-0">
						<div className="sticky top-32 space-y-6">
							<div>
								<h3 className="font-display font-medium text-lg mb-4 px-3 text-primary">
									{t("title")}
								</h3>
								<nav className="space-y-1">
									{navItems.map((item) => {
										// next-intl usePathname() returns the internal key (e.g. "/terms")
										// which makes this check very clean.
										const isActive = pathname === item.href;

										return (
											<Link
												key={item.href}
												href={item.href as any}
												className={cn(
													"flex items-center px-4 py-2.5 text-sm font-display font-medium rounded-lg transition-all duration-200",
													isActive
														? "bg-primary/10 text-primary"
														: "text-muted-foreground hover:bg-muted hover:text-foreground border-transparent"
												)}
											>
												{item.label}
											</Link>
										);
									})}
								</nav>
							</div>
						</div>
					</aside>

					{/* Policy Content */}
					<main className="flex-1 max-w-3xl min-w-0">
						<article className="prose prose-slate dark:prose-invert max-w-none 
							prose-headings:font-display prose-headings:font-light 
							prose-h1:text-4xl md:prose-h1:text-5xl prose-h2:text-2xl 
							prose-p:text-lg prose-p:leading-relaxed prose-p:text-muted-foreground
							prose-li:text-lg prose-li:text-muted-foreground
							prose-strong:text-foreground prose-strong:font-medium">
							{children}
						</article>
					</main>
				</div>
			</div>
		</div>
		<Footer />
		</>
	);
}