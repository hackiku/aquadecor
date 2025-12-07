// src/app/admin/content/gallery/_components/ImageDetailClient.tsx
// src/app/admin/content/gallery/_components/ImageDetailClient.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { api } from "~/trpc/react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Badge } from "~/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "~/components/ui/select";
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
import {
	ArrowLeft,
	Save,
	Trash2,
	ExternalLink,
	Copy,
	Check,
	Plus,
	X,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

interface ImageDetailClientProps {
	image: {
		id: string;
		productId: string | null;
		storageUrl: string;
		altText?: string | null;
		width?: number | null;
		height?: number | null;
		fileSize?: number | null;
		mimeType?: string | null;
		sortOrder: number;
		createdAt: Date;
		// Add relations if needed
		categoryId?: string | null;
	};
	categories: Array<{
		id: string;
		name: string | null;
		slug: string;
	}>;
}

export function ImageDetailClient({
	image: initialImage,
	categories
}: ImageDetailClientProps) {
	const router = useRouter();
	const [isEditing, setIsEditing] = useState(false);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [copied, setCopied] = useState(false);

	const [altText, setAltText] = useState(initialImage.altText || "");
	const [sortOrder, setSortOrder] = useState(initialImage.sortOrder);
	// We handle single category assignment now as per schema
	const [assignedCategory, setAssignedCategory] = useState<string | null>(initialImage.categoryId || null);

	// Mutations - UPDATED TO MEDIA ROUTER
	const updateMutation = api.admin.media.update.useMutation({
		onSuccess: () => {
			setIsEditing(false);
			toast.success("Image updated");
		},
		onError: (error) => {
			toast.error(`Update failed: ${error.message}`);
		},
	});

	const deleteMutation = api.admin.media.delete.useMutation({
		onSuccess: () => {
			toast.success("Image deleted");
			router.push("/admin/content/gallery");
		},
		onError: (error) => {
			toast.error(`Delete failed: ${error.message}`);
		},
	});

	const addToCategoryMutation = api.admin.media.addImageToCategory.useMutation({
		onSuccess: () => {
			toast.success("Category updated");
		},
		onError: (error) => {
			toast.error(`Failed to update: ${error.message}`);
		},
	});

	const removeFromCategoryMutation = api.admin.media.removeImageFromCategory.useMutation({
		onSuccess: () => {
			toast.success("Category removed");
			setAssignedCategory(null);
		},
		onError: (error) => {
			toast.error(`Failed to remove: ${error.message}`);
		},
	});

	const handleSave = () => {
		updateMutation.mutate({
			id: initialImage.id,
			altText,
			sortOrder,
		});
	};

	const handleDelete = () => {
		deleteMutation.mutate({ id: initialImage.id });
	};

	const handleAssignCategory = (catId: string) => {
		setAssignedCategory(catId);
		addToCategoryMutation.mutate({
			imageId: initialImage.id,
			categoryId: catId,
		});
	};

	const handleRemoveCategory = () => {
		if (assignedCategory) {
			removeFromCategoryMutation.mutate({
				imageId: initialImage.id,
				categoryId: assignedCategory,
			});
		}
	};

	const copyToClipboard = async (text: string) => {
		await navigator.clipboard.writeText(text);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	const formatFileSize = (bytes: number | null | undefined) => {
		if (!bytes) return "—";
		const kb = bytes / 1024;
		if (kb < 1024) return `${kb.toFixed(1)} KB`;
		return `${(kb / 1024).toFixed(1)} MB`;
	};

	return (
		<div className="space-y-8">
			{/* Header - same as before ... */}
			<div className="flex items-start justify-between">
				<div className="space-y-4">
					<Button variant="ghost" asChild className="font-display font-light -ml-4">
						<Link href="/admin/content/gallery">
							<ArrowLeft className="mr-2 h-4 w-4" />
							Back to Gallery
						</Link>
					</Button>
					<div className="space-y-2">
						<h1 className="text-4xl font-display font-extralight tracking-tight">
							{initialImage.altText || "Untitled Image"}
						</h1>
					</div>
				</div>
				<div className="flex gap-2">
					{isEditing ? (
						<>
							<Button variant="outline" onClick={() => setIsEditing(false)} className="rounded-full">Cancel</Button>
							<Button onClick={handleSave} className="rounded-full"><Save className="mr-2 h-4 w-4" /> Save</Button>
						</>
					) : (
						<>
							<Button variant="outline" onClick={() => setIsEditing(true)} className="rounded-full">Edit Details</Button>
							<Button variant="destructive" onClick={() => setDeleteDialogOpen(true)} className="rounded-full"><Trash2 className="mr-2 h-4 w-4" /> Delete</Button>
						</>
					)}
				</div>
			</div>

			<div className="grid gap-8 lg:grid-cols-2">
				{/* Image Preview */}
				<div className="space-y-6">
					<Card className="border-2">
						<CardContent className="p-0">
							<div className="relative aspect-video w-full overflow-hidden rounded-lg bg-muted">
								<Image
									src={initialImage.storageUrl}
									alt={initialImage.altText || "Gallery image"}
									fill
									className="object-contain"
								/>
							</div>
						</CardContent>
					</Card>
					<div className="flex gap-2">
						<Button variant="outline" onClick={() => window.open(initialImage.storageUrl, "_blank")} className="flex-1 rounded-full">
							<ExternalLink className="mr-2 h-4 w-4" /> Open Original
						</Button>
						<Button variant="outline" onClick={() => copyToClipboard(initialImage.storageUrl)} className="flex-1 rounded-full">
							{copied ? <Check className="mr-2 h-4 w-4 text-green-500" /> : <Copy className="mr-2 h-4 w-4" />} Copy URL
						</Button>
					</div>
				</div>

				{/* Details */}
				<div className="space-y-6">
					<Card className="border-2">
						<CardHeader><CardTitle className="font-display font-normal">Image Details</CardTitle></CardHeader>
						<CardContent className="space-y-4">
							<div>
								<Label htmlFor="altText">Alt Text</Label>
								<Input id="altText" value={altText} onChange={(e) => setAltText(e.target.value)} disabled={!isEditing} />
							</div>
							<div>
								<Label htmlFor="sortOrder">Sort Order</Label>
								<Input id="sortOrder" type="number" value={sortOrder} onChange={(e) => setSortOrder(parseInt(e.target.value) || 0)} disabled={!isEditing} />
							</div>
							<div className="pt-4 space-y-3 border-t">
								<div className="flex justify-between text-sm">
									<span className="text-muted-foreground">Dimensions</span>
									<span>{initialImage.width ? `${initialImage.width}×${initialImage.height}px` : "—"}</span>
								</div>
								<div className="flex justify-between text-sm">
									<span className="text-muted-foreground">File Size</span>
									<span>{formatFileSize(initialImage.fileSize)}</span>
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Category Assignment */}
					<Card className="border-2">
						<CardHeader><CardTitle className="font-display font-normal">Category</CardTitle></CardHeader>
						<CardContent className="space-y-4">
							{assignedCategory ? (
								<div className="flex items-center justify-between p-3 border rounded-lg">
									<span>{categories.find(c => c.id === assignedCategory)?.name || "Unknown Category"}</span>
									<Button variant="ghost" size="sm" onClick={handleRemoveCategory}><X className="h-4 w-4" /></Button>
								</div>
							) : (
								<Select onValueChange={handleAssignCategory}>
									<SelectTrigger><SelectValue placeholder="Assign to category..." /></SelectTrigger>
									<SelectContent>
										{categories.map((cat) => (
											<SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
										))}
									</SelectContent>
								</Select>
							)}
						</CardContent>
					</Card>
				</div>
			</div>

			<AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Delete this image?</AlertDialogTitle>
						<AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel className="rounded-full">Cancel</AlertDialogCancel>
						<AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90 rounded-full">Delete</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
}