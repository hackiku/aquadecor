// src/app/admin/catalog/products/[id]/page.tsx

import { notFound } from "next/navigation";
import { api } from "~/trpc/server";
import { ProductDetailClient } from "./_components/ProductDetailClient";

interface PageProps {
	params: Promise<{
		id: string;
	}>;
	searchParams: Promise<{
		market?: string;
	}>;
}

export default async function ProductDetailPage({ params, searchParams }: PageProps) {
	const { id } = await params;
	const { market } = await searchParams;
	const selectedMarket = (market as 'US' | 'ROW') || 'ROW';

	const product = await api.admin.product.getById({ id });

	if (!product) {
		notFound();
	}

	return <ProductDetailClient product={product} initialMarket={selectedMarket} />;
}