// src/app/[locale]/(website)/about/_components/DistributorsPreview.tsx

"use client";

import { useTranslations } from 'next-intl';
import Link from "next/link";
import { DistributorsGrid } from "../../distributors/DistributorsGrid";
import { WaveDivider } from "~/components/ui/water/wave-divider";

export function DistributorsPreview() {
	const t = useTranslations('about');

	return (
		<section className="relative py-24 md:py-32 bg-linear-to-b from-accent/5 to-background">
			{/* Top Wave */}
			<WaveDivider position="top" color="currentColor" className="text-background" />

			<div className="container px-4 max-w-7xl mx-auto">
				<div className="flex flex-col md:flex-row items-end justify-between mb-12">
					<div>
						<h2 className="text-3xl md:text-4xl font-display font-light mb-4">
							{t('distributors.title')}
						</h2>
						<p className="text-lg text-muted-foreground font-display font-light">
							{t('distributors.subtitle')}
						</p>
					</div>
					<Link
						href="/distributors"
						className="text-primary hover:underline font-display font-medium inline-flex items-center gap-2 mt-4 md:mt-0"
					>
						{t('distributors.cta')}
						<span>→</span>
					</Link>
				</div>

				{/* Show first 6 distributors */}
				<DistributorsGrid limit={6} className="lg:grid-cols-3" />
			</div>
		</section>
	);
}