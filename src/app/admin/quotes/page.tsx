// src/app/admin/quotes/page.tsx
"use client";

import { useState } from "react";
import { api } from "~/trpc/react";
import { type RouterOutputs } from "~/trpc/react";
import { AdminTable, type Column } from "../_components/primitives/AdminTable";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Filter } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { QuotesFilter } from "./_components/QuotesFilter";

type Quote = RouterOutputs["admin"]["quote"]["getAll"][number];

export default function QuotesPage() {
	const [filters, setFilters] = useState<{ status?: "pending" | "accepted" | "rejected"; search?: string }>({});
	const [showFilters, setShowFilters] = useState(false);

	const { data: quotes, isLoading } = api.admin.quote.getAll.useQuery({
		status: filters.status,
		search: filters.search,
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

	const getStatusBadge = (status: Quote["status"]) => {
		const variants: Record<string, { variant: "secondary" | "default" | "destructive"; label: string }> = {
			pending: { variant: "secondary", label: "Pending" },
			accepted: { variant: "default", label: "Accepted" },
			rejected: { variant: "destructive", label: "Rejected" },
			quoted: { variant: "default", label: "Quoted" },
			paid: { variant: "default", label: "Paid" },
			cancelled: { variant: "destructive", label: "Cancelled" },
		};
		return variants[status] || { variant: "secondary", label: status };
	};

	const columns: Column<Quote>[] = [
		{
			header: "Quote",
			accessorKey: "id",
			cell: (quote) => (
				<div className="space-y-1">
					<p className="font-display font-normal text-primary text-sm">
						QUO-{quote.id.split("-")[0]}
					</p>
					<p className="font-display font-light text-xs text-muted-foreground font-mono">
						{quote.id.split("-")[0]}...
					</p>
				</div>
			),
		},
		{
			header: "Customer",
			accessorKey: "email",
			cell: (quote) => (
				<div className="space-y-0.5">
					<p className="font-display font-normal text-sm">
						{quote.firstName && quote.lastName
							? `${quote.firstName} ${quote.lastName}`
							: "—"
						}
					</p>
					<p className="font-display font-light text-xs text-muted-foreground">
						{quote.email}
					</p>
				</div>
			),
		},
		{
			header: "Date",
			accessorKey: "createdAt",
			cell: (quote) => (
				<span className="font-display font-light text-sm whitespace-nowrap">
					{formatDate(quote.createdAt)}
				</span>
			),
		},
		{
			header: "Country",
			accessorKey: "country",
			cell: (quote) => (
				<span className="font-display font-light text-sm">
					{quote.country || "—"}
				</span>
			),
		},
		{
			header: "Estimated Price",
			accessorKey: "estimatedPriceEurCents",
			cell: (quote) => (
				<span className="font-display font-normal">
					{formatPrice(quote.estimatedPriceEurCents, "EUR")}
				</span>
			),
		},
		{
			header: "Status",
			accessorKey: "status",
			cell: (quote) => {
				const statusInfo = getStatusBadge(quote.status);
				return (
					<Badge variant={statusInfo.variant} className="font-display font-light">
						{statusInfo.label}
					</Badge>
				);
			},
		},
	];

	if (isLoading) {
		return (
			<div className="space-y-8">
				<h1 className="text-4xl font-display font-extralight">Quotes</h1>
				<p className="text-muted-foreground font-display font-light">Loading quotes...</p>
			</div>
		);
	}

	return (
		<div className="space-y-8">
			{/* Header */}
			<div className="flex items-start justify-between">
				<div className="space-y-2">
					<h1 className="text-4xl font-display font-extralight tracking-tight">
						Quotes
					</h1>
					<p className="text-muted-foreground font-display font-light text-lg">
						Manage custom configuration quote requests
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
							<QuotesFilter onFilterChange={setFilters} />
						</motion.div>
					)}
				</AnimatePresence>

				{/* Quotes Table */}
				<div className="flex-1">
					<AdminTable
						columns={columns}
						data={quotes || []}
						pageSize={50}
						onRowClick={(quote) => `/admin/quotes/${quote.id}`}
						searchPlaceholder="Search quotes by email or name..."
					/>
				</div>
			</div>
		</div>
	);
}