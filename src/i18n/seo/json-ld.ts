// src/i18n/seo/json-ld.ts
import type { BlogPost } from "~/lib/strapi/types";

type ProductSchemaParams = {
	name: string;
	description: string;
	images: string[];
	sku: string;
	mpn?: string;
	brandName?: string;
	priceCents: number | null | undefined;
	currency: "EUR" | "USD";
	availability: "in_stock" | "out_of_stock" | "made_to_order" | "requires_quote" | "discontinued" | string;
	url: string;
};

export function generateProductSchema(product: ProductSchemaParams) {
	const availabilityMap: Record<string, string> = {
		in_stock: "https://schema.org/InStock",
		made_to_order: "https://schema.org/InStock",
		requires_quote: "https://schema.org/PreOrder",
		out_of_stock: "https://schema.org/OutOfStock",
		discontinued: "https://schema.org/Discontinued",
	};

	const schema: any = {
		"@context": "https://schema.org/",
		"@type": "Product",
		"name": product.name,
		"description": product.description,
		"image": product.images,
		"sku": product.sku,
		"mpn": product.mpn || product.sku,
		"brand": {
			"@type": "Brand",
			"name": product.brandName || "Aquadecor"
		}
	};

	if (product.priceCents && product.priceCents > 0) {
		schema.offers = {
			"@type": "Offer",
			"url": product.url,
			"priceCurrency": product.currency,
			"price": (product.priceCents / 100).toFixed(2),
			"availability": availabilityMap[product.availability] || "https://schema.org/InStock",
			"itemCondition": "https://schema.org/NewCondition"
		};
	}

	return schema;
}

export function generateBreadcrumbSchema(items: { name: string; url: string }[]) {
	return {
		"@context": "https://schema.org",
		"@type": "BreadcrumbList",
		"itemListElement": items.map((item, index) => ({
			"@type": "ListItem",
			"position": index + 1,
			"name": item.name,
			"item": item.url
		}))
	};
}

export function generateArticleSchema(post: BlogPost, locale: string) {
	const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://aquadecorbackgrounds.com";

	const schema: any = {
		"@context": "https://schema.org",
		"@type": "BlogPosting",
		"mainEntityOfPage": {
			"@type": "WebPage",
			"@id": `${baseUrl}/${locale}/blog/${post.slug}`
		},
		"headline": post.title,
		"description": post.description,
		"image": {
			"@type": "ImageObject",
			"url": post.cover.url,
			...(post.cover.alternativeText && { "caption": post.cover.alternativeText })
		},
		"author": {
			"@type": "Organization",
			"name": "Aquadecor Team",
			"url": baseUrl
		},
		"publisher": {
			"@type": "Organization",
			"name": "Aquadecor",
			"logo": {
				"@type": "ImageObject",
				"url": `${baseUrl}/logo.png`
			}
		},
		"datePublished": post.publishedAt,
		"dateModified": post.updatedAt
	};

	if (post.reading_time) {
		schema.timeRequired = `PT${post.reading_time}M`;
	}

	return schema;
}

export function generateWebApplicationSchema(params: {
	name: string;
	description: string;
	url: string;
	features?: string[];
}) {
	const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://aquadecorbackgrounds.com";

	return {
		"@context": "https://schema.org",
		"@type": "WebApplication",
		"name": params.name,
		"description": params.description,
		"url": params.url,
		"applicationCategory": "DesignApplication",
		"offers": {
			"@type": "Offer",
			"price": "0",
			"priceCurrency": "EUR",
			"description": "Free online tool"
		},
		...(params.features && {
			"featureList": params.features
		}),
		"publisher": {
			"@type": "Organization",
			"name": "Aquadecor",
			"logo": {
				"@type": "ImageObject",
				"url": `${baseUrl}/logo.png`
			}
		}
	};
}

/**
 * Generate FAQPage schema for rich snippets in Google Search
 * Shows expandable Q&A cards directly in search results
 * 
 * @param questions - Array of FAQ items with question and answer
 * @returns FAQPage schema for injection
 */
export function generateFAQSchema(questions: Array<{ question: string; answer: string }>) {
	// Filter out any empty questions/answers
	const validQuestions = questions.filter(q => q.question && q.answer);

	if (validQuestions.length === 0) {
		return null; // Don't generate schema if no valid FAQs
	}

	return {
		"@context": "https://schema.org",
		"@type": "FAQPage",
		"mainEntity": validQuestions.map(item => ({
			"@type": "Question",
			"name": item.question,
			"acceptedAnswer": {
				"@type": "Answer",
				"text": item.answer
			}
		}))
	};
}