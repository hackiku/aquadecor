// src/app/[locale]/(website)/about/_components/FamilySection.tsx

"use client";

import { useTranslations } from 'next-intl';
import { Users, ExternalLink } from "lucide-react";
import Image from "next/image";

export function FamilySection() {
	const t = useTranslations('about');

	const companies = [
		{
			key: 'aquadecor',
			url: '/shop',
			image: '/images/about/aquadecor-showcase.jpg', // Add: aquarium setup
			isExternal: false,
		},
		{
			key: 'terradecor',
			url: 'https://terradecor.com',
			image: '/images/about/terradecor-showcase.jpg', // Add: terrarium setup
			isExternal: true,
		},
	] as const;

	return (
		<section className="py-24 md:py-32">
			<div className="container px-4 max-w-7xl mx-auto">

				{/* Header */}
				<div className="text-center mb-16">
					<div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 backdrop-blur-sm rounded-full border border-primary/20 mb-4">
						<span className="text-sm text-primary font-display font-medium">
							{t('family.badge')}
						</span>
					</div>
					<h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-light mb-6">
						{t('family.title')}
					</h2>
					<p className="text-lg text-muted-foreground font-display font-light max-w-3xl mx-auto">
						{t('family.subtitle')}
					</p>
				</div>

				{/* Companies */}
				<div className="grid md:grid-cols-2 gap-8 mb-16">
					{companies.map((company) => (
						<a
							key={company.key}
							href={company.url}
							target={company.isExternal ? "_blank" : undefined}
							rel={company.isExternal ? "noopener noreferrer" : undefined}
							className="group relative bg-card/50 backdrop-blur-sm rounded-2xl overflow-hidden hover:bg-card/80 transition-all duration-300 hover:scale-[1.02] border-2 border-transparent hover:border-primary/30"
						>
							{/* Background Image */}
							<div className="relative h-64 overflow-hidden">
								<Image
									src={company.image}
									alt={t(`family.companies.${company.key}.name`)}
									fill
									className="object-cover group-hover:scale-110 transition-transform duration-500"
								/>
								<div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

								{/* Founded Badge */}
								<div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full">
									<span className="text-xs text-white font-display">
										{t(`family.companies.${company.key}.founded`)}
									</span>
								</div>

								{/* External Link Icon */}
								{company.isExternal && (
									<div className="absolute top-4 left-4 w-8 h-8 rounded-full bg-primary/20 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
										<ExternalLink className="h-4 w-4 text-white" />
									</div>
								)}
							</div>

							{/* Content */}
							<div className="p-8 space-y-4">
								<div>
									<h3 className="text-2xl md:text-3xl font-display font-light group-hover:text-primary transition-colors mb-1">
										{t(`family.companies.${company.key}.name`)}
									</h3>
									<p className="text-sm text-primary font-display font-medium">
										{t(`family.companies.${company.key}.tagline`)}
									</p>
								</div>
								<p className="text-muted-foreground font-display font-light leading-relaxed">
									{t(`family.companies.${company.key}.description`)}
								</p>
							</div>
						</a>
					))}
				</div>

				{/* Team Section */}
				<div className="bg-gradient-to-br from-primary/5 to-primary/10 backdrop-blur-sm rounded-2xl p-8 md:p-12 border-2 border-primary/20">
					<div className="grid md:grid-cols-[auto_1fr] gap-8 items-center">
						<div className="w-20 h-20 rounded-2xl bg-primary/20 flex items-center justify-center">
							<Users className="h-10 w-10 text-primary" />
						</div>
						<div className="space-y-4">
							<h3 className="text-2xl md:text-3xl font-display font-light">
								{t('family.team.title')}
							</h3>
							<p className="text-muted-foreground font-display font-light leading-relaxed text-lg">
								{t('family.team.description')}
							</p>
							<div className="flex flex-wrap gap-3 pt-2">
								{['custom', 'consultation', 'patented'].map((badge) => (
									<div key={badge} className="px-4 py-2 bg-primary/10 rounded-full">
										<span className="text-sm font-display font-medium text-primary">
											{t(`family.team.badges.${badge}`)}
										</span>
									</div>
								))}
							</div>
						</div>
					</div>
				</div>

				{/* Trademark Notice */}
				<div className="mt-8 text-center">
					<p className="text-sm text-muted-foreground font-display font-light">
						{t('family.trademark')}
					</p>
				</div>
			</div>
		</section>
	);
}