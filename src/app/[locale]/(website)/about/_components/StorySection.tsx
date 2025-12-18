// src/app/[locale]/(website)/about/_components/StorySection.tsx

"use client";

import { useTranslations } from 'next-intl';
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Quote } from "lucide-react";

export function StorySection() {
	const t = useTranslations('about');

	return (
		<section id="story" className="py-24 md:py-32 scroll-mt-20">
			<div className="container px-4 max-w-7xl mx-auto">

				{/* Section Header */}
				<div className="text-center mb-16">
					<div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/5 rounded-full mb-4">
						<span className="text-xs text-primary font-display font-medium">
							{t('story.badge')}
						</span>
					</div>
					<h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-light mb-6">
						{t('story.title')}
					</h2>
				</div>

				<div className="grid lg:grid-cols-2 gap-16 items-start mb-24">
					{/* Content */}
					<div className="space-y-6 lg:sticky lg:top-24">
						<div className="space-y-4 text-muted-foreground font-display font-light leading-relaxed text-lg">
							<p>{t('story.paragraph1')}</p>
							<p>{t('story.paragraph2')}</p>
							<p>{t('story.paragraph3')}</p>
						</div>

						<Link
							href="/blog/aquadecor-aquarium-background-story-an-interview-with-mr-florian-kovac-the-founder-of-the-aquadecor-brand"
							className="inline-flex items-center gap-2 text-primary hover:gap-3 transition-all font-display font-medium text-lg mt-6"
						>
							{t('story.ctaInterview')}
							<ArrowRight className="h-5 w-5" />
						</Link>
					</div>

					{/* Images + Quote */}
					<div className="space-y-8">
						{/* Workshop Image */}
						<div className="relative aspect-[4/3] rounded-2xl overflow-hidden border-2 border-border">
							<Image
								src="/images/about/workshop-detail.jpg" // Add: craftsman working on background
								alt="Aquadecor workshop"
								fill
								className="object-cover"
							/>
						</div>

						{/* Founder Quote Card */}
						<div className="relative bg-gradient-to-br from-primary/5 to-primary/10 backdrop-blur-sm rounded-2xl p-8 border-2 border-primary/20">
							<Quote className="h-10 w-10 text-primary/30 mb-4" />
							<blockquote className="space-y-6">
								<p className="text-xl md:text-2xl font-display font-light italic text-foreground leading-relaxed">
									{t('story.quote.text')}
								</p>
								<footer className="flex items-center gap-4 pt-4 border-t border-primary/20">
									<div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-primary/30">
										<Image
											src="/images/about/founder-florian.jpg" // Add: founder photo
											alt="Florian Kovac"
											fill
											className="object-cover"
										/>
									</div>
									<div>
										<cite className="not-italic font-display font-medium text-foreground text-lg">
											{t('story.quote.author')}
										</cite>
										<p className="text-sm text-muted-foreground font-display font-light">
											{t('story.quote.title')}
										</p>
									</div>
								</footer>
							</blockquote>
						</div>

						{/* Process Image */}
						<div className="relative aspect-[4/3] rounded-2xl overflow-hidden border-2 border-border">
							<Image
								src="/images/about/painting-process.jpg" // Add: painting/finishing process
								alt="Hand-painting details"
								fill
								className="object-cover"
							/>
						</div>
					</div>
				</div>

				{/* Timeline/Milestones */}
				<div className="grid md:grid-cols-3 gap-8 pt-12 border-t">
					<div className="text-center space-y-3">
						<div className="text-3xl font-display font-light text-primary">2004</div>
						<h3 className="font-display font-medium">{t('story.milestones.founding.title')}</h3>
						<p className="text-sm text-muted-foreground font-display font-light">
							{t('story.milestones.founding.description')}
						</p>
					</div>
					<div className="text-center space-y-3">
						<div className="text-3xl font-display font-light text-primary">2010</div>
						<h3 className="font-display font-medium">{t('story.milestones.global.title')}</h3>
						<p className="text-sm text-muted-foreground font-display font-light">
							{t('story.milestones.global.description')}
						</p>
					</div>
					<div className="text-center space-y-3">
						<div className="text-3xl font-display font-light text-primary">Today</div>
						<h3 className="font-display font-medium">{t('story.milestones.today.title')}</h3>
						<p className="text-sm text-muted-foreground font-display font-light">
							{t('story.milestones.today.description')}
						</p>
					</div>
				</div>
			</div>
		</section>
	);
}