// src/app/(website)/landing/_components/ComparisonTable.tsx

import Link from "next/link";
import { Button } from "~/components/ui/button";
import { Check, X } from "lucide-react";

const STANDARD_FEATURES = [
	{
		included: true,
		title: "Entirely handmade",
		description: "Completely hand-made to bring nature into your fish tank. Only nature can copy us."
	},
	{
		included: true,
		title: "Easy selection",
		description: "Choose from available variations without needing customization."
	},
	{
		included: true,
		title: "Fast production and delivery",
		description: "Standard dimensions guarantee faster order processing and delivery."
	},
	{
		included: false,
		title: "Limited customization",
		description: "May not find exact size or dimensions among available variations."
	},
];

const CUSTOM_FEATURES = [
	{
		included: true,
		title: "Entirely handmade",
		description: "Completely hand-made to bring nature into your fish tank. Only nature can copy us."
	},
	{
		included: true,
		title: "Personalization",
		description: "Customize dimensions and sizes according to your specific needs and preferences."
	},
	{
		included: false,
		title: "Extended production time",
		description: "Custom products may require longer lead times for production."
	},
	{
		included: true,
		title: "Unique products",
		description: "Made to order, ensuring each product is unique and tailored to requirements."
	},
];

export function ComparisonTable() {
	return (
		<div className="max-w-7xl mx-auto px-4">
			{/* Desktop: Side-by-side comparison */}
			<div className="hidden lg:grid lg:grid-cols-2 gap-8">
				<ComparisonCard
					title="Standard dimensions"
					description="Products in standard dimensions and sizes."
					features={STANDARD_FEATURES}
					ctaHref="/store"
					ctaText="Shop now"
					variant="secondary"
				/>
				<ComparisonCard
					title="Custom dimensions"
					description="Customize dimensions and sizes based on your needs."
					features={CUSTOM_FEATURES}
					ctaHref="/calculator"
					ctaText="Order custom"
					variant="default"
					highlighted
				/>
			</div>

			{/* Mobile: Stacked cards */}
			<div className="lg:hidden space-y-8">
				<ComparisonCard
					title="Standard dimensions"
					description="Products in standard dimensions and sizes."
					features={STANDARD_FEATURES}
					ctaHref="/store"
					ctaText="Shop now"
					variant="secondary"
				/>
				<ComparisonCard
					title="Custom dimensions"
					description="Customize dimensions and sizes based on your needs."
					features={CUSTOM_FEATURES}
					ctaHref="/store/configurator"
					ctaText="Order custom"
					variant="default"
					highlighted
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
}

function ComparisonCard({
	title,
	description,
	features,
	ctaHref,
	ctaText,
	variant,
	highlighted
}: ComparisonCardProps) {
	return (
		<div
			className={`
				rounded-2xl p-8 md:p-10 h-full flex flex-col
				backdrop-blur-sm transition-all duration-300
				${highlighted
					? "bg-white/10 border-2 border-cyan-400 shadow-xl shadow-cyan-500/20"
					: "bg-white/5 border border-white/10"
				}
			`}
		>
			<div className="mb-8">
				<h3 className={`font-display font-light text-3xl mb-3 ${highlighted ? "text-cyan-300" : "text-white"}`}>
					{title}
				</h3>
				<p className="font-display text-base text-cyan-100/70">
					{description}
				</p>
			</div>

			<div className="space-y-6 flex-grow mb-8">
				{features.map((feature, index) => (
					<div key={index} className="space-y-2">
						<div className="flex items-start gap-3">
							{feature.included ? (
								<div className="shrink-0 mt-0.5 w-6 h-6 rounded-full bg-cyan-400/20 flex items-center justify-center">
									<Check className="h-4 w-4 text-cyan-400" />
								</div>
							) : (
								<div className="shrink-0 mt-0.5 w-6 h-6 rounded-full bg-white/5 flex items-center justify-center">
									<X className="h-4 w-4 text-white/40" />
								</div>
							)}
							<p className="text-base font-display font-normal text-white">
								{feature.title}
							</p>
						</div>
						<p className="text-sm text-cyan-100/60 font-display font-light ml-9">
							{feature.description}
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
	);
}