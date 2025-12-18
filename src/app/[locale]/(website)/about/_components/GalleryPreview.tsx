// src/app/[locale]/(website)/about/_components/GalleryPreview.tsx

"use client";

import { useTranslations } from 'next-intl';
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function GalleryPreview() {
	const t = useTranslations('about');

	return (
		<section className="py-24 md:py-32 bg-gradient-to-b from-muted/30 to-background">
			<div className="container px-4 max-w-7xl mx-auto">

				{/* Header */}
				<div className="text-center mb-12">
					<h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-light mb-6">
						{t('gallery.title')}
					</h2>
					<p className="text-lg text-muted-foreground font-display font-light max-w-3xl mx-auto mb-8">
						{t('gallery.subtitle')}
					</p>
					<Link
						href="/gallery"
						className="inline-flex items-center gap-2 text-primary hover:gap-3 transition-all font-display font-medium text-lg"
					>
						{t('gallery.cta')}
						<ArrowRight className="h-5 w-5" />
					</Link>
				</div>

				{/* Gallery Grid - Your dynamic component will replace this */}
				<div className="min-h-[400px] rounded-2xl border-2 border-dashed border-border/50 flex items-center justify-center bg-muted/10">
					<div className="text-center space-y-2">
						<p className="text-muted-foreground font-display font-light">
							{t('gallery.placeholder')}
						</p>
						<p className="text-xs text-muted-foreground/50 font-display">
							SocialGrid component will be rendered here
						</p>
					</div>
				</div>
			</div>
		</section>
	);
}