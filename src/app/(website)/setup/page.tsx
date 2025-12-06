// src/app/(website)/setup/page.tsx

import Image from "next/image";
import { WaveDivider } from "~/components/ui/water/wave-divider";

const SETUP_EXAMPLES = [
	{
		number: 1,
		title: "Classic Single Wall Setup",
		description: "The most popular configuration - covers the back glass with one equipment chamber. Perfect for standard aquariums against a wall. Chamber (8×8cm or 10×10cm) can be positioned in either corner for your heater and intake pipe. Water flows naturally through the gap between glass and background, protected by transparent mesh.",
		image: "/media/images/setting-up-1.webp",
		bestFor: "Standard aquariums, beginners",
		imagePosition: "right" as const,
	},
	{
		number: 2,
		title: "Natural Crack Design",
		description: "Elevate your setup with naturally integrated equipment hiding. Water enters through realistic cracks in the rockwork instead of visible gaps. Your heater and intake stay together in the chamber while the background maintains its organic appearance throughout.",
		image: "/media/images/setting-up-2.webp",
		bestFor: "Advanced aquascaping",
		imagePosition: "left" as const,
	},
	{
		number: 3,
		title: "L-Shape Corner Mount",
		description: "Maximize your aquarium's presence by covering the back wall plus one side. Ideal for tanks positioned next to walls or in corners. The single corner chamber keeps all equipment hidden while water flows through natural-looking fissures in the background.",
		image: "/media/images/setting-up-3.webp",
		bestFor: "Corner placements, side-wall tanks",
		imagePosition: "right" as const,
	},
	{
		number: 4,
		title: "Full Surround Immersion",
		description: "Transform your aquarium into a viewing portal. Covers back and both sides, creating a complete underwater world visible only through the front glass. Dual corner chambers handle all equipment with water entering through convincingly natural cracks.",
		image: "/media/images/setting-up-4.webp",
		bestFor: "Room dividers, centerpiece tanks",
		imagePosition: "left" as const,
	},
	{
		number: 5,
		title: "Island Divider Setup",
		description: "Place the background in the center as a natural divider with chambers or filters on either side. Perfect for double-sided viewing or using as a filter cover. Water flows through organic-looking openings while equipment stays completely concealed.",
		image: "/media/images/setting-up-5.webp",
		bestFor: "Between-room installations",
		imagePosition: "right" as const,
	},
	{
		number: 6,
		title: "Depth Illusion Design",
		description: "Create dramatic depth by partially covering a black/navy foiled back glass. The background appears to float in space while chambers hide in corners. Water enters through the gap covered by transparent mesh, maximizing the 3D effect.",
		image: "/media/images/setting-up-6.webp",
		bestFor: "Maximizing depth perception",
		imagePosition: "left" as const,
	},
	{
		number: 7,
		title: "Multi-Wall Depth Design",
		description: "Extend the depth illusion to one or both sides with foiled glass. Corner chambers remain hidden while water flows through natural cracks. Creates an incredibly immersive viewing experience, especially effective in wall-mounted installations.",
		image: "/media/images/setting-up-7.webp",
		bestFor: "Wall-mounted, built-in tanks",
		imagePosition: "right" as const,
	},
	{
		number: 8,
		title: "Internal Filter Integration",
		description: "Hide any internal filter regardless of location. Custom cracks and entrances match your specific filter type. For overflow systems, the background sits lower to allow top water flow. Your filter disappears while remaining fully functional.",
		image: "/media/images/setting-up-8.webp",
		bestFor: "Internal filters, overflow systems",
		imagePosition: "left" as const,
	},
	{
		number: 9,
		title: "Stream Pump Cover",
		description: "Classic back wall coverage with bonus: hide your stream pump behind a detachable rock. Full access maintained - remove, relocate, or redirect water flow anytime. Equipment chamber handles heater and intake as usual.",
		image: "/media/images/setting-up-9.webp",
		bestFor: "High-flow systems, wave makers",
		imagePosition: "right" as const,
	},
	{
		number: 10,
		title: "Slim Bio-Filter Design",
		description: "Flexible one-piece background with biological filtration space behind it. Fill the gap with bio-balls, sponge, or Siporax. Drill custom holes for water flow (DIY or we'll do it), add a powerhead in the corner, and you've got a hidden bio-filter that looks like solid rock.",
		image: "/media/images/setting-up-10.webp",
		bestFor: "Biological filtration, cichlid tanks",
		imagePosition: "left" as const,
	},
];

export default function SetupPage() {
	return (
		<main className="min-h-screen">
			{/* Hero */}
			<section className="relative pt-16 md:pt-24 pb-16 md:pb-24 bg-linear-to-b from-muted/50 to-transparent overflow-hidden">
				<div className="container px-4 max-w-5xl mx-auto">
					<div className="text-center space-y-6">
						<div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 backdrop-blur-sm rounded-full border border-primary/20">
							<span className="text-sm text-primary font-display font-medium">
								Installation Guide
							</span>
						</div>
						<h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-extralight tracking-tight">
							Setting Up Your 3D Background
						</h1>
						<p className="text-lg md:text-xl text-muted-foreground font-display font-light max-w-3xl mx-auto leading-relaxed">
							Professional installation guides for every aquarium configuration. From simple back walls to complex multi-chamber systems.
						</p>
					</div>
				</div>
			</section>


			{/* Video Guides */}
			<section className="">
				<div className="container px-4 max-w-6xl mx-auto">
					<div className="hidden text-center mb-12">
						<h2 className="text-3xl md:text-4xl font-display font-light mb-4">
							Watch the Process
						</h2>
						<p className="text-lg text-muted-foreground font-display font-light">
							Step-by-step installation videos
						</p>
					</div>

					<div className="grid md:grid-cols-2 gap-8">
						<div className="relative aspect-video rounded-2xl overflow-hidden bg-muted">
							<iframe
								width="100%"
								height="100%"
								src="https://www.youtube.com/embed/4bMwWn0oOUM"
								title="Installation guide part 1"
								allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
								allowFullScreen
								className="absolute inset-0"
							/>
						</div>
						<div className="relative aspect-video rounded-2xl overflow-hidden bg-muted">
							<iframe
								width="100%"
								height="100%"
								src="https://www.youtube.com/embed/lDQ1jNlrkPo"
								title="Installation guide part 2"
								allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
								allowFullScreen
								className="absolute inset-0"
							/>
						</div>
					</div>
				</div>
			</section>


			{/* Important Notes */}
			<section className="py-12 md:py-16 bg-accent/5">
				<div className="container px-4 max-w-4xl mx-auto">
					<div className="bg-card/50 backdrop-blur-sm rounded-2xl p-6 md:p-8 space-y-4">
						<h2 className="text-xl md:text-2xl font-display font-light">
							Before You Start
						</h2>
						<div className="space-y-3 text-muted-foreground font-display font-light leading-relaxed">
							<p>
								Aquadecor backgrounds are made from lightweight material that won't stress your aquarium glass. However, water pressure means the background must be firmly attached using aquarium-safe silicone.
							</p>
							<p className="text-sm">
								<strong className="text-foreground font-medium">Pro tip:</strong> Always check your silicone's expiration date before starting installation.
							</p>
						</div>
					</div>
				</div>
			</section>

			{/* Setup Examples */}
			<section className="py-16 md:py-24 bg-accent/5">
				<div className="container px-4 max-w-6xl mx-auto">
					<div className="text-center mb-16">
						<h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-light mb-4">
							10 Setup Configurations
						</h2>
						<p className="text-lg text-muted-foreground font-display font-light max-w-2xl mx-auto">
							Choose the perfect configuration for your aquarium placement and equipment
						</p>
					</div>

					<div className="space-y-24">
						{SETUP_EXAMPLES.map((example, index) => (
							<div
								key={example.number}
								className={`flex flex-col gap-8 ${example.imagePosition === "left" ? "lg:flex-row-reverse" : "lg:flex-row"
									} items-center`}
							>
								{/* Image */}
								<div className="flex-1 w-full">
									<div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-muted border-2 border-border hover:border-primary/50 transition-colors">
										<Image
											src={example.image}
											alt={`Setup example ${example.number}`}
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
												{example.number}
											</span>
										</div>
										<h3 className="text-2xl md:text-3xl font-display font-light">
											{example.title}
										</h3>
									</div>

									<p className="text-base md:text-lg text-muted-foreground font-display font-light leading-relaxed">
										{example.description}
									</p>

									<div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/5 rounded-full">
										<span className="text-xs text-primary font-display font-medium">
											Best for: {example.bestFor}
										</span>
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* CTA */}
			<section className="py-16 md:py-24">
				<div className="container px-4 max-w-4xl mx-auto text-center">
					<div className="space-y-6">
						<h2 className="text-3xl md:text-4xl font-display font-light">
							Need Help Choosing?
						</h2>
						<p className="text-lg text-muted-foreground font-display font-light max-w-2xl mx-auto">
							Not sure which setup is right for your aquarium? Our team can help you design the perfect configuration.
						</p>
						<div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
							<a
								href="/calculator"
								className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-full font-display font-medium hover:bg-primary/90 transition-all hover:scale-105"
							>
								Configure Your Background
							</a>
							<a
								href="/shop"
								className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-border rounded-full font-display font-medium hover:border-primary/50 hover:bg-accent/30 transition-all"
							>
								Browse Products
							</a>
						</div>
					</div>
				</div>
			</section>
		</main>
	);
}