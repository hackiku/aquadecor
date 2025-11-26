// src/app/admin/countries/_components/AddCountryModal.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "~/components/ui/dialog";
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
import { api } from "~/trpc/react";
import { toast } from "sonner";

interface AddCountryModalProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	zones: Array<{
		id: string;
		name: string;
		code: string;
	}>;
}

export function AddCountryModal({ open, onOpenChange, zones }: AddCountryModalProps) {
	const router = useRouter();
	const utils = api.useUtils();
	const [formData, setFormData] = useState({
		iso2: "",
		iso3: "",
		name: "",
		localName: "",
		flagEmoji: "",
		shippingZoneId: "",
		postOperatorCode: "",
		postZone: "",
		requiresCustoms: false,
		requiresPhoneNumber: false,
		isShippingEnabled: true,
		notes: "",
	});

	const createMutation = api.admin.country.create.useMutation({
		onSuccess: () => {
			toast.success("Country added successfully!");
			utils.admin.country.getAll.invalidate();
			utils.admin.country.getStats.invalidate();
			onOpenChange(false);
			// Reset form
			setFormData({
				iso2: "",
				iso3: "",
				name: "",
				localName: "",
				flagEmoji: "",
				shippingZoneId: "",
				postOperatorCode: "",
				postZone: "",
				requiresCustoms: false,
				requiresPhoneNumber: false,
				isShippingEnabled: true,
				notes: "",
			});
		},
		onError: (error) => {
			toast.error(`Failed to add country: ${error.message}`);
		},
	});

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		createMutation.mutate({
			iso2: formData.iso2.toUpperCase(),
			iso3: formData.iso3.toUpperCase(),
			name: formData.name,
			localName: formData.localName || undefined,
			flagEmoji: formData.flagEmoji || undefined,
			shippingZoneId: formData.shippingZoneId || undefined,
			postOperatorCode: formData.postOperatorCode || undefined,
			postZone: formData.postZone ? parseInt(formData.postZone) : undefined,
			requiresCustoms: formData.requiresCustoms,
			requiresPhoneNumber: formData.requiresPhoneNumber,
			isShippingEnabled: formData.isShippingEnabled,
			notes: formData.notes || undefined,
		});
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
				<DialogHeader>
					<DialogTitle>Add New Country</DialogTitle>
					<DialogDescription>
						Add a new country to enable shipping destinations
					</DialogDescription>
				</DialogHeader>

				<form onSubmit={handleSubmit} className="space-y-4">
					{/* Basic Info */}
					<div className="grid gap-4 md:grid-cols-2">
						<div className="space-y-2">
							<Label htmlFor="iso2">ISO2 Code *</Label>
							<Input
								id="iso2"
								placeholder="RS"
								maxLength={2}
								value={formData.iso2}
								onChange={(e) =>
									setFormData({ ...formData, iso2: e.target.value.toUpperCase() })
								}
								required
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="iso3">ISO3 Code *</Label>
							<Input
								id="iso3"
								placeholder="SRB"
								maxLength={3}
								value={formData.iso3}
								onChange={(e) =>
									setFormData({ ...formData, iso3: e.target.value.toUpperCase() })
								}
								required
							/>
						</div>
					</div>

					<div className="space-y-2">
						<Label htmlFor="name">Country Name *</Label>
						<Input
							id="name"
							placeholder="Serbia"
							value={formData.name}
							onChange={(e) => setFormData({ ...formData, name: e.target.value })}
							required
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="localName">Local Name</Label>
						<Input
							id="localName"
							placeholder="Србија"
							value={formData.localName}
							onChange={(e) =>
								setFormData({ ...formData, localName: e.target.value })
							}
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="flagEmoji">Flag Emoji</Label>
						<Input
							id="flagEmoji"
							placeholder="🇷🇸"
							value={formData.flagEmoji}
							onChange={(e) =>
								setFormData({ ...formData, flagEmoji: e.target.value })
							}
						/>
					</div>

					{/* Shipping Configuration */}
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
										{zone.name}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					{/* Serbia Post Fields */}
					<div className="grid gap-4 md:grid-cols-2">
						<div className="space-y-2">
							<Label htmlFor="postOperatorCode">Post Operator Code</Label>
							<Input
								id="postOperatorCode"
								placeholder="SRA"
								value={formData.postOperatorCode}
								onChange={(e) =>
									setFormData({
										...formData,
										postOperatorCode: e.target.value.toUpperCase(),
									})
								}
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="postZone">Serbia Post Zone</Label>
							<Input
								id="postZone"
								type="number"
								placeholder="1-5"
								min="1"
								max="5"
								value={formData.postZone}
								onChange={(e) =>
									setFormData({ ...formData, postZone: e.target.value })
								}
							/>
						</div>
					</div>

					{/* Requirements Checkboxes */}
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
					</div>

					{/* Notes */}
					<div className="space-y-2">
						<Label htmlFor="notes">Notes</Label>
						<Textarea
							id="notes"
							placeholder="Any special notes or restrictions..."
							value={formData.notes}
							onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
							rows={3}
						/>
					</div>

					{/* Actions */}
					<div className="flex justify-end gap-3 pt-4">
						<Button
							type="button"
							variant="outline"
							onClick={() => onOpenChange(false)}
							disabled={createMutation.isPending}
						>
							Cancel
						</Button>
						<Button type="submit" disabled={createMutation.isPending}>
							{createMutation.isPending ? "Adding..." : "Add Country"}
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
}