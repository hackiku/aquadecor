// src/components/shop/DiscountBadge.tsx
"use client";

import { Badge } from "~/components/ui/badge";
import { Percent, Tag, Sparkles } from "lucide-react";
import { cn } from "~/lib/utils";

type DiscountType = 'promoter' | 'sale' | 'signup' | 'percentage' | 'fixed';

interface DiscountBadgeProps {
	type: DiscountType;
	value: number; // Either percentage (10) or amount in cents (1000)
	code?: string; // Optional discount code to display
	label?: string; // Custom label override
	className?: string;
	size?: "sm" | "md" | "lg";
	variant?: "subtle" | "vibrant";
}

export function DiscountBadge({
	type,
	value,
	code,
	label,
	className,
	size = "md",
	variant = "subtle"
}: DiscountBadgeProps) {

	// Generate appropriate label if not provided
	const getLabel = () => {
		if (label) return label;

		switch (type) {
			case 'promoter':
				return `${value}% Off`;
			case 'sale':
				return `${value}% Off`;
			case 'signup':
				return `${value}% Off`;
			case 'percentage':
				return `${value}% Off`;
			case 'fixed':
				return `€${(value / 100).toFixed(0)} Off`;
			default:
				return `${value}% Off`;
		}
	};

	// Icon selection
	const getIcon = () => {
		switch (type) {
			case 'signup':
				return Sparkles;
			case 'promoter':
				return Tag;
			case 'sale':
			case 'percentage':
			case 'fixed':
			default:
				return Percent;
		}
	};

	// Color configuration
	const getColors = () => {
		if (variant === "vibrant") {
			switch (type) {
				case 'signup':
					return "bg-gradient-to-r from-purple-500/90 to-pink-500/90 text-white border-none";
				case 'promoter':
					return "bg-gradient-to-r from-blue-500/90 to-cyan-500/90 text-white border-none";
				case 'sale':
					return "bg-gradient-to-r from-orange-500/90 to-red-500/90 text-white border-none";
				default:
					return "bg-gradient-to-r from-emerald-500/90 to-green-500/90 text-white border-none";
			}
		}

		// Subtle variant (default)
		switch (type) {
			case 'signup':
				return "bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/20";
			case 'promoter':
				return "bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/20";
			case 'sale':
				return "bg-orange-500/10 text-orange-700 dark:text-orange-300 border-orange-500/20";
			default:
				return "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20";
		}
	};

	// Size configuration
	const sizeClasses = {
		sm: "text-xs px-2 py-0.5",
		md: "text-sm px-3 py-1",
		lg: "text-base px-4 py-1.5"
	};

	const iconSizes = {
		sm: "h-3 w-3",
		md: "h-3.5 w-3.5",
		lg: "h-4 w-4"
	};

	const Icon = getIcon();

	return (
		<Badge
			className={cn(
				"backdrop-blur-sm font-display font-semibold tracking-wide inline-flex items-center gap-1.5 shadow-sm",
				getColors(),
				sizeClasses[size],
				className
			)}
		>
			<Icon className={iconSizes[size]} />
			<span>{getLabel()}</span>
			{code && (
				<span className="opacity-70 font-mono text-[0.85em] ml-0.5">
					{code}
				</span>
			)}
		</Badge>
	);
}