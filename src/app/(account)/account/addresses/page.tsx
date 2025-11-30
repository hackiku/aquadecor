// src/app/(account)/account/addresses/page.tsx
"use client";

import { useState } from "react";
import { MobileAccountNav } from "../../_components/MobileAccountNav";
import { Button } from "~/components/ui/button";
import { Plus, MapPin, Pencil, Trash2, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { EditAddress } from "../../_components/EditAddress";
import { api, type RouterOutputs } from "~/trpc/react";
import { toast } from "sonner";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "~/components/ui/alert-dialog";

// Type inference from tRPC router
type Address = RouterOutputs["account"]["address"]["getAll"][number];

export default function AddressesPage() {
	const [isEditOpen, setIsEditOpen] = useState(false);
	const [editMode, setEditMode] = useState<"create" | "edit">("create");
	const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
	const [deleteId, setDeleteId] = useState<string | null>(null);

	const utils = api.useUtils();

	// Queries
	const { data: addresses, isLoading } = api.account.address.getAll.useQuery();

	// Mutations
	const deleteMutation = api.account.address.delete.useMutation({
		onSuccess: () => {
			toast.success("Address deleted");
			utils.account.address.getAll.invalidate();
			setDeleteId(null);
		},
		onError: (err) => toast.error(err.message)
	});

	const setDefaultMutation = api.account.address.setDefault.useMutation({
		onSuccess: () => {
			toast.success("Default address updated");
			utils.account.address.getAll.invalidate();
		},
		onError: (err) => toast.error(err.message)
	});

	const handleCreate = () => {
		setSelectedAddress(null);
		setEditMode("create");
		setIsEditOpen(true);
	};

	const handleEdit = (address: Address) => {
		setSelectedAddress(address);
		setEditMode("edit");
		setIsEditOpen(true);
	};

	const handleDelete = (id: string) => {
		setDeleteId(id);
	};

	const confirmDelete = () => {
		if (deleteId) {
			deleteMutation.mutate({ id: deleteId });
		}
	};

	const handleSetDefault = (id: string) => {
		setDefaultMutation.mutate({ id });
	};

	if (isLoading) {
		return (
			<div className="space-y-6">
				<div className="flex items-center justify-between">
					<div>
						<h1 className="text-2xl md:text-3xl font-display font-light">Addresses</h1>
						<p className="text-muted-foreground font-display font-light">
							Manage shipping and billing addresses.
						</p>
					</div>
					<MobileAccountNav />
				</div>
				<div className="flex items-center justify-center py-12">
					<Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
				</div>
			</div>
		);
	}

	return (
		<>
			<div className="space-y-6">
				<div className="flex items-center justify-between">
					<div>
						<h1 className="text-2xl md:text-3xl font-display font-light">Addresses</h1>
						<p className="text-muted-foreground font-display font-light">
							Manage shipping and billing addresses.
						</p>
					</div>
					<MobileAccountNav />
				</div>

				{addresses && addresses.length === 0 ? (
					// Empty state
					<div className="flex flex-col items-center justify-center py-12 border-2 border-dashed rounded-xl">
						<MapPin className="h-12 w-12 text-muted-foreground mb-4" />
						<h3 className="font-display font-medium text-lg mb-2">No addresses yet</h3>
						<p className="text-muted-foreground text-sm mb-6">
							Add your first shipping address to get started
						</p>
						<Button onClick={handleCreate} className="rounded-full">
							<Plus className="h-4 w-4 mr-2" />
							Add Address
						</Button>
					</div>
				) : (
					<div className="grid md:grid-cols-2 gap-6">
						{addresses?.map((address) => (
							<Card
								key={address.id}
								className="relative group border-2 hover:border-primary/20 transition-all"
							>
								<CardHeader className="pb-3">
									<div className="flex items-start justify-between">
										<div className="flex items-center gap-2">
											<MapPin className="h-4 w-4 text-primary" />
											<span className="font-display font-medium">{address.label}</span>
											{address.isDefault && (
												<Badge variant="secondary" className="text-xs font-normal">
													Default
												</Badge>
											)}
										</div>
									</div>
								</CardHeader>
								<CardContent className="space-y-4">
									<div className="text-sm font-display font-light text-muted-foreground space-y-1">
										<p className="text-foreground font-medium">
											{address.firstName} {address.lastName}
										</p>
										{address.company && <p>{address.company}</p>}
										<p>{address.streetAddress1}</p>
										{address.streetAddress2 && <p>{address.streetAddress2}</p>}
										<p>
											{address.postalCode} {address.city}
										</p>
										{address.state && <p>{address.state}</p>}
										<p>{address.countryCode}</p>
										{address.phone && <p className="pt-2">{address.phone}</p>}
									</div>

									<div className="flex gap-2 pt-2">
										<Button
											variant="outline"
											size="sm"
											className="h-8 rounded-full"
											onClick={() => handleEdit(address)}
										>
											<Pencil className="h-3 w-3 mr-2" />
											Edit
										</Button>
										{!address.isDefault && (
											<Button
												variant="outline"
												size="sm"
												className="h-8 rounded-full"
												onClick={() => handleSetDefault(address.id)}
												disabled={setDefaultMutation.isPending}
											>
												Set Default
											</Button>
										)}
										<Button
											variant="ghost"
											size="sm"
											className="h-8 rounded-full text-red-600 hover:text-red-700 hover:bg-red-50"
											onClick={() => handleDelete(address.id)}
											disabled={deleteMutation.isPending}
										>
											<Trash2 className="h-3 w-3" />
										</Button>
									</div>
								</CardContent>
							</Card>
						))}

						{/* Add New Button */}
						<button
							onClick={handleCreate}
							className="flex flex-col items-center justify-center h-full min-h-[200px] border-2 border-dashed rounded-xl hover:border-primary/50 hover:bg-muted/30 transition-all group"
						>
							<div className="w-12 h-12 rounded-full bg-muted group-hover:bg-primary/10 flex items-center justify-center mb-3 transition-colors">
								<Plus className="h-6 w-6 text-muted-foreground group-hover:text-primary" />
							</div>
							<span className="font-display font-medium">Add New Address</span>
						</button>
					</div>
				)}
			</div>

			{/* Edit/Create Dialog */}
			<EditAddress
				open={isEditOpen}
				onOpenChange={setIsEditOpen}
				mode={editMode}
				initialData={selectedAddress}
			/>

			{/* Delete Confirmation Dialog */}
			<AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Delete Address?</AlertDialogTitle>
						<AlertDialogDescription>
							This action cannot be undone. This will permanently delete the address from
							your account.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction
							onClick={confirmDelete}
							className="bg-red-600 hover:bg-red-700"
						>
							Delete
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
}