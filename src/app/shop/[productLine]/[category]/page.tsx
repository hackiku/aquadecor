// src/app/shop/[productLine]/[category]/[productSlug]/page.tsx

import { notFound } from "next/navigation";
import Image from "next/image";
import { Breadcrumbs } from "~/components/navigation/Breadcrumbs";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { BuyButton } from "~/app/shop/_components/buy/BuyButton";
import { AddToFavorites } from "~/app/shop/_components/buy/AddToFavorites";
import { api } from "~/trpc/server";

interface ProductPageProps {
	params: {
		productLine: string;
		category: string;
		productSlug: string;
	};
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
	const product = await api.product.getBySlug({
		slug: params.productSlug,
		locale: "en",
	});

	if (!product) {
		notFound();
	}

	// Name mappings (TODO: Get from DB)
	const productLineNames: Record<string, string> = {
		"3d-backgrounds": "3D Backgrounds",
		"aquarium-decorations": "Aquarium Decorations",
	};

	const categoryNames: Record<string, string> = {
		"a-models": "A Models - Classic Rocky Backgrounds",
		"slim-models": "A Slim Models",
		"b-models": "B Models - Amazonian",
		"aquarium-plants": "Aquarium Plants",
		"aquarium-rocks": "Aquarium Rocks",
		"d-models": "D Models",
		"h-models": "H Models",
		"j-models": "J Models",
		"m-models": "M Models",
		"s-models": "S Models",
		"starter-sets": "Starter Sets",
		"v-models": "V Models",
	};

	const productLineName = productLineNames[params.productLine] || params.productLine;
	const categoryName = categoryNames[params.category] || params.category;

	// Format price
	const formattedPrice = product.basePriceEurCents
		? `€${(product.basePriceEurCents / 100).toFixed(2)}`
		: null;

	// Determine if custom made
	const isCustomMade = product.stockStatus === "made_to_order" && !product.basePriceEurCents;

	return (
		<main className="min-h-screen">
			{/* Breadcrumbs */}
			<div className="border-b bg-muted/30">
				<div className="container px-4 py-4">
					<Breadcrumbs
						items={[
							{ label: "Home", href: "/" },
							{ label: "Shop", href: "/shop" },
							{ label: productLineName, href: `/shop/${params.productLine}` },
							{ label: categoryName, href: `/shop/${params.productLine}/${params.category}` },
							{ label: product.name || "", href: `#` },
						]}
					/>
				</div>
			</div>

			{/* Product Detail */}
			<section className="py-12 md:py-16">
				<div className="container px-4">
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-7xl mx-auto">
						{/* Images */}
						<div className="space-y-4">
							<div className="aspect-[4/3] relative rounded-2xl border bg-muted overflow-hidden">
								{product.images && product.images.length > 0 ? (
									<Image
										src={product.images[0].storageUrl || ""}
										alt={product.images[0].altText || product.name || "Product image"}
										fill
										className="object-cover"
										priority
									/>
								) : (
									<div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
										<p className="text-muted-foreground font-display text-lg">Product Image</p>
									</div>
								)}
							</div>

							{/* Thumbnail gallery */}
							{product.images && product.images.length > 1 && (
								<div className="grid grid-cols-4 gap-4">
									{product.images.map((img) => (
										<button
											key={img.id}
											className="aspect-square relative rounded-lg border bg-muted overflow-hidden hover:border-primary transition-colors"
										>
											<Image
												src={img.storageUrl}
												alt={img.altText || "Product thumbnail"}
												fill
												className="object-cover"
											/>
										</button>
									))}
								</div>
							)}
						</div>

						{/* Product Info */}
						<div className="space-y-6">
							<div className="space-y-4">
								{/* SKU and Stock Status */}
								<div className="flex items-center gap-2 flex-wrap">
									{product.sku && (
										<Badge variant="secondary" className="font-display">
											SKU: {product.sku}
										</Badge>
									)}
									{product.stockStatus === "in_stock" && (
										<Badge variant="default" className="bg-green-500">
											In Stock
										</Badge>
									)}
									{product.stockStatus === "made_to_order" && (
										<Badge variant="outline">
											Made to Order
										</Badge>
									)}
								</div>

								{/* Product Name */}
								<h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-light tracking-tight">
									{product.name}
								</h1>

								{/* Short Description */}
								{product.shortDescription && (
									<p className="text-xl text-muted-foreground font-display font-light">
										{product.shortDescription}
									</p>
								)}

								{/* Price */}
								{formattedPrice && (
									<div className="pt-2">
										<p className="text-4xl font-display font-light text-primary">
											{formattedPrice}
										</p>
									</div>
								)}

								{/* Price Note */}
								{product.priceNote && (
									<Card className="bg-muted/50">
										<CardContent className="pt-6">
											<p className="text-base font-display">
												{product.priceNote}
											</p>
										</CardContent>
									</Card>
								)}
							</div>

							{/* CTAs */}
							<div className="flex gap-3">
								<div className="flex-1">
									<BuyButton
										productId={product.id}
										productName={product.name || ""}
										className="w-full rounded-full text-lg h-12"
									/>
								</div>
								<AddToFavorites productId={product.id} />
							</div>

							{/* Specifications */}
							{product.specifications && Object.keys(product.specifications).length > 0 && (
								<Card>
									<CardHeader>
										<CardTitle className="text-lg font-display font-normal">
											Specifications
										</CardTitle>
									</CardHeader>
									<CardContent className="space-y-3">
										{Object.entries(product.specifications).map(([key, value]) => (
											<div key={key} className="flex justify-between py-2 border-b last:border-0">
												<span className="text-muted-foreground capitalize font-display">
													{key.replace(/([A-Z])/g, " $1").trim()}
												</span>
												<span className="font-medium font-display">{String(value)}</span>
											</div>
										))}
									</CardContent>
								</Card>
							)}
						</div>
					</div>

					{/* Full Description */}
					{product.fullDescription && (
						<div className="mt-16 max-w-4xl mx-auto">
							<h2 className="text-2xl md:text-3xl font-display font-light mb-6">
								Product Description
							</h2>
							<div className="prose prose-lg max-w-none">
								{product.fullDescription.split("\n\n").map((paragraph, i) => (
									<p key={i} className="text-muted-foreground font-display font-light leading-relaxed mb-4">
										{paragraph}
									</p>
								))}
							</div>
						</div>
					)}
				</div>
			</section>
		</main>
	);
}