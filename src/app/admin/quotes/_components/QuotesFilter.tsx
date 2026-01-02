// src/app/admin/quotes/_components/QuotesFilter.tsx

"use client";

import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { X } from "lucide-react";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "~/components/ui/select";

interface QuotesFilterProps {
	onFilterChange: (filters: { status?: "pending" | "accepted" | "rejected"; search?: string }) => void;
}

export function QuotesFilter({ onFilterChange }: QuotesFilterProps) {
	const [search, setSearch] = useState("");
	const [status, setStatus] = useState<"pending" | "accepted" | "rejected" | "all">("all");

	const handleReset = () => {
		setSearch("");
		setStatus("all");
		onFilterChange({});
	};

	const handleApply = () => {
		onFilterChange({
			search: search || undefined,
			status: status === "all" ? undefined : status,
		});
	};

	const hasFilters = search || status !== "all";

	return (
		<div className="p-6 rounded-xl border-2 border-border bg-muted/20 space-y-4">
			<div className="flex items-center justify-between">
				<h3 className="font-display font-normal text-lg">Filter quotes</h3>
				<Button
					variant="ghost"
					size="icon"
					className="h-8 w-8 rounded-full"
					onClick={handleReset}
				>
					<X className="h-4 w-4" />
				</Button>
			</div>

			<div className="space-y-4">
				<div>
					<label className="text-sm font-display font-light text-muted-foreground mb-2 block">
						Search by email or name
					</label>
					<Input
						placeholder="Search email or name..."
						value={search}
						onChange={(e) => {
							setSearch(e.target.value);
							handleApply();
						}}
						className="font-display font-light"
					/>
				</div>

				<div>
					<label className="text-sm font-display font-light text-muted-foreground mb-2 block">
						Filter by status
					</label>
					<Select
						value={status}
						onValueChange={(value) => {
							setStatus(value as typeof status);
							onFilterChange({
								search: search || undefined,
								status: value === "all" ? undefined : (value as "pending" | "accepted" | "rejected"),
							});
						}}
					>
						<SelectTrigger className="font-display font-light">
							<SelectValue placeholder="Select status" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all" className="font-display font-light">All statuses</SelectItem>
							<SelectItem value="pending" className="font-display font-light">Pending</SelectItem>
							<SelectItem value="accepted" className="font-display font-light">Accepted</SelectItem>
							<SelectItem value="rejected" className="font-display font-light">Rejected</SelectItem>
						</SelectContent>
					</Select>
				</div>

				{hasFilters && (
					<Button
						onClick={handleReset}
						variant="ghost"
						className="w-full font-display font-light"
					>
						Reset filters
					</Button>
				)}
			</div>

			<div className="pt-2">
				<p className="text-xs text-muted-foreground font-display font-light">
					Quotes per page: 50 rows
				</p>
			</div>
		</div>
	);
}