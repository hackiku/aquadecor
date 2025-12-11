// src/app/admin/catalog/products/_components/pricing/BundleTierManager.tsx
"use client";

import { useState } from "react";
import { api } from "~/trpc/react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Badge } from "~/components/ui/badge";
import { Plus, Trash2, Edit2, Save, X, GripVertical } from "lucide-react";
import { toast } from "sonner";

interface BundleTierManagerProps {
	pricingId: string;
	productId: string;
	bundles?: any[];
}

export function BundleTierManager({ pricingId, productId, bundles }: BundleTierManagerProps) {
	const [isAdding, setIsAdding] = useState(false);
	const [editingId, setEditingId] = useState<string | null>(null);
	const [formData, setFormData] = useState({
		quantity: "",
		totalPrice: "",
		label: "",
		savingsPercent: "",
	});

	const utils = api.useUtils();

	const createBundle = api.admin.pricing.createBundle.useMutation({
		onSuccess: async () => {
			toast.success("Bundle tier added");
			await utils.admin.pricing.getByProduct.invalidate({ productId });
			resetForm();
		},
		onError: (error) => {
			toast.error(`Failed to add bundle: ${error.message}`);
		},
	});

	const updateBundle = api.admin.pricing.updateBundle.useMutation({
		onSuccess: async () => {
			toast.success("Bundle tier updated");
			await utils.admin.pricing.getByProduct.invalidate({ productId });
			setEditingId(null);
		},
		onError: (error) => {
			toast.error(`Failed to update bundle: ${error.message}`);
		},
	});

	const deleteBundle = api.admin.pricing.deleteBundle.useMutation({
		onSuccess: async () => {
			toast.success("Bundle tier deleted");
			await utils.admin.pricing.getByProduct.invalidate({ productId });
		},
		onError: (error) => {
			toast.error(`Failed to delete bundle: ${error.message}`);
		},
	});

	const resetForm = () => {
		setIsAdding(false);
		setEditingId(null);
		setFormData({
			quantity: "",
			totalPrice: "",
			label: "",
			savingsPercent: "",
		});
	};

	const handleCreate = () => {
		const quantity = parseInt(formData.quantity);
		const totalPrice = parseFloat(formData.totalPrice);

		if (!quantity || quantity <= 0) {
			toast.error("Quantity must be greater than 0");
			return;
		}

		if (!totalPrice || totalPrice <= 0) {
			toast.error("Price must be greater than 0");
			return;
		}

		createBundle.mutate({
			pricingId,
			quantity,
			totalPriceEurCents: Math.round(totalPrice * 100),
			label: formData.label || undefined,
			savingsPercent: formData.savingsPercent
				? parseInt(formData.savingsPercent)
				: undefined,
			isDefault: false,
			sortOrder: bundles?.length || 0,
		});
	};

	const handleUpdate = (bundleId: string) => {
		const quantity = parseInt(formData.quantity);
		const totalPrice = parseFloat(formData.totalPrice);

		if (!quantity || quantity <= 0) {
			toast.error("Quantity must be greater than 0");
			return;
		}

		if (!totalPrice || totalPrice <= 0) {
			toast.error("Price must be greater than 0");
			return;
		}

		updateBundle.mutate({
			bundleId,
			quantity,
			totalPriceEurCents: Math.round(totalPrice * 100),
			label: formData.label || undefined,
			savingsPercent: formData.savingsPercent
				? parseInt(formData.savingsPercent)
				: undefined,
		});
	};

	const handleDelete = (bundleId: string) => {
		if (confirm("Delete this bundle tier?")) {
			deleteBundle.mutate({ bundleId });
		}
	};

	const startEdit = (bundle: any) => {
		setEditingId(bundle.id);
		setFormData({
			quantity: bundle.quantity.toString(),
			totalPrice: (bundle.totalPriceEurCents / 100).toFixed(2),
			label: bundle.label || "",
			savingsPercent: bundle.savingsPercent?.toString() || "",
		});
	};

	const formatPrice = (cents: number) => `€${(cents / 100).toFixed(2)}`;

	return (
		<Card>
			<CardHeader>
				<div className="flex items-center justify-between">
					<CardTitle className="text-lg font-display font-normal">Bundle Tiers</CardTitle>
					{!isAdding && (
						<Button
							size="sm"
							variant="outline"
							onClick={() => setIsAdding(true)}
							className="rounded-full"
						>
							<Plus className="mr-2 h-4 w-4" />
							Add Tier
						</Button>
					)}
				</div>
			</CardHeader>
			<CardContent className="space-y-4">
				{/* Existing Bundles */}
				{bundles && bundles.length > 0 ? (
					<div className="space-y-2">
						{bundles.map((bundle) =>
							editingId === bundle.id ? (
								<Card key={bundle.id} className="border-primary">
									<CardContent className="pt-6 space-y-4">
										<div className="grid grid-cols-2 gap-4">
											<div className="space-y-2">
												<Label className="font-display font-light">Quantity</Label>
												<Input
													type="number"
													min="1"
													value={formData.quantity}
													onChange={(e) =>
														setFormData({ ...formData, quantity: e.target.value })
													}
													className="font-display font-light"
												/>
											</div>
											<div className="space-y-2">
												<Label className="font-display font-light">Total Price (€)</Label>
												<Input
													type="number"
													step="0.01"
													min="0"
													value={formData.totalPrice}
													onChange={(e) =>
														setFormData({ ...formData, totalPrice: e.target.value })
													}
													className="font-display font-light"
												/>
											</div>
										</div>
										<div className="grid grid-cols-2 gap-4">
											<div className="space-y-2">
												<Label className="font-display font-light">
													Label (Optional)
												</Label>
												<Input
													value={formData.label}
													onChange={(e) =>
														setFormData({ ...formData, label: e.target.value })
													}
													placeholder="e.g., Best Value"
													className="font-display font-light"
												/>
											</div>
											<div className="space-y-2">
												<Label className="font-display font-light">
													Savings % (Optional)
												</Label>
												<Input
													type="number"
													min="0"
													max="100"
													value={formData.savingsPercent}
													onChange={(e) =>
														setFormData({
															...formData,
															savingsPercent: e.target.value,
														})
													}
													placeholder="15"
													className="font-display font-light"
												/>
											</div>
										</div>
										<div className="flex gap-2">
											<Button
												size="sm"
												onClick={() => handleUpdate(bundle.id)}
												disabled={updateBundle.isPending}
												className="rounded-full"
											>
												<Save className="mr-2 h-4 w-4" />
												Save
											</Button>
											<Button
												size="sm"
												variant="ghost"
												onClick={resetForm}
												className="rounded-full"
											>
												<X className="mr-2 h-4 w-4" />
												Cancel
											</Button>
										</div>
									</CardContent>
								</Card>
							) : (
								<div
									key={bundle.id}
									className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
								>
									<div className="flex items-center gap-3">
										<GripVertical className="h-4 w-4 text-muted-foreground" />
										<div>
											<div className="flex items-center gap-2">
												<p className="font-display font-normal">
													{bundle.quantity} pieces
												</p>
												{bundle.isDefault && (
													<Badge variant="secondary" className="text-xs">
														Default
													</Badge>
												)}
											</div>
											{bundle.label && (
												<p className="text-sm text-muted-foreground font-display font-light">
													{bundle.label}
												</p>
											)}
										</div>
									</div>
									<div className="flex items-center gap-4">
										<div className="text-right">
											<p className="font-display font-light text-lg">
												{formatPrice(bundle.totalPriceEurCents)}
											</p>
											{bundle.savingsPercent && (
												<p className="text-xs text-green-600">
													Save {bundle.savingsPercent}%
												</p>
											)}
										</div>
										<div className="flex gap-2">
											<Button
												size="sm"
												variant="ghost"
												onClick={() => startEdit(bundle)}
												className="rounded-full"
											>
												<Edit2 className="h-4 w-4" />
											</Button>
											<Button
												size="sm"
												variant="ghost"
												onClick={() => handleDelete(bundle.id)}
												disabled={deleteBundle.isPending}
												className="rounded-full text-destructive hover:text-destructive"
											>
												<Trash2 className="h-4 w-4" />
											</Button>
										</div>
									</div>
								</div>
							)
						)}
					</div>
				) : (
					<p className="text-sm text-muted-foreground italic font-display font-light text-center py-4">
						No bundle tiers yet
					</p>
				)}

				{/* Add New Form */}
				{isAdding && (
					<Card className="border-primary">
						<CardContent className="pt-6 space-y-4">
							<div className="grid grid-cols-2 gap-4">
								<div className="space-y-2">
									<Label className="font-display font-light">Quantity</Label>
									<Input
										type="number"
										min="1"
										value={formData.quantity}
										onChange={(e) =>
											setFormData({ ...formData, quantity: e.target.value })
										}
										placeholder="3"
										className="font-display font-light"
									/>
								</div>
								<div className="space-y-2">
									<Label className="font-display font-light">Total Price (€)</Label>
									<Input
										type="number"
										step="0.01"
										min="0"
										value={formData.totalPrice}
										onChange={(e) =>
											setFormData({ ...formData, totalPrice: e.target.value })
										}
										placeholder="29.99"
										className="font-display font-light"
									/>
								</div>
							</div>
							<div className="grid grid-cols-2 gap-4">
								<div className="space-y-2">
									<Label className="font-display font-light">Label (Optional)</Label>
									<Input
										value={formData.label}
										onChange={(e) => setFormData({ ...formData, label: e.target.value })}
										placeholder="e.g., Starter Pack"
										className="font-display font-light"
									/>
								</div>
								<div className="space-y-2">
									<Label className="font-display font-light">
										Savings % (Optional)
									</Label>
									<Input
										type="number"
										min="0"
										max="100"
										value={formData.savingsPercent}
										onChange={(e) =>
											setFormData({ ...formData, savingsPercent: e.target.value })
										}
										placeholder="15"
										className="font-display font-light"
									/>
								</div>
							</div>
							<div className="flex gap-2">
								<Button
									size="sm"
									onClick={handleCreate}
									disabled={createBundle.isPending}
									className="rounded-full"
								>
									<Plus className="mr-2 h-4 w-4" />
									Add Tier
								</Button>
								<Button
									size="sm"
									variant="ghost"
									onClick={resetForm}
									className="rounded-full"
								>
									<X className="mr-2 h-4 w-4" />
									Cancel
								</Button>
							</div>
						</CardContent>
					</Card>
				)}
			</CardContent>
		</Card>
	);
}