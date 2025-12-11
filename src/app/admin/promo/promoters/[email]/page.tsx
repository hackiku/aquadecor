// src/app/admin/promo/promoters/[email]/page.tsx

import { Suspense } from "react";
import { api } from "~/trpc/server";
import { notFound } from "next/navigation";
import { PromoterDetailClient } from "../_components/PromoterDetailClient";

interface PromoterDetailPageProps {
	params: {
		email: string;
	};
}

export default async function PromoterDetailPage({ params }: PromoterDetailPageProps) {
	const email = decodeURIComponent(params.email);

	// CORRECT WAY IN SERVER COMPONENT
	const promoter = await api.admin.promoter.getByEmail({ email });

	if (!promoter) {
		notFound();
	}

	return (
		<Suspense fallback={<div className="py-12 text-center">Loading promoter details...</div>}>
			<PromoterDetailClient promoter={promoter} />
		</Suspense>
	);
}