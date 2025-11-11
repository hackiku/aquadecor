// src/app/admin/orders/page.tsx

import { Suspense } from "react";
import { AdminTable } from "../_components/primitives/AdminTable";
import { Badge } from "~/components/ui/badge";
import { api } from "~/trpc/server";
import Link from "next/link";

export default async function OrdersPage() {
	const orders = await api.order.getAll(); // TODO: Implement

	const columns = [
		{ header: "Order ID", accessorKey: "id" },
		{ header: "Email", accessorKey: "email" },
		{ header: "Date", accessorKey: "createdAt" },
		{ header: "Price", accessorKey: "total" },
		{
			header: "Status",
			accessorKey: "status",
			cell: (row: any) => (
				<Badge
					variant={row.status === "Paid" ? "default" : "destructive"}
				>
					{row.status}
				</Badge>
			),
		},
		{ header: "Discount Code", accessorKey: "discountCode" },
	];

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold">Orders</h1>
					<p className="text-muted-foreground">
						Click on single order to see details
					</p>
				</div>
			</div>

			<Suspense fallback={<div>Loading orders...</div>}>
				<AdminTable
					columns={columns}
					data={orders}
					onRowClick={(row) => `/admin/orders/${row.id}`}
				/>
			</Suspense>
		</div>
	);
}