// src/app/admin/_components/primitives/StatCard.tsx

import { type LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { cn } from "~/lib/utils";
import { TrendingUp, TrendingDown } from "lucide-react";

interface StatCardProps {
	title: string;
	value: string | number;
	icon: LucideIcon;
	trend?: string;
	trendUp?: boolean;
	description?: string;
}

export function StatCard({
	title,
	value,
	icon: Icon,
	trend,
	trendUp,
	description,
}: StatCardProps) {
	return (
		<Card>
			<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
				<CardTitle className="text-sm font-medium">{title}</CardTitle>
				<Icon className="h-4 w-4 text-muted-foreground" />
			</CardHeader>
			<CardContent>
				<div className="text-2xl font-bold">{value}</div>
				{trend && (
					<div className="flex items-center text-xs text-muted-foreground mt-1">
						{trendUp ? (
							<TrendingUp className="mr-1 h-3 w-3 text-green-500" />
						) : (
							<TrendingDown className="mr-1 h-3 w-3 text-red-500" />
						)}
						<span className={cn(trendUp ? "text-green-500" : "text-red-500")}>
							{trend}
						</span>
						<span className="ml-1">from last month</span>
					</div>
				)}
				{description && (
					<p className="text-xs text-muted-foreground mt-1">{description}</p>
				)}
			</CardContent>
		</Card>
	);
}