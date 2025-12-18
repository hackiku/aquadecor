// src/app/[locale]/(website)/contact/page.tsx

import { setRequestLocale, getTranslations } from "next-intl/server";
import { routing } from "~/i18n/routing";
import { generateSEOMetadata } from "~/i18n/seo/hreflang";
import type { Metadata } from "next";
import { ContactForm } from "~/components/cta/contact/ContactForm";
import { ContactInfo } from "~/components/cta/contact/ContactInfo";
import { Mail, MapPin, Clock } from "lucide-react";

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
		path: '/contact',
		title: t('meta.title'),
		description: t('meta.description'),
		type: 'website',
	});
}

// ========================================
// STATIC GENERATION
// ========================================
export function generateStaticParams() {
	return routing.locales.map((locale) => ({ locale }));
}

export default async function ContactPage({ params }: Props) {
	const { locale } = await params;

	// Enable static rendering
	setRequestLocale(locale);

	const t = await getTranslations({ locale, namespace: 'contact' });

	return (
		<main className="min-h-screen">
			{/* Hero */}
			<section className="relative py-16 md:py-24 bg-linear-to-b from-muted/50 to-transparent">
				<div className="container px-4 max-w-4xl mx-auto text-center">
					<div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 backdrop-blur-sm rounded-full border border-primary/20 mb-6">
						<Mail className="h-4 w-4 text-primary" />
						<span className="text-sm text-primary font-display font-medium">
							{t('hero.badge')}
						</span>
					</div>
					<h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-extralight tracking-tight mb-6">
						{t('hero.title')}
					</h1>
					<p className="text-lg md:text-xl text-muted-foreground font-display font-light max-w-2xl mx-auto leading-relaxed">
						{t('hero.subtitle')}
					</p>
				</div>
			</section>

			{/* Main Content */}
			<section className="pb-16 md:pb-24">
				<div className="container px-4 max-w-6xl mx-auto">
					<div className="grid lg:grid-cols-5 gap-12">

						{/* Form - Takes up more space */}
						<div className="lg:col-span-3">
							<ContactForm />
						</div>

						{/* Contact Info Sidebar */}
						<div className="lg:col-span-2 space-y-8">
							<ContactInfo />

							{/* Quick Links */}
							<div className="bg-card/50 backdrop-blur-sm rounded-2xl p-6 border">
								<h3 className="text-lg font-display font-medium mb-4">
									{t('sidebar.quickLinks.title')}
								</h3>
								<div className="space-y-3">
									<a
										href="/calculator"
										className="block text-muted-foreground hover:text-primary transition-colors font-display font-light"
									>
										{t('sidebar.quickLinks.calculator')}
									</a>
									<a
										href="/faq"
										className="block text-muted-foreground hover:text-primary transition-colors font-display font-light"
									>
										{t('sidebar.quickLinks.faq')}
									</a>
									<a
										href="/distributors"
										className="block text-muted-foreground hover:text-primary transition-colors font-display font-light"
									>
										{t('sidebar.quickLinks.distributors')}
									</a>
								</div>
							</div>

							{/* Response Time */}
							<div className="bg-lienar-to-br from-primary/5 to-primary/10 backdrop-blur-sm rounded-2xl p-6 border-2 border-primary/20">
								<div className="flex items-start gap-3">
									<Clock className="h-5 w-5 text-primary mt-0.5" />
									<div>
										<h3 className="text-lg font-display font-medium mb-2">
											{t('sidebar.responseTime.title')}
										</h3>
										<p className="text-sm text-muted-foreground font-display font-light">
											{t('sidebar.responseTime.description')}
										</p>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>
		</main>
	);
}