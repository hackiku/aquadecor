// src/app/about/page.tsx

import { HeroSection } from "./_components/HeroSection";
import { StorySection } from "./_components/StorySection";
import { TechSection } from "./_components/TechSection";
import { ValuesSection, StoreSlider, BlogSlider } from "./_components/ValuesSection";
import { FamilySection } from "./_components/FamilySection";
import { DistributorsGrid } from "../distributors/DistributorsGrid";

export default function AboutPage() {
	return (
		<main className="min-h-screen">
			<HeroSection />
			<ValuesSection />
			<StorySection />
			<TechSection />
			<StoreSlider />
			<FamilySection />

			{/* Distributors Preview */}
			<section className="py-16 md:py-24 bg-accent/5">
				<div className="container px-4 max-w-7xl mx-auto">
					<div className="flex items-center justify-between mb-12">
						<div>
							<h2 className="text-3xl md:text-4xl font-display font-light mb-4">
								Our Global Partners
							</h2>
							<p className="text-lg text-muted-foreground font-display font-light">
								Trusted distributors worldwide
							</p>
						</div>
						<a
							href="/distributors"
							className="text-primary hover:underline font-display font-medium"
						>
							View all →
						</a>
					</div>

					{/* Show first 6 distributors */}
					<DistributorsGrid className="lg:grid-cols-3" />
				</div>
			</section>

			<BlogSlider />
		</main>
	);
}