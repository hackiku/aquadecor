// src/app/admin/countries/[id]/page.tsx
"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Trash2 } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "~/components/ui/select";
import { Checkbox } from "~/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { api } from "~/trpc/react";
import { toast } from "sonner";

export default function CountryDetailPage({ params }: { params: Promise<{ id: string }> }) {
	const router = useRouter();
	const utils = api.useUtils();
	const { id } = use(params);

	// Fetch country data
	const { data: country, isLoading } = api.admin.country.getById.useQuery({
		id,
	});

	// Fetch zones for dropdown
	const { data: zones = [] } = api.admin.country.getZones.useQuery();

	// Local form state
	const [formData, setFormData] = useState({
		shippingZoneId: country?.shippingZoneId || "",
		isShippingEnabled: country?.isShippingEnabled ?? true,
		isSuspended: country?.isSuspended ?? false,
		suspensionReason: country?.suspensionReason || "",
		requiresCustoms: country?.requiresCustoms ?? false,
		requiresPhoneNumber: country?.requiresPhoneNumber ?? false,
		maxWeightKg: country?.maxWeightKg?.toString() || "",
		maxValueCents: country?.maxValueCents?.toString() || "",
		notes: country?.notes || "",
	});

	// Update form when country loads
	useState(() => {
		if (country) {
			setFormData({
				shippingZoneId: country.shippingZoneId || "",
				isShippingEnabled: country.isShippingEnabled,
				isSuspended: country.isSuspended,
				suspensionReason: country.suspensionReason || "",
				requiresCustoms: country.requiresCustoms ?? false,
				requiresPhoneNumber: country.requiresPhoneNumber ?? false,
				maxWeightKg: country.maxWeightKg?.toString() || "",
				maxValueCents: country.maxValueCents?.toString() || "",
				notes: country.notes || "",
			});
		}
	});

	// Update mutation
	const updateMutation = api.admin.country.update.useMutation({
		onSuccess: () => {
			toast.success("Country updated successfully!");
			utils.admin.country.getById.invalidate({ id: params.id });
			utils.admin.country.getAll.invalidate();
			utils.admin.country.getStats.invalidate();
		},
		onError: (error) => {
			toast.error(`Failed to update: ${error.message}`);
		},
	});

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		updateMutation.mutate({
			id: params.id,
			shippingZoneId: formData.shippingZoneId || undefined,
			isShippingEnabled: formData.isShippingEnabled,
			isSuspended: formData.isSuspended,
			suspensionReason: formData.isSuspended ? formData.suspensionReason : null,
			requiresCustoms: formData.requiresCustoms,
			requiresPhoneNumber: formData.requiresPhoneNumber,
			maxWeightKg: formData.maxWeightKg ? parseInt(formData.maxWeightKg) : null,
			maxValueCents: formData.maxValueCents ? parseInt(formData.maxValueCents) : null,
			notes: formData.notes || null,
		});
	};

	if (isLoading) {
		return (
			<div className="flex h-96 items-center justify-center">
				<div className="text-muted-foreground">Loading country...</div>
			</div>
		);
	}

	if (!country) {
		return (
			<div className="flex h-96 flex-col items-center justify-center gap-4">
				<div className="text-muted-foreground">Country not found</div>
				<Button asChild>
					<Link href="/admin/countries">Back to Countries</Link>
				</Button>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-4">
					<Button variant="ghost" size="icon" asChild>
						<Link href="/admin/countries">
							<ArrowLeft className="h-4 w-4" />
						</Link>
					</Button>
					<div>
						<div className="flex items-center gap-3">
							<span className="text-4xl">{country.flagEmoji || "🏴"}</span>
							<div>
								<h1 className="text-3xl font-bold">{country.name}</h1>
								<p className="text-muted-foreground">
									{country.iso2} • {country.iso3}
									{country.localName && ` • ${country.localName}`}
								</p>
							</div>
						</div>
					</div>
				</div>
				<div className="flex gap-2">
					<Button variant="outline" size="sm">
						<Trash2 className="mr-2 h-4 w-4" />
						Delete
					</Button>
					<Button onClick={handleSubmit} disabled={updateMutation.isPending}>
						<Save className="mr-2 h-4 w-4" />
						{updateMutation.isPending ? "Saving..." : "Save Changes"}
					</Button>
				</div>
			</div>

			{/* Stats Overview */}
			<div className="grid gap-4 md:grid-cols-4">
				<Card>
					<CardHeader className="pb-3">
						<CardDescription>Total Orders</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{country.totalOrders || 0}</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="pb-3">
						<CardDescription>Total Revenue</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							€{((country.totalRevenueCents || 0) / 100).toFixed(2)}
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="pb-3">
						<CardDescription>Last Order</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="text-sm">
							{country.lastOrderAt
								? new Date(country.lastOrderAt).toLocaleDateString()
								: "Never"}
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="pb-3">
						<CardDescription>Status</CardDescription>
					</CardHeader>
					<CardContent>
						{country.isSuspended ? (
							<Badge variant="destructive">Suspended</Badge>
						) : country.isShippingEnabled ? (
							<Badge>Active</Badge>
						) : (
							<Badge variant="secondary">Disabled</Badge>
						)}
					</CardContent>
				</Card>
			</div>

			{/* Edit Form */}
			<form onSubmit={handleSubmit} className="space-y-6">
				<Card>
					<CardHeader>
						<CardTitle>Shipping Configuration</CardTitle>
						<CardDescription>
							Configure shipping settings for this country
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="shippingZone">Shipping Zone</Label>
							<Select
								value={formData.shippingZoneId}
								onValueChange={(value) =>
									setFormData({ ...formData, shippingZoneId: value })
								}
							>
								<SelectTrigger>
									<SelectValue placeholder="Select zone..." />
								</SelectTrigger>
								<SelectContent>
									{zones.map((zone) => (
										<SelectItem key={zone.id} value={zone.id}>
											{zone.name} ({zone.code})
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						<div className="grid gap-4 md:grid-cols-2">
							<div className="space-y-2">
								<Label htmlFor="maxWeight">Max Weight (kg)</Label>
								<Input
									id="maxWeight"
									type="number"
									placeholder="30"
									value={formData.maxWeightKg}
									onChange={(e) =>
										setFormData({ ...formData, maxWeightKg: e.target.value })
									}
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="maxValue">Max Value (cents)</Label>
								<Input
									id="maxValue"
									type="number"
									placeholder="400000"
									value={formData.maxValueCents}
									onChange={(e) =>
										setFormData({ ...formData, maxValueCents: e.target.value })
									}
								/>
							</div>
						</div>

						<div className="space-y-3">
							<div className="flex items-center space-x-2">
								<Checkbox
									id="requiresCustoms"
									checked={formData.requiresCustoms}
									onCheckedChange={(checked) =>
										setFormData({
											...formData,
											requiresCustoms: checked === true,
										})
									}
								/>
								<Label htmlFor="requiresCustoms" className="cursor-pointer">
									Requires customs declaration
								</Label>
							</div>

							<div className="flex items-center space-x-2">
								<Checkbox
									id="requiresPhoneNumber"
									checked={formData.requiresPhoneNumber}
									onCheckedChange={(checked) =>
										setFormData({
											...formData,
											requiresPhoneNumber: checked === true,
										})
									}
								/>
								<Label htmlFor="requiresPhoneNumber" className="cursor-pointer">
									Requires phone number for delivery
								</Label>
							</div>

							<div className="flex items-center space-x-2">
								<Checkbox
									id="isShippingEnabled"
									checked={formData.isShippingEnabled}
									onCheckedChange={(checked) =>
										setFormData({
											...formData,
											isShippingEnabled: checked === true,
										})
									}
								/>
								<Label htmlFor="isShippingEnabled" className="cursor-pointer">
									Enable shipping to this country
								</Label>
							</div>

							<div className="flex items-center space-x-2">
								<Checkbox
									id="isSuspended"
									checked={formData.isSuspended}
									onCheckedChange={(checked) =>
										setFormData({
											...formData,
											isSuspended: checked === true,
										})
									}
								/>
								<Label htmlFor="isSuspended" className="cursor-pointer">
									Suspend shipping (temporary)
								</Label>
							</div>
						</div>

						{formData.isSuspended && (
							<div className="space-y-2">
								<Label htmlFor="suspensionReason">Suspension Reason</Label>
								<Input
									id="suspensionReason"
									placeholder="e.g., Conflict zone, carrier issues..."
									value={formData.suspensionReason}
									onChange={(e) =>
										setFormData({
											...formData,
											suspensionReason: e.target.value,
										})
									}
								/>
							</div>
						)}

						<div className="space-y-2">
							<Label htmlFor="notes">Notes</Label>
							<Textarea
								id="notes"
								placeholder="Any special notes or restrictions..."
								value={formData.notes}
								onChange={(e) =>
									setFormData({ ...formData, notes: e.target.value })
								}
								rows={3}
							/>
						</div>
					</CardContent>
				</Card>

				{/* Serbia Post Info (Read-only) */}
				{(country.postOperatorCode || country.postZone) && (
					<Card>
						<CardHeader>
							<CardTitle>Serbia Post Information</CardTitle>
							<CardDescription>Original data from Serbia Post CSV</CardDescription>
						</CardHeader>
						<CardContent className="grid gap-4 md:grid-cols-2">
							<div>
								<Label className="text-muted-foreground">Operator Code</Label>
								<div className="text-lg">{country.postOperatorCode || "—"}</div>
							</div>
							<div>
								<Label className="text-muted-foreground">Post Zone</Label>
								<div className="text-lg">{country.postZone || "—"}</div>
							</div>
						</CardContent>
					</Card>
				)}
			</form>
		</div>
	);
}