// src/app/admin/catalog/categories/[id]/page.tsx

import { notFound } from "next/navigation";
import { api } from "~/trpc/server";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { CategoryDetailClient } from "./_components/CategoryDetailClient";

interface PageProps {
	params: Promise<{
		id: string;
	}>;
}

export default async function CategoryDetailPage({ params }: PageProps) {
	const { id } = await params;
	const category = await api.admin.category.getById({ id });

	if (!category) {
		notFound();
	}

	const productLineNames: Record<string, string> = {
		"3d-backgrounds": "3D Backgrounds",
		"aquarium-decorations": "Aquarium Decorations",
	};

	return (
		<div className="space-y-8">
			{/* Header */}
			<div className="flex items-start justify-between">
				<div className="space-y-4">
					<Button variant="ghost" asChild className="font-display font-light -ml-4">
						<Link href="/admin/catalog/categories">
							<ArrowLeft className="mr-2 h-4 w-4" />
							Back to Categories
						</Link>
					</Button>
					<div className="space-y-2">
						<div className="flex items-center gap-3">
							<h1 className="text-4xl font-display font-extralight tracking-tight">
								{category.name || "Untitled Category"}
							</h1>
							<Badge
								variant={category.isActive ? "default" : "secondary"}
								className="font-display font-light"
							>
								{category.isActive ? "Active" : "Inactive"}
							</Badge>
						</div>
						<p className="text-muted-foreground font-display font-light text-lg">
							{productLineNames[category.productLine]} • {category.productCount} products
						</p>
					</div>
				</div>
			</div>

			{/* Client Component for Inline Editing */}
			<CategoryDetailClient category={category} />
		</div>
	);
}