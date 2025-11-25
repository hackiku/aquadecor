// src/app/admin/promo/page.tsx

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Percent, Users, ArrowRight, TrendingUp } from "lucide-react";

export default function PromoOverviewPage() {
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
							Active Discounts
						</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-3xl font-display font-light">8</p>
						<p className="text-xs text-muted-foreground font-display font-light mt-2">
							2 expiring soon
						</p>
					</CardContent>
				</Card>
				<Card className="border-2">
					<CardHeader>
						<CardTitle className="font-display font-normal text-sm text-muted-foreground">
							Active Promoters
						</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-3xl font-display font-light">7</p>
						<p className="text-xs text-muted-foreground font-display font-light mt-2">
							12 codes in use
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
						<p className="text-3xl font-display font-light">€847.50</p>
						<p className="text-xs text-green-600 font-display font-light mt-2 flex items-center gap-1">
							<TrendingUp className="h-3 w-3" />
							+12% this month
						</p>
					</CardContent>
				</Card>
			</div>

			{/* Main Sections */}
			<div className="grid gap-6 md:grid-cols-2">
				{/* Discounts */}
				<Link href="/admin/discounts">
					<Card className="border-2 hover:border-primary/50 hover:shadow-lg transition-all group h-full">
						<CardHeader className="space-y-4">
							<div className="flex items-start justify-between">
								<div className="space-y-2">
									<div className="flex items-center gap-3">
										<div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
											<Percent className="h-6 w-6 text-primary" />
										</div>
										<h3 className="text-2xl font-display font-light group-hover:text-primary transition-colors">
											Discounts
										</h3>
									</div>
									<p className="text-muted-foreground font-display font-light">
										Create and manage discount codes for your shop
									</p>
								</div>
								<ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
							</div>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="space-y-2">
								<div className="flex justify-between text-sm">
									<span className="text-muted-foreground font-display font-light">
										Active codes
									</span>
									<span className="font-display font-normal">8</span>
								</div>
								<div className="flex justify-between text-sm">
									<span className="text-muted-foreground font-display font-light">
										Total usage
									</span>
									<span className="font-display font-normal">234</span>
								</div>
								<div className="flex justify-between text-sm">
									<span className="text-muted-foreground font-display font-light">
										Total savings
									</span>
									<span className="font-display font-normal">€3,421.00</span>
								</div>
							</div>
						</CardContent>
					</Card>
				</Link>

				{/* Promoters */}
				<Link href="/admin/promoters">
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
									<span className="font-display font-normal">7</span>
								</div>
								<div className="flex justify-between text-sm">
									<span className="text-muted-foreground font-display font-light">
										Total orders
									</span>
									<span className="font-display font-normal">67</span>
								</div>
								<div className="flex justify-between text-sm">
									<span className="text-muted-foreground font-display font-light">
										Total commission
									</span>
									<span className="font-display font-normal">€847.50</span>
								</div>
							</div>
						</CardContent>
					</Card>
				</Link>
			</div>

			{/* Recent Activity */}
			<Card className="border-2">
				<CardHeader>
					<CardTitle className="font-display font-normal">Recent Activity</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="space-y-4">
						<div className="flex items-start gap-4 pb-4 border-b">
							<div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center">
								<Percent className="h-4 w-4 text-green-600" />
							</div>
							<div className="flex-1">
								<p className="font-display font-normal text-sm">
									Discount code SUMMER25 used
								</p>
								<p className="text-xs text-muted-foreground font-display font-light">
									Order #ORD-2024-00892 • €49.50 saved • 2 hours ago
								</p>
							</div>
						</div>
						<div className="flex items-start gap-4 pb-4 border-b">
							<div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
								<Users className="h-4 w-4 text-blue-600" />
							</div>
							<div className="flex-1">
								<p className="font-display font-normal text-sm">
									Promoter JOEY15 generated order
								</p>
								<p className="text-xs text-muted-foreground font-display font-light">
									Order #ORD-2024-00887 • €12.75 commission • 5 hours ago
								</p>
							</div>
						</div>
						<div className="flex items-start gap-4">
							<div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
								<Percent className="h-4 w-4 text-purple-600" />
							</div>
							<div className="flex-1">
								<p className="font-display font-normal text-sm">
									New discount code HOLIDAY20 created
								</p>
								<p className="text-xs text-muted-foreground font-display font-light">
									Active from Dec 15 - Jan 5 • 1 day ago
								</p>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}