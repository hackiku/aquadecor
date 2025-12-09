// src/app/(website)/_components/ComparisonTable.tsx

import Link from "next/link";
import Image from "next/image";
import { Button } from "~/components/ui/button";
import { Check, X } from "lucide-react";

const STANDARD_FEATURES = [
	{ included: true, title: "Handcrafted 3D realism" },
	{ included: true, title: "Ready-made dimensions" },
	{ included: true, title: "Faster delivery (7-10 days)" },
	{ included: false, title: "Limited size options" },
];

const CUSTOM_FEATURES = [
	{ included: true, title: "Handcrafted 3D realism" },
	{ included: true, title: "Perfect fit for your tank" },
	{ included: true, title: "Accommodates overflow boxes" },
	{ included: false, title: "Longer lead time (10-14 days)" },
];

export function ComparisonTable() {
	return (
		<div className="max-w-7xl mx-auto px-4">
			{/* Desktop: Side-by-side comparison */}
			<div className="hidden lg:grid lg:grid-cols-2 gap-8">
				<ComparisonCard
					title="Standard dimensions"
					description="Ready-made sizes for immediate ordering"
					features={STANDARD_FEATURES}
					ctaHref="/store"
					ctaText="Shop now"
					variant="secondary"
					bgImage="/media/images/standard-tank.webp"
				/>
				<ComparisonCard
					title="Custom dimensions"
					description="Built exactly to your tank specifications"
					features={CUSTOM_FEATURES}
					ctaHref="/calculator"
					ctaText="Order custom"
					variant="default"
					highlighted
					bgImage="/media/images/custom-tank.webp"
				/>
			</div>

			{/* Mobile: Stacked cards */}
			<div className="lg:hidden space-y-8">
				<ComparisonCard
					title="Standard dimensions"
					description="Ready-made sizes for immediate ordering"
					features={STANDARD_FEATURES}
					ctaHref="/store"
					ctaText="Shop now"
					variant="secondary"
					bgImage="/media/images/standard-tank.webp"
				/>
				<ComparisonCard
					title="Custom dimensions"
					description="Built exactly to your tank specifications"
					features={CUSTOM_FEATURES}
					ctaHref="/calculator"
					ctaText="Order custom"
					variant="default"
					highlighted
					bgImage="/media/images/custom-tank.webp"
				/>
			</div>
		</div>
	);
}

interface ComparisonCardProps {
	title: string;
	description: string;
	features: typeof STANDARD_FEATURES;
	ctaHref: string;
	ctaText: string;
	variant: "default" | "secondary";
	highlighted?: boolean;
	bgImage?: string;
}

function ComparisonCard({
	title,
	description,
	features,
	ctaHref,
	ctaText,
	variant,
	highlighted,
	bgImage
}: ComparisonCardProps) {
	return (
		<div
			className={`
				relative rounded-2xl p-8 md:p-10 h-full flex flex-col overflow-hidden
				backdrop-blur-sm transition-all duration-300
				${highlighted
					? "border-2 border-cyan-400 shadow-xl shadow-cyan-500/20"
					: "border border-white/10"
				}
			`}
		>
			{/* Background Image Layer */}
			{bgImage && (
				<>
					<Image
						src={bgImage}
						alt=""
						fill
						className="object-cover z-0"
						sizes="(max-width: 1024px) 100vw, 50vw"
					/>
					{/* Dark overlay gradient - stronger at bottom for text readability */}
					<div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/70 to-black/50 z-0" />
				</>
			)}

			{/* Content - elevated above background */}
			<div className="relative z-10 flex flex-col h-full">
				<div className="mb-8">
					<h3 className={`font-display font-thin text-4xl mb-3 ${highlighted ? "text-cyan-300" : "text-white"}`}>
						{title}
					</h3>
					<p className="font-thin text-lg text-cyan-200/90">
						{description}
					</p>
				</div>

				<div className="space-y-4 grow mb-8">
					{features.map((feature, index) => (
						<div key={index} className="flex items-center gap-3">
							{feature.included ? (
								<div className="shrink-0 w-6 h-6 rounded-full bg-cyan-400/30 backdrop-blur-sm flex items-center justify-center">
									<Check className="h-4 w-4 text-cyan-300" />
								</div>
							) : (
								<div className="shrink-0 w-6 h-6 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
									<X className="h-4 w-4 text-white/50" />
								</div>
							)}
							<p className="text-base font-display font-thin text-white">
								{feature.title}
							</p>
						</div>
					))}
				</div>

				<Button
					asChild
					variant={variant}
					size="lg"
					className={`
						w-full rounded-full font-display
						${variant === "default"
							? "bg-cyan-400 hover:bg-cyan-300 text-cyan-950"
							: "bg-white/10 hover:bg-white/20 text-white border-white/20"
						}
					`}
				>
					<Link href={ctaHref}>{ctaText}</Link>
				</Button>
			</div>
		</div>
	);
}