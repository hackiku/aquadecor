// src/app/admin/content/gallery/_components/GalleryStats.tsx
"use client";

import { StatCard } from "~/app/admin/_components/primitives/StatCard";
import { Image, Database, TrendingUp } from "lucide-react";

interface GalleryStatsProps {
	total: number;
	totalSizeMB: string;
	byProduct: Array<{
		productId: string;
		count: number;
	}>;
}

export function GalleryStats({ total, totalSizeMB, byProduct }: GalleryStatsProps) {
	const avgSizeMB = total > 0
		? (parseFloat(totalSizeMB) / total).toFixed(2)
		: "0";

	return (
		<div className="grid gap-6 md:grid-cols-3">
			<StatCard
				title="Total Images"
				value={total}
				icon={Image}
				description="Across all categories and products"
			/>
			<StatCard
				title="Storage Used"
				value={`${totalSizeMB} MB`}
				icon={Database}
				description={`~${avgSizeMB} MB per image`}
			/>
			<StatCard
				title="Most Images"
				value={byProduct[0]?.count ?? 0}
				icon={TrendingUp}
				description={byProduct[0] ? `Product ${byProduct[0].productId}` : "No products yet"}
			/>
		</div>
	);
}