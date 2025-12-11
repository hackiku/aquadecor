// src/app/admin/catalog/trash/_components/TrashActionsClient.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "~/trpc/react";
import { Button } from "~/components/ui/button";
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
import { Loader2, RotateCcw, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface TrashActionsClientProps {
	productIds: string[];
	productName?: string | null;
	showRestoreOnly?: boolean;
}

export function TrashActionsClient({
	productIds,
	productName,
	showRestoreOnly = false
}: TrashActionsClientProps) {
	const router = useRouter();
	const [showEmptyDialog, setShowEmptyDialog] = useState(false);
	const [showDeleteDialog, setShowDeleteDialog] = useState(false);

	const restoreProducts = api.admin.product.bulkRestore.useMutation({
		onSuccess: (data) => {
			toast.success(`Restored ${data.restored} product${data.restored !== 1 ? 's' : ''}`);
			router.refresh();
		},
		onError: (error) => {
			toast.error(`Failed to restore: ${error.message}`);
		},
	});

	const permanentlyDelete = api.admin.product.permanentlyDelete.useMutation({
		onSuccess: () => {
			toast.success('Product permanently deleted');
			setShowDeleteDialog(false);
			router.refresh();
		},
		onError: (error) => {
			toast.error(`Failed to delete: ${error.message}`);
		},
	});

	const emptyTrash = api.admin.product.emptyTrash.useMutation({
		onSuccess: (data) => {
			toast.success(`Permanently deleted ${data.deleted} product${data.deleted !== 1 ? 's' : ''}`);
			setShowEmptyDialog(false);
			router.refresh();
		},
		onError: (error) => {
			toast.error(`Failed to empty trash: ${error.message}`);
		},
	});

	const handleRestore = () => {
		restoreProducts.mutate({ productIds });
	};

	const handlePermanentDelete = () => {
		if (productIds.length === 1) {
			permanentlyDelete.mutate({ id: productIds[0]! });
		} else {
			// Bulk delete not implemented yet, show dialog
			setShowDeleteDialog(true);
		}
	};

	const handleEmptyTrash = () => {
		emptyTrash.mutate();
	};

	// Single product actions (in grid)
	if (showRestoreOnly) {
		return (
			<>
				<Button
					size="sm"
					onClick={handleRestore}
					disabled={restoreProducts.isPending}
					className="rounded-full"
				>
					{restoreProducts.isPending ? (
						<Loader2 className="h-4 w-4 animate-spin" />
					) : (
						<>
							<RotateCcw className="mr-2 h-4 w-4" />
							Restore
						</>
					)}
				</Button>
				<Button
					variant="ghost"
					size="sm"
					onClick={() => setShowDeleteDialog(true)}
					className="rounded-full text-destructive hover:text-destructive"
				>
					<Trash2 className="h-4 w-4" />
				</Button>

				{/* Delete Confirmation */}
				<AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
					<AlertDialogContent>
						<AlertDialogHeader>
							<AlertDialogTitle>Permanently Delete Product?</AlertDialogTitle>
							<AlertDialogDescription>
								This will permanently delete{' '}
								<span className="font-semibold">{productName || 'this product'}</span>.
								This action cannot be undone.
							</AlertDialogDescription>
						</AlertDialogHeader>
						<AlertDialogFooter>
							<AlertDialogCancel>Cancel</AlertDialogCancel>
							<AlertDialogAction
								onClick={handlePermanentDelete}
								disabled={permanentlyDelete.isPending}
								className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
							>
								{permanentlyDelete.isPending ? (
									<Loader2 className="h-4 w-4 animate-spin" />
								) : (
									'Delete Permanently'
								)}
							</AlertDialogAction>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialog>
			</>
		);
	}

	// Bulk actions (in header)
	return (
		<>
			<div className="flex items-center gap-2">
				<Button
					variant="outline"
					onClick={handleRestore}
					disabled={restoreProducts.isPending}
					className="rounded-full"
				>
					{restoreProducts.isPending ? (
						<Loader2 className="h-4 w-4 animate-spin" />
					) : (
						<>
							<RotateCcw className="mr-2 h-4 w-4" />
							Restore All
						</>
					)}
				</Button>
				<Button
					variant="destructive"
					onClick={() => setShowEmptyDialog(true)}
					className="rounded-full"
				>
					<Trash2 className="mr-2 h-4 w-4" />
					Empty Trash
				</Button>
			</div>

			{/* Empty Trash Confirmation */}
			<AlertDialog open={showEmptyDialog} onOpenChange={setShowEmptyDialog}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Empty Trash?</AlertDialogTitle>
						<AlertDialogDescription>
							This will permanently delete all {productIds.length} product
							{productIds.length !== 1 ? 's' : ''} in the trash. This action cannot be undone.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction
							onClick={handleEmptyTrash}
							disabled={emptyTrash.isPending}
							className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
						>
							{emptyTrash.isPending ? (
								<Loader2 className="h-4 w-4 animate-spin" />
							) : (
								'Empty Trash'
							)}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
}