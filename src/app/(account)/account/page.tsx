// src/app/(account)/account/page.tsx
import { MobileAccountNav } from "../_components/MobileAccountNav";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Package, MapPin, CreditCard, Clock } from "lucide-react";
import Link from "next/link";
export default function AccountOverview() {
	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl md:text-3xl font-display font-light">Overview</h1>
					<p className="text-muted-foreground font-display font-light">
						Track your shipments and manage your details.
					</p>
				</div>
				<MobileAccountNav />
			</div>
			{/* Recent Order Card - "The Hero" of the dashboard */}
			<Card className="border-2 border-primary/20 bg-primary/5">
				<CardHeader className="flex flex-row items-center justify-between pb-2">
					<CardTitle className="text-lg font-display font-medium">
						Latest Order #ORD-2024-882
					</CardTitle>
					<div className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700 text-xs font-medium">
						In Production
					</div>
				</CardHeader>
				<CardContent>
					<div className="grid md:grid-cols-3 gap-6">
						<div className="space-y-1">
							<p className="text-sm text-muted-foreground font-display">Estimated Delivery</p>
							<p className="font-medium font-display">Jan 24 - Jan 28</p>
						</div>
						<div className="space-y-1">
							<p className="text-sm text-muted-foreground font-display">Items</p>
							<p className="font-medium font-display">F1 Background (Custom), Z1 Plant</p>
						</div>
						<div className="flex items-center md:justify-end">
							<Button asChild size="sm" className="rounded-full">
								<Link href="/account/orders/123">
									Track Order
								</Link>
							</Button>
						</div>
					</div>

					{/* Simple Progress Bar */}
					<div className="mt-6 relative">
						<div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-primary/20">
							<div style={{ width: "40%" }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary"></div>
						</div>
						<div className="flex justify-between text-xs text-muted-foreground font-display">
							<span className="text-primary font-medium">Confirmed</span>
							<span className="text-primary font-medium">Production</span>
							<span>Shipped</span>
							<span>Delivered</span>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Quick Stats Grid */}
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
						<CardTitle className="text-sm font-medium font-display">Total Orders</CardTitle>
						<Package className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold font-display">12</div>
						<p className="text-xs text-muted-foreground font-display mt-1">
							Lifetime value: €1,240
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
						<CardTitle className="text-sm font-medium font-display">Default Address</CardTitle>
						<MapPin className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-sm font-display truncate">
							Branka Nemet<br />
							Example Street 123...
						</div>
						<Link href="/account/addresses" className="text-xs text-primary hover:underline font-display mt-2 block">
							Manage addresses
						</Link>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
						<CardTitle className="text-sm font-medium font-display">Wishlist</CardTitle>
						<CreditCard className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold font-display">4 items</div>
						<Link href="/account/wishlist" className="text-xs text-primary hover:underline font-display mt-1 block">
							View saved items
						</Link>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
