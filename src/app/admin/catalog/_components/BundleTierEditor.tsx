// src/app/admin/catalog/_components/BundleTierEditor.tsx
"use client";

import { useState } from "react";
import { api } from "~/trpc/react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Badge } from "~/components/ui/badge";
import { Loader2, Plus, Trash2, Star } from "lucide-react";
import { toast } from "sonner";
import type { PricingBundle } from "~/server/db/schema/shop";

interface BundleTierEditorProps {
	pricingId: string;
	bundles: PricingBundle[];
	onUpdate?: () => void;
}

export function BundleTierEditor({ pricingId, bundles, onUpdate }: BundleTierEditorProps) {
	const [isAddingNew, setIsAddingNew] = useState(false);
	const [newBundle, setNewBundle] = useState({
		quantity: 0,
		totalPriceEurCents: 0,
		label: '',
		savingsPercent: 0,
	});

	const createBundle = api.admin.pricing.createBundle.useMutation({
		onSuccess: () => {
			toast.success('Bundle tier added');
			setIsAddingNew(false);
			setNewBundle({ quantity: 0, totalPriceEurCents: 0, label: '', savingsPercent: 0 });
			onUpdate?.();
		},
		onError: (error) => {
			toast.error(`Failed to add bundle: ${error.message}`);
		},
	});

	const updateBundle = api.admin.pricing.updateBundle.useMutation({
		onSuccess: () => {
			toast.success('Bundle tier updated');
			onUpdate?.();
		},
		onError: (error) => {
			toast.error(`Failed to update bundle: ${error.message}`);
		},
	});

	const deleteBundle = api.admin.pricing.deleteBundle.useMutation({
		onSuccess: () => {
			toast.success('Bundle tier deleted');
			onUpdate?.();
		},
		onError: (error) => {
			toast.error(`Failed to delete bundle: ${error.message}`);
		},
	});

	const handleCreateBundle = () => {
		if (newBundle.quantity <= 0 || newBundle.totalPriceEurCents <= 0) {
			toast.error('Please enter valid quantity and price');
			return;
		}

		createBundle.mutate({
			pricingId,
			...newBundle,
		});
	};

	const handleSetDefault = (bundleId: string) => {
		updateBundle.mutate({
			bundleId,
			isDefault: true,
		});
	};

	const handleDeleteBundle = (bundleId: string) => {
		if (confirm('Delete this bundle tier?')) {
			deleteBundle.mutate({ bundleId });
		}
	};

	const formatPrice = (cents: number) => `€${(cents / 100).toFixed(2)}`;
	const formatPricePerPiece = (totalCents: number, quantity: number) =>
		`€${(totalCents / 100 / quantity).toFixed(2)}`;

	return (
		<Card className="border-2">
			<CardHeader>
				<div className="flex items-center justify-between">
					<CardTitle className="font-display font-normal">Bundle Tiers</CardTitle>
					<Button
						size="sm"
						onClick={() => setIsAddingNew(!isAddingNew)}
						className="rounded-full"
						variant={isAddingNew ? "ghost" : "default"}
					>
						{isAddingNew ? (
							'Cancel'
						) : (
							<>
								<Plus className="mr-2 h-4 w-4" />
								Add Tier
							</>
						)}
					</Button>
				</div>
			</CardHeader>
			<CardContent className="space-y-4">
				{/* Existing Bundles */}
				{bundles.length === 0 && !isAddingNew && (
					<p className="text-center text-muted-foreground font-display font-light py-8">
						No bundle tiers yet. Click "Add Tier" to create one.
					</p>
				)}

				{bundles
					.sort((a, b) => a.sortOrder - b.sortOrder)
					.map((bundle) => (
						<div
							key={bundle.id}
							className="flex items-center gap-4 p-4 rounded-lg border border-border hover:border-primary/50 transition-colors"
						>
							<div className="flex-1 space-y-2">
								<div className="flex items-center gap-3">
									<div className="flex items-center gap-2">
										<span className="text-2xl font-display font-light">
											{bundle.quantity}
										</span>
										<span className="text-sm text-muted-foreground font-display font-light">
											pieces
										</span>
									</div>
									{bundle.isDefault && (
										<Badge variant="default" className="flex items-center gap-1">
											<Star className="h-3 w-3" />
											Default
										</Badge>
									)}
									{bundle.label && (
										<Badge variant="outline" className="font-display font-light">
											{bundle.label}
										</Badge>
									)}
								</div>
								<div className="flex items-baseline gap-3">
									<span className="text-xl font-display font-semibold">
										{formatPrice(bundle.totalPriceEurCents)}
									</span>
									<span className="text-sm text-muted-foreground font-display font-light">
										{formatPricePerPiece(bundle.totalPriceEurCents, bundle.quantity)} per piece
									</span>
									{bundle.savingsPercent && bundle.savingsPercent > 0 && (
										<Badge variant="secondary" className="bg-green-500/10 text-green-700">
											Save {bundle.savingsPercent}%
										</Badge>
									)}
								</div>
							</div>
							<div className="flex items-center gap-2">
								{!bundle.isDefault && (
									<Button
										variant="outline"
										size="sm"
										onClick={() => handleSetDefault(bundle.id)}
										disabled={updateBundle.isPending}
										className="rounded-full"
									>
										Set Default
									</Button>
								)}
								<Button
									variant="ghost"
									size="sm"
									onClick={() => handleDeleteBundle(bundle.id)}
									disabled={deleteBundle.isPending}
									className="rounded-full text-destructive hover:text-destructive"
								>
									<Trash2 className="h-4 w-4" />
								</Button>
							</div>
						</div>
					))}

				{/* Add New Bundle Form */}
				{isAddingNew && (
					<div className="p-4 rounded-lg border-2 border-dashed border-primary/50 space-y-4">
						<div className="grid gap-4 sm:grid-cols-2">
							<div className="space-y-2">
								<Label htmlFor="quantity" className="font-display font-light">
									Quantity
								</Label>
								<Input
									id="quantity"
									type="number"
									min="1"
									value={newBundle.quantity || ''}
									onChange={(e) =>
										setNewBundle({ ...newBundle, quantity: parseInt(e.target.value) || 0 })
									}
									placeholder="e.g., 7"
									className="font-display font-light"
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="totalPrice" className="font-display font-light">
									Total Price (€)
								</Label>
								<Input
									id="totalPrice"
									type="number"
									step="0.01"
									min="0"
									value={newBundle.totalPriceEurCents ? (newBundle.totalPriceEurCents / 100).toFixed(2) : ''}
									onChange={(e) =>
										setNewBundle({
											...newBundle,
											totalPriceEurCents: Math.round(parseFloat(e.target.value) * 100) || 0,
										})
									}
									placeholder="e.g., 49.90"
									className="font-display font-light"
								/>
							</div>
						</div>

						<div className="grid gap-4 sm:grid-cols-2">
							<div className="space-y-2">
								<Label htmlFor="label" className="font-display font-light">
									Label (Optional)
								</Label>
								<Input
									id="label"
									type="text"
									value={newBundle.label}
									onChange={(e) => setNewBundle({ ...newBundle, label: e.target.value })}
									placeholder="e.g., Starter Pack"
									className="font-display font-light"
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="savings" className="font-display font-light">
									Savings % (Optional)
								</Label>
								<Input
									id="savings"
									type="number"
									min="0"
									max="100"
									value={newBundle.savingsPercent || ''}
									onChange={(e) =>
										setNewBundle({ ...newBundle, savingsPercent: parseInt(e.target.value) || 0 })
									}
									placeholder="e.g., 15"
									className="font-display font-light"
								/>
							</div>
						</div>

						{newBundle.quantity > 0 && newBundle.totalPriceEurCents > 0 && (
							<div className="p-3 rounded-lg bg-muted/50">
								<p className="text-sm font-display font-light">
									<span className="text-muted-foreground">Price per piece:</span>{' '}
									<span className="font-semibold">
										{formatPricePerPiece(newBundle.totalPriceEurCents, newBundle.quantity)}
									</span>
								</p>
							</div>
						)}

						<Button
							onClick={handleCreateBundle}
							disabled={createBundle.isPending}
							className="w-full rounded-full"
						>
							{createBundle.isPending ? (
								<Loader2 className="h-4 w-4 animate-spin" />
							) : (
								<>
									<Plus className="mr-2 h-4 w-4" />
									Add Bundle Tier
								</>
							)}
						</Button>
					</div>
				)}
			</CardContent>
		</Card>
	);
}