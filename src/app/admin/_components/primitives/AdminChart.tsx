// src/app/admin/_components/primitives/AdminChart.tsx

"use client";

import { Card } from "~/components/ui/card";

interface AdminChartProps {
	type: "line" | "bar" | "pie";
	data?: any; // TODO: Add proper chart data types when implementing
}

export function AdminChart({ type, data }: AdminChartProps) {
	// TODO: Implement with recharts or similar
	// For now, just placeholder
	return (
		<div className="h-[300px] flex items-center justify-center border rounded-lg bg-muted/10">
			<p className="text-sm text-muted-foreground">
				{type.charAt(0).toUpperCase() + type.slice(1)} chart placeholder
				<br />
				<span className="text-xs">(Implement with recharts)</span>
			</p>
		</div>
	);
}