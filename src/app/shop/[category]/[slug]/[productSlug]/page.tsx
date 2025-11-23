// @ts-nocheck
// src/app/shop/[category]/[slug]/[productSlug]/page.tsx

import { notFound } from "next/navigation";
import Image from "next/image";
import { AddToCartButton } from "~/components/shop/cart/AddToCartButton";
import { WishlistButton } from "~/components/shop/wishlist/WishlistButton";
import { CustomOnlyBadge } from "~/components/shop/product/CustomOnlyBadge";
import { api, HydrateClient } from "~/trpc/server";
import { Badge } from "~/components/ui/badge";
import { Package, Truck, Clock, Shield, Zap, CheckCircle2 } from "lucide-react";

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

	const isCustomOnly = !product.basePriceEurCents;

	return (
		<HydrateClient>
			<main className="min-h-screen">
				{/* Hero Section - Full Width Image */}
				<section className="relative h-[40vh] md:h-[50vh] border-b">
					{product.images && product.images[0] ? (
						<Image
							src={product.images[0].storageUrl}
							alt={product.images[0].altText ?? product.name ?? "Product"}
							fill
							className="object-cover"
							priority
						/>
					) : (
						<div className="absolute inset-0 bg-muted flex items-center justify-center">
							<Package className="h-20 w-20 text-muted-foreground/20" />
						</div>
					)}

					{/* Gradient overlay */}
					<div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />

					{/* Quick info overlay */}
					<div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
						<div className="max-w-7xl mx-auto">
							<div className="flex items-center gap-3 mb-4">
								<Badge variant="secondary" className="font-display text-xs">
									{product.sku}
								</Badge>
								{product.stockStatus === "in_stock" && (
									<Badge className="bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20 text-xs">
										In Stock
									</Badge>
								)}
								{product.stockStatus === "made_to_order" && (
									<Badge className="bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20 text-xs">
										Made to Order
									</Badge>
								)}
								{isCustomOnly && <CustomOnlyBadge variant="inline" />}
							</div>
							<h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-light text-white drop-shadow-lg">
								{product.name ?? "Product"}
							</h1>
						</div>
					</div>
				</section>

				{/* Main Content - Two Column */}
				<section className="py-12 md:py-16">
					<div className="px-4 max-w-7xl mx-auto">
						<div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

							{/* Left Column - Info */}
							<div className="lg:col-span-2 space-y-8">

								{/* Description */}
								<div className="space-y-4">
									<h2 className="text-2xl font-display font-normal">Product Details</h2>
									<p className="text-lg text-muted-foreground font-display font-light leading-relaxed">
										{product.fullDescription || product.shortDescription}
									</p>
								</div>

								{/* Specifications */}
								{product.specifications &&
									typeof product.specifications === 'object' &&
									Object.keys(product.specifications).length > 0 && (
										<div className="space-y-4">
											<h2 className="text-2xl font-display font-normal">Specifications</h2>
											<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-6 bg-muted/30 rounded-xl border">
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

								{/* Features */}
								<div className="space-y-4">
									<h2 className="text-2xl font-display font-normal">Key Features</h2>
									<div className="grid gap-4">
										<div className="flex items-start gap-4 p-4 rounded-xl border bg-card">
											<div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
												<Shield className="h-5 w-5 text-primary" />
											</div>
											<div className="space-y-1">
												<h3 className="font-display font-medium">Lifetime Warranty</h3>
												<p className="text-sm text-muted-foreground font-display font-light">
													Chemical-resistant materials that never leach or affect water chemistry
												</p>
											</div>
										</div>

										<div className="flex items-start gap-4 p-4 rounded-xl border bg-card">
											<div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
												<Zap className="h-5 w-5 text-primary" />
											</div>
											<div className="space-y-1">
												<h3 className="font-display font-medium">Easy Installation</h3>
												<p className="text-sm text-muted-foreground font-display font-light">
													Modular design with numbered sections for seamless assembly
												</p>
											</div>
										</div>

										<div className="flex items-start gap-4 p-4 rounded-xl border bg-card">
											<div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
												<CheckCircle2 className="h-5 w-5 text-primary" />
											</div>
											<div className="space-y-1">
												<h3 className="font-display font-medium">Maintenance Free</h3>
												<p className="text-sm text-muted-foreground font-display font-light">
													Scrub-safe surface - algae wipes off easily without damage
												</p>
											</div>
										</div>
									</div>
								</div>

								{/* Image Gallery */}
								{product.images && product.images.length > 1 && (
									<div className="space-y-4">
										<h2 className="text-2xl font-display font-normal">Product Gallery</h2>
										<div className="grid grid-cols-2 md:grid-cols-3 gap-4">
											{product.images.slice(1).map((image, idx) => (
												<div
													key={idx}
													className="relative aspect-square rounded-xl overflow-hidden border-2 border-border cursor-pointer hover:border-primary transition-colors"
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
									</div>
								)}
							</div>

							{/* Right Column - Sticky Buy Box */}
							<div className="lg:col-span-1">
								<div className="sticky top-24 space-y-6">
									{/* Buy Box */}
									<div className="p-6 rounded-2xl border-2 border-border bg-card/50 backdrop-blur space-y-6">

										{/* Wishlist */}
										<div className="flex justify-end">
											<WishlistButton productId={product.id} />
										</div>

										{/* Custom Only Banner */}
										{isCustomOnly && (
											<CustomOnlyBadge variant="banner" showCalculatorLink />
										)}

										{/* Price */}
										{!isCustomOnly && (
											<div className="space-y-2 pb-6 border-b">
												<div className="text-4xl font-display font-light">
													€{(product.basePriceEurCents / 100).toFixed(2)}
												</div>
												{product.priceNote && (
													<p className="text-sm text-muted-foreground font-display font-light">
														{product.priceNote}
													</p>
												)}
											</div>
										)}

										{/* Trust Signals */}
										<div className="space-y-3">
											<div className="flex items-center gap-3 text-sm">
												<Truck className="h-5 w-5 text-primary flex-shrink-0" />
												<span className="font-display font-light">Free worldwide shipping</span>
											</div>
											<div className="flex items-center gap-3 text-sm">
												<Clock className="h-5 w-5 text-primary flex-shrink-0" />
												<span className="font-display font-light">10-12 day production time</span>
											</div>
											<div className="flex items-center gap-3 text-sm">
												<Package className="h-5 w-5 text-primary flex-shrink-0" />
												<span className="font-display font-light">Custom sizes available</span>
											</div>
										</div>

										{/* CTA */}
										<div className="space-y-3">
											{isCustomOnly ? (
												<a
													href="/calculator"
													className="block w-full px-6 py-4 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full font-display font-medium transition-all hover:scale-[1.02] text-center"
												>
													Get Custom Quote
												</a>
											) : (
												<AddToCartButton
													product={product}
													size="lg"
													className="w-full rounded-full"
												/>
											)}
											<p className="text-center text-xs text-muted-foreground font-display font-light">
												Questions? <a href="/contact" className="text-primary hover:underline">Contact us</a> for custom sizing
											</p>
										</div>
									</div>

									{/* Additional Info */}
									<div className="p-4 rounded-xl bg-muted/30 space-y-2">
										<div className="flex items-center gap-2 text-xs text-muted-foreground font-display">
											<span className="text-primary">✓</span>
											<span>20+ years experience</span>
										</div>
										<div className="flex items-center gap-2 text-xs text-muted-foreground font-display">
											<span className="text-primary">✓</span>
											<span>50,000+ products shipped</span>
										</div>
										<div className="flex items-center gap-2 text-xs text-muted-foreground font-display">
											<span className="text-primary">✓</span>
											<span>Made in Serbia</span>
										</div>
									</div>
								</div>
							</div>

						</div>
					</div>
				</section>

				{/* Social Proof Section - Placeholder */}
				{/* TODO: Add social mentions masonry here */}
			</main>
		</HydrateClient>
	);
}