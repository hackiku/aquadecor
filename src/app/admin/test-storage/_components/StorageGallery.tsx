// @ts-nocheck
// src/app/admin/test-storage/_components/StorageGallery.tsx
"use client";

import { useEffect, useState } from "react";
import { supabase } from "~/lib/supabase";
import { Loader2, Image as ImageIcon } from "lucide-react";
import Image from "next/image";

interface StorageFile {
	name: string;
	id: string;
	updated_at: string;
	created_at: string;
	last_accessed_at: string;
	metadata: {
		size: number;
		mimetype: string;
	};
}

interface StorageGalleryProps {
	bucket?: string;
}

export function StorageGallery({ bucket = "aquadecor-gallery" }: StorageGalleryProps) {
	const [files, setFiles] = useState<StorageFile[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		loadFiles();
	}, []);

	const loadFiles = async () => {
		try {
			setLoading(true);
			setError(null);

			// List files in bucket root (or 'gallery' folder if it exists)
			const { data, error: listError } = await supabase.storage
				.from(bucket)
				.list('', { // Empty string = list root
					limit: 100,
					sortBy: { column: 'created_at', order: 'desc' }
				});

			if (listError) throw listError;

			setFiles(data || []);
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Failed to load files');
		} finally {
			setLoading(false);
		}
	};

	const getPublicUrl = (filename: string) => {
		const { data } = supabase.storage
			.from(bucket)
			.getPublicUrl(filename); // Use filename directly (works for root or folders)
		return data.publicUrl;
	};

	if (loading) {
		return (
			<div className="flex items-center justify-center py-12">
				<Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
			</div>
		);
	}

	if (error) {
		return (
			<div className="text-center py-12">
				<p className="text-sm text-destructive font-display font-light">
					Error: {error}
				</p>
			</div>
		);
	}

	if (files.length === 0) {
		return (
			<div className="text-center py-12">
				<ImageIcon className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
				<p className="text-sm text-muted-foreground font-display font-light">
					No files uploaded yet
				</p>
			</div>
		);
	}

	return (
		<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
			{files.map((file) => (
				<div
					key={file.id}
					className="relative aspect-square rounded-lg overflow-hidden bg-muted border-2 hover:border-primary transition-colors"
				>
					<Image
						src={getPublicUrl(file.name)}
						alt={file.name}
						fill
						className="object-cover"
					/>
					<div className="absolute bottom-0 left-0 right-0 bg-black/60 backdrop-blur-sm p-2">
						<p className="text-xs text-white font-display font-light truncate">
							{file.name}
						</p>
						<p className="text-xs text-white/60 font-display font-light">
							{(file.metadata.size / 1024 / 1024).toFixed(2)} MB
						</p>
					</div>
				</div>
			))}
		</div>
	);
}