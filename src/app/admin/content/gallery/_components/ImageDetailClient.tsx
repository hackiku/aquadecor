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
		productId: string;
		storageUrl: string;
		storagePath?: string | null;
		altText?: string | null;
		width?: number | null;
		height?: number | null;
		fileSize?: number | null;
		mimeType?: string | null;
		sortOrder: number;
		createdAt: Date;
	};
	categories: Array<{
		id: string;
		name: string;
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

	// Form state
	const [altText, setAltText] = useState(initialImage.altText || "");
	const [sortOrder, setSortOrder] = useState(initialImage.sortOrder);
	const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
	const [categoryToAdd, setCategoryToAdd] = useState<string>("");

	// Mutations
	const updateMutation = api.admin.gallery.update.useMutation({
		onSuccess: () => {
			setIsEditing(false);
			toast.success("Image updated");
		},
		onError: (error) => {
			toast.error(`Update failed: ${error.message}`);
		},
	});

	const deleteMutation = api.admin.gallery.delete.useMutation({
		onSuccess: () => {
			toast.success("Image deleted");
			router.push("/admin/content/gallery");
		},
		onError: (error) => {
			toast.error(`Delete failed: ${error.message}`);
		},
	});

	const addToCategoryMutation = api.admin.gallery.addImageToCategory.useMutation({
		onSuccess: () => {
			toast.success("Added to category");
			setCategoryToAdd("");
		},
		onError: (error) => {
			toast.error(`Failed to add: ${error.message}`);
		},
	});

	const removeFromCategoryMutation = api.admin.gallery.removeImageFromCategory.useMutation({
		onSuccess: () => {
			toast.success("Removed from category");
		},
		onError: (error) => {
			toast.error(`Failed to remove: ${error.message}`);
		},
	});

	// Handlers
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

	const handleAddToCategory = () => {
		if (!categoryToAdd) return;
		addToCategoryMutation.mutate({
			imageId: initialImage.id,
			categoryId: categoryToAdd,
		});
	};

	const handleRemoveFromCategory = (categoryId: string) => {
		removeFromCategoryMutation.mutate({
			imageId: initialImage.id,
			categoryId,
		});
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

	const formatDate = (date: Date) => {
		return new Date(date).toLocaleDateString("en-US", {
			year: "numeric",
			month: "long",
			day: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		});
	};

	return (
		<div className="space-y-8">
			{/* Header */}
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
						<p className="text-muted-foreground font-display font-light text-lg">
							Uploaded {formatDate(initialImage.createdAt)}
						</p>
					</div>
				</div>
				<div className="flex gap-2">
					{isEditing ? (
						<>
							<Button
								variant="outline"
								onClick={() => setIsEditing(false)}
								disabled={updateMutation.isPending}
								className="rounded-full"
							>
								Cancel
							</Button>
							<Button
								onClick={handleSave}
								disabled={updateMutation.isPending}
								className="rounded-full"
							>
								<Save className="mr-2 h-4 w-4" />
								Save Changes
							</Button>
						</>
					) : (
						<>
							<Button
								variant="outline"
								onClick={() => setIsEditing(true)}
								className="rounded-full"
							>
								Edit Details
							</Button>
							<Button
								variant="destructive"
								onClick={() => setDeleteDialogOpen(true)}
								className="rounded-full"
							>
								<Trash2 className="mr-2 h-4 w-4" />
								Delete
							</Button>
						</>
					)}
				</div>
			</div>

			<div className="grid gap-8 lg:grid-cols-2">
				{/* Left: Image Preview */}
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

					{/* Image Actions */}
					<div className="flex gap-2">
						<Button
							variant="outline"
							onClick={() => window.open(initialImage.storageUrl, "_blank")}
							className="flex-1 rounded-full"
						>
							<ExternalLink className="mr-2 h-4 w-4" />
							Open Original
						</Button>
						<Button
							variant="outline"
							onClick={() => copyToClipboard(initialImage.storageUrl)}
							className="flex-1 rounded-full"
						>
							{copied ? (
								<>
									<Check className="mr-2 h-4 w-4 text-green-500" />
									Copied!
								</>
							) : (
								<>
									<Copy className="mr-2 h-4 w-4" />
									Copy URL
								</>
							)}
						</Button>
					</div>
				</div>

				{/* Right: Details & Categories */}
				<div className="space-y-6">
					{/* Basic Info */}
					<Card className="border-2">
						<CardHeader>
							<CardTitle className="font-display font-normal">Image Details</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<div>
								<Label htmlFor="altText" className="font-display font-light">
									Alt Text (SEO & Accessibility)
								</Label>
								<Input
									id="altText"
									value={altText}
									onChange={(e) => setAltText(e.target.value)}
									disabled={!isEditing}
									className="font-display font-light"
								/>
							</div>

							<div>
								<Label htmlFor="sortOrder" className="font-display font-light">
									Sort Order (0 = hero image)
								</Label>
								<Input
									id="sortOrder"
									type="number"
									value={sortOrder}
									onChange={(e) => setSortOrder(parseInt(e.target.value) || 0)}
									disabled={!isEditing}
									className="font-display font-light"
								/>
							</div>

							{/* Metadata (read-only) */}
							<div className="pt-4 space-y-3 border-t">
								<div className="flex justify-between text-sm">
									<span className="text-muted-foreground font-display font-light">
										Dimensions
									</span>
									<span className="font-display font-light">
										{initialImage.width && initialImage.height
											? `${initialImage.width}×${initialImage.height}px`
											: "—"
										}
									</span>
								</div>
								<div className="flex justify-between text-sm">
									<span className="text-muted-foreground font-display font-light">
										File Size
									</span>
									<span className="font-display font-light">
										{formatFileSize(initialImage.fileSize)}
									</span>
								</div>
								<div className="flex justify-between text-sm">
									<span className="text-muted-foreground font-display font-light">
										Format
									</span>
									<Badge variant="outline" className="font-display font-light">
										{initialImage.mimeType?.split("/")[1]?.toUpperCase() || "—"}
									</Badge>
								</div>
								<div className="flex justify-between text-sm">
									<span className="text-muted-foreground font-display font-light">
										Image ID
									</span>
									<span className="font-display font-light font-mono text-xs">
										{initialImage.id.slice(0, 8)}...
									</span>
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Categories */}
					<Card className="border-2">
						<CardHeader>
							<CardTitle className="font-display font-normal">Categories</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							{/* Current categories */}
							{selectedCategories.length > 0 && (
								<div className="flex flex-wrap gap-2">
									{selectedCategories.map((catId) => {
										const category = categories.find(c => c.id === catId);
										return category ? (
											<Badge key={catId} variant="secondary" className="font-display font-light">
												{category.name}
												<button
													onClick={() => handleRemoveFromCategory(catId)}
													className="ml-2 hover:text-destructive"
												>
													<X className="h-3 w-3" />
												</button>
											</Badge>
										) : null;
									})}
								</div>
							)}

							{/* Add to category */}
							<div className="flex gap-2">
								<Select value={categoryToAdd} onValueChange={setCategoryToAdd}>
									<SelectTrigger className="flex-1 font-display font-light">
										<SelectValue placeholder="Add to category..." />
									</SelectTrigger>
									<SelectContent>
										{categories
											.filter(c => !selectedCategories.includes(c.id))
											.map((cat) => (
												<SelectItem
													key={cat.id}
													value={cat.id}
													className="font-display font-light"
												>
													{cat.name}
												</SelectItem>
											))
										}
									</SelectContent>
								</Select>
								<Button
									onClick={handleAddToCategory}
									disabled={!categoryToAdd}
									className="rounded-full"
								>
									<Plus className="h-4 w-4" />
								</Button>
							</div>

							{selectedCategories.length === 0 && (
								<p className="text-sm text-muted-foreground font-display font-light">
									Not assigned to any categories
								</p>
							)}
						</CardContent>
					</Card>
				</div>
			</div>

			{/* Delete confirmation */}
			<AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle className="font-display font-normal">
							Delete this image?
						</AlertDialogTitle>
						<AlertDialogDescription className="font-display font-light">
							This will permanently delete this image. This action cannot be undone.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel className="rounded-full font-display font-light">
							Cancel
						</AlertDialogCancel>
						<AlertDialogAction
							onClick={handleDelete}
							className="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-full font-display font-light"
						>
							Delete
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
}