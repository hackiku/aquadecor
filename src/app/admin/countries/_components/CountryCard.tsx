// src/app/admin/_components/CountryCard.tsx
"use client";

import Link from "next/link";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";

interface CountryCardProps {
	country: {
		id: string;
		iso2: string;
		name: string;
		flagEmoji: string | null;
		isShippingEnabled: boolean;
		isSuspended: boolean;
		suspensionReason: string | null;
		totalOrders: number | null;
		totalRevenueCents: number | null;
		requiresCustoms: boolean | null;
		zone: {
			name: string;
			code: string;
		} | null;
	};
}

export function CountryCard({ country }: CountryCardProps) {
	const getStatusBadge = () => {
		if (country.isSuspended) {
			return <Badge variant="destructive">Suspended</Badge>;
		}
		if (country.isShippingEnabled) {
			return <Badge variant="default">Active</Badge>;
		}
		return <Badge variant="secondary">Disabled</Badge>;
	};

	// Format currency inline (EUR cents to display)
	const formatCurrency = (cents: number) => {
		return new Intl.NumberFormat("en-US", {
			style: "currency",
			currency: "EUR",
		}).format(cents / 100);
	};

	return (
		<Link href={`/admin/countries/${country.id}`}>
			<Card className="flex cursor-pointer items-center justify-between p-4 transition-colors hover:bg-muted/50">
				<div className="flex items-center gap-4">
					<div className="text-4xl">{country.flagEmoji || "🏴"}</div>
					<div>
						<div className="flex items-center gap-2">
							<h3 className="font-semibold">{country.name}</h3>
							<span className="text-xs text-muted-foreground">{country.iso2}</span>
							{getStatusBadge()}
						</div>
						<div className="mt-1 flex items-center gap-3 text-sm text-muted-foreground">
							{country.zone && (
								<span className="rounded bg-muted px-2 py-0.5 text-xs">
									{country.zone.name}
								</span>
							)}
							{country.requiresCustoms && (
								<Badge variant="outline" className="text-xs">
									Customs
								</Badge>
							)}
						</div>
						{country.suspensionReason && (
							<p className="mt-1 text-xs text-destructive">
								{country.suspensionReason}
							</p>
						)}
					</div>
				</div>

				<div className="flex items-center gap-6 text-sm">
					<div className="text-right">
						<div className="font-semibold">{country.totalOrders || 0}</div>
						<div className="text-xs text-muted-foreground">Orders</div>
					</div>
					<div className="text-right">
						<div className="font-semibold">
							{formatCurrency(country.totalRevenueCents || 0)}
						</div>
						<div className="text-xs text-muted-foreground">Revenue</div>
					</div>
					<Button variant="ghost" size="sm">
						View →
					</Button>
				</div>
			</Card>
		</Link>
	);
}