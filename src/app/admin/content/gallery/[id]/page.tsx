// src/app/admin/content/gallery/[id]/page.tsx


import { notFound } from "next/navigation";
import { api } from "~/trpc/server";
import { ImageDetailClient } from "../_components/ImageDetailClient";

interface PageProps {
	params: Promise<{
		id: string;
	}>;
}

export default async function ImageDetailPage({ params }: PageProps) {
	const { id } = await params;

	// Use new media router
	const image = await api.admin.media.getById({ id });

	if (!image) {
		notFound();
	}

	// Fetch categories
	const categories = await api.admin.media.getCategories({ isActive: true });

	return (
		<ImageDetailClient
			image={image}
			categories={categories ?? []}
		/>
	);
}