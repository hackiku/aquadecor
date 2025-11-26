// src/app/admin/countries/[id]/page.tsx

import { notFound } from "next/navigation";
import { api } from "~/trpc/server";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Switch } from "~/components/ui/switch";
import { Textarea } from "~/components/ui/textarea";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";

interface PageProps {
	params: Promise<{
		id: string;
	}>;
}

export default async function CountryDetailPage({ params }: PageProps) {
	const { id } = await params;
	const country = await api.admin.country.getById({ id });

	if (!country) {
		notFound();
	}

	// Note: Form submission would need to be in a client component
	// This is the display-only version

	return (
		<div className="space-y-8">
			{/* Header */}
			<div className="flex items-start justify-between">
				<div className="space-y-4">
					<Button variant="ghost" asChild className="font-display font-light -ml-4">
						<Link href="/admin/countries">
							<ArrowLeft className="mr-2 h-4 w-4" />
							Back to Countries
						</Link>
					</Button>
					<div className="space-y-2">
						<div className="flex items-center gap-3">
							<h1 className="text-4xl font-display font-extralight tracking-tight">
								{country.flagEmoji} {country.name}
							</h1>
							<Badge
								variant={country.isShippingEnabled && !country.isSuspended ? "default" : "secondary"}
								className="font-display font-light"
							>
								{country.isShippingEnabled && !country.isSuspended ? "Enabled" : "Disabled"}
							</Badge>
						</div>
						<p className="text-muted-foreground font-display font-light text-lg">
							{country.iso2} • {country.iso3}
						</p>
					</div>
				</div>
			</div>

			<div className="grid gap-8 lg:grid-cols-2">
				{/* Left Column */}
				<div className="space-y-6">
					<Card className="border-2">
						<CardHeader>
							<CardTitle className="font-display font-normal">Basic Information</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="grid grid-cols-2 gap-4">
								<div>
									<Label className="font-display font-light">ISO 2</Label>
									<Input value={country.iso2} disabled className="font-display" />
								</div>
								<div>
									<Label className="font-display font-light">ISO 3</Label>
									<Input value={country.iso3} disabled className="font-display" />
								</div>
							</div>
							<div>
								<Label className="font-display font-light">Name</Label>
								<Input value={country.name} disabled className="font-display" />
							</div>
							{country.localName && (
								<div>
									<Label className="font-display font-light">Local Name</Label>
									<Input value={country.localName} disabled className="font-display" />
								</div>
							)}
						</CardContent>
					</Card>

					<Card className="border-2">
						<CardHeader>
							<CardTitle className="font-display font-normal">Shipping Configuration</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="flex items-center justify-between">
								<Label className="font-display font-light">Shipping Enabled</Label>
								<Switch checked={country.isShippingEnabled ?? false} disabled />
							</div>
							<div className="flex items-center justify-between">
								<Label className="font-display font-light">Suspended</Label>
								<Switch checked={country.isSuspended ?? false} disabled />
							</div>
							{country.suspensionReason && (
								<div>
									<Label className="font-display font-light">Suspension Reason</Label>
									<Textarea value={country.suspensionReason} disabled className="font-display" />
								</div>
							)}
							{country.zone && (
								<div>
									<Label className="font-display font-light">Shipping Zone</Label>
									<Input value={`${country.zone.name} (${country.zone.code})`} disabled className="font-display" />
								</div>
							)}
						</CardContent>
					</Card>
				</div>

				{/* Right Column */}
				<div className="space-y-6">
					<Card className="border-2">
						<CardHeader>
							<CardTitle className="font-display font-normal">Statistics</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="grid grid-cols-2 gap-4">
								<div>
									<p className="text-sm text-muted-foreground font-display font-light mb-1">
										Total Orders
									</p>
									<p className="text-2xl font-display font-normal">
										{country.totalOrders || 0}
									</p>
								</div>
								<div>
									<p className="text-sm text-muted-foreground font-display font-light mb-1">
										Total Revenue
									</p>
									<p className="text-2xl font-display font-normal">
										€{((country.totalRevenueCents || 0) / 100).toFixed(2)}
									</p>
								</div>
							</div>
							{country.lastOrderAt && (
								<div>
									<p className="text-sm text-muted-foreground font-display font-light mb-1">
										Last Order
									</p>
									<p className="font-display font-normal">
										{new Date(country.lastOrderAt).toLocaleDateString()}
									</p>
								</div>
							)}
						</CardContent>
					</Card>

					<Card className="border-2">
						<CardHeader>
							<CardTitle className="font-display font-normal">Metadata</CardTitle>
						</CardHeader>
						<CardContent className="space-y-3 text-sm">
							<div className="flex justify-between">
								<span className="text-muted-foreground font-display font-light">Country ID</span>
								<span className="font-display font-light font-mono text-xs">{country.id}</span>
							</div>
							<div className="flex justify-between">
								<span className="text-muted-foreground font-display font-light">Created</span>
								<span className="font-display font-light">
									{new Date(country.createdAt).toLocaleDateString()}
								</span>
							</div>
							{country.updatedAt && (
								<div className="flex justify-between">
									<span className="text-muted-foreground font-display font-light">Updated</span>
									<span className="font-display font-light">
										{new Date(country.updatedAt).toLocaleDateString()}
									</span>
								</div>
							)}
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}