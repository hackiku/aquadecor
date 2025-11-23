// @ts-nocheck
// src/app/shop/[category]/[slug]/[productSlug]/page.tsx

import { notFound } from "next/navigation";
import Image from "next/image";
import { Breadcrumbs } from "~/components/navigation/Breadcrumbs";
import { AddToCartButton } from "~/components/shop/cart/AddToCartButton";
import { WishlistButton } from "~/components/shop/wishlist/WishlistButton";
import { api, HydrateClient } from "~/trpc/server";
import { Badge } from "~/components/ui/badge";
import { Package, Truck, Clock } from "lucide-react";

interface ProductDetailPageProps {
	params: Promise<{
		category: string;
		slug: string;
		productSlug: string;
	}>;
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
	const { category, slug, productSlug } = await params;

	// Load product
	const product = await api.product.getBySlug({
		slug: productSlug,
		locale: "en",
	});

	if (!product) {
		notFound();
	}

	// Temporary name mappings
	const categoryNames: Record<string, string> = {
		"a-models": "A Models",
		"aquarium-plants": "Aquarium Plants",
	};

	const productLineNames: Record<string, string> = {
		"3d-backgrounds": "3D Backgrounds",
		"aquarium-decorations": "Aquarium Decorations",
	};

	const categoryName = categoryNames[slug] || slug;
	const productLineName = productLineNames[category] || category;

	return (
		<HydrateClient>
			<main className="min-h-screen">
				{/* Breadcrumbs - Sticky with Nav awareness */}
				<div className="sticky top-16 z-40 border-b bg-background/95 backdrop-blur">
					<div className="px-4 py-4 max-w-7xl mx-auto">
						<Breadcrumbs
							items={[
								{ label: "Shop", href: "/shop" },
								{ label: productLineName, href: `/shop/${category}` },
								{ label: categoryName, href: `/shop/${category}/${slug}` },
								{ label: product.name ?? productSlug, href: `/shop/${category}/${slug}/${productSlug}` },
							]}
						/>
					</div>
				</div>

				{/* Product Content */}
				<section className="py-12 md:py-20">
					<div className="px-4 max-w-7xl mx-auto">
						<div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
							{/* Left: Images */}
							<div className="space-y-6">
								{/* Main Image */}
								<div className="relative aspect-square rounded-2xl overflow-hidden border-2 border-border bg-muted">
									{product.images && product.images[0] ? (
										<Image
											src={product.images[0].storageUrl}
											alt={product.images[0].altText ?? product.name ?? "Product"}
											fill
											className="object-cover"
											priority
										/>
									) : (
										<div className="absolute inset-0 flex items-center justify-center">
											<Package className="h-20 w-20 text-muted-foreground/20" />
										</div>
									)}
								</div>

								{/* Thumbnail Gallery */}
								{product.images && product.images.length > 1 && (
									<div className="grid grid-cols-4 gap-4">
										{product.images.slice(1, 5).map((image, idx) => (
											<div
												key={idx}
												className="relative aspect-square rounded-lg overflow-hidden border border-border cursor-pointer hover:border-primary transition-colors"
											>
												<Image
													src={image.storageUrl}
													alt={image.altText || `${product.name} ${idx + 2}`}
													fill
													className="object-cover"
												/>
											</div>
										))}
									</div>
								)}
							</div>

							{/* Right: Info */}
							<div className="space-y-8">
								{/* Title & SKU */}
								<div className="space-y-3">
									<div className="flex items-center gap-3">
										<Badge variant="secondary" className="font-display">
											{product.sku}
										</Badge>
										{product.stockStatus === "in_stock" && (
											<Badge className="bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20">
												In Stock
											</Badge>
										)}
										{product.stockStatus === "made_to_order" && (
											<Badge className="bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20">
												Made to Order
											</Badge>
										)}
									</div>

									<div className="flex items-start justify-between gap-4">
										<h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-light tracking-tight">
											{product.name ?? "Product"}
										</h1>
										<WishlistButton productId={product.id} />
									</div>
								</div>

								{/* Price */}
								<div className="py-6 border-y space-y-2">
									{product.basePriceEurCents ? (
										<div className="text-4xl font-display font-light">
											€{(product.basePriceEurCents / 100).toFixed(2)}
										</div>
									) : (
										<div className="text-2xl font-display font-light text-muted-foreground">
											Custom Pricing
										</div>
									)}
									{product.priceNote && (
										<p className="text-sm text-muted-foreground font-display font-light">
											{product.priceNote}
										</p>
									)}
								</div>

								{/* Description */}
								<div className="space-y-4">
									<h2 className="text-xl font-display font-normal">Description</h2>
									<p className="text-base text-muted-foreground font-display font-light leading-relaxed">
										{product.fullDescription || product.shortDescription}
									</p>
								</div>

								{/* Specifications */}
								{product.specifications &&
									typeof product.specifications === 'object' &&
									Object.keys(product.specifications).length > 0 && (
										<div className="space-y-4">
											<h2 className="text-xl font-display font-normal">Specifications</h2>
											<div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6 bg-muted/30 rounded-xl">
												{Object.entries(product.specifications).map(([key, value]) => {
													const formattedKey = key
														.replace(/([A-Z])/g, " $1")
														.replace(/Cm$/, "")
														.trim()
														.split(" ")
														.map(word => word.charAt(0).toUpperCase() + word.slice(1))
														.join(" ");

													const formattedValue = typeof value === 'object'
														? JSON.stringify(value)
														: key.toLowerCase().includes('cm') || key.toLowerCase().includes('depth') || key.toLowerCase().includes('width') || key.toLowerCase().includes('height')
															? `${value} cm`
															: String(value);

													return (
														<div key={key} className="space-y-1">
															<dt className="text-xs text-muted-foreground font-display uppercase tracking-wide">
																{formattedKey}
															</dt>
															<dd className="text-base font-display font-medium">
																{formattedValue}
															</dd>
														</div>
													);
												})}
											</div>
										</div>
									)}

								{/* Trust Signals */}
								<div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6">
									<div className="flex items-center gap-3 text-sm">
										<Truck className="h-5 w-5 text-primary" />
										<span className="font-display font-light">Free Shipping</span>
									</div>
									<div className="flex items-center gap-3 text-sm">
										<Clock className="h-5 w-5 text-primary" />
										<span className="font-display font-light">10-12 Days</span>
									</div>
									<div className="flex items-center gap-3 text-sm">
										<Package className="h-5 w-5 text-primary" />
										<span className="font-display font-light">Custom Sizes</span>
									</div>
								</div>

								{/* CTA */}
								<div className="pt-6 space-y-3">
									<AddToCartButton
										product={product}
										size="lg"
										className="w-full rounded-full"
									/>
									<p className="text-center text-sm text-muted-foreground font-display font-light">
										Questions? Contact us for custom sizing
									</p>
								</div>
							</div>
						</div>
					</div>
				</section>

				{/* Trust Bar */}
				<section className="py-12 md:py-16 border-t bg-accent/5">
					<div className="px-4 max-w-7xl mx-auto">
						<div className="flex flex-wrap items-center justify-center gap-8 text-sm font-display font-light">
							<div className="flex items-center gap-2">
								<span className="text-primary text-lg">✓</span>
								<span>20+ Years Experience</span>
							</div>
							<div className="flex items-center gap-2">
								<span className="text-primary text-lg">✓</span>
								<span>50K+ Products Shipped</span>
							</div>
							<div className="flex items-center gap-2">
								<span className="text-primary text-lg">✓</span>
								<span>Lifetime Warranty</span>
							</div>
							<div className="flex items-center gap-2">
								<span className="text-primary text-lg">✓</span>
								<span>Made in Serbia</span>
							</div>
						</div>
					</div>
				</section>
			</main>
		</HydrateClient>
	);
}