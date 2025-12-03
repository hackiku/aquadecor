// @ts-nocheck
// src/lib/supabase/storage.ts
// Shared storage utilities for Supabase Storage
// Works with both client and server

import { supabase } from './client';
import { supabaseAdmin } from './server';

export const BUCKETS = {
	GALLERY: 'aquadecor-gallery',
	PRODUCTS: 'aquadecor-products', // If you create separate buckets later
	TEMP: 'aquadecor-temp', // For temporary uploads
} as const;

// ============================================================================
// CLIENT-SIDE HELPERS (for use in browser)
// ============================================================================

/**
 * Upload file to Supabase Storage (client-side)
 */
export async function uploadFile(
	bucket: string,
	path: string,
	file: File | Blob,
	options?: {
		cacheControl?: string;
		contentType?: string;
		upsert?: boolean;
	}
) {
	const { data, error } = await supabase.storage
		.from(bucket)
		.upload(path, file, {
			cacheControl: options?.cacheControl ?? '3600',
			contentType: options?.contentType,
			upsert: options?.upsert ?? false,
		});

	if (error) throw error;
	return data;
}

/**
 * Get public URL for a file
 */
export function getPublicUrl(bucket: string, path: string): string {
	const { data } = supabase.storage.from(bucket).getPublicUrl(path);
	return data.publicUrl;
}

/**
 * Delete file from storage (client-side)
 */
export async function deleteFile(bucket: string, path: string) {
	const { error } = await supabase.storage.from(bucket).remove([path]);
	if (error) throw error;
}

/**
 * List files in a bucket/folder
 */
export async function listFiles(
	bucket: string,
	path?: string,
	options?: {
		limit?: number;
		offset?: number;
		sortBy?: { column: string; order: 'asc' | 'desc' };
	}
) {
	const { data, error } = await supabase.storage.from(bucket).list(path, options);
	if (error) throw error;
	return data;
}

// ============================================================================
// SERVER-SIDE HELPERS (for use in API routes, Server Actions, cron jobs)
// ============================================================================

/**
 * Upload file to Supabase Storage (server-side, bypasses RLS)
 */
export async function uploadFileAdmin(
	bucket: string,
	path: string,
	file: Buffer | Uint8Array | Blob,
	options?: {
		cacheControl?: string;
		contentType?: string;
		upsert?: boolean;
	}
) {
	const { data, error } = await supabaseAdmin.storage
		.from(bucket)
		.upload(path, file, {
			cacheControl: options?.cacheControl ?? '3600',
			contentType: options?.contentType,
			upsert: options?.upsert ?? false,
		});

	if (error) throw error;
	return data;
}

/**
 * Delete file from storage (server-side, bypasses RLS)
 */
export async function deleteFileAdmin(bucket: string, path: string) {
	const { error } = await supabaseAdmin.storage.from(bucket).remove([path]);
	if (error) throw error;
}

/**
 * Bulk delete files (server-side)
 */
export async function bulkDeleteFilesAdmin(bucket: string, paths: string[]) {
	const { error } = await supabaseAdmin.storage.from(bucket).remove(paths);
	if (error) throw error;
}

/**
 * Move/rename file (server-side)
 */
export async function moveFileAdmin(bucket: string, fromPath: string, toPath: string) {
	const { error } = await supabaseAdmin.storage.from(bucket).move(fromPath, toPath);
	if (error) throw error;
}

/**
 * Generate a signed URL with expiration (server-side)
 * Useful for private files that need temporary access
 */
export async function createSignedUrl(
	bucket: string,
	path: string,
	expiresIn = 3600 // seconds
) {
	const { data, error } = await supabaseAdmin.storage
		.from(bucket)
		.createSignedUrl(path, expiresIn);

	if (error) throw error;
	return data.signedUrl;
}

// ============================================================================
// UTILITY HELPERS
// ============================================================================

/**
 * Generate unique filename with timestamp
 */
export function generateUniqueFilename(originalName: string): string {
	const timestamp = Date.now();
	const cleanName = originalName.replace(/[^a-zA-Z0-9.-]/g, '_');
	return `${timestamp}-${cleanName}`;
}

/**
 * Generate storage path for gallery images
 */
export function generateGalleryPath(filename: string): string {
	return `gallery/${generateUniqueFilename(filename)}`;
}

/**
 * Generate storage path for product images
 */
export function generateProductPath(productId: string, filename: string): string {
	return `products/${productId}/${generateUniqueFilename(filename)}`;
}

/**
 * Extract storage path from public URL
 */
export function extractPathFromUrl(publicUrl: string, bucket: string): string {
	const urlPattern = new RegExp(`/object/public/${bucket}/(.+)$`);
	const match = publicUrl.match(urlPattern);
	return match?.[1] ?? '';
}

/**
 * Get image dimensions from File object
 */
export function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
	return new Promise((resolve, reject) => {
		const img = new Image();
		img.onload = () => {
			resolve({ width: img.width, height: img.height });
			URL.revokeObjectURL(img.src);
		};
		img.onerror = reject;
		img.src = URL.createObjectURL(file);
	});
}

// ============================================================================
// TYPES
// ============================================================================

export type BucketName = (typeof BUCKETS)[keyof typeof BUCKETS];

export interface UploadResult {
	path: string;
	publicUrl: string;
	dimensions?: { width: number; height: number };
}

export interface StorageMetadata {
	cacheControl?: string;
	contentType?: string;
	upsert?: boolean;
}