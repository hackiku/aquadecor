// src/app/admin/page.tsx

import { Suspense } from "react";
import { AdminCard } from "./_components/primitives/AdminCard";
import { StatCard } from "./_components/primitives/StatCard";
import { AdminChart } from "./_components/primitives/AdminChart";
import { api } from "~/trpc/server";
import { ShoppingCart, DollarSign, Users, TrendingUp } from "lucide-react";

export default async function AdminDashboard() {
	// TODO: Fetch real stats from tRPC
	const stats = {
		revenue: "$12,453",
		orders: 143,
		customers: 89,
		conversionRate: "3.2%",
	};

	return (
		<div className="space-y-8">
			<div>
				<h1 className="text-3xl font-bold">Dashboard</h1>
				<p className="text-muted-foreground">
					Overview of your store performance
				</p>
			</div>

			{/* Stats Grid */}
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				<StatCard
					title="Total Revenue"
					value={stats.revenue}
					icon={DollarSign}
					trend="+12.5%"
					trendUp
				/>
				<StatCard
					title="Orders"
					value={stats.orders}
					icon={ShoppingCart}
					trend="+8.2%"
					trendUp
				/>
				<StatCard
					title="Customers"
					value={stats.customers}
					icon={Users}
					trend="+23.1%"
					trendUp
				/>
				<StatCard
					title="Conversion"
					value={stats.conversionRate}
					icon={TrendingUp}
					trend="-2.4%"
					trendUp={false}
				/>
			</div>

			{/* Charts */}
			<div className="grid gap-4 md:grid-cols-2">
				<AdminCard title="Revenue Overview" description="Last 30 days">
					<Suspense fallback={<div>Loading...</div>}>
						<AdminChart type="line" />
					</Suspense>
				</AdminCard>

				<AdminCard title="Top Products" description="Best sellers">
					<Suspense fallback={<div>Loading...</div>}>
						<AdminChart type="bar" />
					</Suspense>
				</AdminCard>
			</div>
		</div>
	);
}