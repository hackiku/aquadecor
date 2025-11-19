// src/app/(website)/design/page.tsx
"use client";

import { useState } from "react";
import { ShopButton } from "~/components/cta/ShopButton";
import { ReviewCard } from "~/components/proof/ReviewCard";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Star, Check, ArrowRight } from "lucide-react";

export default function DesignSystemPage() {
	const [isHovered, setIsHovered] = useState(false);

	return (
		<main className="min-h-screen bg-background">
			{/* Header */}
			<section className="py-12 border-b bg-gradient-to-b from-muted/50 to-transparent">
				<div className="container px-4 max-w-7xl">
					<h1 className="text-4xl md:text-5xl font-display font-extralight tracking-tight mb-4">
						Design System
					</h1>
					<p className="text-lg text-muted-foreground font-display font-light max-w-2xl">
						Living reference for AquaDecor's visual language. Captures brand personality: premium craftsmanship meets underwater elegance.
					</p>
				</div>
			</section>

			{/* Color System */}
			<section className="py-16 border-b">
				<div className="container px-4 max-w-7xl space-y-8">
					<div>
						<h2 className="text-3xl font-display font-light mb-2">Colors</h2>
						<p className="text-muted-foreground font-display font-light">
							Water-inspired palette. Primary blue (#3781C2) anchors the brand—deep, trustworthy, aquatic.
						</p>
					</div>

					<div className="grid md:grid-cols-4 gap-6">
						{/* Primary - Brand Blue */}
						<Card className="p-6 space-y-3">
							<div className="h-24 rounded-xl bg-[#3781C2] shadow-lg" />
							<div className="space-y-1">
								<p className="font-display font-medium">Primary Blue</p>
								<p className="text-sm text-muted-foreground font-mono">#3781C2</p>
								<p className="text-xs text-muted-foreground font-display font-light">
									CTAs, links, trust signals
								</p>
							</div>
						</Card>

						{/* Accent - Light Blue */}
						<Card className="p-6 space-y-3">
							<div className="h-24 rounded-xl bg-[#87CEEB] shadow-lg" />
							<div className="space-y-1">
								<p className="font-display font-medium">Accent Light</p>
								<p className="text-sm text-muted-foreground font-mono">#87CEEB</p>
								<p className="text-xs text-muted-foreground font-display font-light">
									Hover states, highlights
								</p>
							</div>
						</Card>

						{/* Dark Frame */}
						<Card className="p-6 space-y-3">
							<div className="h-24 rounded-xl bg-[#2a2a2a] shadow-lg" />
							<div className="space-y-1">
								<p className="font-display font-medium">Frame Dark</p>
								<p className="text-sm text-muted-foreground font-mono">#2a2a2a</p>
								<p className="text-xs text-muted-foreground font-display font-light">
									Tank frames, borders
								</p>
							</div>
						</Card>

						{/* Substrate */}
						<Card className="p-6 space-y-3">
							<div className="h-24 rounded-xl bg-[#8B7355] shadow-lg" />
							<div className="space-y-1">
								<p className="font-display font-medium">Substrate Brown</p>
								<p className="text-sm text-muted-foreground font-mono">#8B7355</p>
								<p className="text-xs text-muted-foreground font-display font-light">
									Natural, earthy accents
								</p>
							</div>
						</Card>
					</div>
				</div>
			</section>

			{/* Typography */}
			<section className="py-16 border-b">
				<div className="container px-4 max-w-7xl space-y-8">
					<div>
						<h2 className="text-3xl font-display font-light mb-2">Typography</h2>
						<p className="text-muted-foreground font-display font-light">
							font-display for all text. Light weights (200-300) for elegance, medium (500) for emphasis.
						</p>
					</div>

					<div className="space-y-6">
						<div className="space-y-2">
							<h1 className="text-5xl font-display font-extralight tracking-tight">
								Extralight (200) — Hero Headlines
							</h1>
							<code className="text-sm text-muted-foreground">font-display font-extralight</code>
						</div>

						<div className="space-y-2">
							<h2 className="text-3xl font-display font-light">
								Light (300) — Section Titles
							</h2>
							<code className="text-sm text-muted-foreground">font-display font-light</code>
						</div>

						<div className="space-y-2">
							<p className="text-lg font-display font-light text-muted-foreground">
								Light (300) — Body Copy, Descriptions
							</p>
							<code className="text-sm text-muted-foreground">font-display font-light text-muted-foreground</code>
						</div>

						<div className="space-y-2">
							<p className="text-base font-display font-medium">
								Medium (500) — Emphasis, Labels
							</p>
							<code className="text-sm text-muted-foreground">font-display font-medium</code>
						</div>
					</div>
				</div>
			</section>

			{/* Gradients & Effects */}
			<section className="py-16 border-b">
				<div className="container px-4 max-w-7xl space-y-8">
					<div>
						<h2 className="text-3xl font-display font-light mb-2">Gradients & Effects</h2>
						<p className="text-muted-foreground font-display font-light">
							Subtle depth layers. Never flat—always hints of dimension like water refracting light.
						</p>
					</div>

					<div className="grid md:grid-cols-2 gap-6">
						{/* Glass Card */}
						<Card className="p-8 bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm border-2">
							<h3 className="text-xl font-display font-light mb-3">Glassy Card</h3>
							<p className="text-sm text-muted-foreground font-display font-light mb-4">
								Semi-transparent with backdrop blur. Like looking through aquarium glass.
							</p>
							<code className="text-xs bg-muted/50 px-3 py-1 rounded">
								bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm
							</code>
						</Card>

						{/* Muted Section */}
						<div className="p-8 rounded-xl bg-gradient-to-b from-muted/50 to-transparent border">
							<h3 className="text-xl font-display font-light mb-3">Muted Section</h3>
							<p className="text-sm text-muted-foreground font-display font-light mb-4">
								Soft gradient backgrounds for hero sections and dividers.
							</p>
							<code className="text-xs bg-background px-3 py-1 rounded">
								bg-gradient-to-b from-muted/50 to-transparent
							</code>
						</div>

						{/* Primary Accent */}
						<div className="p-8 rounded-xl bg-gradient-to-br from-primary/5 to-primary/10 border-2 border-primary/20">
							<h3 className="text-xl font-display font-light mb-3 text-primary">Primary Accent</h3>
							<p className="text-sm text-muted-foreground font-display font-light mb-4">
								For callouts, benefits, trust signals. Reinforces brand color.
							</p>
							<code className="text-xs bg-background px-3 py-1 rounded">
								bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20
							</code>
						</div>

						{/* Scarcity Orange */}
						<div className="p-8 rounded-xl bg-orange-500/10 border border-orange-500/20">
							<h3 className="text-xl font-display font-light mb-3 text-orange-600">Urgency Orange</h3>
							<p className="text-sm text-muted-foreground font-display font-light mb-4">
								Limited slots, low stock. Creates FOMO without being obnoxious.
							</p>
							<code className="text-xs bg-background px-3 py-1 rounded">
								bg-orange-500/10 border-orange-500/20
							</code>
						</div>
					</div>
				</div>
			</section>

			{/* Buttons & CTAs */}
			<section className="py-16 border-b">
				<div className="container px-4 max-w-7xl space-y-8">
					<div>
						<h2 className="text-3xl font-display font-light mb-2">Buttons & CTAs</h2>
						<p className="text-muted-foreground font-display font-light">
							Rounded corners (rounded-full or rounded-xl). Hover states always include subtle transforms.
						</p>
					</div>

					<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
						{/* Aqua Shop Button */}
						<div className="space-y-3">
							<ShopButton />
							<p className="text-sm text-muted-foreground font-display font-light">
								Signature water-fill effect. Over-the-top but memorable brand signal.
							</p>
						</div>

						{/* Primary Solid */}
						<div className="space-y-3">
							<Button
								className="w-full bg-primary hover:bg-primary/90 text-white rounded-full"
								size="lg"
							>
								Primary Action
							</Button>
							<p className="text-sm text-muted-foreground font-display font-light">
								Solid primary for main CTAs. Always rounded-full.
							</p>
						</div>

						{/* Outline */}
						<div className="space-y-3">
							<Button
								variant="outline"
								className="w-full rounded-full"
								size="lg"
							>
								Secondary Action
							</Button>
							<p className="text-sm text-muted-foreground font-display font-light">
								Outline for less emphasis. Still rounded-full.
							</p>
						</div>

						{/* Link with Arrow */}
						<div className="space-y-3">
							<button className="group flex items-center gap-2 text-primary hover:text-primary/80 font-display font-medium transition-colors">
								<span>Learn More</span>
								<ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
							</button>
							<p className="text-sm text-muted-foreground font-display font-light">
								Text links with animated arrow. Lightweight hierarchy.
							</p>
						</div>

						{/* Icon Button */}
						<div className="space-y-3">
							<button className="p-3 rounded-xl border-2 hover:border-primary/50 hover:shadow-lg transition-all">
								<Check className="h-5 w-5 text-primary" />
							</button>
							<p className="text-sm text-muted-foreground font-display font-light">
								Icon buttons. Hover expands border and adds shadow.
							</p>
						</div>

						{/* Badge */}
						<div className="space-y-3">
							<Badge className="bg-primary/10 text-primary border-primary/20">
								✓ Verified Purchase
							</Badge>
							<p className="text-sm text-muted-foreground font-display font-light">
								Trust badges. Subtle background, clear text.
							</p>
						</div>
					</div>
				</div>
			</section>

			{/* Cards & Containers */}
			<section className="py-16 border-b">
				<div className="container px-4 max-w-7xl space-y-8">
					<div>
						<h2 className="text-3xl font-display font-light mb-2">Cards & Containers</h2>
						<p className="text-muted-foreground font-display font-light">
							Always border-2 on hover. Scale transforms are subtle (1.02). Shadow-2xl for depth.
						</p>
					</div>

					<div className="grid md:grid-cols-2 gap-6">
						{/* Product Card Pattern */}
						<button
							onMouseEnter={() => setIsHovered(true)}
							onMouseLeave={() => setIsHovered(false)}
							className={`relative overflow-hidden rounded-2xl border-2 transition-all duration-300 text-left ${isHovered
									? "border-primary bg-primary/5 scale-[1.02] shadow-2xl"
									: "border-border hover:border-primary/50 hover:shadow-lg"
								}`}
						>
							{/* Image placeholder */}
							<div className="relative h-48 bg-gradient-to-br from-primary/20 to-primary/5">
								<div className="absolute inset-0 flex items-center justify-center text-muted-foreground font-display font-light">
									Product Image
								</div>
								{isHovered && (
									<div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center">
										<Check className="h-4 w-4" />
									</div>
								)}
								<div className="absolute bottom-3 left-3 px-3 py-1.5 bg-black/70 backdrop-blur-sm rounded-lg">
									<p className="text-xs text-white font-display font-light">From €250/m²</p>
								</div>
							</div>

							<div className="p-5 space-y-2">
								<h3 className={`text-lg font-display font-medium transition-colors ${isHovered ? "text-primary" : ""
									}`}>
									Product Card Pattern
								</h3>
								<p className="text-sm text-muted-foreground font-display font-light">
									Hover reveals checkmark, scales card, adds shadow. Price tag always visible.
								</p>
							</div>
						</button>

						{/* Review Card Example */}
						<ReviewCard
							review={{
								id: "1",
								rating: 5,
								title: "Absolutely stunning craftsmanship",
								content: "The attention to detail is incredible. Every crevice and texture looks like real rock. My cichlids love hiding in the caves.",
								authorName: "Marcus Schmidt",
								authorLocation: "Berlin, Germany",
								verifiedPurchase: true,
								source: "Google Reviews",
								sourceUrl: "https://google.com/reviews",
							}}
						/>
					</div>
				</div>
			</section>

			{/* Interactive Elements */}
			<section className="py-16 border-b">
				<div className="container px-4 max-w-7xl space-y-8">
					<div>
						<h2 className="text-3xl font-display font-light mb-2">Interactive Patterns</h2>
						<p className="text-muted-foreground font-display font-light">
							Hover states, animations, micro-interactions. Everything feels responsive.
						</p>
					</div>

					<div className="grid md:grid-cols-3 gap-6">
						{/* Star Rating */}
						<Card className="p-6 space-y-3">
							<div className="flex items-center gap-1">
								{Array.from({ length: 5 }).map((_, i) => (
									<Star
										key={i}
										className={`h-5 w-5 transition-colors ${i < 5
												? "fill-primary text-primary"
												: "fill-muted-foreground/20 text-muted-foreground/20"
											}`}
									/>
								))}
							</div>
							<p className="text-sm text-muted-foreground font-display font-light">
								5-star rating. Filled stars in primary color.
							</p>
						</Card>

						{/* Live Indicator */}
						<Card className="p-6 space-y-3">
							<div className="flex items-center gap-2">
								<span className="relative flex h-2 w-2">
									<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
									<span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
								</span>
								<span className="text-sm text-muted-foreground font-display font-light">
									7 people viewing
								</span>
							</div>
							<p className="text-sm text-muted-foreground font-display font-light">
								Animated pulse. Creates urgency without being pushy.
							</p>
						</Card>

						{/* Progress Bar */}
						<Card className="p-6 space-y-3">
							<div className="space-y-2">
								<div className="flex justify-between text-sm">
									<span className="text-muted-foreground font-display font-light">Progress</span>
									<span className="text-primary font-display font-medium">75%</span>
								</div>
								<div className="h-2 bg-muted rounded-full overflow-hidden">
									<div className="h-full bg-primary transition-all duration-500" style={{ width: "75%" }} />
								</div>
							</div>
							<p className="text-sm text-muted-foreground font-display font-light">
								Smooth transitions. Used in calculator for config progress.
							</p>
						</Card>
					</div>
				</div>
			</section>

			{/* Spacing & Layout */}
			<section className="py-16 border-b">
				<div className="container px-4 max-w-7xl space-y-8">
					<div>
						<h2 className="text-3xl font-display font-light mb-2">Spacing & Layout</h2>
						<p className="text-muted-foreground font-display font-light">
							Generous breathing room. Sections use py-12 or py-16. Cards have p-6 or p-8.
						</p>
					</div>

					<div className="space-y-6">
						<div className="p-6 border rounded-xl">
							<code className="text-sm">py-12</code>
							<p className="text-sm text-muted-foreground font-display font-light mt-2">
								Standard section vertical spacing (48px)
							</p>
						</div>

						<div className="p-8 border rounded-xl">
							<code className="text-sm">py-16</code>
							<p className="text-sm text-muted-foreground font-display font-light mt-2">
								Generous section spacing for important areas (64px)
							</p>
						</div>

						<div className="space-y-3 p-6 border rounded-xl">
							<code className="text-sm">space-y-6</code>
							<p className="text-sm text-muted-foreground font-display font-light">
								Standard stack spacing between elements (24px)
							</p>
						</div>
					</div>
				</div>
			</section>

			{/* Copy Patterns */}
			<section className="py-16">
				<div className="container px-4 max-w-7xl space-y-8">
					<div>
						<h2 className="text-3xl font-display font-light mb-2">Copywriting Patterns</h2>
						<p className="text-muted-foreground font-display font-light">
              Write directly in components. Specific &gt; generic. Benefits &gt; features.
						</p>
					</div>

					<div className="grid md:grid-cols-2 gap-6">
						{/* Before/After Example */}
						<Card className="p-6 space-y-4 border-red-500/20 bg-red-500/5">
							<Badge className="bg-red-500/10 text-red-600 border-red-500/20">❌ Generic</Badge>
							<h3 className="text-xl font-display font-light">
								High-Quality Aquarium Backgrounds
							</h3>
							<p className="text-sm text-muted-foreground font-display font-light">
								We offer premium products with excellent craftsmanship and attention to detail.
							</p>
							<p className="text-xs text-red-600/80 font-display font-light">
								Too vague. No differentiation. Could be any company.
							</p>
						</Card>

						<Card className="p-6 space-y-4 border-primary/20 bg-primary/5">
							<Badge className="bg-primary/10 text-primary border-primary/20">✓ Specific</Badge>
							<h3 className="text-xl font-display font-light">
								Hand-Painted 3D Backgrounds That Feel Like Real Rock
							</h3>
							<p className="text-sm text-muted-foreground font-display font-light">
								Every background is custom-made to your exact tank dimensions. Styrofoam core stays lightweight while the textured surface mimics natural stone perfectly.
							</p>
							<p className="text-xs text-primary/80 font-display font-light">
								Concrete benefits. Addresses objections (weight). Sensory language.
							</p>
						</Card>
					</div>

					{/* Writing Guidelines */}
					<div className="p-8 bg-accent/5 rounded-xl border space-y-4">
						<h3 className="text-xl font-display font-medium">Quick Copy Rules</h3>
						<ul className="space-y-2 text-sm text-muted-foreground font-display font-light">
							<li className="flex items-start gap-2">
								<Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
								<span>Lead with benefits, not features: "Jump the production queue" not "Priority processing"</span>
							</li>
							<li className="flex items-start gap-2">
								<Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
								<span>Be specific: "10-12 day production" not "Fast turnaround"</span>
							</li>
							<li className="flex items-start gap-2">
								<Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
								<span>Address objections: "Lightweight Styrofoam core" (weight concern)</span>
							</li>
							<li className="flex items-start gap-2">
								<Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
								<span>Use sensory language: "Feels just like a rock" vs "High quality material"</span>
							</li>
							<li className="flex items-start gap-2">
								<Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
								<span>Create urgency subtly: "4 slots left this month" not "LIMITED TIME OFFER!!!"</span>
							</li>
						</ul>
					</div>
				</div>
			</section>
		</main>
	);
}