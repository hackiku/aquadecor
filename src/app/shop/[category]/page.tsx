// src/app/shop/[category]/page.tsx

import { notFound } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Breadcrumbs } from "~/components/navigation/Breadcrumbs";
import { api, HydrateClient } from "~/trpc/server";
import { ArrowRight } from "lucide-react";

interface CategoryPageProps {
	params: {
		category: string;
	};
}

export default async function ProductLinePage({ params }: CategoryPageProps) {
	// Try to load as product line first
	const categories = await api.product.getCategoriesForProductLine({
		productLineSlug: params.category,
		locale: "en",
	});

	// If no categories found, might be a direct category - redirect to products
	if (!categories || categories.length === 0) {
		// This will be handled by the products page
		notFound();
	}

	// Get the product line name from first category's parent
	// For display purposes, we'll use a mapping
	const productLineNames: Record<string, string> = {
		"3d-backgrounds": "3D Backgrounds",
		"aquarium-decorations": "Aquarium Decorations",
	};

	const productLineName = productLineNames[params.category] || params.category;

	return (
		<HydrateClient>
		<main className="min-h-screen">
			{/* Breadcrumbs */}
			<div className="border-b bg-muted/30">
				<div className="container px-4 py-4">
					<Breadcrumbs
						items={[
							{ label: "Home", href: "/" },
							{ label: "Shop", href: "/shop" },
							{ label: productLineName, href: `/shop/${params.category}` },
						]}
					/>
				</div>
			</div>

			{/* Header */}
			<section className="border-b bg-gradient-to-b from-background to-muted/30">
				<div className="container px-4 py-12 md:py-16">
					<div className="max-w-3xl">
						<h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-light tracking-tight">
							{productLineName}
						</h1>
						<p className="mt-4 text-lg text-muted-foreground font-display font-light">
							Choose from {categories.length} categories
						</p>
					</div>
				</div>
			</section>

			{/* Categories Grid */}
			<section className="py-12 md:py-16">
				<div className="container px-4">
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
						{categories.map((category) => (
							<Link
								key={category.id}
								href={`/shop/${params.category}/${category.slug}`}
							>
								<Card className="h-full transition-all hover:shadow-lg hover:border-primary/50 cursor-pointer group">
									<CardHeader className="space-y-3">
										<div className="flex items-start justify-between gap-2">
											<CardTitle className="text-xl font-display font-normal group-hover:text-primary transition-colors leading-tight">
												{category.name}
											</CardTitle>
											<ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0 mt-0.5" />
										</div>
										<CardDescription className="text-sm font-display font-light leading-relaxed">
											{category.description}
										</CardDescription>
									</CardHeader>
									<CardContent>
										<span className="text-sm text-primary font-display font-medium">
											View products →
										</span>
									</CardContent>
								</Card>
							</Link>
						))}
					</div>
				</div>
			</section>
		</main>
		</HydrateClient>
	);
}