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

	// Fetch image data on server
	const image = await api.admin.gallery.getById({ id });

	if (!image) {
		notFound();
	}

	// Fetch categories for the edit form
	const categories = await api.admin.gallery.getCategories({ isActive: true });

	return (
		<ImageDetailClient
			image={image}
			categories={categories ?? []}
		/>
	);
}