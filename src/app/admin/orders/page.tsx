// src/app/admin/orders/page.tsx

"use client";

import { useState } from "react";
import { api } from "~/trpc/react";
import { AdminTable, type Column } from "../_components/primitives/AdminTable";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Filter } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { OrdersFilter } from "./_components/OrdersFilter";

type Order = NonNullable<ReturnType<typeof api.admin.order.getAll.useQuery>['data']>[0];

export default function OrdersPage() {
	const [filters, setFilters] = useState<{ email?: string; discountCode?: string }>({});
	const [showFilters, setShowFilters] = useState(false);

	const { data: orders, isLoading } = api.admin.order.getAll.useQuery({
		email: filters.email,
		discountCode: filters.discountCode,
	});

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
		}).format(new Date(date));
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
			paid: { variant: "default" as const, label: "Paid" },
			failed: { variant: "destructive" as const, label: "Failed" },
			refunded: { variant: "destructive" as const, label: "Refunded" },
		};
		return variants[status];
	};

	const columns: Column<Order>[] = [
		{
			header: "Order",
			accessorKey: "orderNumber",
			cell: (order) => (
				<div className="space-y-1">
					<p className="font-display font-normal text-primary text-sm">
						{order.orderNumber}
					</p>
					<p className="font-display font-light text-xs text-muted-foreground font-mono">
						{order.id.split("-")[0]}...
					</p>
				</div>
			),
		},
		{
			header: "Email",
			accessorKey: "email",
			cell: (order) => (
				<span className="font-display font-light text-sm">
					{order.email}
				</span>
			),
		},
		{
			header: "Date",
			accessorKey: "createdAt",
			cell: (order) => (
				<span className="font-display font-light text-sm whitespace-nowrap">
					{formatDate(order.createdAt)}
				</span>
			),
		},
		{
			header: "Total",
			accessorKey: "total",
			cell: (order) => (
				<span className="font-display font-normal">
					{formatPrice(order.total, order.currency)}
				</span>
			),
		},
		{
			header: "Status",
			accessorKey: "status",
			cell: (order) => {
				const statusInfo = getStatusBadge(order.status);
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
			cell: (order) => {
				const paymentInfo = getPaymentBadge(order.paymentStatus);
				return (
					<Badge variant={paymentInfo.variant} className="font-display font-light">
						{paymentInfo.label}
					</Badge>
				);
			},
		},
		{
			header: "Discount",
			accessorKey: "discountCode",
			cell: (order) => (
				<span className="font-display font-light text-sm">
					{order.discountCode || "—"}
				</span>
			),
		},
	];

	if (isLoading) {
		return (
			<div className="space-y-8">
				<h1 className="text-4xl font-display font-extralight">Orders</h1>
				<p className="text-muted-foreground font-display font-light">Loading orders...</p>
			</div>
		);
	}

	return (
		<div className="space-y-8">
			{/* Header */}
			<div className="flex items-start justify-between">
				<div className="space-y-2">
					<h1 className="text-4xl font-display font-extralight tracking-tight">
						Orders
					</h1>
					<p className="text-muted-foreground font-display font-light text-lg">
						Manage customer orders and fulfillment
					</p>
				</div>
				<Button
					variant="outline"
					onClick={() => setShowFilters(!showFilters)}
					className="rounded-full"
				>
					<Filter className="mr-2 h-4 w-4" />
					{showFilters ? "Hide Filters" : "Show Filters"}
				</Button>
			</div>

			{/* Content Grid */}
			<div className="flex gap-6">
				{/* Filter Sidebar - Collapsible */}
				<AnimatePresence>
					{showFilters && (
						<motion.div
							initial={{ width: 0, opacity: 0 }}
							animate={{ width: 280, opacity: 1 }}
							exit={{ width: 0, opacity: 0 }}
							transition={{ duration: 0.3, ease: "easeInOut" }}
							className="overflow-hidden"
						>
							<OrdersFilter onFilterChange={setFilters} />
						</motion.div>
					)}
				</AnimatePresence>

				{/* Orders Table */}
				<div className="flex-1">
					<AdminTable
						columns={columns}
						data={orders || []}
						onRowClick={(order) => `/admin/orders/${order.id}`}
						searchPlaceholder="Search orders by email or order number..."
					/>
				</div>
			</div>
		</div>
	);
}