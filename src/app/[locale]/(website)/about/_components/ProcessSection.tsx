// src/app/[locale]/(website)/about/_components/ProcessSection.tsx

"use client";

import { useTranslations } from 'next-intl';
import { Hammer, Palette, Shield, PackageCheck } from "lucide-react";
import Image from "next/image";

const PROCESS_ICONS = {
	sculpt: Hammer,
	paint: Palette,
	seal: Shield,
	ship: PackageCheck,
};

export function ProcessSection() {
	const t = useTranslations('about');

	const steps = [
		{ key: 'sculpt', icon: PROCESS_ICONS.sculpt },
		{ key: 'paint', icon: PROCESS_ICONS.paint },
		{ key: 'seal', icon: PROCESS_ICONS.seal },
		{ key: 'ship', icon: PROCESS_ICONS.ship },
	] as const;

	return (
		<section className="py-24 md:py-32 bg-accent/5">
			<div className="container px-4 max-w-7xl mx-auto">

				{/* Header */}
				<div className="text-center mb-16">
					<div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 backdrop-blur-sm rounded-full border border-primary/20 mb-4">
						<span className="text-sm text-primary font-display font-medium">
							{t('process.badge')}
						</span>
					</div>
					<h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-light mb-6">
						{t('process.title')}
					</h2>
					<p className="text-lg text-muted-foreground font-display font-light max-w-3xl mx-auto">
						{t('process.subtitle')}
					</p>
				</div>

				{/* Process Steps */}
				<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
					{steps.map((step, index) => {
						const Icon = step.icon;
						return (
							<div
								key={step.key}
								className="relative group"
							>
								{/* Connection Line (not on last item) */}
								{index < steps.length - 1 && (
									<div className="hidden lg:block absolute top-12 left-[60%] w-[80%] h-[2px] bg-gradient-to-r from-primary/30 to-transparent" />
								)}

								<div className="relative bg-card/50 backdrop-blur-sm rounded-2xl p-6 hover:bg-card/80 transition-all duration-300 hover:scale-105 border-2 border-transparent group-hover:border-primary/30">
									{/* Step Number */}
									<div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-display font-medium">
										{index + 1}
									</div>

									{/* Icon */}
									<div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
										<Icon className="h-7 w-7 text-primary" />
									</div>

									{/* Content */}
									<h3 className="text-xl font-display font-medium mb-2">
										{t(`process.steps.${step.key}.title`)}
									</h3>
									<p className="text-sm text-muted-foreground font-display font-light leading-relaxed">
										{t(`process.steps.${step.key}.description`)}
									</p>
								</div>
							</div>
						);
					})}
				</div>

				{/* Process Image */}
				<div className="relative aspect-[21/9] rounded-2xl overflow-hidden border-2 border-border">
					<Image
						src="/images/about/process-workshop.jpg" // Add: wide shot of workshop/process
						alt="Aquadecor manufacturing process"
						fill
						className="object-cover"
					/>
					<div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
					<div className="absolute bottom-8 left-8 right-8">
						<p className="text-white font-display font-light text-lg md:text-xl">
							{t('process.imageCaption')}
						</p>
					</div>
				</div>
			</div>
		</section>
	);
}