// TEST FILE - src/app/test-discount-badges/page.tsx
// This is just for testing - delete when done

import { DiscountBadge } from "~/components/shop/DiscountBadge";

export default function TestDiscountBadges() {
	return (
		<div className="min-h-screen p-12 space-y-16">
			<div className="max-w-4xl mx-auto space-y-8">
				<h1 className="text-4xl font-display font-bold">Discount Badge Variants</h1>

				{/* Subtle Variants */}
				<section className="space-y-4">
					<h2 className="text-2xl font-display font-semibold">Subtle (Default)</h2>
					<div className="flex flex-wrap gap-4 p-6 bg-muted/30 rounded-xl">
						<DiscountBadge type="sale" value={25} />
						<DiscountBadge type="promoter" value={15} code="IVAN15" />
						<DiscountBadge type="signup" value={10} />
						<DiscountBadge type="percentage" value={20} />
						<DiscountBadge type="fixed" value={5000} label="€50 Off" />
					</div>
				</section>

				{/* Vibrant Variants */}
				<section className="space-y-4">
					<h2 className="text-2xl font-display font-semibold">Vibrant</h2>
					<div className="flex flex-wrap gap-4 p-6 bg-muted/30 rounded-xl">
						<DiscountBadge type="sale" value={25} variant="vibrant" />
						<DiscountBadge type="promoter" value={15} code="IVAN15" variant="vibrant" />
						<DiscountBadge type="signup" value={10} variant="vibrant" />
						<DiscountBadge type="percentage" value={20} variant="vibrant" />
						<DiscountBadge type="fixed" value={5000} variant="vibrant" />
					</div>
				</section>

				{/* Size Variants */}
				<section className="space-y-4">
					<h2 className="text-2xl font-display font-semibold">Sizes</h2>
					<div className="flex flex-wrap items-center gap-4 p-6 bg-muted/30 rounded-xl">
						<DiscountBadge type="sale" value={25} size="sm" />
						<DiscountBadge type="sale" value={25} size="md" />
						<DiscountBadge type="sale" value={25} size="lg" />
					</div>
				</section>

				{/* Product Card Context */}
				<section className="space-y-4">
					<h2 className="text-2xl font-display font-semibold">In Product Card Context</h2>
					<div className="grid grid-cols-2 gap-6">
						{/* Mock Product Card 1 */}
						<div className="relative border-2 border-border rounded-2xl overflow-hidden bg-card">
							<div className="relative h-64 bg-gradient-to-br from-blue-500/20 to-purple-500/20">
								<div className="absolute top-3 left-3 flex gap-2">
									<div className="px-3 py-1 bg-background/80 backdrop-blur-sm rounded-md text-xs font-mono">
										SKU-001
									</div>
									<DiscountBadge type="sale" value={25} size="sm" />
								</div>
							</div>
							<div className="p-5">
								<h3 className="font-display text-lg font-medium">Sample Product</h3>
								<p className="text-sm text-muted-foreground mt-2">With subtle discount badge</p>
								<div className="flex items-end justify-between mt-4">
									<span className="text-2xl font-semibold">€89.99</span>
									<button className="px-4 py-2 bg-primary text-white rounded-full text-sm">
										Add to Cart
									</button>
								</div>
							</div>
						</div>

						{/* Mock Product Card 2 */}
						<div className="relative border-2 border-border rounded-2xl overflow-hidden bg-card">
							<div className="relative h-64 bg-gradient-to-br from-orange-500/20 to-red-500/20">
								<div className="absolute top-3 left-3 flex gap-2">
									<div className="px-3 py-1 bg-background/80 backdrop-blur-sm rounded-md text-xs font-mono">
										SKU-002
									</div>
									<DiscountBadge type="promoter" value={15} code="IVAN15" size="sm" variant="vibrant" />
								</div>
							</div>
							<div className="p-5">
								<h3 className="font-display text-lg font-medium">Another Product</h3>
								<p className="text-sm text-muted-foreground mt-2">With vibrant discount badge</p>
								<div className="flex items-end justify-between mt-4">
									<span className="text-2xl font-semibold">€149.99</span>
									<button className="px-4 py-2 bg-primary text-white rounded-full text-sm">
										Add to Cart
									</button>
								</div>
							</div>
						</div>
					</div>
				</section>

				{/* Dark Mode Test */}
				<section className="space-y-4">
					<h2 className="text-2xl font-display font-semibold">Dark Background Test</h2>
					<div className="flex flex-wrap gap-4 p-6 bg-black rounded-xl">
						<DiscountBadge type="sale" value={25} />
						<DiscountBadge type="promoter" value={15} code="PROMO" />
						<DiscountBadge type="signup" value={10} />
						<DiscountBadge type="sale" value={25} variant="vibrant" />
						<DiscountBadge type="promoter" value={15} variant="vibrant" />
					</div>
				</section>
			</div>
		</div>
	);
}