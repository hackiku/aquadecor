// src/app/admin/_components/primitives/AdminChart.tsx

"use client";

import {
	LineChart,
	Line,
	BarChart,
	Bar,
	PieChart,
	Pie,
	Cell,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	ResponsiveContainer,
} from "recharts";

export interface ChartDataPoint {
	name: string;
	value: number;
	[key: string]: any;
}

interface AdminChartProps {
	type: "line" | "bar" | "pie";
	data: ChartDataPoint[];
	dataKeys?: string[]; // For line/bar charts with multiple series
	colors?: string[];
	height?: number;
}

const DEFAULT_COLORS = [
	"hsl(var(--primary))",
	"hsl(var(--chart-1))",
	"hsl(var(--chart-2))",
	"hsl(var(--chart-3))",
	"hsl(var(--chart-4))",
];

export function AdminChart({
	type,
	data,
	dataKeys = ["value"],
	colors = DEFAULT_COLORS,
	height = 300,
}: AdminChartProps) {
	if (type === "line") {
		return (
			<ResponsiveContainer width="100%" height={height}>
				<LineChart data={data}>
					<CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
					<XAxis
						dataKey="name"
						className="text-xs"
						stroke="hsl(var(--muted-foreground))"
					/>
					<YAxis
						className="text-xs"
						stroke="hsl(var(--muted-foreground))"
					/>
					<Tooltip
						contentStyle={{
							backgroundColor: "hsl(var(--card))",
							border: "1px solid hsl(var(--border))",
							borderRadius: "8px",
						}}
					/>
					<Legend />
					{dataKeys.map((key, index) => (
						<Line
							key={key}
							type="monotone"
							dataKey={key}
							stroke={colors[index % colors.length]}
							strokeWidth={2}
							dot={{ fill: colors[index % colors.length] }}
						/>
					))}
				</LineChart>
			</ResponsiveContainer>
		);
	}

	if (type === "bar") {
		return (
			<ResponsiveContainer width="100%" height={height}>
				<BarChart data={data}>
					<CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
					<XAxis
						dataKey="name"
						className="text-xs"
						stroke="hsl(var(--muted-foreground))"
					/>
					<YAxis
						className="text-xs"
						stroke="hsl(var(--muted-foreground))"
					/>
					<Tooltip
						contentStyle={{
							backgroundColor: "hsl(var(--card))",
							border: "1px solid hsl(var(--border))",
							borderRadius: "8px",
						}}
					/>
					<Legend />
					{dataKeys.map((key, index) => (
						<Bar
							key={key}
							dataKey={key}
							fill={colors[index % colors.length]}
							radius={[4, 4, 0, 0]}
						/>
					))}
				</BarChart>
			</ResponsiveContainer>
		);
	}

	if (type === "pie") {
		return (
			<ResponsiveContainer width="100%" height={height}>
				<PieChart>
					<Pie
						data={data}
						cx="50%"
						cy="50%"
						labelLine={false}
						label={({ name, percent }) =>
							`${name}: ${(percent * 100).toFixed(0)}%`
						}
						outerRadius={80}
						fill="hsl(var(--primary))"
						dataKey="value"
					>
						{data.map((entry, index) => (
							<Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
						))}
					</Pie>
					<Tooltip
						contentStyle={{
							backgroundColor: "hsl(var(--card))",
							border: "1px solid hsl(var(--border))",
							borderRadius: "8px",
						}}
					/>
				</PieChart>
			</ResponsiveContainer>
		);
	}

	return null;
}
