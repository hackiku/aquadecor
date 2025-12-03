// src/lib/supabase/index.ts
// Central export point for all Supabase utilities

// Clients
export { supabase, supabaseClient } from './client';
export { supabaseAdmin, supabaseServer } from './server';

// Storage utilities
export {
	// Constants
	BUCKETS,
	// Client-side
	uploadFile,
	getPublicUrl,
	deleteFile,
	listFiles,
	// Server-side
	uploadFileAdmin,
	deleteFileAdmin,
	bulkDeleteFilesAdmin,
	moveFileAdmin,
	createSignedUrl,
	// Utilities
	generateUniqueFilename,
	generateGalleryPath,
	generateProductPath,
	extractPathFromUrl,
	getImageDimensions,
	// Types
	type BucketName,
	type UploadResult,
	type StorageMetadata,
} from './storage';