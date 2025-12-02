// src/app/admin/content/gallery/_components/GalleryCategoryGrid.tsx
"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Layers, ArrowRight, Plus } from "lucide-react";

interface GalleryCategoryGridProps {
	categories: Array<{
		id: string;
		slug: string;
		name: string;
		description?: string | null;
		imageCount: number;
		isActive: boolean;
		usageContext?: string | null;
	}>;
	onSelectCategory: (categoryId: string) => void;
}

export function GalleryCategoryGrid({
	categories,
	onSelectCategory,
}: GalleryCategoryGridProps) {
	if (categories.length === 0) {
		return (
			<div className="py-16 text-center space-y-4">
				<Layers className="mx-auto h-16 w-16 text-muted-foreground" />
				<div className="space-y-2">
					<p className="text-lg text-muted-foreground font-display font-light">
						No categories yet
					</p>
					<p className="text-sm text-muted-foreground font-display font-light">
						Create categories to organize your gallery images
					</p>
				</div>
				<Button className="rounded-full">
					<Plus className="mr-2 h-4 w-4" />
					Create Category
				</Button>
			</div>
		);
	}

	return (
		<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
			{categories.map((category) => (
				<Card
					key={category.id}
					className="border-2 hover:border-primary/50 hover:shadow-lg transition-all group cursor-pointer"
					onClick={() => onSelectCategory(category.id)}
				>
					<CardHeader className="space-y-3">
						<div className="flex items-start justify-between">
							<div className="space-y-1 flex-1">
								<h3 className="font-display font-normal leading-tight group-hover:text-primary transition-colors">
									{category.name}
								</h3>
								{category.description && (
									<p className="text-xs text-muted-foreground font-display font-light line-clamp-2">
										{category.description}
									</p>
								)}
							</div>
							<ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
						</div>
					</CardHeader>
					<CardContent className="space-y-3">
						<div className="flex items-center justify-between text-sm">
							<span className="text-muted-foreground font-display font-light">
								Images
							</span>
							<span className="font-display font-normal text-lg">
								{category.imageCount}
							</span>
						</div>
						<div className="flex items-center gap-2 flex-wrap">
							<Badge
								variant={category.isActive ? "default" : "secondary"}
								className="font-display font-light"
							>
								{category.isActive ? "Active" : "Inactive"}
							</Badge>
							{category.usageContext && (
								<Badge variant="outline" className="font-display font-light">
									{category.usageContext}
								</Badge>
							)}
						</div>
					</CardContent>
				</Card>
			))}
		</div>
	);
}