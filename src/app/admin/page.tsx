// src/app/admin/page.tsx

import { Suspense } from "react";
import { StatCard } from "./_components/primitives/StatCard";
import { api } from "~/trpc/server";
import { ShoppingBag, Layers, Package, Star } from "lucide-react";
import Link from "next/link";
import { Button } from "~/components/ui/button";

async function DashboardStats() {
	const [productStats, categoryStats] = await Promise.all([
		api.admin.product.getStats(),
		api.admin.category.getStats(),
	]);

	return (
		<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
			<StatCard
				title="Total Products"
				value={productStats.total}
				icon={ShoppingBag}
				description={`${productStats.active} active, ${productStats.inactive} inactive`}
			/>
			<StatCard
				title="Categories"
				value={categoryStats.total}
				icon={Layers}
				description={`${categoryStats.byProductLine["3d-backgrounds"]} backgrounds, ${categoryStats.byProductLine["aquarium-decorations"]} decorations`}
			/>
			<StatCard
				title="Featured Products"
				value={productStats.featured}
				icon={Star}
				description="Shown on homepage"
			/>
			<StatCard
				title="Stock Status"
				value={productStats.stockBreakdown.in_stock}
				icon={Package}
				description={`${productStats.stockBreakdown.made_to_order} made-to-order`}
			/>
		</div>
	);
}

export default async function AdminDashboard() {
	return (
		<div className="space-y-8">
			<div className="space-y-2">
				<h1 className="text-4xl font-display font-extralight tracking-tight">Dashboard</h1>
				<p className="text-muted-foreground font-display font-light text-lg">
					Overview of your catalog and store performance
				</p>
			</div>

			{/* Stats Grid */}
			<Suspense fallback={<div className="text-muted-foreground font-display font-light">Loading stats...</div>}>
				<DashboardStats />
			</Suspense>

			{/* Quick Actions */}
			<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
				<Link href="/admin/catalog/products">
					<div className="group p-6 rounded-2xl border-2 border-border hover:border-primary/50 transition-all hover:shadow-lg space-y-3">
						<div className="flex items-center gap-3">
							<div className="p-3 rounded-full bg-primary/10">
								<ShoppingBag className="h-6 w-6 text-primary" />
							</div>
							<h3 className="text-xl font-display font-normal">Manage Products</h3>
						</div>
						<p className="text-sm text-muted-foreground font-display font-light">
							View, edit, and organize your product catalog
						</p>
					</div>
				</Link>

				<Link href="/admin/catalog/categories">
					<div className="group p-6 rounded-2xl border-2 border-border hover:border-primary/50 transition-all hover:shadow-lg space-y-3">
						<div className="flex items-center gap-3">
							<div className="p-3 rounded-full bg-primary/10">
								<Layers className="h-6 w-6 text-primary" />
							</div>
							<h3 className="text-xl font-display font-normal">Manage Categories</h3>
						</div>
						<p className="text-sm text-muted-foreground font-display font-light">
							Organize products into categories and product lines
						</p>
					</div>
				</Link>

				<Link href="/admin/gallery">
					<div className="group p-6 rounded-2xl border-2 border-border hover:border-primary/50 transition-all hover:shadow-lg space-y-3">
						<div className="flex items-center gap-3">
							<div className="p-3 rounded-full bg-primary/10">
								<Package className="h-6 w-6 text-primary" />
							</div>
							<h3 className="text-xl font-display font-normal">Media Gallery</h3>
						</div>
						<p className="text-sm text-muted-foreground font-display font-light">
							Upload and manage product images
						</p>
					</div>
				</Link>
			</div>
		</div>
	);
}