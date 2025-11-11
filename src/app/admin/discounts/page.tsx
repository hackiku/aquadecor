// src/app/admin/discounts/page.tsx

import { AdminCard } from "../_components/primitives/AdminCard";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Plus } from "lucide-react";

export default async function DiscountsPage() {
	// TODO: Fetch from tRPC
	const sales = [
		{
			id: "1",
			name: "Weekend akcija",
			date: "9.10. avgust",
			discount: "20%",
			code: "Weekend20",
			active: false,
		},
	];

	const coupons = [
		{
			id: "1",
			code: "JOEY15",
			type: "Normal discount",
			discount: "15%",
			expiry: "Friday, December 31st, 9999",
			active: true,
		},
		// ... more coupons
	];

	return (
		<div className="space-y-8">
			<h1 className="text-3xl font-bold">Discounts</h1>

			<div className="grid gap-8 md:grid-cols-2">
				{/* Sales */}
				<div className="space-y-4">
					<div className="flex items-center justify-between">
						<h2 className="text-2xl font-semibold">Aquadecor Sales</h2>
						<Button size="sm">
							<Plus className="mr-2 h-4 w-4" />
							Add new sale
						</Button>
					</div>
					<p className="text-sm text-muted-foreground">
						Below are listed all sales both active and inactive...
					</p>

					<div className="space-y-4">
						{sales.map((sale) => (
							<AdminCard key={sale.id}>
								<div className="flex items-start justify-between">
									<div>
										<div className="flex items-center gap-2">
											<h3 className="font-semibold">{sale.name}</h3>
											<Badge variant={sale.active ? "default" : "secondary"}>
												{sale.active ? "Active" : "Inactive"}
											</Badge>
										</div>
										<p className="text-sm text-muted-foreground mt-2">
											{sale.date}
										</p>
										<p className="mt-2">Discount amount: {sale.discount}</p>
										<p>Discount code: {sale.code}</p>
									</div>
									<Button variant="ghost" size="icon">
										•••
									</Button>
								</div>
							</AdminCard>
						))}
					</div>
				</div>

				{/* Coupons */}
				<div className="space-y-4">
					<div className="flex items-center justify-between">
						<h2 className="text-2xl font-semibold">Aquadecor coupons</h2>
						<Button size="sm" disabled>
							Select catalog region before adding new coupon
						</Button>
					</div>
					<p className="text-sm text-muted-foreground">
						Below are listed all coupons both active and inactive...
					</p>

					<div className="space-y-4">
						{coupons.map((coupon) => (
							<AdminCard key={coupon.id}>
								<div className="flex items-start justify-between">
									<div>
										<div className="flex items-center gap-2">
											<h3 className="font-semibold">{coupon.code}</h3>
											<Badge variant={coupon.active ? "default" : "secondary"}>
												{coupon.active ? "Active" : "Inactive"}
											</Badge>
										</div>
										<p className="text-sm text-muted-foreground mt-2">
											{coupon.type}
										</p>
										<p className="mt-2">Discount amount: {coupon.discount}</p>
										<p>Expiration date: {coupon.expiry}</p>
									</div>
									<Button variant="ghost" size="icon">
										•••
									</Button>
								</div>
							</AdminCard>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}