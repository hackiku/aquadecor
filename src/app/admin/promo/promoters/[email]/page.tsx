// src/app/admin/promo/promoters/[email]/page.tsx

import { Suspense } from "react";
import Link from "next/link";
import { ArrowLeft, Mail, Phone, TrendingUp, DollarSign } from "lucide-react";
import { api } from "~/trpc/server";
import { TRPCError } from "@trpc/server";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";

interface PromoterDetailPageProps {
	params: {
		email: string;
	};
}


const formatPrice = (cents: number) => {
	return `€${(cents / 100).toFixed(2)}`;
};

async function PromoterDetailContent({ email: encodedEmail }: { email: string }) {
	
	const email = decodeURIComponent(encodedEmail);
	
	let promoter;

	try {
		// Fetch promoter details using the new getByEmail procedure
		promoter = await api.admin.promoter.getByEmail.useQuery({ email });

	} catch (e) {
		if (e instanceof TRPCError && e.code === "NOT_FOUND") {
			return (
				<div className="space-y-8">
					<h1 className="text-4xl font-display font-extralight tracking-tight">
						Promoter Not Found
					</h1>
					<p className="text-muted-foreground font-display font-light text-lg">
						The promoter with email "{email}" could not be found.
					</p>
					<Link
						href="/admin/promo/promoters"
						className="text-primary hover:underline flex items-center gap-1"
					>
						<ArrowLeft className="h-4 w-4" />
						Go back to Promoters List
					</Link>
				</div>
			);
		}
		throw e;
	}

	if (!promoter) return null; // Should be caught by TRPCError, but for type safety

	return (
		<div className="space-y-8">
			{/* Header */}
			<div className="space-y-2">
				<Link
					href="/admin/promo/promoters"
					className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 mb-4 w-fit"
				>
					<ArrowLeft className="h-4 w-4" />
					Back to Promoters
				</Link>
				<div className="flex items-center justify-between">
					<h1 className="text-4xl font-display font-extralight tracking-tight">
						{promoter.firstName} {promoter.lastName}
					</h1>
					<Button variant="outline" className="font-display font-light">
						{promoter.isActive ? "Deactivate" : "Activate"}
					</Button>
				</div>
				<p className="text-muted-foreground font-display font-light text-lg flex items-center gap-2">
					<Mail className="h-4 w-4" />
					{promoter.email}
				</p>
			</div>

			<Separator />

			{/* Stats Overview */}
			<div className="grid gap-6 md:grid-cols-3">
				<Card className="border-2">
					<CardHeader className="p-4">
						<CardTitle className="font-display font-normal text-sm text-muted-foreground">
							Total Orders
						</CardTitle>
					</CardHeader>
					<CardContent className="p-4 pt-0">
						<p className="text-3xl font-display font-light">{promoter.totalOrders}</p>
					</CardContent>
				</Card>
				<Card className="border-2">
					<CardHeader className="p-4">
						<CardTitle className="font-display font-normal text-sm text-muted-foreground">
							Total Revenue
						</CardTitle>
					</CardHeader>
					<CardContent className="p-4 pt-0">
						<p className="text-3xl font-display font-light">
							{formatPrice(promoter.totalRevenue)}
						</p>
					</CardContent>
				</Card>
				<Card className="border-2">
					<CardHeader className="p-4">
						<CardTitle className="font-display font-normal text-sm text-muted-foreground">
							Total Commission
						</CardTitle>
					</CardHeader>
					<CardContent className="p-4 pt-0">
						<p className="text-3xl font-display font-light text-green-600">
							{formatPrice(promoter.totalCommission)}
						</p>
					</CardContent>
				</Card>
			</div>

			{/* Codes and Recent Orders */}
			<div className="grid gap-6 lg:grid-cols-2">
				{/* Promoter Codes */}
				<Card className="border-2">
					<CardHeader>
						<CardTitle className="font-display font-normal flex justify-between items-center">
							Discount Codes
							<Button size="sm" variant="secondary" className="font-display font-light">Add Code</Button>
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							{promoter.codes.length > 0 ? (
								promoter.codes.map((code) => (
									<div key={code.id} className="p-3 border rounded-lg bg-muted/50">
										<div className="flex justify-between items-center">
											<Badge className="font-display font-normal text-base">{code.code}</Badge>
											<span className="text-sm font-display font-light text-muted-foreground">Used: {code.usageCount}</span>
										</div>
										<div className="mt-2 text-sm space-y-1">
											<p className="font-display font-light">
												Customer Discount: <span className="font-normal text-primary">{code.discountPercent}%</span>
											</p>
											<p className="font-display font-light">
												Promoter Commission: <span className="font-normal text-green-600">{code.commissionPercent}%</span>
											</p>
										</div>
										<div className="flex justify-end mt-2">
											<Button variant="ghost" size="sm" className="font-display font-light">Edit</Button>
										</div>
									</div>
								))
							) : (
								<p className="text-muted-foreground text-center py-6 font-display font-light">
									No active codes for this promoter.
								</p>
							)}
						</div>
					</CardContent>
				</Card>

				{/* Recent Orders */}
				<Card className="border-2">
					<CardHeader>
						<CardTitle className="font-display font-normal">Recent Orders (Last 10)</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-3">
							{promoter.orders.length > 0 ? (
								promoter.orders.map((order) => (
									<div key={order.id} className="flex justify-between items-center text-sm border-b pb-2 last:border-b-0 last:pb-0">
										<Link href={`/admin/orders/${order.id}`} className="hover:underline font-display font-light text-primary">
											Order #{order.orderNumber}
										</Link>
										<div className="text-right font-display font-normal">
											<p>{formatPrice(order.total)}</p>
											<p className="text-xs text-muted-foreground">
												Status: {order.status}
											</p>
										</div>
									</div>
								))
							) : (
								<p className="text-muted-foreground text-center py-6 font-display font-light">
									No recent orders attributed to this promoter.
								</p>
							)}
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}

export default function PromoterDetailPage({ params }: PromoterDetailPageProps) {
	// The email comes from the URL parameter. It will be URL-decoded automatically.
	const promoterEmail = params.email;

	return (
		<Suspense
			fallback={
				<div className="space-y-8">
					<h1 className="text-4xl font-display font-extralight">Promoter Detail</h1>
					<Card className="border-2 border-dashed">
						<CardContent className="pt-6 text-center py-12">
							<p className="text-muted-foreground font-display font-light">
								Loading details for {promoterEmail}...
							</p>
						</CardContent>
					</Card>
				</div>
			}
		>
			<PromoterDetailContent email={promoterEmail} />
		</Suspense>
	);
}