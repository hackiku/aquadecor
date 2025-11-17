// src/app/shop/page.tsx

import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { api } from "~/trpc/server";

export default async function ShopPage() {
	// TODO: Replace with actual tRPC query once router is set up
	const categories = [
		{
			id: "3d-backgrounds",
			slug: "3d-backgrounds",
			name: "3D Backgrounds",
			description: "Natural look with our 3D aquarium backgrounds",
			productCount: 42,
		},
		{
			id: "3d-backgrounds-a-models",
			slug: "a-models",
			name: "A Models - Classic Rocky",
			description: "Realistic 3D aquarium stone decor",
			productCount: 24,
		},
		{
			id: "3d-backgrounds-slim",
			slug: "slim-models",
			name: "A Slim Models - Thin Rocky",
			description: "Space-saving thin design",
			productCount: 11,
		},
		{
			id: "aquarium-decorations",
			slug: "aquarium-decorations",
			name: "Aquarium Decorations",
			description: "Natural effect with aquarium decorations",
			productCount: 76,
		},
	];

	return (
		<main className="min-h-screen">
			{/* Header */}
			<section className="border-b bg-muted/30">
				<div className="container px-4 py-16 md:py-24">
					<div className="max-w-3xl">
						<h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-light tracking-tight">
							Aquadecor shop
						</h1>
						<p className="mt-4 text-lg md:text-xl text-muted-foreground font-display font-light">
							Choose one of the categories...
						</p>
					</div>
				</div>
			</section>

			{/* Category Grid */}
			<section className="py-12 md:py-16">
				<div className="container px-4">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl">
						{categories.map((category) => (
							<Link key={category.id} href={`/shop/${category.slug}`}>
								<Card className="h-full transition-all hover:shadow-lg hover:border-primary/50 cursor-pointer group">
									<CardHeader>
										<CardTitle className="text-2xl font-display font-normal group-hover:text-primary transition-colors">
											{category.name}
										</CardTitle>
										<CardDescription className="text-base font-display font-light">
											{category.description}
										</CardDescription>
									</CardHeader>
									<CardContent>
										<p className="text-sm text-muted-foreground">
											{category.productCount} products
										</p>
									</CardContent>
								</Card>
							</Link>
						))}
					</div>
				</div>
			</section>
		</main>
	);
}