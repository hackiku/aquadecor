// src/app/admin/promoters/page.tsx

"use client";

import { useState } from "react";
import { mockPromoters, type Promoter } from "../../_data/promoters";
import { InvitePromoterModal } from "./_components/InvitePromoterModal";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Plus } from "lucide-react";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "~/components/ui/table";

export default function PromotersPage() {
	const [inviteModalOpen, setInviteModalOpen] = useState(false);

	const formatPrice = (cents: number) => {
		return `€${(cents / 100).toFixed(2)}`;
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
					className="rounded-full"
				>
					<Plus className="mr-2 h-4 w-4" />
					Invite new promoter
				</Button>
			</div>

			{/* Stats Cards */}
			<div className="grid gap-6 md:grid-cols-3">
				<div className="p-6 rounded-xl border-2 border-border space-y-2">
					<p className="text-sm text-muted-foreground font-display font-light">
						Active Promoters
					</p>
					<p className="text-3xl font-display font-light">
						{mockPromoters.filter((p) => p.isActive).length}
					</p>
				</div>
				<div className="p-6 rounded-xl border-2 border-border space-y-2">
					<p className="text-sm text-muted-foreground font-display font-light">
						Total Orders
					</p>
					<p className="text-3xl font-display font-light">
						{mockPromoters.reduce((sum, p) => sum + p.totalOrders, 0)}
					</p>
				</div>
				<div className="p-6 rounded-xl border-2 border-border space-y-2">
					<p className="text-sm text-muted-foreground font-display font-light">
						Total Commission
					</p>
					<p className="text-3xl font-display font-light">
						{formatPrice(mockPromoters.reduce((sum, p) => sum + p.totalCommission, 0))}
					</p>
				</div>
			</div>

			{/* Promoters Table */}
			<div className="rounded-xl border-2 border-border overflow-hidden">
				<Table>
					<TableHeader>
						<TableRow className="bg-muted/50 hover:bg-muted/50">
							<TableHead className="font-display font-normal">First name</TableHead>
							<TableHead className="font-display font-normal">Last name</TableHead>
							<TableHead className="font-display font-normal">Code(s)</TableHead>
							<TableHead className="font-display font-normal text-right">Orders</TableHead>
							<TableHead className="font-display font-normal text-right">Revenue</TableHead>
							<TableHead className="font-display font-normal text-right">Commission</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{mockPromoters.map((promoter) => (
							<TableRow
								key={promoter.id}
								className="cursor-pointer hover:bg-muted/30"
								onClick={() => {
									// TODO: Navigate to promoter detail
									console.log("View promoter:", promoter.id);
								}}
							>
								<TableCell className="font-display font-light">
									{promoter.firstName}
								</TableCell>
								<TableCell className="font-display font-light">
									{promoter.lastName}
								</TableCell>
								<TableCell>
									<div className="flex flex-wrap gap-2">
										{promoter.codes.length > 0 ? (
											promoter.codes.map((code) => (
												<div key={code.code} className="flex items-center gap-2">
													<Badge className="font-display font-light">
														{code.code}
													</Badge>
													<span className="text-xs text-muted-foreground font-display font-light">
														Discount: {code.discountPercent}% | Commission: {code.commissionPercent}%
													</span>
												</div>
											))
										) : (
											<span className="text-sm text-muted-foreground font-display font-light">
												No codes
											</span>
										)}
									</div>
								</TableCell>
								<TableCell className="text-right font-display font-light">
									{promoter.totalOrders}
								</TableCell>
								<TableCell className="text-right font-display font-normal">
									{formatPrice(promoter.totalRevenue)}
								</TableCell>
								<TableCell className="text-right font-display font-normal">
									{formatPrice(promoter.totalCommission)}
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>

			{/* Invite Modal */}
			<InvitePromoterModal
				open={inviteModalOpen}
				onOpenChange={setInviteModalOpen}
			/>
		</div>
	);
}