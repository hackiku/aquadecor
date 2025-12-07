// src/app/admin/content/gallery/page.tsx
"use client";

import { useState } from "react";
import { api } from "~/trpc/react";
import { ImageCard } from "~/components/media/ImageCard";
import { ImageUpload } from "~/components/media/ImageUpload";
import { GalleryStats } from "./_components/GalleryStats";
import { GalleryFilters } from "./_components/GalleryFilters";
import { GalleryDeleteFlow } from "./_components/GalleryDeleteFlow";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "~/components/ui/dialog";
import {
	Upload,
	Image as ImageIcon,
} from "lucide-react";
import { toast } from "sonner";

export default function GalleryPage() {
	// View state
	const [searchQuery, setSearchQuery] = useState("");
	const [sortBy, setSortBy] = useState<"createdAt" | "sortOrder" | "altText">("createdAt");
	const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
	const [gridSize, setGridSize] = useState<"sm" | "md" | "lg">("md");
	const [selectedCategoryId, setSelectedCategoryId] = useState<string | undefined>();
	const [selectedImages, setSelectedImages] = useState<string[]>([]);
	const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

	// Queries - UPDATED TO MEDIA ROUTER
	const { data, isLoading, refetch } = api.admin.media.getAll.useQuery({
		searchQuery: searchQuery || undefined,
		categoryId: selectedCategoryId,
		sortBy,
		sortOrder,
		limit: 100,
	});

	const { data: stats } = api.admin.media.getStats.useQuery();
	const { data: categories } = api.admin.media.getCategories.useQuery({
		isActive: true,
	});

	// Mutations - UPDATED TO MEDIA ROUTER
	const createMutation = api.admin.media.create.useMutation({
		onSuccess: () => {
			refetch();
			setUploadDialogOpen(false);
			toast.success("Image uploaded successfully");
		},
		onError: (error) => {
			toast.error(`Upload failed: ${error.message}`);
		},
	});

	const deleteMutation = api.admin.media.delete.useMutation({
		onSuccess: () => {
			refetch();
			toast.success("Image deleted");
		},
		onError: (error) => {
			toast.error(`Delete failed: ${error.message}`);
		},
	});

	const bulkDeleteMutation = api.admin.media.bulkDelete.useMutation({
		onSuccess: () => {
			refetch();
			setSelectedImages([]);
			setDeleteDialogOpen(false);
			toast.success("Images deleted");
		},
		onError: (error) => {
			toast.error(`Bulk delete failed: ${error.message}`);
		},
	});

	// Handlers
	const handleUpload = async (
		file: File,
		metadata: { altText: string; productId?: string; sortOrder: number }
	) => {
		// Mock upload - Replace with Vercel Blob later
		const placeholderUrl = `https://cdn.aquadecorbackgrounds.com/uploads/${file.name}`;

		await createMutation.mutateAsync({
			storageUrl: placeholderUrl,
			altText: metadata.altText,
			sortOrder: metadata.sortOrder,
			width: 1920,
			height: 1080,
			fileSize: file.size,
			mimeType: file.type,
			usageType: "gallery"
		});
	};

	const handleDelete = (id: string) => {
		deleteMutation.mutate({ id });
	};

	const handleBulkDelete = () => {
		if (selectedImages.length === 0) return;
		bulkDeleteMutation.mutate({ ids: selectedImages });
	};

	const toggleSelectImage = (id: string) => {
		setSelectedImages((prev) =>
			prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
		);
	};

	const selectAll = () => {
		if (!data?.images) return;
		if (selectedImages.length === data.images.length) {
			setSelectedImages([]);
		} else {
			setSelectedImages(data.images.map((img) => img.id));
		}
	};

	const gridSizeClasses = {
		sm: "grid-cols-2 md:grid-cols-4 lg:grid-cols-6",
		md: "grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
		lg: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
	};

	return (
		<div className="space-y-8">
			{/* Header */}
			<div className="flex items-start justify-between">
				<div className="space-y-2">
					<h1 className="text-4xl font-display font-extralight tracking-tight">
						Media Gallery
					</h1>
					<p className="text-muted-foreground font-display font-light text-lg">
						Manage images for products and categories
					</p>
				</div>
				<div className="flex gap-2">
					<Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
						<DialogTrigger asChild>
							<Button className="rounded-full">
								<Upload className="mr-2 h-4 w-4" />
								Upload Image
							</Button>
						</DialogTrigger>
						<DialogContent className="max-w-2xl">
							<DialogHeader>
								<DialogTitle className="font-display font-normal">
									Upload New Image
								</DialogTitle>
								<DialogDescription className="font-display font-light">
									Upload marketing images for products, blog, or social media
								</DialogDescription>
							</DialogHeader>
							<ImageUpload onUpload={handleUpload} />
						</DialogContent>
					</Dialog>
				</div>
			</div>

			{/* Stats */}
			{stats && (
				<GalleryStats
					total={stats.total}
					totalSizeMB={stats.totalSizeMB}
					byProduct={stats.byProduct as any}
				/>
			)}

			{/* Category filter breadcrumb */}
			{selectedCategoryId && (
				<div className="flex items-center gap-2">
					<Button
						variant="ghost"
						size="sm"
						onClick={() => setSelectedCategoryId(undefined)}
						className="font-display font-light"
					>
						All Images
					</Button>
					<span className="text-muted-foreground">/</span>
					<Badge variant="secondary" className="font-display font-light">
						{categories?.find(c => c.id === selectedCategoryId)?.name || "Category"}
					</Badge>
				</div>
			)}

			{/* Filters */}
			<GalleryFilters
				searchQuery={searchQuery}
				onSearchChange={setSearchQuery}
				sortBy={sortBy}
				onSortByChange={setSortBy}
				sortOrder={sortOrder}
				onSortOrderChange={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
				categories={categories || []}
				selectedCategoryId={selectedCategoryId}
				onCategoryChange={setSelectedCategoryId}
				gridSize={gridSize}
				onGridSizeChange={setGridSize}
				selectedCount={selectedImages.length}
				totalCount={data?.images.length ?? 0}
				onSelectAll={selectAll}
				onBulkDelete={() => setDeleteDialogOpen(true)}
			/>

			{/* Gallery Grid */}
			{isLoading ? (
				<div className="py-16 text-center">
					<p className="text-muted-foreground font-display font-light">
						Loading gallery...
					</p>
				</div>
			) : !data?.images || data.images.length === 0 ? (
				<div className="py-16 text-center space-y-4">
					<ImageIcon className="mx-auto h-16 w-16 text-muted-foreground" />
					<div className="space-y-2">
						<p className="text-lg text-muted-foreground font-display font-light">
							No images found
						</p>
						<Button onClick={() => setUploadDialogOpen(true)} className="rounded-full">
							<Upload className="mr-2 h-4 w-4" />
							Upload Image
						</Button>
					</div>
				</div>
			) : (
				<div className={`grid gap-4 ${gridSizeClasses[gridSize]}`}>
					{data.images.map((image) => (
						<ImageCard
							key={image.id}
							id={image.id}
							url={image.storageUrl}
							alt={image.altText}
							width={image.width}
							height={image.height}
							fileSize={image.fileSize}
							mimeType={image.mimeType}
							sortOrder={image.sortOrder}
							isSelected={selectedImages.includes(image.id)}
							onSelect={toggleSelectImage}
							onDelete={handleDelete}
						/>
					))}
				</div>
			)}

			{/* Bulk delete confirmation */}
			<GalleryDeleteFlow
				open={deleteDialogOpen}
				onOpenChange={setDeleteDialogOpen}
				onConfirm={handleBulkDelete}
				itemCount={selectedImages.length}
				type="bulk"
			/>
		</div>
	);
}