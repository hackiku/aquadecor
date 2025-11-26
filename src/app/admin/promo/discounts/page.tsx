// src/app/admin/promo/discounts/page.tsx

import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Plus, Calendar } from "lucide-react";

export default function DiscountsPage() {
	// Mock data - will be replaced with tRPC later
	const sales = [
		{
			id: "1",
			name: "Weekend akcija",
			date: "9-10 August",
			discount: "20%",
			code: "WEEKEND20",
			active: false,
		},
		{
			id: "2",
			name: "Black Friday 2024",
			date: "29 November",
			discount: "25%",
			code: "BLACKFRI25",
			active: false,
		},
	];

	const coupons = [
		{
			id: "1",
			code: "JOEY15",
			type: "Promoter discount",
			discount: "15%",
			expiry: "No expiration",
			active: true,
			usageCount: 31,
		},
		{
			id: "2",
			code: "SUMMER20",
			type: "Seasonal discount",
			discount: "20%",
			expiry: "September 1, 2025",
			active: true,
			usageCount: 67,
		},
		{
			id: "3",
			code: "NYSALE2025",
			type: "Holiday discount",
			discount: "25%",
			expiry: "January 15, 2025",
			active: true,
			usageCount: 23,
		},
	];

	return (
		<div className="space-y-8">
			{/* Header */}
			<div className="space-y-2">
				<h1 className="text-4xl font-display font-extralight tracking-tight">
					Discount Management
				</h1>
				<p className="text-muted-foreground font-display font-light text-lg">
					Manage sales campaigns and discount codes
				</p>
			</div>

			{/* Stats */}
			<div className="grid gap-6 md:grid-cols-3">
				<Card className="border-2">
					<CardHeader>
						<CardTitle className="font-display font-normal text-sm text-muted-foreground">
							Active Codes
						</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-3xl font-display font-light">
							{coupons.filter(c => c.active).length}
						</p>
					</CardContent>
				</Card>
				<Card className="border-2">
					<CardHeader>
						<CardTitle className="font-display font-normal text-sm text-muted-foreground">
							Total Usage
						</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-3xl font-display font-light">
							{coupons.reduce((sum, c) => sum + c.usageCount, 0)}
						</p>
					</CardContent>
				</Card>
				<Card className="border-2">
					<CardHeader>
						<CardTitle className="font-display font-normal text-sm text-muted-foreground">
							Upcoming Sales
						</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-3xl font-display font-light">0</p>
					</CardContent>
				</Card>
			</div>

			<div className="grid gap-8 lg:grid-cols-2">
				{/* Sales Campaigns */}
				<div className="space-y-6">
					<div className="flex items-center justify-between">
						<div>
							<h2 className="text-2xl font-display font-normal">Sales Campaigns</h2>
							<p className="text-sm text-muted-foreground font-display font-light mt-1">
								Seasonal and event-based sales
							</p>
						</div>
						<Button className="rounded-full">
							<Plus className="mr-2 h-4 w-4" />
							New Sale
						</Button>
					</div>

					<div className="space-y-4">
						{sales.map((sale) => (
							<Card key={sale.id} className="border-2 hover:border-primary/30 transition-colors">
								<CardContent className="pt-6">
									<div className="flex items-start justify-between">
										<div className="space-y-3">
											<div className="flex items-center gap-3">
												<h3 className="font-display font-normal text-lg">{sale.name}</h3>
												<Badge variant={sale.active ? "default" : "secondary"} className="font-display font-light">
													{sale.active ? "Active" : "Inactive"}
												</Badge>
											</div>
											<div className="space-y-1 text-sm">
												<div className="flex items-center gap-2 text-muted-foreground font-display font-light">
													<Calendar className="h-4 w-4" />
													{sale.date}
												</div>
												<p className="font-display font-light">
													<span className="text-muted-foreground">Discount:</span> {sale.discount}
												</p>
												<p className="font-display font-light">
													<span className="text-muted-foreground">Code:</span>{" "}
													<code className="px-2 py-1 bg-muted rounded text-xs">{sale.code}</code>
												</p>
											</div>
										</div>
										<Button variant="ghost" size="sm" className="font-display font-light">
											Edit
										</Button>
									</div>
								</CardContent>
							</Card>
						))}
					</div>
				</div>

				{/* Discount Coupons */}
				<div className="space-y-6">
					<div className="flex items-center justify-between">
						<div>
							<h2 className="text-2xl font-display font-normal">Discount Coupons</h2>
							<p className="text-sm text-muted-foreground font-display font-light mt-1">
								General and promoter codes
							</p>
						</div>
						<Button className="rounded-full">
							<Plus className="mr-2 h-4 w-4" />
							New Coupon
						</Button>
					</div>

					<div className="space-y-4">
						{coupons.map((coupon) => (
							<Card key={coupon.id} className="border-2 hover:border-primary/30 transition-colors">
								<CardContent className="pt-6">
									<div className="flex items-start justify-between">
										<div className="space-y-3">
											<div className="flex items-center gap-3">
												<code className="font-display font-normal text-lg bg-muted px-3 py-1 rounded">
													{coupon.code}
												</code>
												<Badge variant={coupon.active ? "default" : "secondary"} className="font-display font-light">
													{coupon.active ? "Active" : "Inactive"}
												</Badge>
											</div>
											<div className="space-y-1 text-sm">
												<p className="font-display font-light text-muted-foreground">
													{coupon.type}
												</p>
												<p className="font-display font-light">
													<span className="text-muted-foreground">Discount:</span> {coupon.discount}
												</p>
												<p className="font-display font-light">
													<span className="text-muted-foreground">Used:</span> {coupon.usageCount} times
												</p>
												<p className="font-display font-light text-xs text-muted-foreground">
													Expires: {coupon.expiry}
												</p>
											</div>
										</div>
										<Button variant="ghost" size="sm" className="font-display font-light">
											Edit
										</Button>
									</div>
								</CardContent>
							</Card>
						))}
					</div>
				</div>
			</div>

			{/* Info Banner */}
			<Card className="border-2 border-blue-500/20 bg-blue-500/5">
				<CardContent className="pt-6">
					<p className="text-sm font-display font-light text-muted-foreground">
						<strong className="font-normal">Note:</strong> Discount codes from promoters are managed in the{" "}
						<a href="/admin/promo/promoters" className="text-primary hover:underline">
							Promoters
						</a>{" "}
						section. This page is for general store-wide discounts and sales campaigns.
					</p>
				</CardContent>
			</Card>
		</div>
	);
}