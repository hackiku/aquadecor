// src/app/admin/_components/layout/QuickActions.tsx

"use client";

import { Button } from "~/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

export function QuickActions() {
	const router = useRouter();

	const actions = [
		{ label: "New Product", href: "/admin/catalog/products/new" },
		{ label: "New Category", href: "/admin/catalog/categories/new" },
		{ label: "New Discount", href: "/admin/discounts/new" },
		{ label: "New Pricing Rule", href: "/admin/calculator/rules/new" },
	];

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button>
					<Plus className="mr-2 h-4 w-4" />
					Quick Add
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				{actions.map((action) => (
					<DropdownMenuItem
						key={action.href}
						onClick={() => router.push(action.href)}
					>
						{action.label}
					</DropdownMenuItem>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}