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
import { ExternalLink } from "lucide-react";
// import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";

// Mock data - replace with real data later
const orders = [
	{
		id: "ORD-2024-882",
		date: "2024-01-15",
		total: "€450.00",
		status: "inProduction" as const,
		items: "F1 Background (Custom)",
		tracking: null
	},
	{
		id: "ORD-2023-104",
		date: "2023-11-20",
		total: "€89.00",
		status: "delivered" as const,
		items: "Z1 Plant, D5 Rocks",
		tracking: "DHL-123456789"
	}
];

export default async function OrdersPage() {
	const t = await getTranslations("account.orders");

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl md:text-3xl font-display font-light">
						{t("title")}
					</h1>
					<p className="text-muted-foreground font-display font-light">
						{t("subtitle")}
					</p>
				</div>
				<MobileAccountNav />
			</div>

			<div className="rounded-xl border bg-card">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead className="w-[100px]">{t("table.order")}</TableHead>
							<TableHead>{t("table.date")}</TableHead>
							<TableHead>{t("table.status")}</TableHead>
							<TableHead className="hidden md:table-cell">
								{t("table.items")}
							</TableHead>
							<TableHead className="text-right">{t("table.total")}</TableHead>
							<TableHead className="text-right">{t("table.actions")}</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{orders.map((order) => (
							<TableRow key={order.id}>
								<TableCell className="font-medium font-display">
									{order.id}
								</TableCell>
								<TableCell className="font-display text-muted-foreground">
									{order.date}
								</TableCell>
								<TableCell>
									<Badge
										variant={order.status === "delivered" ? "secondary" : "default"}
										className="font-display font-normal"
									>
										{t(`status.${order.status}`)}
									</Badge>
								</TableCell>
								<TableCell className="hidden md:table-cell font-display text-sm text-muted-foreground">
									{order.items}
								</TableCell>
								<TableCell className="text-right font-display">
									{order.total}
								</TableCell>
								<TableCell className="text-right">
									{order.tracking ? (
										<Button variant="ghost" size="sm" className="h-8 w-8 p-0">
											<ExternalLink className="h-4 w-4" />
											<span className="sr-only">{t("table.track")}</span>
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