// src/app/admin/quotes/_components/QuotesFilter.tsx
"use client";

import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { X } from "lucide-react";

interface QuotesFilterProps {
	onFilterChange: (filters: { email?: string; status?: string }) => void;
}

export function QuotesFilter({ onFilterChange }: QuotesFilterProps) {
	const [email, setEmail] = useState("");
	const [status, setStatus] = useState("");

	const handleReset = () => {
		setEmail("");
		setStatus("");
		onFilterChange({});
	};

	const handleApply = () => {
		onFilterChange({
			email: email || undefined,
			status: status || undefined,
		});
	};

	const hasFilters = email || status;

	return (
		<div className="p-6 rounded-xl border-2 border-border bg-muted/20 space-y-4 w-[280px] shrink-0">
			<div className="flex items-center justify-between">
				<h3 className="font-display font-normal text-lg">Filter Quotes</h3>
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
						Search
					</label>
					<Input
						placeholder="Email or Name..."
						value={email}
						onChange={(e) => {
							setEmail(e.target.value);
							// Auto-apply for search inputs usually feels better
							onFilterChange({ email: e.target.value || undefined, status: status || undefined });
						}}
						className="font-display font-light"
					/>
				</div>

				{/* Could add a Status Dropdown here later if needed */}
			</div>
		</div>
	);
}