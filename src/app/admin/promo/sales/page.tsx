// src/app/admin/promo/sales/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Plus, Calendar, Code, TrendingUp, Eye, Trash2 } from "lucide-react";
import { api } from "~/trpc/react";

type StatusFilter = "all" | "active" | "upcoming" | "expired";

export default function SalesPage() {
	const router = useRouter();
	const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

	// Fetch sales and stats
	const { data: sales, refetch } = api.admin.sale.getAll.useQuery({
		status: statusFilter,
		sortBy: "created",
		sortOrder: "desc",
	});

	const { data: stats } = api.admin.sale.getStats.useQuery();

	const deleteSale = api.admin.sale.delete.useMutation({
		onSuccess: () => {
			refetch();
		},
	});

	const handleDelete = async (id: string, name: string) => {
		if (confirm(`Are you sure you want to delete "${name}"?`)) {
			await deleteSale.mutateAsync({ id });
		}
	};

	// Helper to determine sale status
	const getSaleStatus = (sale: any) => {
		const now = new Date();
		const starts = new Date(sale.startsAt);
		const ends = new Date(sale.endsAt);

		if (!sale.isActive) return "inactive";
		if (now < starts) return "upcoming";
		if (now > ends) return "expired";
		return "active";
	};

	const getStatusBadge = (status: string) => {
		switch (status) {
			case "active":
				return <Badge variant="default" className="font-display font-light">Active</Badge>;
			case "upcoming":
				return <Badge variant="secondary" className="font-display font-light bg-blue-500/10 text-blue-700">Upcoming</Badge>;
			case "expired":
				return <Badge variant="secondary" className="font-display font-light">Expired</Badge>;
			case "inactive":
				return <Badge variant="secondary" className="font-display font-light">Inactive</Badge>;
			default:
				return null;
		}
	};

	const formatCurrency = (cents: number) => {
		return `€${(cents / 100).toLocaleString("en-US", { minimumFractionDigits: 2 })}`;
	};

	const formatDate = (date: Date | string) => {
		return new Date(date).toLocaleDateString("en-US", {
			month: "short",
			day: "numeric",
			year: "numeric",
		});
	};

	return (
		<div className="space-y-8">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div className="space-y-2">
					<h1 className="text-4xl font-display font-extralight tracking-tight">
						Sales Campaigns
					</h1>
					<p className="text-muted-foreground font-display font-light text-lg">
						Manage time-bound promotional sales
					</p>
				</div>
				<Button asChild className="rounded-full">
					<Link href="/admin/promo/sales/new">
						<Plus className="mr-2 h-4 w-4" />
						New Sale
					</Link>
				</Button>
			</div>

			{/* Stats */}
			<div className="grid gap-6 md:grid-cols-4">
				<Card className="border-2">
					<CardHeader>
						<CardTitle className="font-display font-normal text-sm text-muted-foreground">
							Total Sales
						</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-3xl font-display font-light">
							{stats?.total ?? 0}
						</p>
					</CardContent>
				</Card>
				<Card className="border-2">
					<CardHeader>
						<CardTitle className="font-display font-normal text-sm text-muted-foreground">
							Active Now
						</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-3xl font-display font-light text-green-600">
							{stats?.active ?? 0}
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
							{stats?.totalUsage ?? 0}
						</p>
					</CardContent>
				</Card>
				<Card className="border-2">
					<CardHeader>
						<CardTitle className="font-display font-normal text-sm text-muted-foreground">
							Total Revenue
						</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-3xl font-display font-light">
							{formatCurrency(stats?.totalRevenue ?? 0)}
						</p>
					</CardContent>
				</Card>
			</div>

			{/* Filters */}
			<div className="flex gap-2">
				{(["all", "active", "upcoming", "expired"] as StatusFilter[]).map((filter) => (
					<Button
						key={filter}
						variant={statusFilter === filter ? "default" : "outline"}
						onClick={() => setStatusFilter(filter)}
						className="rounded-full font-display font-light capitalize"
					>
						{filter}
					</Button>
				))}
			</div>

			{/* Sales List */}
			<div className="space-y-4">
				{sales?.map((sale) => {
					const status = getSaleStatus(sale);

					return (
						<Card key={sale.id} className="border-2 hover:border-primary/30 transition-colors">
							<CardContent className="pt-6">
								<div className="flex items-start justify-between">
									<div className="space-y-3 flex-1">
										<div className="flex items-center gap-3 flex-wrap">
											<h3 className="font-display font-normal text-lg">{sale.name}</h3>
											{getStatusBadge(status)}
											<Badge variant="outline" className="font-display font-light">
												{sale.bannerType}
											</Badge>
										</div>

										<div className="grid md:grid-cols-2 gap-4 text-sm">
											<div className="space-y-1">
												<div className="flex items-center gap-2 text-muted-foreground font-display font-light">
													<Calendar className="h-4 w-4" />
													{formatDate(sale.startsAt)} - {formatDate(sale.endsAt)}
												</div>
												<div className="flex items-center gap-2 font-display font-light">
													<Code className="h-4 w-4" />
													<code className="px-2 py-1 bg-muted rounded text-xs">{sale.discountCode}</code>
													<span className="text-muted-foreground">({sale.discountPercent}% off)</span>
												</div>
											</div>

											<div className="space-y-1">
												<div className="flex items-center gap-2 font-display font-light">
													<TrendingUp className="h-4 w-4" />
													<span className="text-muted-foreground">Used:</span> {sale.usageCount} times
												</div>
												<div className="flex items-center gap-2 font-display font-light">
													<span className="text-muted-foreground">Revenue:</span> {formatCurrency(sale.totalRevenue)}
												</div>
												<div className="flex items-center gap-2 font-display font-light">
													<Eye className="h-4 w-4" />
													<span className="text-muted-foreground">Visible on:</span> {sale.visibleOn.join(", ")}
												</div>
											</div>
										</div>
									</div>

									<div className="flex gap-2 ml-4">
										<Button
											variant="ghost"
											size="sm"
											className="font-display font-light"
											asChild
										>
											<Link href={`/admin/promo/sales/${sale.id}`}>
												Edit
											</Link>
										</Button>
										<Button
											variant="ghost"
											size="sm"
											className="font-display font-light text-destructive hover:text-destructive"
											onClick={() => handleDelete(sale.id, sale.name)}
										>
											<Trash2 className="h-4 w-4" />
										</Button>
									</div>
								</div>
							</CardContent>
						</Card>
					);
				})}

				{(!sales || sales.length === 0) && (
					<Card className="border-2 border-dashed">
						<CardContent className="pt-6 text-center py-12">
							<p className="text-muted-foreground font-display font-light">
								No sales campaigns found. Create your first sale to get started!
							</p>
						</CardContent>
					</Card>
				)}
			</div>
		</div>
	);
}