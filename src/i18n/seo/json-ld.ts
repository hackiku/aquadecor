// src/i18n/seo/json-ld.ts

type ProductSchemaParams = {
	name: string;
	description: string;
	images: string[];
	sku: string;
	mpn?: string;
	brandName?: string;
	// ✅ CHANGED: Allow null or undefined for price
	priceCents: number | null | undefined;
	currency: "EUR" | "USD";
	availability: "in_stock" | "out_of_stock" | "made_to_order" | "requires_quote" | "discontinued" | string;
	url: string;
};

export function generateProductSchema(product: ProductSchemaParams) {
	const availabilityMap: Record<string, string> = {
		in_stock: "https://schema.org/InStock",
		made_to_order: "https://schema.org/InStock",
		requires_quote: "https://schema.org/PreOrder", // or omit offer entirely
		out_of_stock: "https://schema.org/OutOfStock",
		discontinued: "https://schema.org/Discontinued",
	};

	// Base Schema
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

	// ✅ LOGIC: Only add "Offer" if we have a real price (> 0)
	// If it's a calculator product (price = 0 or null), we simply don't tell Google a price.
	// This prevents "€0.00" in search results.
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