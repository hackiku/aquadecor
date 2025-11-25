// src/app/admin/orders/_components/OrdersFilter.tsx

"use client";

import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { X } from "lucide-react";

interface OrdersFilterProps {
	onFilterChange: (filters: { email?: string; discountCode?: string }) => void;
}

export function OrdersFilter({ onFilterChange }: OrdersFilterProps) {
	const [email, setEmail] = useState("");
	const [discountCode, setDiscountCode] = useState("");

	const handleReset = () => {
		setEmail("");
		setDiscountCode("");
		onFilterChange({});
	};

	const handleApply = () => {
		onFilterChange({
			email: email || undefined,
			discountCode: discountCode || undefined,
		});
	};

	const hasFilters = email || discountCode;

	return (
		<div className="p-6 rounded-xl border-2 border-border bg-muted/20 space-y-4">
			<div className="flex items-center justify-between">
				<h3 className="font-display font-normal text-lg">Filter orders</h3>
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
						Filter by email or id
					</label>
					<Input
						placeholder="Search email or order ID..."
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						className="font-display font-light"
					/>
				</div>

				<div>
					<label className="text-sm font-display font-light text-muted-foreground mb-2 block">
						Filter by discount code
					</label>
					<Input
						placeholder="Enter discount code..."
						value={discountCode}
						onChange={(e) => setDiscountCode(e.target.value)}
						className="font-display font-light"
					/>
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
					Orders per page: 45 rows
				</p>
			</div>
		</div>
	);
}