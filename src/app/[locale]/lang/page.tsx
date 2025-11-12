// src/app/[locale]/landing/page.tsx

import { dictionaries, type Locale } from "~/lib/i18n/dictionaries"
import { ShopButton } from "~/components/cta/ShopButton"
import type { Metadata } from "next"

export async function generateMetadata({
	params,
}: {
	params: Promise<{ locale: Locale }>
}): Promise<Metadata> {
	const { locale } = await params
	const t = dictionaries[locale] || dictionaries.us

	return {
		title: t.meta.title,
		description: t.meta.description,
		keywords: t.meta.keywords,
		openGraph: {
			title: t.meta.title,
			description: t.meta.description,
			locale: locale === "us" ? "en_US" : locale === "de" ? "de_DE" : "nl_NL",
			type: "website",
		},
	}
}

export async function generateStaticParams() {
	return [{ locale: "us" }, { locale: "de" }, { locale: "nl" }]
}

export default async function LocaleLandingPage({
	params,
}: {
	params: Promise<{ locale: Locale }>
}) {
	const { locale } = await params
	const t = dictionaries[locale] || dictionaries.us

	return (
		<main className="min-h-screen">
			{/* Hero Section */}
			<section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-linear-to-b from-background to-accent/20">
				{/* Background pattern placeholder */}
				<div className="absolute inset-0 bg-linear-to-br from-primary/5 to-primary/10 opacity-50" />

				<div className="container relative z-10 px-4 py-32 md:py-40">
					<div className="mx-auto max-w-4xl text-center space-y-8">
						<div className="space-y-4">
							<p className="text-sm font-medium text-primary tracking-wider uppercase font-display">{t.hero.tagline}</p>
							<h1 className="text-4xl __font-bold font-display font-extralight tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
								{t.hero.headline}
							</h1>
							<p className="mx-auto max-w-2xl text-lg text-muted-foreground font-display font-light md:text-xl">
								{t.hero.subheadline}
							</p>
						</div>

						<div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
							<ShopButton href={`/${locale}/store`}>{t.hero.shopNow}</ShopButton>
							<ShopButton href={`/${locale}/calculator`}>{t.hero.orderCustom}</ShopButton>
						</div>
					</div>
				</div>
			</section>

			{/* Products Section */}
			<section className="py-16 md:py-24 bg-background">
				<div className="container px-4">
					<div className="text-center mb-12 md:mb-16">
						<h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-light tracking-normal">
							{t.products.title}
						</h2>
						<p className="mt-4 text-lg text-muted-foreground font-display font-light max-w-2xl mx-auto">
							{t.products.subtitle}
						</p>
					</div>

					{/* Product Grid Placeholder */}
					<div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
						{[1, 2, 3].map((i) => (
							<div key={i} className="rounded-lg border bg-card p-6 space-y-4">
								<div className="aspect-[4/3] bg-gradient-to-br from-primary/20 to-primary/5 rounded-lg" />
								<h3 className="font-display font-normal text-lg">Product {i}</h3>
								<p className="text-sm text-muted-foreground font-display font-light">
									Handcrafted 3D aquarium background
								</p>
								<p className="text-lg font-display font-medium text-primary">{t.products.from} €199</p>
							</div>
						))}
					</div>

					<div className="text-center mt-12">
						<ShopButton href={`/${locale}/store`}>{t.products.viewAll}</ShopButton>
					</div>
				</div>
			</section>

			{/* About Section */}
			<section className="py-16 md:py-24 bg-accent/5">
				<div className="container px-4">
					<div className="max-w-4xl mx-auto text-center space-y-6">
						<h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-light">{t.about.title}</h2>
						<p className="text-lg md:text-xl text-muted-foreground font-display font-light leading-relaxed">
							{t.about.description}
						</p>
					</div>
				</div>
			</section>

			{/* Stats Section */}
			<section className="py-16 md:py-24">
				<div className="container px-4">
					<div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
						<div className="text-center space-y-2">
							<p className="text-4xl md:text-5xl font-display font-light text-primary">20+</p>
							<p className="text-sm md:text-base text-muted-foreground font-display">{t.stats.years}</p>
						</div>
						<div className="text-center space-y-2">
							<p className="text-4xl md:text-5xl font-display font-light text-primary">50K+</p>
							<p className="text-sm md:text-base text-muted-foreground font-display">{t.stats.products}</p>
						</div>
						<div className="text-center space-y-2">
							<p className="text-4xl md:text-5xl font-display font-light text-primary">1000+</p>
							<p className="text-sm md:text-base text-muted-foreground font-display">{t.stats.designs}</p>
						</div>
						<div className="text-center space-y-2">
							<p className="text-4xl md:text-5xl font-display font-light text-primary">50+</p>
							<p className="text-sm md:text-base text-muted-foreground font-display">{t.stats.countries}</p>
						</div>
					</div>
				</div>
			</section>

			{/* Comparison Section */}
			<section className="py-16 md:py-24 bg-background">
				<div className="container px-4">
					<div className="text-center mb-12 md:mb-16">
						<h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-light tracking-normal mb-4">
							{t.comparison.title}
						</h2>
					</div>

					<div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
						{/* Standard */}
						<div className="rounded-lg border p-6 space-y-6">
							<div>
								<h3 className="text-2xl font-display font-light mb-2">{t.comparison.standard.title}</h3>
								<p className="text-muted-foreground font-display font-light">{t.comparison.standard.description}</p>
							</div>

							<div className="space-y-4">
								<div className="flex items-start gap-2">
									<span className="text-primary mt-1">✓</span>
									<div>
										<p className="font-display font-normal">{t.comparison.features.handmade}</p>
										<p className="text-sm text-muted-foreground font-display font-light">
											{t.comparison.features.handmadeDesc}
										</p>
									</div>
								</div>
								<div className="flex items-start gap-2">
									<span className="text-primary mt-1">✓</span>
									<div>
										<p className="font-display font-normal">{t.comparison.features.easySelection}</p>
										<p className="text-sm text-muted-foreground font-display font-light">
											{t.comparison.features.easySelectionDesc}
										</p>
									</div>
								</div>
							</div>

							<ShopButton href={`/${locale}/store`} className="w-full">
								{t.comparison.standard.cta}
							</ShopButton>
						</div>

						{/* Custom */}
						<div className="rounded-lg border-2 border-primary p-6 space-y-6 bg-primary/5">
							<div>
								<h3 className="text-2xl font-display font-light mb-2 text-primary">{t.comparison.custom.title}</h3>
								<p className="text-muted-foreground font-display font-light">{t.comparison.custom.description}</p>
							</div>

							<div className="space-y-4">
								<div className="flex items-start gap-2">
									<span className="text-primary mt-1">✓</span>
									<div>
										<p className="font-display font-normal">{t.comparison.features.handmade}</p>
										<p className="text-sm text-muted-foreground font-display font-light">
											{t.comparison.features.handmadeDesc}
										</p>
									</div>
								</div>
								<div className="flex items-start gap-2">
									<span className="text-primary mt-1">✓</span>
									<div>
										<p className="font-display font-normal">{t.comparison.features.personalization}</p>
										<p className="text-sm text-muted-foreground font-display font-light">
											{t.comparison.features.personalizationDesc}
										</p>
									</div>
								</div>
							</div>

							<ShopButton href={`/${locale}/calculator`} className="w-full">
								{t.comparison.custom.cta}
							</ShopButton>
						</div>
					</div>
				</div>
			</section>

			{/* Newsletter Section */}
			<section className="py-16 md:py-24 bg-primary/5">
				<div className="container px-4">
					<div className="max-w-2xl mx-auto">
						<div className="rounded-2xl border bg-card p-8 md:p-12 text-center space-y-6">
							<div className="space-y-3">
								<h2 className="text-3xl md:text-4xl font-display font-light tracking-tight">{t.newsletter.title}</h2>
								<p className="text-lg text-muted-foreground font-display font-light">{t.newsletter.description}</p>
							</div>

							<form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
								<input
									type="email"
									placeholder={t.newsletter.placeholder}
									className="flex-1 rounded-full px-6 py-3 border bg-background"
								/>
								<button className="px-8 py-3 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
									{t.newsletter.subscribe}
								</button>
							</form>

							<p className="text-xs text-muted-foreground font-display font-light">{t.newsletter.disclaimer}</p>
						</div>
					</div>
				</div>
			</section>

			{/* Footer */}
			<footer className="py-8 border-t">
				<div className="container px-4 text-center">
					<p className="text-sm text-muted-foreground font-display">{t.footer.copyright}</p>
				</div>
			</footer>
		</main>
	)
}
