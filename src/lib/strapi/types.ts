// src/lib/strapi/types.ts

export interface StrapiImage {
	url: string;
	alternativeText?: string;
	caption?: string;
	width: number;
	height: number;
}

export interface StrapiSEO {
	metaTitle: string;
	metaDescription: string;
	keywords?: string;
	indexing: boolean;
	shared_image?: {
		file: StrapiImage;
	};
}

export interface BlogPost {
	id: number;
	slug: string;
	title: string;
	description: string;
	body: any; // BlocksContent from @strapi/blocks-react-renderer
	cover: StrapiImage;
	reading_time: number;
	createdAt: string;
	publishedAt: string;
	updatedAt: string;
	seo: StrapiSEO;
}

export interface BlogPostPreview {
	id: number;
	slug: string;
	title: string;
	description: string;
	cover: StrapiImage;
	reading_time: number;
	createdAt: string;
	publishedAt: string;
}