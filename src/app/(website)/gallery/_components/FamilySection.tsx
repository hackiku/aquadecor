// src/app/about/_components/FamilySection.tsx

import { Users, Building2 } from "lucide-react";

const COMPANIES = [
	{
		name: "AquaDecor",
		tagline: "Aquarium Specialists",
		description: "Over 70 models of custom-made aquarium backgrounds and decorations. From Malawi rock formations to Amazonian root systems, every piece is unique and inspired by natural habitats.",
		founded: "2004",
	},
	{
		name: "TerraDecor",
		tagline: "Terrarium & Interior Design",
		description: "Founded shortly after AquaDecor's success, TerraDecor brings the same meticulous craftsmanship to terrarium interiors and architectural decoration projects.",
		founded: "2005",
	},
];

export function FamilySection() {
	return (
		<section className="py-16 md:py-24">
			<div className="container px-4 max-w-6xl mx-auto">
				{/* Header */}
				<div className="text-center mb-12 md:mb-16">
					<div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 backdrop-blur-sm rounded-full border border-primary/20 mb-6">
						<span className="text-sm text-primary font-display font-medium">
							The DecorGroup
						</span>
					</div>
					<h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-light mb-4">
						Two Companies. One Vision.
					</h2>
					<p className="text-lg text-muted-foreground font-display font-light max-w-3xl mx-auto">
						DecorGroup consists of AquaDecor and TerraDecor, both dedicated to bringing nature into your space with unmatched craftsmanship.
					</p>
				</div>

				{/* Companies */}
				<div className="grid md:grid-cols-2 gap-8 mb-16">
					{COMPANIES.map((company) => (
						<div
							key={company.name}
							className="relative bg-card/50 backdrop-blur-sm rounded-2xl p-8 hover:bg-card/80 transition-all duration-300 group"
						>
							<div className="space-y-4">
								<div className="flex items-start justify-between">
									<div>
										<h3 className="text-2xl md:text-3xl font-display font-light group-hover:text-primary transition-colors">
											{company.name}
										</h3>
										<p className="text-sm text-primary font-display font-medium mt-1">
											{company.tagline}
										</p>
									</div>
									<span className="text-xs text-muted-foreground font-display bg-muted px-2 py-1 rounded-full">
										Est. {company.founded}
									</span>
								</div>
								<p className="text-muted-foreground font-display font-light leading-relaxed">
									{company.description}
								</p>
							</div>
						</div>
					))}
				</div>

				{/* Team Section */}
				<div className="bg-gradient-to-br from-primary/5 to-primary/10 backdrop-blur-sm rounded-2xl p-8 md:p-10 border-2 border-primary/20">
					<div className="grid md:grid-cols-[auto_1fr] gap-8 items-center">
						<div className="w-20 h-20 rounded-2xl bg-primary/20 flex items-center justify-center">
							<Users className="h-10 w-10 text-primary" />
						</div>
						<div className="space-y-4">
							<h3 className="text-2xl md:text-3xl font-display font-light">
								Dedicated Craftspeople
							</h3>
							<p className="text-muted-foreground font-display font-light leading-relaxed">
								Our team works daily to perfect new models, paying attention to the tiniest details—shapes, colors, natural textures, even how algae would naturally grow. Every background undergoes rigorous quality control and disinfection before being carefully packaged and shipped from our distribution center.
							</p>
							<div className="flex flex-wrap gap-4 pt-2">
								<div className="px-4 py-2 bg-primary/10 rounded-full">
									<span className="text-sm font-display font-medium text-primary">
										Custom Design Service
									</span>
								</div>
								<div className="px-4 py-2 bg-primary/10 rounded-full">
									<span className="text-sm font-display font-medium text-primary">
										In-Person Consultations
									</span>
								</div>
								<div className="px-4 py-2 bg-primary/10 rounded-full">
									<span className="text-sm font-display font-medium text-primary">
										Patented Process
									</span>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* Trademark Notice */}
				<div className="mt-8 text-center">
					<p className="text-sm text-muted-foreground font-display font-light">
						All AquaDecor products and production processes are patented. Our name is a registered trademark in the EU, USA, and many other countries.
					</p>
				</div>
			</div>
		</section>
	);
}