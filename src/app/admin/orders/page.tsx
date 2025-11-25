// src/app/admin/orders/page.tsx

"use client";

import { useState, useMemo } from "react";
import { mockOrders, type Order } from "../_data/orders";
import { OrdersFilter } from "./_components/OrdersFilter";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { ChevronLeft, ChevronRight, Filter } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "~/components/ui/table";

export default function OrdersPage() {
	const [filters, setFilters] = useState<{ email?: string; discountCode?: string }>({});
	const [currentPage, setCurrentPage] = useState(1);
	const [showFilters, setShowFilters] = useState(false);

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
				<div className="flex-1 overflow-hidden">
					<div className="rounded-xl border-2 border-border overflow-hidden">
						<Table>
							<TableHeader>
								<TableRow className="bg-muted/50 hover:bg-muted/50">
									<TableHead className="w-12">
										<Button
											variant="ghost"
											size="icon"
											onClick={() => setShowFilters(!showFilters)}
											className="h-8 w-8 rounded-full"
										>
											<Filter className="h-4 w-4" />
										</Button>
									</TableHead>
									<TableHead className="font-display font-normal text-primary">
										Order ID
									</TableHead>
									<TableHead className="font-display font-normal">Email</TableHead>
									<TableHead className="font-display font-normal">Date</TableHead>
									<TableHead className="font-display font-normal">Price</TableHead>
									<TableHead className="font-display font-normal">Status</TableHead>
									<TableHead className="font-display font-normal">Payment</TableHead>
									<TableHead className="font-display font-normal">Discount Code</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{filteredOrders.length === 0 ? (
									<TableRow>
										<TableCell colSpan={8} className="h-32 text-center">
											<p className="text-muted-foreground font-display font-light">
												No orders found
											</p>
										</TableCell>
									</TableRow>
								) : (
									filteredOrders.map((order, index) => {
										const statusInfo = getStatusBadge(order.status);
										const paymentInfo = getPaymentBadge(order.paymentStatus);

										return (
											<TableRow
												key={order.id}
												className="cursor-pointer hover:bg-muted/30"
												onClick={() => {
													// TODO: Navigate to order detail
													console.log("View order:", order.id);
												}}
											>
												<TableCell className="font-display font-light text-muted-foreground">
													{index + 1}
												</TableCell>
												<TableCell>
													<div className="space-y-1">
														<p className="font-display font-normal text-primary text-sm">
															{order.orderNumber}
														</p>
														<p className="font-display font-light text-xs text-muted-foreground font-mono">
															{order.id.split("-")[0]}...
														</p>
													</div>
												</TableCell>
												<TableCell>
													<span className="font-display font-light text-sm">
														{order.email}
													</span>
												</TableCell>
												<TableCell>
													<span className="font-display font-light text-sm whitespace-nowrap">
														{formatDate(order.createdAt)}
													</span>
												</TableCell>
												<TableCell>
													<span className="font-display font-normal">
														{formatPrice(order.total, order.currency)}
													</span>
												</TableCell>
												<TableCell>
													<Badge variant={statusInfo.variant} className="font-display font-light">
														{statusInfo.label}
													</Badge>
												</TableCell>
												<TableCell>
													<Badge
														variant={paymentInfo.variant}
														className={`font-display font-light ${paymentInfo.color || ""}`}
													>
														{paymentInfo.label}
													</Badge>
												</TableCell>
												<TableCell>
													<span className="font-display font-light text-sm">
														{order.discountCode || "—"}
													</span>
												</TableCell>
											</TableRow>
										);
									})
								)}
							</TableBody>
						</Table>
					</div>
				</div>
			</div>
		</div>
	);
}