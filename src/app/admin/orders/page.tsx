// src/app/admin/orders/page.tsx

"use client";

import { useState, useMemo } from "react";
import { mockOrders, type Order } from "../_data/orders";
import { OrdersFilter } from "./_components/OrdersFilter";
import { AdminTable, type Column } from "../_components/primitives/AdminTable";
import { Badge } from "~/components/ui/badge";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function OrdersPage() {
	const [filters, setFilters] = useState<{ email?: string; discountCode?: string }>({});
	const [currentPage, setCurrentPage] = useState(1);

	// Filter orders
	const filteredOrders = useMemo(() => {
		let result = mockOrders;

		if (filters.email) {
			result = result.filter((order) =>
				order.email.toLowerCase().includes(filters.email!.toLowerCase()) ||
				order.orderNumber.toLowerCase().includes(filters.email!.toLowerCase())
			);
		}

		if (filters.discountCode) {
			result = result.filter((order) =>
				order.discountCode?.toLowerCase().includes(filters.discountCode!.toLowerCase())
			);
		}

		return result;
	}, [filters]);

	const formatPrice = (cents: number, currency: string = "EUR") => {
		const symbol = currency === "EUR" ? "€" : "$";
		return `${symbol}${(cents / 100).toFixed(2)}`;
	};

	const formatDate = (date: Date) => {
		return new Intl.DateTimeFormat("en-GB", {
			day: "2-digit",
			month: "short",
			year: "numeric",
			hour: "2-digit",
			minute: "2-digit",
			hour12: false,
		}).format(date);
	};

	const getStatusBadge = (status: Order["status"]) => {
		const variants = {
			pending: { variant: "secondary" as const, label: "Pending" },
			confirmed: { variant: "default" as const, label: "Confirmed" },
			in_production: { variant: "default" as const, label: "In Production" },
			ready_to_ship: { variant: "default" as const, label: "Ready to Ship" },
			shipped: { variant: "default" as const, label: "Shipped" },
			delivered: { variant: "default" as const, label: "Delivered" },
			cancelled: { variant: "destructive" as const, label: "Cancelled" },
			refunded: { variant: "destructive" as const, label: "Refunded" },
			abandoned: { variant: "destructive" as const, label: "Abandoned" },
		};
		return variants[status];
	};

	const getPaymentBadge = (status: Order["paymentStatus"]) => {
		const variants = {
			pending: { variant: "secondary" as const, label: "Pending" },
			paid: { variant: "default" as const, label: "Paid", color: "bg-blue-500" },
			failed: { variant: "destructive" as const, label: "Failed" },
			refunded: { variant: "destructive" as const, label: "Refunded" },
		};
		return variants[status];
	};

	const columns: Column<Order>[] = [
		{
			header: "Order ID",
			accessorKey: "orderNumber",
			cell: (row) => (
				<div className="space-y-1">
					<p className="font-display font-normal text-primary text-sm">
						{row.orderNumber}
					</p>
					<p className="font-display font-light text-xs text-muted-foreground font-mono">
						{row.id.split("-")[0]}...
					</p>
				</div>
			),
		},
		{
			header: "Email",
			accessorKey: "email",
			cell: (row) => (
				<span className="font-display font-light text-sm">
					{row.email}
				</span>
			),
		},
		{
			header: "Date",
			accessorKey: "createdAt",
			cell: (row) => (
				<span className="font-display font-light text-sm whitespace-nowrap">
					{formatDate(row.createdAt)}
				</span>
			),
		},
		{
			header: "Price",
			accessorKey: "total",
			cell: (row) => (
				<span className="font-display font-normal">
					{formatPrice(row.total, row.currency)}
				</span>
			),
		},
		{
			header: "Status",
			accessorKey: "status",
			cell: (row) => {
				const statusInfo = getStatusBadge(row.status);
				return (
					<Badge variant={statusInfo.variant} className="font-display font-light">
						{statusInfo.label}
					</Badge>
				);
			},
		},
		{
			header: "Payment",
			accessorKey: "paymentStatus",
			cell: (row) => {
				const paymentInfo = getPaymentBadge(row.paymentStatus);
				return (
					<Badge
						variant={paymentInfo.variant}
						className={`font-display font-light ${paymentInfo.color || ""}`}
					>
						{paymentInfo.label}
					</Badge>
				);
			},
		},
		{
			header: "Discount Code",
			accessorKey: "discountCode",
			cell: (row) => (
				<span className="font-display font-light text-sm">
					{row.discountCode || "—"}
				</span>
			),
		},
	];

	return (
		<div className="space-y-8">
			{/* Header */}
			<div className="space-y-2">
				<div className="flex items-center justify-between">
					<h1 className="text-4xl font-display font-extralight tracking-tight">
						Orders overview
					</h1>
					<div className="flex items-center gap-2">
						<button className="p-2 hover:bg-muted rounded-full transition-colors">
							<ChevronLeft className="h-5 w-5 text-muted-foreground" />
						</button>
						<span className="font-display font-light text-primary">1</span>
						<button className="p-2 hover:bg-muted rounded-full transition-colors">
							<ChevronRight className="h-5 w-5 text-muted-foreground" />
						</button>
					</div>
				</div>
				<p className="text-muted-foreground font-display font-light">
					Click on single order to see details.
				</p>
			</div>

			{/* Content Grid */}
			<div className="grid lg:grid-cols-[280px_1fr] gap-6">
				{/* Filter Sidebar */}
				<div>
					<OrdersFilter onFilterChange={setFilters} />
				</div>

				{/* Orders Table */}
				<div>
					<AdminTable
						columns={columns}
						data={filteredOrders}
						onRowClick={(row) => `/admin/orders/${row.id}`}
						searchable={false}
					/>
				</div>
			</div>
		</div>
	);
}