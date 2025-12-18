// src/app/[locale]/(website)/support/page.tsx

import { setRequestLocale, getTranslations } from "next-intl/server";
import { routing } from "~/i18n/routing";
import { generateSEOMetadata } from "~/i18n/seo/hreflang";
import type { Metadata } from "next";
import { SupportForm } from "~/components/cta/support/SupportForm";
import { SupportResources } from "~/components/cta/support/SupportResources";
import { LifeBuoy, Book, MessageCircle, FileText } from "lucide-react";
import Link from "next/link";

type Props = {
	params: Promise<{ locale: string }>;
};

// ========================================
// SEO METADATA
// ========================================
export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { locale } = await params;
	const t = await getTranslations({ locale, namespace: 'contact' });

	return generateSEOMetadata({
		currentLocale: locale,
		path: '/support',
		title: t('support.meta.title'),
		description: t('support.meta.description'),
		type: 'website',
	});
}

// ========================================
// STATIC GENERATION
// ========================================
export function generateStaticParams() {
	return routing.locales.map((locale) => ({ locale }));
}

export default async function SupportPage({ params }: Props) {
	const { locale } = await params;

	// Enable static rendering
	setRequestLocale(locale);

	const t = await getTranslations({ locale, namespace: 'contact' });

	return (
		<main className="min-h-screen">
			{/* Hero */}
			<section className="relative pt-16 md:pt-24 pb-16 md:pb-20 bg-gradient-to-b from-muted/50 to-transparent">
				<div className="container px-4 max-w-4xl mx-auto text-center">
					<div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 backdrop-blur-sm rounded-full border border-primary/20 mb-6">
						<LifeBuoy className="h-4 w-4 text-primary" />
						<span className="text-sm text-primary font-display font-medium">
							{t('support.hero.badge')}
						</span>
					</div>
					<h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-extralight tracking-tight mb-6">
						{t('support.hero.title')}
					</h1>
					<p className="text-lg md:text-xl text-muted-foreground font-display font-light max-w-2xl mx-auto leading-relaxed">
						{t('support.hero.subtitle')}
					</p>
				</div>
			</section>

			{/* Self-Service Resources */}
			<section className="pb-12">
				<div className="container px-4 max-w-6xl mx-auto">
					<h2 className="text-2xl md:text-3xl font-display font-light mb-8 text-center">
						{t('support.resources.title')}
					</h2>
					<div className="grid md:grid-cols-3 gap-6 mb-12">
						<Link
							href="/faq"
							className="group bg-card/50 backdrop-blur-sm rounded-2xl p-6 border hover:border-primary/30 transition-all hover:scale-[1.02]"
						>
							<Book className="h-8 w-8 text-primary mb-4" />
							<h3 className="text-xl font-display font-medium mb-2 group-hover:text-primary transition-colors">
								{t('support.resources.faq.title')}
							</h3>
							<p className="text-sm text-muted-foreground font-display font-light">
								{t('support.resources.faq.description')}
							</p>
						</Link>

						<Link
							href="/setup"
							className="group bg-card/50 backdrop-blur-sm rounded-2xl p-6 border hover:border-primary/30 transition-all hover:scale-[1.02]"
						>
							<FileText className="h-8 w-8 text-primary mb-4" />
							<h3 className="text-xl font-display font-medium mb-2 group-hover:text-primary transition-colors">
								{t('support.resources.guides.title')}
							</h3>
							<p className="text-sm text-muted-foreground font-display font-light">
								{t('support.resources.guides.description')}
							</p>
						</Link>

						<Link
							href="/contact"
							className="group bg-card/50 backdrop-blur-sm rounded-2xl p-6 border hover:border-primary/30 transition-all hover:scale-[1.02]"
						>
							<MessageCircle className="h-8 w-8 text-primary mb-4" />
							<h3 className="text-xl font-display font-medium mb-2 group-hover:text-primary transition-colors">
								{t('support.resources.contact.title')}
							</h3>
							<p className="text-sm text-muted-foreground font-display font-light">
								{t('support.resources.contact.description')}
							</p>
						</Link>
					</div>
				</div>
			</section>

			{/* Support Form */}
			<section className="pb-16 md:pb-24">
				<div className="container px-4 max-w-4xl mx-auto">
					<div className="text-center mb-8">
						<h2 className="text-2xl md:text-3xl font-display font-light mb-4">
							{t('support.form.heading')}
						</h2>
						<p className="text-muted-foreground font-display font-light">
							{t('support.form.subheading')}
						</p>
					</div>
					<SupportForm />
					<SupportResources />
				</div>
			</section>
		</main>
	);
}