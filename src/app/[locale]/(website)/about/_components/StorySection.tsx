// src/app/about/_components/StorySection.tsx

import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function StorySection() {
	return (
		<section id="story" className="py-16 md:py-24 scroll-mt-20">
			<div className="container px-4 max-w-6xl mx-auto">
				<div className="grid lg:grid-cols-2 gap-12 items-center">
					{/* Content */}
					<div className="space-y-6">
						<div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/5 rounded-full">
							<span className="text-xs text-primary font-display font-medium">
								The Beginning
							</span>
						</div>

						<h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-light">
							Only Nature Can Copy Us
						</h2>

						<div className="space-y-4 text-muted-foreground font-display font-light leading-relaxed">
							<p>
								Our story started in a 9m² shed in Serbia. Founder Florian Kovac spent hours perfecting his craft, creating the first 3D aquarium backgrounds by hand. He knew from the start this was something special.
							</p>
							<p>
								"I would spend hours looking at the result of my work," Florian recalls. "Bit by bit, the whole picture started to show up. My favorite part is the final details—the cherry on top. Painting affects the final look substantially, and you can change the appearance of a 3D background easily."
							</p>
							<p>
								What started as a local Serbian operation in 2004 has grown into a worldwide brand. Today, 95% of our products ship internationally. We've designed over 1,000 unique models and served 50,000+ customers across 50+ countries.
							</p>
						</div>

						<Link
							href="/blog/aquadecor-aquarium-background-story-an-interview-with-mr-florian-kovac-the-founder-of-the-aquadecor-brand"
							className="inline-flex items-center gap-2 text-primary hover:gap-3 transition-all font-display font-medium"
						>
							Read the full interview
							<ArrowRight className="h-4 w-4" />
						</Link>
					</div>

					{/* Quote Card */}
					<div className="relative">
						<div className="bg-gradient-to-br from-primary/5 to-primary/10 backdrop-blur-sm rounded-2xl p-8 md:p-10 border-2 border-primary/20">
							<blockquote className="space-y-6">
								<p className="text-2xl md:text-3xl font-display font-light italic text-foreground">
									"I knew from the start that this was going to be a great international success."
								</p>
								<footer className="flex items-center gap-4">
									<div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
										<span className="text-primary font-display font-medium text-lg">FK</span>
									</div>
									<div>
										<cite className="not-italic font-display font-medium text-foreground">
											Florian Kovac
										</cite>
										<p className="text-sm text-muted-foreground font-display font-light">
											Founder & Head Designer
										</p>
									</div>
								</footer>
							</blockquote>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}