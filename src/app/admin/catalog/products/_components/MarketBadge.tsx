// src/app/admin/catalog/products/_components/MarketBadge.tsx

import { Badge } from "~/components/ui/badge";
import { Globe, Flag } from "lucide-react";
import { cn } from "~/lib/utils";

interface MarketBadgeProps {
	market: 'US' | 'ROW' | 'CA' | 'UK';
	className?: string;
	showIcon?: boolean;
}

const marketConfig = {
	US: {
		label: 'US Market',
		icon: Flag,
		emoji: '🇺🇸',
		variant: 'default' as const,
	},
	ROW: {
		label: 'Rest of World',
		icon: Globe,
		emoji: '🌍',
		variant: 'secondary' as const,
	},
	CA: {
		label: 'Canada',
		icon: Flag,
		emoji: '🇨🇦',
		variant: 'outline' as const,
	},
	UK: {
		label: 'United Kingdom',
		icon: Flag,
		emoji: '🇬🇧',
		variant: 'outline' as const,
	},
};

export function MarketBadge({ market, className, showIcon = true }: MarketBadgeProps) {
	const config = marketConfig[market];
	const Icon = config.icon;

	return (
		<Badge variant={config.variant} className={cn("font-display font-light", className)}>
			{showIcon && <span className="mr-1">{config.emoji}</span>}
			{config.label}
		</Badge>
	);
}