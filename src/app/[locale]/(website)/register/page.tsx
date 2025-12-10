// @ts-nocheck
// src/app/[locale]/(website)/setup/page.tsx

import { getTranslations } from 'next-intl/server';
import Image from "next/image";
import { WaveDivider } from "~/components/ui/water/wave-divider";
import { getPageMessages } from '~/i18n/utils';
// import { getPageMessages } from '~/lib/i18n/i18n.utils';
import Link from 'next/link'; // Use Next's Link component

// --- 1. SEO Metadata Function (Server-Side) ---
export async function generateMetadata({ params: { locale } }) {
	// Only load the 'metadata' namespace for the <head> tags
	const messages = await getPageMessages(locale, []); // 'metadata' is auto-loaded
	const t = getTranslations(messages, 'metadata');

	return {
		title: t('SetupPage.title'),
		description: t('SetupPage.description'),
	};
}
// ---------------------------------------------


export default async function SetupPage({ params: { locale } }: { params: { locale: string } }) {
	// 2. Load the 'setup' and 'common' messages
	const messages = await getPageMessages(locale, ['setup']);
	const t = getTranslations(messages, 'setup');
	const tCommon = getTranslations(messages, 'common'); // For global/common strings like button text

	// 3. Dynamically load the example data array from the translated JSON
	// The t.raw() function is safe here because it returns the raw JSON structure
	const SETUP_EXAMPLES = t.raw('SetupExamples') as {
		title: string;
		description: string;
		image: string; // The image path is NOT translated
		bestFor: string;
		imagePosition: 'left' | 'right';
	}[];

	// We re-inject the number property for display, as it was removed from the JSON for simplicity
	const numberedExamples = SETUP_EXAMPLES.map((ex, i) => ({ ...ex, number: i + 1 }));


	return (
		<main className="min-h-screen">
			{/* Hero */}
			<section className="relative pt-16 md:pt-24 pb-16 md:pb-24 bg-linear-to-b from-muted/50 to-transparent overflow-hidden">
				<div className="container px-4 max-w-5xl mx-auto">
					<div className="text-center space-y-6">
						<div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 backdrop-blur-sm rounded-full border border-primary/20">
							<span className="text-sm text-primary font-display font-medium">
								{t('guideBadge')}
							</span>
						</div>
						<h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-extralight tracking-tight">
							{t('headline')}
						</h1>
						<p className="text-lg md:text-xl text-muted-foreground font-display font-light max-w-3xl mx-auto leading-relaxed">
							{t('subHeadline')}
						</p>
					</div>
				</div>
			</section>


			{/* Video Guides (Content remains static - no t() calls needed) */}
			{/* ... keep this section as-is if the YouTube content is multilingual/universal ... */}


			{/* Important Notes */}
			<section className="py-12 md:py-16 bg-accent/5">
				<div className="container px-4 max-w-4xl mx-auto">
					<div className="bg-card/50 backdrop-blur-sm rounded-2xl p-6 md:p-8 space-y-4">
						<h2 className="text-xl md:text-2xl font-display font-light">
							{t('proTipHeadline')}
						</h2>
						<div className="space-y-3 text-muted-foreground font-display font-light leading-relaxed">
							<p>{t('proTipText1')}</p>
							<p className="text-sm">
								<strong className="text-foreground font-medium">
									{/* Use t.rich for simple markdown/bolding */}
									{t.rich('proTipText2', { strong: (chunks) => <strong className="text-foreground font-medium">{chunks}</strong> })}
								</strong>
							</p>
						</div>
					</div>
				</div>
			</section>

			{/* Setup Examples */}
			<section className="py-16 md:py-24 bg-accent/5">
				<div className="container px-4 max-w-6xl mx-auto">
					<div className="text-center mb-16">
						<h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-light mb-4">
							{t('configHeadline')}
						</h2>
						<p className="text-lg text-muted-foreground font-display font-light max-w-2xl mx-auto">
							{t('configSubHeadline')}
						</p>
					</div>

					<div className="space-y-24">
						{numberedExamples.map((example, index) => (
							<div
								key={example.number}
								className={`flex flex-col gap-8 ${example.imagePosition === "left" ? "lg:flex-row-reverse" : "lg:flex-row"
									} items-center`}
							>
								{/* Image - path is NOT translated */}
								<div className="flex-1 w-full">
									<div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-muted border-2 border-border hover:border-primary/50 transition-colors">
										<Image
											src={example.image}
											alt={`Setup example ${example.number}`}
											fill
											className="object-contain"
											sizes="(max-width: 1024px) 100vw, 50vw"
										/>
									</div>
								</div>

								{/* Content */}
								<div className="flex-1 space-y-4">
									<div className="flex items-center gap-3">
										<div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
											<span className="text-primary font-display font-medium">
												{example.number}
											</span>
										</div>
										<h3 className="text-2xl md:text-3xl font-display font-light">
											{example.title}
										</h3>
									</div>

									<p className="text-base md:text-lg text-muted-foreground font-display font-light leading-relaxed">
										{example.description}
									</p>

									<div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/5 rounded-full">
										<span className="text-xs text-primary font-display font-medium">
											{t('bestFor')} {example.bestFor}
										</span>
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* CTA */}
			<section className="py-16 md:py-24">
				<div className="container px-4 max-w-4xl mx-auto text-center">
					<div className="space-y-6">
						<h2 className="text-3xl md:text-4xl font-display font-light">
							{t('ctaHeadline')}
						</h2>
						<p className="text-lg text-muted-foreground font-display font-light max-w-2xl mx-auto">
							{t('ctaSubHeadline')}
						</p>
						<div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
							<Link
								href="/calculator"
								className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-full font-display font-medium hover:bg-primary/90 transition-all hover:scale-105"
							>
								{t('ctaButton1')}
							</Link>
							<Link
								href="/shop"
								className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-border rounded-full font-display font-medium hover:border-primary/50 hover:bg-accent/30 transition-all"
							>
								{t('ctaButton2')}
							</Link>
						</div>
					</div>
				</div>
			</section>
		</main>
	);
}