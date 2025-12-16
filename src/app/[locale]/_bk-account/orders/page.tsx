// src/app/[locale]/account/orders/page.tsx
import { MobileAccountNav } from "../_components/MobileAccountNav";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow
} from "~/components/ui/table";
import { Package, ExternalLink } from "lucide-react";
// Mock data
const orders = [
	{
		id: "ORD-2024-882",
		date: "2024-01-15",
		total: "€450.00",
		status: "In Production",
		items: "F1 Background (Custom)",
		tracking: null
	},
	{
		id: "ORD-2023-104",
		date: "2023-11-20",
		total: "€89.00",
		status: "Delivered",
		items: "Z1 Plant, D5 Rocks",
		tracking: "DHL-123456789"
	}
];
export default function OrdersPage() {
	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl md:text-3xl font-display font-light">My Orders</h1>
					<p className="text-muted-foreground font-display font-light">
						View and track your order history.
					</p>
				</div>
				<MobileAccountNav />
			</div>
			<div className="rounded-xl border bg-card">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead className="w-[100px]">Order</TableHead>
							<TableHead>Date</TableHead>
							<TableHead>Status</TableHead>
							<TableHead className="hidden md:table-cell">Items</TableHead>
							<TableHead className="text-right">Total</TableHead>
							<TableHead className="text-right">Actions</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{orders.map((order) => (
							<TableRow key={order.id}>
								<TableCell className="font-medium font-display">{order.id}</TableCell>
								<TableCell className="font-display text-muted-foreground">{order.date}</TableCell>
								<TableCell>
									<Badge
										variant={order.status === "Delivered" ? "secondary" : "default"}
										className="font-display font-normal"
									>
										{order.status}
									</Badge>
								</TableCell>
								<TableCell className="hidden md:table-cell font-display text-sm text-muted-foreground">
									{order.items}
								</TableCell>
								<TableCell className="text-right font-display">{order.total}</TableCell>
								<TableCell className="text-right">
									{order.tracking ? (
										<Button variant="ghost" size="sm" className="h-8 w-8 p-0">
											<ExternalLink className="h-4 w-4" />
											<span className="sr-only">Track</span>
										</Button>
									) : (
										<span className="text-xs text-muted-foreground font-display">-</span>
									)}
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
		</div>
	);
}