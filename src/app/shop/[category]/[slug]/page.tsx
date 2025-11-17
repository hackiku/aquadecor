// src/app/shop/[category]/[slug]/page.tsx

import { notFound } from "next/navigation";
import Image from "next/image";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { api } from "~/trpc/server";

interface ProductPageProps {
	params: {
		category: string;
		slug: string;
	};
}

export default async function ProductPage({ params }: ProductPageProps) {
	// TODO: Replace with actual tRPC query
	// const product = await api.product.getBySlug({ slug: params.slug });

	// Mock data
	const mockProduct = {
		id: "f1-3d-background",
		name: "F1 - 3D Background in Stone",
		slug: params.slug,
		sku: "F1",
		priceNote: "Production takes 10-12 business days, delivery takes 5-6 business days",
		shortDescription: "3D Rocky aquarium background with natural stone appearance",
		fullDescription: `3D Rocky aquarium background with stone appearance. Top-notch, free shipping.

Production takes 10-12 business days, and delivery takes 5-6 business days. The design imitates a rocky riverbed with stones in a singular tone. The entire aquarium is divided into three planes – an aquarium cover, floor, and a middle zone, with elements standing at various heights to create a dramatic natural impression of depth.

The space between the grains and the background allows for hiding aquarium equipment such as filters, aerators, and oxygen stones. The narrow passageways allow your fish to inhabit and swim in the spaces created, giving them numerous hiding spots of various sizes.

Available in a wide range of sizes.`,
		specifications: {
			productionTime: "10-12 business days",
			material: "High-quality resin with natural stone appearance",
		},
		images: [
			{ id: "1", url: "/placeholder.jpg", altText: "Product view 1" },
		],
		categorySlug: params.category,
	};

	if (!mockProduct) {
		notFound();
	}

	return (
		<main className="min-h-screen">
			{/* Breadcrumbs */}
			<div className="border-b bg-muted/30">
				<div className="container px-4 py-4">
					<nav className="flex items-center space-x-2 text-sm text-muted-foreground">
						<a href="/" className="hover:text-foreground transition-colors">
							Home
						</a>
						<span>›</span>
						<a href="/shop" className="hover:text-foreground transition-colors">
							Shop
						</a>
						<span>›</span>
						<a href={`/shop/${params.category}`} className="hover:text-foreground transition-colors">
							{params.category}
						</a>
						<span>›</span>
						<span className="text-foreground">{mockProduct.name}</span>
					</nav>
				</div>
			</div>

			{/* Product Detail */}
			<section className="py-12">
				<div className="container px-4">
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-7xl">
						{/* Images */}
						<div className="space-y-4">
							<div className="aspect-[4/3] relative rounded-2xl border bg-muted overflow-hidden">
								{/* Placeholder - replace with actual image */}
								<div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
									<p className="text-muted-foreground font-display">Product Image</p>
								</div>
								{/* 
								<Image
									src={mockProduct.images[0].url}
									alt={mockProduct.images[0].altText}
									fill
									className="object-cover"
									priority
								/>
								*/}
							</div>

							{/* Thumbnail gallery if multiple images */}
							{mockProduct.images.length > 1 && (
								<div className="grid grid-cols-4 gap-4">
									{mockProduct.images.map((img) => (
										<button
											key={img.id}
											className="aspect-square relative rounded-lg border bg-muted overflow-hidden hover:border-primary transition-colors"
										>
											<div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-primary/5" />
										</button>
									))}
								</div>
							)}
						</div>

						{/* Product Info */}
						<div className="space-y-6">
							<div>
								<p className="text-sm text-muted-foreground font-display uppercase tracking-wide">
									SKU: {mockProduct.sku}
								</p>
								<h1 className="text-3xl md:text-4xl font-display font-light tracking-tight mt-2">
									{mockProduct.name}
								</h1>
								<p className="text-xl text-muted-foreground font-display font-light mt-3">
									{mockProduct.shortDescription}
								</p>
							</div>

							{/* Price Note */}
							<Card className="bg-muted/50">
								<CardContent className="pt-6">
									<p className="text-lg font-display">
										{mockProduct.priceNote}
									</p>
								</CardContent>
							</Card>

							{/* CTA */}
							<div className="space-y-3">
								<Button size="lg" className="w-full rounded-full text-lg h-12">
									Request Quote
								</Button>
								<Button size="lg" variant="outline" className="w-full rounded-full">
									Add to Wishlist
								</Button>
							</div>

							{/* Specifications */}
							{mockProduct.specifications && (
								<Card>
									<CardHeader>
										<CardTitle className="text-lg font-display font-normal">
											Specifications
										</CardTitle>
									</CardHeader>
									<CardContent className="space-y-3">
										{Object.entries(mockProduct.specifications).map(([key, value]) => (
											<div key={key} className="flex justify-between py-2 border-b last:border-0">
												<span className="text-muted-foreground capitalize">
													{key.replace(/([A-Z])/g, " $1").trim()}
												</span>
												<span className="font-medium">{String(value)}</span>
											</div>
										))}
									</CardContent>
								</Card>
							)}
						</div>
					</div>

					{/* Full Description */}
					<div className="mt-12 max-w-4xl">
						<h2 className="text-2xl font-display font-light mb-6">Description</h2>
						<div className="prose prose-lg max-w-none">
							{mockProduct.fullDescription.split("\n\n").map((paragraph, i) => (
								<p key={i} className="text-muted-foreground font-display font-light leading-relaxed mb-4">
									{paragraph}
								</p>
							))}
						</div>
					</div>
				</div>
			</section>
		</main>
	);
}