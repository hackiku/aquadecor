// src/app/[locale]/(website)/setup/page.tsx

import { getTranslations } from 'next-intl/server';
import Image from "next/image";
import Link from 'next/link';

// The setup examples with their image paths (NOT translated)
const SETUP_IMAGES = [
	'/media/images/setting-up-1.webp',
	'/media/images/setting-up-2.webp',
	'/media/images/setting-up-3.webp',
	'/media/images/setting-up-4.webp',
	'/media/images/setting-up-5.webp',
	'/media/images/setting-up-6.webp',
	'/media/images/setting-up-7.webp',
	'/media/images/setting-up-8.webp',
	'/media/images/setting-up-9.webp',
	'/media/images/setting-up-10.webp',
];

// Generate metadata using translations
// FIX 1: Await the props object before using params
export async function generateMetadata(props: { params: { locale: string } }) {
	const { params } = await props;
	const { locale } = params;

	const t = await getTranslations({ locale, namespace: 'metadata' });

	return {
		title: t('setup.title'),
		description: t('setup.description'),
	};
}


export default async function SetupPage(props: { params: { locale: string } }) {
	// FIX 2: Await the props object before using params
	const { params } = await props;
	const { locale } = params;

	const t = await getTranslations({ locale, namespace: 'setup' });
	// Note: getTranslations automatically returns a string if the key is missing,
	// which prevents the app from crashing (the fallback you wanted).

	return (
		<main className="min-h-screen">
			{/* Hero */}
			<section className="relative pt-16 md:pt-24 pb-16 md:pb-24 bg-gradient-to-b from-muted/50 to-transparent overflow-hidden">
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
									{/* NOTE: We removed t.rich() for simplicity, you can re-add it if needed */}
									{t('proTipText2')}
								</strong>
							</p>
						</div>
					</div>
				</div>
			</section>

			{/* Setup Examples Grid */}
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
						{SETUP_IMAGES.map((image, index) => {
							const number = index + 1;
							const isEven = index % 2 === 0;

							// Get translations for this specific setup using dot notation
							// This relies on the 'examples.1.title' structure in your JSON
							const title = t(`examples.${number}.title`);
							const description = t(`examples.${number}.description`);
							const bestFor = t(`examples.${number}.bestFor`);

							return (
								<div
									key={number}
									className={`flex flex-col gap-8 ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'
										} items-center`}
								>
									{/* Image */}
									<div className="flex-1 w-full">
										<div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-muted border-2 border-border hover:border-primary/50 transition-colors">
											<Image
												src={image}
												alt={`Setup example ${number}`}
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
													{number}
												</span>
											</div>
											<h3 className="text-2xl md:text-3xl font-display font-light">
												{title}
											</h3>
										</div>

										<p className="text-base md:text-lg text-muted-foreground font-display font-light leading-relaxed">
											{description}
										</p>

										<div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/5 rounded-full">
											<span className="text-xs text-primary font-display font-medium">
												{t('bestFor')} {bestFor}
											</span>
										</div>
									</div>
								</div>
							);
						})}
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
							{/* FIX 3: Use the locale variable for Link components */}
							<Link
								href={`/${locale}/calculator`}
								className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-full font-display font-medium hover:bg-primary/90 transition-all hover:scale-105"
							>
								{t('ctaButton1')}
							</Link>
							<Link
								href={`/${locale}/shop`}
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