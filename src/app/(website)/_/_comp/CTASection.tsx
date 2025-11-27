// src/app/_components/CTASection.tsx

import { EmailForm } from "~/components/cta/email/EmailForm";

export function CTASection() {
	return (
		<section className="py-24 md:py-32 bg-primary/5">
			<div className="container px-4">
				<div className="mx-auto max-w-3xl rounded-2xl border bg-card p-8 md:p-12 text-center space-y-8">
					<div className="space-y-4">
						<h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
							Ready to Transform Your Aquarium?
						</h2>
						<p className="text-lg text-muted-foreground">
							Get exclusive updates, custom design previews, and special offers delivered to your inbox.
						</p>
					</div>

					<EmailForm />

					<p className="text-xs text-muted-foreground">
						Join 10,000+ aquarium enthusiasts. Unsubscribe anytime.
					</p>
				</div>
			</div>
		</section>
	);
}