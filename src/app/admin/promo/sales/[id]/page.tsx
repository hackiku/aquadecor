// src/app/admin/promo/sales/[id]/page.tsx
"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { SaleForm } from "../_components/SaleForm";
import { api } from "~/trpc/react";
import { Card, CardContent } from "~/components/ui/card";

interface EditSalePageProps {
	params: Promise<{ id: string }>;
}

export default function EditSalePage({ params }: EditSalePageProps) {
	const { id } = use(params);
	const router = useRouter();

	const { data: sale, isLoading, error } = api.admin.sale.getById.useQuery({ id });

	if (isLoading) {
		return (
			<div className="space-y-8">
				<div className="space-y-2">
					<h1 className="text-4xl font-display font-extralight tracking-tight">
						Edit Sale
					</h1>
					<p className="text-muted-foreground font-display font-light text-lg">
						Loading...
					</p>
				</div>
			</div>
		);
	}

	if (error || !sale) {
		return (
			<div className="space-y-8">
				<div className="space-y-2">
					<h1 className="text-4xl font-display font-extralight tracking-tight">
						Sale Not Found
					</h1>
				</div>
				<Card className="border-2 border-destructive/20">
					<CardContent className="pt-6">
						<p className="text-destructive font-display font-light">
							The sale you're looking for doesn't exist or has been deleted.
						</p>
					</CardContent>
				</Card>
			</div>
		);
	}

	return (
		<div className="space-y-8">
			<div className="space-y-2">
				<h1 className="text-4xl font-display font-extralight tracking-tight">
					Edit Sale
				</h1>
				<p className="text-muted-foreground font-display font-light text-lg">
					{sale.name}
				</p>
			</div>

			<SaleForm sale={sale} />
		</div>
	);
}