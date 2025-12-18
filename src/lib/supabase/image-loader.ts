// src/lib/supabase/image-loader.ts

export default function supabaseLoader({ src, width, quality }: { src: string; width: number; quality?: number }) {
	// If it's a local image or external URL not in Supabase, return as is
	if (!src.startsWith('http') || !src.includes('supabase.co')) {
		return src;
	}

	// Supabase Transformation URL pattern
	// transforms: /object/public/bucket/folder/img.jpg?width=500&quality=75
	const url = new URL(src);
	url.searchParams.set('width', width.toString());
	url.searchParams.set('quality', (quality || 75).toString());
	url.searchParams.set('resize', 'contain'); // or 'cover' depending on your needs

	return url.toString();
}