// src/components/media/ImageUpload.tsx
"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Card, CardContent } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import {
	Upload,
	X,
	Image as ImageIcon,
	Loader2,
	AlertCircle,
} from "lucide-react";
import { cn } from "~/lib/utils";
import Image from "next/image";

interface ImageUploadProps {
	onUpload: (file: File, metadata: ImageMetadata) => Promise<void>;
	productId?: string;
	maxSizeMB?: number;
	allowedTypes?: string[];
	className?: string;
}

interface ImageMetadata {
	altText: string;
	productId?: string;
	sortOrder: number;
}

export function ImageUpload({
	onUpload,
	productId,
	maxSizeMB = 10,
	allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"],
	className,
}: ImageUploadProps) {
	const [file, setFile] = useState<File | null>(null);
	const [preview, setPreview] = useState<string | null>(null);
	const [altText, setAltText] = useState("");
	const [sortOrder, setSortOrder] = useState(0);
	const [isUploading, setIsUploading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const onDrop = useCallback((acceptedFiles: File[]) => {
		setError(null);
		const selectedFile = acceptedFiles[0];

		if (!selectedFile) return;

		// Validate file size
		const sizeMB = selectedFile.size / 1024 / 1024;
		if (sizeMB > maxSizeMB) {
			setError(`File size must be less than ${maxSizeMB}MB`);
			return;
		}

		// Validate file type
		if (!allowedTypes.includes(selectedFile.type)) {
			setError(`File type must be one of: ${allowedTypes.join(", ")}`);
			return;
		}

		setFile(selectedFile);

		// Create preview
		const reader = new FileReader();
		reader.onloadend = () => {
			setPreview(reader.result as string);
		};
		reader.readAsDataURL(selectedFile);

		// Auto-generate alt text from filename
		const filename = selectedFile.name.replace(/\.[^/.]+$/, "");
		const generatedAlt = filename
			.replace(/[-_]/g, " ")
			.replace(/\b\w/g, (l) => l.toUpperCase());
		setAltText(generatedAlt);
	}, [maxSizeMB, allowedTypes]);

	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		onDrop,
		accept: allowedTypes.reduce((acc, type) => ({ ...acc, [type]: [] }), {}),
		maxFiles: 1,
		multiple: false,
	});

	const handleUpload = async () => {
		if (!file) return;

		setIsUploading(true);
		setError(null);

		try {
			await onUpload(file, {
				altText,
				productId,
				sortOrder,
			});

			// Reset form
			setFile(null);
			setPreview(null);
			setAltText("");
			setSortOrder(0);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Upload failed");
		} finally {
			setIsUploading(false);
		}
	};

	const handleCancel = () => {
		setFile(null);
		setPreview(null);
		setAltText("");
		setSortOrder(0);
		setError(null);
	};

	return (
		<Card className={cn("border-2", className)}>
			<CardContent className="p-6">
				{!file ? (
					// Upload zone
					<div
						{...getRootProps()}
						className={cn(
							"border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
							isDragActive
								? "border-primary bg-primary/5"
								: "border-muted-foreground/25 hover:border-primary/50"
						)}
					>
						<input {...getInputProps()} />
						<Upload className={cn(
							"mx-auto h-12 w-12 mb-4 transition-colors",
							isDragActive ? "text-primary" : "text-muted-foreground"
						)} />
						<p className="text-lg font-display font-light mb-2">
							{isDragActive ? "Drop image here" : "Drag & drop an image"}
						</p>
						<p className="text-sm text-muted-foreground font-display font-light mb-4">
							or click to browse
						</p>
						<p className="text-xs text-muted-foreground font-display font-light">
							Max {maxSizeMB}MB • {allowedTypes.map(t => t.split("/")[1]?.toUpperCase()).join(", ")}
						</p>
					</div>
				) : (
					// Preview and metadata form
					<div className="space-y-4">
						{/* Preview */}
						<div className="relative aspect-video w-full overflow-hidden rounded-lg bg-muted">
							{preview && (
								<Image
									src={preview}
									alt="Upload preview"
									fill
									className="object-contain"
								/>
							)}
							<Button
								size="icon"
								variant="destructive"
								className="absolute top-2 right-2 h-8 w-8 rounded-full"
								onClick={handleCancel}
								disabled={isUploading}
							>
								<X className="h-4 w-4" />
							</Button>
						</div>

						{/* File info */}
						<div className="flex items-center gap-2 p-3 rounded-lg bg-muted">
							<ImageIcon className="h-5 w-5 text-muted-foreground" />
							<div className="flex-1 min-w-0">
								<p className="text-sm font-display font-normal truncate">
									{file.name}
								</p>
								<p className="text-xs text-muted-foreground font-display font-light">
									{(file.size / 1024 / 1024).toFixed(2)} MB
								</p>
							</div>
						</div>

						{/* Metadata form */}
						<div className="space-y-3">
							<div>
								<Label htmlFor="altText" className="font-display font-light">
									Alt Text (for SEO & accessibility)
								</Label>
								<Input
									id="altText"
									value={altText}
									onChange={(e) => setAltText(e.target.value)}
									placeholder="Describe the image..."
									className="font-display font-light"
									disabled={isUploading}
								/>
							</div>

							<div>
								<Label htmlFor="sortOrder" className="font-display font-light">
									Sort Order (0 = featured/hero image)
								</Label>
								<Input
									id="sortOrder"
									type="number"
									value={sortOrder}
									onChange={(e) => setSortOrder(parseInt(e.target.value) || 0)}
									className="font-display font-light"
									disabled={isUploading}
								/>
							</div>
						</div>

						{/* Error display */}
						{error && (
							<div className="flex items-start gap-2 p-3 rounded-lg bg-destructive/10 text-destructive">
								<AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
								<p className="text-sm font-display font-light">{error}</p>
							</div>
						)}

						{/* Actions */}
						<div className="flex gap-2">
							<Button
								onClick={handleUpload}
								disabled={isUploading || !altText.trim()}
								className="flex-1 rounded-full"
							>
								{isUploading ? (
									<>
										<Loader2 className="mr-2 h-4 w-4 animate-spin" />
										Uploading...
									</>
								) : (
									<>
										<Upload className="mr-2 h-4 w-4" />
										Upload Image
									</>
								)}
							</Button>
							<Button
								variant="outline"
								onClick={handleCancel}
								disabled={isUploading}
								className="rounded-full"
							>
								Cancel
							</Button>
						</div>
					</div>
				)}
			</CardContent>
		</Card>
	);
}