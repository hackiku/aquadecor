// src/app/admin/test-storage/_components/StorageGallery.tsx
"use client";

import { useEffect, useState } from "react";
import { supabase } from "~/lib/supabase/client";
import { Loader2, Image as ImageIcon, Folder, FolderOpen } from "lucide-react";
import Image from "next/image";
import { cn } from "~/lib/utils";

interface StorageFile {
	name: string;
	id: string;
	metadata?: {
		size?: number;
		mimetype?: string;
	} | null;
}

interface StorageGalleryProps {
	bucket?: string;
}

export function StorageGallery({ bucket = "aquadecor-gallery" }: StorageGalleryProps) {
	const [currentPath, setCurrentPath] = useState<string>("");
	const [folders, setFolders] = useState<string[]>([]);
	const [files, setFiles] = useState<StorageFile[]>([]);
	const [allFiles, setAllFiles] = useState<StorageFile[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		loadFolders();
		loadAllFiles();
	}, [bucket]);

	useEffect(() => {
		loadFiles(currentPath);
	}, [currentPath, bucket]);

	// Load all unique folders
	const loadFolders = async () => {
		try {
			const { data, error } = await supabase.storage
				.from(bucket)
				.list('', { limit: 1000 });

			if (error) throw error;

			// Get unique folder names (items without file extensions are folders)
			const folderNames = (data || [])
				.filter(item => !item.name.includes('.'))
				.map(item => item.name);

			setFolders(folderNames);
		} catch (err) {
			console.error('Failed to load folders:', err);
		}
	};

	// Load ALL files recursively (for ~/* view)
	const loadAllFiles = async () => {
		try {
			const allFilesArray: StorageFile[] = [];

			// Get root files
			const { data: rootFiles } = await supabase.storage
				.from(bucket)
				.list('', { limit: 100 });

			if (rootFiles) {
				allFilesArray.push(...rootFiles.filter(f => f.id && f.name.includes('.')));
			}

			// Get files from each folder
			const { data: foldersList } = await supabase.storage
				.from(bucket)
				.list('', { limit: 1000 });

			const folderNames = (foldersList || [])
				.filter(item => !item.name.includes('.'))
				.map(item => item.name);

			for (const folder of folderNames) {
				const { data: folderFiles } = await supabase.storage
					.from(bucket)
					.list(folder, { limit: 100 });

				if (folderFiles) {
					const filesWithPath = folderFiles
						.filter(f => f.id && f.name.includes('.'))
						.map(f => ({ ...f, name: `${folder}/${f.name}` }));
					allFilesArray.push(...filesWithPath);
				}
			}

			setAllFiles(allFilesArray);
		} catch (err) {
			console.error('Failed to load all files:', err);
		}
	};

	// Load files in specific path
	const loadFiles = async (path: string) => {
		try {
			setLoading(true);
			setError(null);

			const { data, error: listError } = await supabase.storage
				.from(bucket)
				.list(path, { limit: 100 });

			if (listError) throw listError;

			// Filter out folders, keep only files
			const filesOnly = (data || []).filter(item => item.id && item.name.includes('.'));
			setFiles(filesOnly);
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Failed to load files');
		} finally {
			setLoading(false);
		}
	};

	const getPublicUrl = (filename: string) => {
		const { data } = supabase.storage
			.from(bucket)
			.getPublicUrl(filename);
		return data.publicUrl;
	};

	const formatFileSize = (file: StorageFile): string => {
		const size = file.metadata?.size;
		if (!size) return '';
		return (size / 1024 / 1024).toFixed(2) + ' MB';
	};

	const displayFiles = currentPath === '~/*' ? allFiles : files;

	return (
		<div className="flex gap-4">
			{/* Sidebar */}
			<div className="w-48 flex-shrink-0 space-y-1">
				{/* All files */}
				<button
					onClick={() => setCurrentPath('~/*')}
					className={cn(
						"w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-display font-light transition-colors",
						currentPath === '~/*'
							? "bg-primary text-primary-foreground"
							: "hover:bg-muted"
					)}
				>
					<FolderOpen className="h-4 w-4" />
					~/*
				</button>

				{/* Root */}
				<button
					onClick={() => setCurrentPath('')}
					className={cn(
						"w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-display font-light transition-colors",
						currentPath === ''
							? "bg-primary text-primary-foreground"
							: "hover:bg-muted"
					)}
				>
					<Folder className="h-4 w-4" />
					~/
				</button>

				{/* Folders */}
				{folders.map((folder) => (
					<button
						key={folder}
						onClick={() => setCurrentPath(folder)}
						className={cn(
							"w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-display font-light transition-colors",
							currentPath === folder
								? "bg-primary text-primary-foreground"
								: "hover:bg-muted"
						)}
					>
						<Folder className="h-4 w-4" />
						~/{folder}
					</button>
				))}
			</div>

			{/* Gallery */}
			<div className="flex-1">
				{loading ? (
					<div className="flex items-center justify-center py-12">
						<Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
					</div>
				) : error ? (
					<div className="text-center py-12">
						<p className="text-sm text-destructive font-display font-light">
							Error: {error}
						</p>
					</div>
				) : displayFiles.length === 0 ? (
					<div className="text-center py-12">
						<ImageIcon className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
						<p className="text-sm text-muted-foreground font-display font-light">
							No files in {currentPath === '~/*' ? 'bucket' : currentPath || 'root'}
						</p>
					</div>
				) : (
					<div className="space-y-2">
						<p className="text-xs text-muted-foreground font-display font-light">
							{displayFiles.length} file{displayFiles.length !== 1 ? 's' : ''} in{' '}
							{currentPath === '~/*' ? 'entire bucket' : currentPath || 'root'}
						</p>
						<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
							{displayFiles.map((file) => (
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
											{file.name.split('/').pop()}
										</p>
										{file.metadata?.size && (
											<p className="text-xs text-white/60 font-display font-light">
												{formatFileSize(file)}
											</p>
										)}
									</div>
								</div>
							))}
						</div>
					</div>
				)}
			</div>
		</div>
	);
}