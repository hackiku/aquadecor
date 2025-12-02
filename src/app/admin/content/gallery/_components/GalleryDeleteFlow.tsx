// src/app/admin/content/gallery/_components/GalleryDeleteFlow.tsx
"use client";

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

interface GalleryDeleteFlowProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onConfirm: () => void;
	itemCount: number;
	type?: "single" | "bulk";
}

export function GalleryDeleteFlow({
	open,
	onOpenChange,
	onConfirm,
	itemCount,
	type = "single",
}: GalleryDeleteFlowProps) {
	const title = type === "bulk"
		? `Delete ${itemCount} image${itemCount !== 1 ? "s" : ""}?`
		: "Delete image?";

	const description = type === "bulk"
		? "This will permanently delete the selected images. This action cannot be undone."
		: "This will permanently delete this image. This action cannot be undone.";

	return (
		<AlertDialog open={open} onOpenChange={onOpenChange}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle className="font-display font-normal">
						{title}
					</AlertDialogTitle>
					<AlertDialogDescription className="font-display font-light">
						{description}
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel className="rounded-full font-display font-light">
						Cancel
					</AlertDialogCancel>
					<AlertDialogAction
						onClick={onConfirm}
						className="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-full font-display font-light"
					>
						Delete
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}