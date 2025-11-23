// src/lib/strapi/queries.ts

import { fetchStrapi, flattenStrapiResponse, getStrapiMedia } from "./client";
import type { BlogPost, BlogPostPreview } from "./types";

/**
 * Get all blog posts (list view)
 */
export async function getBlogPosts(): Promise<BlogPostPreview[]> {
	const response = await fetchStrapi("/blogs", {
		sort: ["createdAt:desc"],
		fields: ["title", "slug", "description", "createdAt", "publishedAt", "reading_time"],
		populate: {
			cover: {
				fields: ["url", "alternativeText", "width", "height"],
			},
		},
		pagination: {
			start: 0,
			limit: 60,
		},
	});

	const flattened = flattenStrapiResponse<any[]>(response.data);

	// Transform to our type
	return flattened.map((post) => ({
		id: post.id,
		slug: post.slug,
		title: post.title,
		description: post.description,
		cover: {
			url: getStrapiMedia(post.cover?.url),
			alternativeText: post.cover?.alternativeText || post.title,
			width: post.cover?.width || 1200,
			height: post.cover?.height || 800,
		},
		reading_time: post.reading_time || 5,
		createdAt: post.createdAt,
		publishedAt: post.publishedAt || post.createdAt,
	}));
}

/**
 * Get recent blog posts (for FeaturedArticles component)
 */
export async function getRecentBlogPosts(limit: number = 3): Promise<BlogPostPreview[]> {
	const response = await fetchStrapi("/blogs", {
		sort: ["createdAt:desc"],
		fields: ["title", "slug", "description", "createdAt", "publishedAt", "reading_time"],
		populate: {
			cover: {
				fields: ["url", "alternativeText", "width", "height"],
			},
		},
		pagination: {
			start: 0,
			limit,
		},
	});

	const flattened = flattenStrapiResponse<any[]>(response.data);

	// Transform to our type
	return flattened.map((post) => ({
		id: post.id,
		slug: post.slug,
		title: post.title,
		description: post.description,
		cover: {
			url: getStrapiMedia(post.cover?.url),
			alternativeText: post.cover?.alternativeText || post.title,
			width: post.cover?.width || 1200,
			height: post.cover?.height || 800,
		},
		reading_time: post.reading_time || 5,
		createdAt: post.createdAt,
		publishedAt: post.publishedAt || post.createdAt,
	}));
}

/**
 * Get single blog post by slug
 */
export async function getBlogPost(slug: string): Promise<BlogPost | null> {
	const response = await fetchStrapi("/blogs", {
		filters: {
			slug: {
				$eq: slug,
			},
		},
		populate: {
			cover: {
				fields: ["url", "alternativeText", "caption", "width", "height"],
			},
			seo: {
				populate: {
					shared_image: {
						populate: {
							file: {
								fields: ["url", "alternativeText", "width", "height"],
							},
						},
					},
				},
			},
		},
	});

	if (!response.data || response.data.length === 0) {
		return null;
	}

	const post = flattenStrapiResponse<any>(response.data[0]);

	// Transform to our type
	return {
		id: post.id,
		slug: post.slug,
		title: post.title,
		description: post.description,
		body: post.body, // Blocks content - will be rendered by BlocksRenderer
		cover: {
			url: getStrapiMedia(post.cover?.url),
			alternativeText: post.cover?.alternativeText || post.title,
			caption: post.cover?.caption,
			width: post.cover?.width || 1200,
			height: post.cover?.height || 800,
		},
		reading_time: post.reading_time || 5,
		createdAt: post.createdAt,
		publishedAt: post.publishedAt || post.createdAt,
		updatedAt: post.updatedAt || post.publishedAt || post.createdAt,
		seo: {
			metaTitle: post.seo?.metaTitle || post.title,
			metaDescription: post.seo?.metaDescription || post.description,
			keywords: post.seo?.keywords,
			indexing: post.seo?.indexing ?? true,
			shared_image: post.seo?.shared_image?.file
				? {
					file: {
						url: getStrapiMedia(post.seo.shared_image.file.url),
						alternativeText: post.seo.shared_image.file.alternativeText || post.title,
						width: post.seo.shared_image.file.width || 1200,
						height: post.seo.shared_image.file.height || 630,
					},
				}
				: undefined,
		},
	};
}