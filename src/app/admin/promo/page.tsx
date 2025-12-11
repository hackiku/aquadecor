// src/app/admin/promo/page.tsx
"use client";

import { Suspense } from "react";
import Link from "next/link";
import { api } from "~/trpc/react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Percent, Users, ArrowRight, TrendingUp } from "lucide-react";
import { AdminChart } from "../_components/primitives/AdminChart";
import { Badge } from "~/components/ui/badge";

function PromoStats() {
	// Query the new promoter stats endpoint
	const { data: promoterStats, isLoading: isStatsLoading } = api.admin.promoter.getStats.useQuery();

	const formatPrice = (cents: number) => `€${(cents / 100).toFixed(2)}`;

	// --- MOCK CHART DATA ---
	// Real time-series data requires a separate endpoint, keeping this for chart visualization.
	const revenueData = [
		{ name: "Jan", revenue: 45000, commission: 4500 },
		{ name: "Feb", revenue: 68000, commission: 6800 },
		{ name: "Mar", revenue: 92000, commission: 9200 },
		{ name: "Apr", revenue: 115000, commission: 11500 },
		{ name: "May", revenue: 138000, commission: 13800 },
		{ name: "Jun", revenue: 162000, commission: 16200 },
	];
	// --- END MOCK DATA ---

	const activePromoters = promoterStats?.active || 0;
	const inactivePromoters = (promoterStats?.total || 0) - activePromoters;
	const promoterDistribution = [
		{ name: "Active", value: activePromoters },
		{ name: "Inactive", value: inactivePromoters },
	];


	return (
		<div className="space-y-8">
			{/* Header */}
			<div className="space-y-2">
				<h1 className="text-4xl font-display font-extralight tracking-tight">
					Promo Overview
				</h1>
				<p className="text-muted-foreground font-display font-light text-lg">
					Manage discounts and promoter partnerships
				</p>
			</div>

			{/* Stats Overview */}
			<div className="grid gap-6 md:grid-cols-3">
				<Card className="border-2">
					<CardHeader>
						<CardTitle className="font-display font-normal text-sm text-muted-foreground">
							Active Promoters
						</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-3xl font-display font-light">{isStatsLoading ? '...' : promoterStats?.active || 0}</p>
						<p className="text-xs text-muted-foreground font-display font-light mt-2">
							{isStatsLoading ? '...' : promoterStats?.total || 0} total
						</p>
					</CardContent>
				</Card>
				<Card className="border-2">
					<CardHeader>
						<CardTitle className="font-display font-normal text-sm text-muted-foreground">
							Total Orders
						</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-3xl font-display font-light">{isStatsLoading ? '...' : promoterStats?.totalOrders || 0}</p>
						<p className="text-xs text-green-600 font-display font-light mt-2 flex items-center gap-1">
							<TrendingUp className="h-3 w-3" />
							From promoter codes
						</p>
					</CardContent>
				</Card>
				<Card className="border-2">
					<CardHeader>
						<CardTitle className="font-display font-normal text-sm text-muted-foreground">
							Total Commission
						</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-3xl font-display font-light">
							{isStatsLoading ? '...' : formatPrice(promoterStats?.totalCommission || 0)}
						</p>
						<p className="text-xs text-muted-foreground font-display font-light mt-2">
							Revenue: {isStatsLoading ? '...' : formatPrice(promoterStats?.totalRevenue || 0)}
						</p>
					</CardContent>
				</Card>
			</div>

			{/* Charts Row */}
			<div className="grid gap-6 lg:grid-cols-2">
				<Card className="border-2">
					<CardHeader>
						<CardTitle className="font-display font-normal">Revenue & Commission</CardTitle>
					</CardHeader>
					<CardContent>
						<AdminChart
							type="line"
							data={revenueData.map(d => ({ // Convert mock cents to display currency
								name: d.name,
								revenue: d.revenue / 100,
								commission: d.commission / 100
							}))}
							dataKeys={["revenue", "commission"]}
							colors={["hsl(var(--primary))", "hsl(var(--chart-2))"]}
						/>
					</CardContent>
				</Card>

				<Card className="border-2">
					<CardHeader>
						<CardTitle className="font-display font-normal">Promoter Status</CardTitle>
					</CardHeader>
					<CardContent>
						<AdminChart
							type="pie"
							data={promoterDistribution}
							colors={["hsl(var(--primary))", "hsl(var(--muted))"]}
						/>
					</CardContent>
				</Card>
			</div>

			{/* Main Sections */}
			<div className="grid gap-6 md:grid-cols-2">
				{/* Promoters */}
				<Link href="/admin/promo/promoters">
					<Card className="border-2 hover:border-primary/50 hover:shadow-lg transition-all group h-full">
						<CardHeader className="space-y-4">
							<div className="flex items-start justify-between">
								<div className="space-y-2">
									<div className="flex items-center gap-3">
										<div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
											<Users className="h-6 w-6 text-primary" />
										</div>
										<h3 className="text-2xl font-display font-light group-hover:text-primary transition-colors">
											Promoters
										</h3>
									</div>
									<p className="text-muted-foreground font-display font-light">
										Manage affiliate partners and commission tracking
									</p>
								</div>
								<ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
							</div>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="space-y-2">
								<div className="flex justify-between text-sm">
									<span className="text-muted-foreground font-display font-light">
										Active promoters
									</span>
									<span className="font-display font-normal">{isStatsLoading ? '...' : promoterStats?.active || 0}</span>
								</div>
								<div className="flex justify-between text-sm">
									<span className="text-muted-foreground font-display font-light">
										Total orders
									</span>
									<span className="font-display font-normal">{isStatsLoading ? '...' : promoterStats?.totalOrders || 0}</span>
								</div>
								<div className="flex justify-between text-sm">
									<span className="text-muted-foreground font-display font-light">
										Total commission
									</span>
									<span className="font-display font-normal">
										{isStatsLoading ? '...' : formatPrice(promoterStats?.totalCommission || 0)}
									</span>
								</div>
							</div>
						</CardContent>
					</Card>
				</Link>

				{/* Discounts */}
				<Link href="/admin/promo/sales">
					<Card className="border-2 hover:border-primary/50 hover:shadow-lg transition-all group h-full">
						<CardHeader className="space-y-4">
							<div className="flex items-start justify-between">
								<div className="space-y-2">
									<div className="flex items-center gap-3">
										<div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
											<Percent className="h-6 w-6 text-primary" />
										</div>
										<h3 className="text-2xl font-display font-light group-hover:text-primary transition-colors">
											Discounts & Sales
										</h3>
									</div>
									<p className="text-muted-foreground font-display font-light">
										Create and manage sales campaigns and discount codes
									</p>
								</div>
								<ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
							</div>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="space-y-2">
								<div className="flex justify-between text-sm">
									<span className="text-muted-foreground font-display font-light">
										Active Campaigns
									</span>
									<span className="font-display font-normal">{isStatsLoading ? '...' : 'TBD'}</span>
								</div>
								<div className="flex justify-between text-sm">
									<span className="text-muted-foreground font-display font-light">
										Total Usage
									</span>
									<span className="font-display font-normal">{isStatsLoading ? '...' : 'TBD'}</span>
								</div>
								<div className="flex justify-between text-sm">
									<span className="text-muted-foreground font-display font-light">
										Total Revenue from Sales
									</span>
									<span className="font-display font-normal">{isStatsLoading ? '...' : 'TBD'}</span>
								</div>
							</div>
						</CardContent>
					</Card>
				</Link>
			</div>

			{/* Recent Activity */}
			<Card className="border-2">
				<CardHeader>
					<CardTitle className="font-display font-normal">Recent Promoter Activity</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="space-y-4">
						<div className="flex items-start gap-4 pb-4 border-b">
							<div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center">
								<Users className="h-4 w-4 text-green-600" />
							</div>
							<div className="flex-1">
								<p className="font-display font-normal text-sm">
									Promoter JOEY15 generated order
								</p>
								<p className="text-xs text-muted-foreground font-display font-light">
									Order #ORD-2025-006 • €10.51 commission • Recently
								</p>
							</div>
							<Badge variant="outline" className="font-display font-light">
								Delivered
							</Badge>
						</div>
						<div className="text-center py-4">
							<p className="text-sm text-muted-foreground font-display font-light">
								More activity tracking coming soon
							</p>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}

export default function PromoOverviewPage() {
	return (
		<Suspense fallback={
			<div className="space-y-8">
				<h1 className="text-4xl font-display font-extralight">Promo Overview</h1>
				<p className="text-muted-foreground font-display font-light">Loading...</p>
			</div>
		}>
			<PromoStats />
		</Suspense>
	);
}