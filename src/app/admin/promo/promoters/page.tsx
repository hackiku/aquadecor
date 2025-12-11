// src/app/admin/promo/promoters/page.tsx (REWRITTEN to use AdminTable)

"use client";

import { useState, Suspense } from "react";
import { api } from "~/trpc/react";
import { InvitePromoterModal } from "./_components/InvitePromoterModal";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Plus } from "lucide-react";
import type { Promoter, PromoterCode } from "~/server/db/schema/promoters";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { AdminTable, type Column } from "~/app/admin/_components/primitives/AdminTable";

// Define the type for the data returned by the router's getAll (Promoter with Codes)
type PromoterWithCodes = Promoter & { codes: PromoterCode[] };

const formatPrice = (cents: number) => {
	return `€${(cents / 100).toFixed(2)}`;
};

const promoterColumns: Column<PromoterWithCodes>[] = [
	{
		header: "First Name",
		accessorKey: "firstName",
		cell: (row) => (
			<span className="font-display font-light">
				{row.firstName}
				{!row.isActive && (
					<Badge variant="outline" className="ml-2 bg-red-500/10 text-red-700 font-display font-light">
						Inactive
					</Badge>
				)}
			</span>
		),
	},
	{
		header: "Last Name",
		accessorKey: "lastName",
		cell: (row) => <span className="font-display font-light">{row.lastName}</span>,
	},
	{
		header: "Email",
		accessorKey: "email",
		cell: (row) => <span className="font-display font-light text-muted-foreground">{row.email}</span>,
	},
	{
		header: "Code(s)",
		accessorKey: "codes",
		cell: (row) => (
			<div className="flex flex-wrap gap-2">
				{row.codes && row.codes.length > 0 ? (
					row.codes.map((code) => (
						<Badge key={code.id} className="font-display font-light">
							{code.code}
						</Badge>
					))
				) : (
					<span className="text-sm text-muted-foreground font-display font-light">
						No codes
					</span>
				)}
			</div>
		),
	},
	{
		header: "Orders",
		accessorKey: "totalOrders",
		cell: (row) => <span className="font-display font-light text-right w-full block">{row.totalOrders}</span>,
	},
	{
		header: "Revenue",
		accessorKey: "totalRevenue",
		cell: (row) => <span className="font-display font-normal text-right w-full block">{formatPrice(row.totalRevenue)}</span>,
	},
	{
		header: "Commission",
		accessorKey: "totalCommission",
		cell: (row) => <span className="font-display font-normal text-right w-full block">{formatPrice(row.totalCommission)}</span>,
	},
];


function PromotersList() {
	const [inviteModalOpen, setInviteModalOpen] = useState(false);

	// Query data from the new router
	const { data: promoters, isLoading: isListLoading, refetch: refetchPromoters } = api.admin.promoter.getAll.useQuery();
	const { data: stats, isLoading: isStatsLoading } = api.admin.promoter.getStats.useQuery();

	const totalOrders = stats?.totalOrders || 0;
	const totalCommission = stats?.totalCommission || 0;
	const activePromoters = stats?.active || 0;


	// Function to open the modal and refetch on close if a new promoter was added
	const handleOpenChange = (open: boolean) => {
		if (!open && inviteModalOpen) {
			refetchPromoters();
		}
		setInviteModalOpen(open);
	};

	// Function to handle row click and generate the email-based URL
	const handleRowClick = (row: PromoterWithCodes) => {
		// We MUST encode the URI component here, and decode it on the detail page.
		// This is necessary because Next.js will re-encode it if we don't.
		return `/admin/promo/promoters/${encodeURIComponent(row.email)}`;
	};

	return (
		<div className="space-y-8">
			{/* Header */}
			<div className="flex items-start justify-between">
				<div className="space-y-2">
					<h1 className="text-4xl font-display font-extralight tracking-tight">
						Promoters
					</h1>
					<p className="text-muted-foreground font-display font-light text-lg">
						Manage affiliate promoters and discount codes
					</p>
				</div>
				<Button
					onClick={() => setInviteModalOpen(true)}
					className="rounded-full font-display font-light"
					disabled={isListLoading || isStatsLoading}
				>
					<Plus className="mr-2 h-4 w-4" />
					Invite new promoter
				</Button>
			</div>

			{/* Stats Cards */}
			<div className="grid gap-6 md:grid-cols-3">
				<Card className="border-2">
					<CardHeader className="p-4">
						<CardTitle className="font-display font-normal text-sm text-muted-foreground">
							Active Promoters
						</CardTitle>
					</CardHeader>
					<CardContent className="p-4 pt-0">
						<p className="text-3xl font-display font-light">
							{isStatsLoading ? '...' : activePromoters}
						</p>
					</CardContent>
				</Card>

				<Card className="border-2">
					<CardHeader className="p-4">
						<CardTitle className="font-display font-normal text-sm text-muted-foreground">
							Total Orders
						</CardTitle>
					</CardHeader>
					<CardContent className="p-4 pt-0">
						<p className="text-3xl font-display font-light">
							{isStatsLoading ? '...' : totalOrders}
						</p>
					</CardContent>
				</Card>

				<Card className="border-2">
					<CardHeader className="p-4">
						<CardTitle className="font-display font-normal text-sm text-muted-foreground">
							Total Commission
						</CardTitle>
					</CardHeader>
					<CardContent className="p-4 pt-0">
						<p className="text-3xl font-display font-light">
							{isStatsLoading ? '...' : formatPrice(totalCommission)}
						</p>
					</CardContent>
				</Card>
			</div>

			{/* Promoters Table - Using AdminTable component */}
			<AdminTable<PromoterWithCodes>
				columns={promoterColumns}
				data={promoters || []}
				onRowClick={handleRowClick}
				searchPlaceholder="Search by name, email, or code..."
				isLoading={isListLoading}
			/>


			{/* Invite Modal */}
			<InvitePromoterModal
				open={inviteModalOpen}
				onOpenChange={handleOpenChange}
				onInviteSuccess={refetchPromoters}
			/>
		</div>
	);
}

export default function PromotersPageWrapper() {
	return (
		<Suspense fallback={
			<div className="space-y-8">
				<h1 className="text-4xl font-display font-extralight">Promoters</h1>
				<p className="text-muted-foreground font-display font-light">Loading...</p>
			</div>
		}>
			<PromotersList />
		</Suspense>
	)
}