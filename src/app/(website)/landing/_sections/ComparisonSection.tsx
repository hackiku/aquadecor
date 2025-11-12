// src/app/(website)/landing/_sections/ComparisonSection.tsx

import Link from "next/link";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import { Check, X } from "lucide-react";

const STANDARD_FEATURES = [
	{
		included: true,
		title: "Entirely handmade",
		description: "These products are completely hand-made to bring nature into your fish tank. Only nature can copy us."
	},
	{
		included: true,
		title: "Easy selection",
		description: "Customers can easily choose from available variations without needing customization."
	},
	{
		included: true,
		title: "Fast production and delivery",
		description: "Standard dimensions guarantee faster order and delivery compared to custom-sized products."
	},
	{
		included: false,
		title: "Limited customization",
		description: "Customers may not find the exact size or dimensions they need among available variations."
	},
];

const CUSTOM_FEATURES = [
	{
		included: true,
		title: "Entirely handmade",
		description: "These products are completely hand-made to bring nature into your fish tank. Only nature can copy us."
	},
	{
		included: true,
		title: "Personalization",
		description: "Customers can customize dimensions and sizes according to their specific needs and preferences."
	},
	{
		included: false,
		title: "Extended production time",
		description: "Custom products may require longer lead times for production."
	},
	{
		included: true,
		title: "Unique products",
		description: "Custom-sized products are made to order, ensuring each product is unique and tailored to requirements."
	},
];

export function ComparisonSection() {
	return (
		<section className="py-16 md:py-24 bg-background">
			<div className="container px-4">
				<div className="text-center mb-12 md:mb-16">
					<h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-light tracking-normal mb-4">
						Whatever you choose, you won't regret it!
					</h2>
				</div>

				{/* Desktop: Side-by-side comparison */}
				<div className="hidden lg:grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
					<ComparisonCard
						title="Standard dimensions"
						description="Products in standard dimensions and sizes."
						features={STANDARD_FEATURES}
						ctaHref="/store"
						ctaText="Shop now"
						variant="outline"
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

				{/* Mobile: Stacked cards */}
				<div className="lg:hidden space-y-8 max-w-2xl mx-auto">
					<ComparisonCard
						title="Standard dimensions"
						description="Products in standard dimensions and sizes."
						features={STANDARD_FEATURES}
						ctaHref="/store"
						ctaText="Shop now"
						variant="outline"
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
		</section>
	);
}

interface ComparisonCardProps {
	title: string;
	description: string;
	features: typeof STANDARD_FEATURES;
	ctaHref: string;
	ctaText: string;
	variant: "default" | "outline";
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
		<Card className={`h-full ${highlighted ? "border-primary border-2" : ""}`}>
			<CardHeader>
				<CardTitle className={`font-display font-light text-2xl ${highlighted ? "text-primary" : ""}`}>
					{title}
				</CardTitle>
				<CardDescription className="font-display text-base">
					{description}
				</CardDescription>
			</CardHeader>
			<CardContent className="space-y-6">
				{features.map((feature, index) => (
					<div key={index} className="space-y-2">
						<div className="flex items-start gap-2">
							{feature.included ? (
								<Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
							) : (
								<X className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
							)}
							<p className="text-base font-display font-normal">
								{feature.title}
							</p>
						</div>
						<p className="text-sm text-muted-foreground font-display font-light ml-7">
							{feature.description}
						</p>
					</div>
				))}
			</CardContent>
			<CardFooter>
				<Button
					asChild
					variant={variant}
					size="lg"
					className="w-full rounded-full"
				>
					<Link href={ctaHref}>{ctaText}</Link>
				</Button>
			</CardFooter>
		</Card>
	);
}