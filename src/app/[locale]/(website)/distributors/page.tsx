// src/app/distributors/page.tsx

import { AlertTriangle, Info } from "lucide-react";
import { DistributorsGrid } from "./DistributorsGrid";

export default function DistributorsPage() {
	return (
		<main className="min-h-screen">
			{/* Hero */}
			<section className="relative pt-32 md:pt-40 pb-16 md:pb-24 bg-gradient-to-b from-muted/50 to-transparent">
				<div className="container px-4 max-w-5xl mx-auto">
					<div className="space-y-6">
						<div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 backdrop-blur-sm rounded-full border border-primary/20">
							<span className="text-sm text-primary font-display font-medium">
								Global Network
							</span>
						</div>
						<h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-extralight tracking-tight">
							Official Distributors
						</h1>
						<p className="text-lg md:text-xl text-muted-foreground font-display font-light max-w-3xl leading-relaxed">
							Our trusted partners around the world. For questions or concerns, contact{" "}
							<a
								href="mailto:support@aquadecorbackgrounds.com"
								className="text-primary hover:underline font-medium"
							>
								support@aquadecorbackgrounds.com
							</a>
						</p>
					</div>
				</div>
			</section>

			{/* Alerts */}
			<section className="py-8 bg-accent/5">
				<div className="container px-4 max-w-5xl mx-auto space-y-4">
					{/* Scam Warning */}
					<div className="bg-red-500/10 border-2 border-red-500/20 rounded-2xl p-6">
						<div className="flex items-start gap-4">
							<AlertTriangle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
							<div className="space-y-2">
								<h3 className="font-display font-medium text-red-500">
									Beware of Fake Representatives
								</h3>
								<p className="text-sm font-display font-light text-muted-foreground leading-relaxed">
									A number of fake Aquadecor representatives have appeared, offering discounts and quotes while claiming to be official. Please be aware of these scammers!
								</p>
							</div>
						</div>
					</div>

					{/* Official Notice */}
					<div className="bg-primary/5 border-2 border-primary/20 rounded-2xl p-6">
						<div className="flex items-start gap-4">
							<Info className="h-5 w-5 text-primary shrink-0 mt-0.5" />
							<div className="space-y-2">
								<h3 className="font-display font-medium text-primary">
									Original Products Only Here
								</h3>
								<p className="text-sm font-display font-light text-muted-foreground leading-relaxed">
									Authentic Aquadecor backgrounds can only be ordered through{" "}
									<strong className="text-foreground font-medium">
										www.aquadecorbackgrounds.com
									</strong>{" "}
									and our registered distributors listed below.
								</p>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Distributors Grid */}
			<section className="py-16 md:py-24">
				<div className="container px-4 max-w-7xl mx-auto">
					<div className="mb-12">
						<h2 className="text-3xl md:text-4xl font-display font-light mb-4">
							Worldwide Partners
						</h2>
						<p className="text-lg text-muted-foreground font-display font-light">
							Contact your nearest distributor for local support and faster shipping
						</p>
					</div>

					<DistributorsGrid />
				</div>
			</section>

			{/* CTA */}
			<section className="py-16 md:py-24 bg-accent/5">
				<div className="container px-4 max-w-4xl mx-auto text-center">
					<div className="space-y-6">
						<h2 className="text-3xl md:text-4xl font-display font-light">
							Want to Become a Distributor?
						</h2>
						<p className="text-lg text-muted-foreground font-display font-light max-w-2xl mx-auto">
							Interested in representing Aquadecor in your region? Get in touch with our team.
						</p>
						<div className="pt-4">
							<a
								href="mailto:support@aquadecorbackgrounds.com?subject=Distributor Inquiry"
								className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-full font-display font-medium hover:bg-primary/90 transition-all hover:scale-105"
							>
								Contact Us
							</a>
						</div>
					</div>
				</div>
			</section>
		</main>
	);
}