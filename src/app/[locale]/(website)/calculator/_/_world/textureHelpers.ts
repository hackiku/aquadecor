// src/app/(website)/calculator/_world/textureHelpers.ts

/**
 * Validates and sanitizes texture URLs for 3D scene
 * Prevents broken CDN URLs from crashing the WebGL context
 */
export function sanitizeTextureUrl(url: string | null | undefined): string | undefined {
	if (!url) return undefined;

	// Allow local paths (relative or absolute)
	if (url.startsWith('/')) return url;

	// Allow Supabase storage URLs
	if (url.includes('supabase.co/storage')) return url;

	// TEMPORARILY allow old CDN for testing (even though CORS is fucked)
	// We'll block these again after Supabase migration
	if (url.includes('cdn.aquadecorbackgrounds.com') || url.includes('aquadecor-blob')) {
		console.warn('⚠️ Using legacy CDN URL (may fail CORS):', url);
		return url;
	}

	// Block everything else (broken CDN, external URLs, etc.)
	console.warn('🚫 Blocked unsafe texture URL:', url);
	return undefined;
}

/**
 * Get the best available texture URL with fallback chain
 */
export function getBestTextureUrl(
	subcategoryTexture?: string | null,
	backgroundTexture?: string | null,
	fallback: string = "/3d/texture-placeholder.png"
): string {
	// Try subcategory (product-specific) first
	const safeSubcategory = sanitizeTextureUrl(subcategoryTexture);
	if (safeSubcategory) return safeSubcategory;

	// Try background (category-level)
	const safeBackground = sanitizeTextureUrl(backgroundTexture);
	if (safeBackground) return safeBackground;

	// Return fallback
	return fallback;
}