// @ts-nocheck
// src/app/admin/orders/[id]/page.tsx

import { notFound } from "next/navigation";
import { db } from "~/server/db";
import { orders } from "~/server/db/schema/orders";
import { eq } from "drizzle-orm";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { ArrowLeft, Pencil, Package, Truck, Mail, MapPin } from "lucide-react";
import Link from "next/link";

interface PageProps {
	params: Promise<{
		id: string;
	}>;
}

export default async function OrderDetailPage({ params }: PageProps) {
	const { id } = await params;

	// Query the DB directly including the items
	const order = await db.query.orders.findFirst({
		where: eq(orders.id, id),
		with: {
			items: true,
		},
	});

	if (!order) {
		notFound();
	}

	const formatPrice = (cents: number, currency: string = "EUR") => {
		const symbol = currency === "EUR" ? "€" : "$";
		return `${symbol}${(cents / 100).toFixed(2)}`;
	};

	const formatDate = (date: Date) => {
		return new Intl.DateTimeFormat("en-GB", {
			day: "2-digit",
			month: "long",
			year: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		}).format(date);
	};

	const getStatusBadge = (status: typeof order.status) => {
		const variants: Record<string, { variant: "secondary" | "default" | "destructive"; label: string }> = {
			pending: { variant: "secondary", label: "Pending" },
			confirmed: { variant: "default", label: "Confirmed" },
			in_production: { variant: "default", label: "In Production" },
			ready_to_ship: { variant: "default", label: "Ready to Ship" },
			shipped: { variant: "default", label: "Shipped" },
			delivered: { variant: "default", label: "Delivered" },
			cancelled: { variant: "destructive", label: "Cancelled" },
			refunded: { variant: "destructive", label: "Refunded" },
			abandoned: { variant: "destructive", label: "Abandoned" },
		};
		return variants[status] || { variant: "secondary", label: status };
	};

	const getPaymentBadge = (status: typeof order.paymentStatus) => {
		const variants: Record<string, { variant: "secondary" | "default" | "destructive"; label: string }> = {
			pending: { variant: "secondary", label: "Pending" },
			paid: { variant: "default", label: "Paid" },
			failed: { variant: "destructive", label: "Failed" },
			refunded: { variant: "destructive", label: "Refunded" },
		};
		return variants[status] || { variant: "secondary", label: status };
	};

	const statusInfo = getStatusBadge(order.status);
	const paymentInfo = getPaymentBadge(order.paymentStatus);

	return (
		<div className="space-y-8">
			{/* Header */}
			<div className="flex items-start justify-between">
				<div className="space-y-4">
					<Button variant="ghost" asChild className="font-display font-light -ml-4">
						<Link href="/admin/orders">
							<ArrowLeft className="mr-2 h-4 w-4" />
							Back to Orders
						</Link>
					</Button>
					<div className="space-y-2">
						<div className="flex items-center gap-3">
							<h1 className="text-4xl font-display font-extralight tracking-tight">
								{order.orderNumber}
							</h1>
							<Badge variant={statusInfo.variant} className="font-display font-light">
								{statusInfo.label}
							</Badge>
							<Badge variant={paymentInfo.variant} className="font-display font-light">
								{paymentInfo.label}
							</Badge>
						</div>
						<p className="text-muted-foreground font-display font-light text-lg">
							{order.email} • {formatDate(order.createdAt)}
						</p>
					</div>
				</div>
				<Button className="rounded-full">
					<Pencil className="mr-2 h-4 w-4" />
					Update Order
				</Button>
			</div>

			<div className="grid gap-8 lg:grid-cols-2">
				{/* Left Column */}
				<div className="space-y-6">
					{/* Order Summary */}
					<Card className="border-2">
						<CardHeader>
							<div className="flex items-center gap-2">
								<Package className="h-5 w-5 text-primary" />
								<CardTitle className="font-display font-normal">Order Summary</CardTitle>
							</div>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="space-y-3 text-sm">
								<div className="flex justify-between">
									<span className="text-muted-foreground font-display font-light">Subtotal</span>
									<span className="font-display font-normal">
										{formatPrice(order.subtotal, order.currency)}
									</span>
								</div>
								{order.discount > 0 && (
									<div className="flex justify-between">
										<span className="text-muted-foreground font-display font-light">Discount</span>
										<span className="font-display font-normal text-green-600">
											-{formatPrice(order.discount, order.currency)}
										</span>
									</div>
								)}
								<div className="flex justify-between">
									<span className="text-muted-foreground font-display font-light">Shipping</span>
									<span className="font-display font-normal">
										{order.shipping === 0 ? "Free" : formatPrice(order.shipping, order.currency)}
									</span>
								</div>
								<div className="border-t pt-3 flex justify-between">
									<span className="font-display font-normal text-lg">Total</span>
									<span className="font-display font-normal text-lg">
										{formatPrice(order.total, order.currency)}
									</span>
								</div>
							</div>

							{order.discountCode && (
								<div className="pt-4 border-t">
									<p className="text-sm text-muted-foreground font-display font-light mb-2">
										Discount Code Applied
									</p>
									<Badge className="font-display font-light">
										{order.discountCode}
									</Badge>
								</div>
							)}
						</CardContent>
					</Card>

					{/* Order Items */}
					<Card className="border-2">
						<CardHeader>
							<CardTitle className="font-display font-normal">Order Items</CardTitle>
						</CardHeader>
						<CardContent>
							{order.items.length > 0 ? (
								<div className="space-y-4">
									{order.items.map((item) => (
										<div key={item.id} className="flex items-start gap-4 pb-4 border-b last:border-0">
											<div className="w-16 h-16 rounded-lg bg-muted" />
											<div className="flex-1 space-y-1">
												<p className="font-display font-normal">{item.productName}</p>
												{item.sku && (
													<p className="text-xs text-muted-foreground font-display font-light">
														SKU: {item.sku}
													</p>
												)}
												<p className="text-sm text-muted-foreground font-display font-light">
													Qty: {item.quantity} × {formatPrice(item.pricePerUnit, order.currency)}
												</p>
											</div>
											<div className="font-display font-normal">
												{formatPrice(item.total, order.currency)}
											</div>
										</div>
									))}
								</div>
							) : (
								<p className="text-muted-foreground font-display font-light text-center py-8">
									No items in this order
								</p>
							)}
						</CardContent>
					</Card>

					{/* Shipping Address */}
					{order.shippingAddress && (
						<Card className="border-2">
							<CardHeader>
								<div className="flex items-center gap-2">
									<MapPin className="h-5 w-5 text-primary" />
									<CardTitle className="font-display font-normal">Shipping Address</CardTitle>
								</div>
							</CardHeader>
							<CardContent className="font-display font-light space-y-1">
								<p className="font-normal">
									{order.shippingAddress.firstName} {order.shippingAddress.lastName}
								</p>
								{order.shippingAddress.company && (
									<p className="text-muted-foreground">{order.shippingAddress.company}</p>
								)}
								<p>{order.shippingAddress.address1}</p>
								{order.shippingAddress.address2 && <p>{order.shippingAddress.address2}</p>}
								<p>
									{order.shippingAddress.city}, {order.shippingAddress.state}{" "}
									{order.shippingAddress.postalCode}
								</p>
								<p>{order.shippingAddress.country}</p>
								{order.shippingAddress.phone && (
									<p className="text-muted-foreground pt-2">{order.shippingAddress.phone}</p>
								)}
							</CardContent>
						</Card>
					)}
				</div>

				{/* Right Column */}
				<div className="space-y-6">
					{/* Customer Info */}
					<Card className="border-2">
						<CardHeader>
							<div className="flex items-center gap-2">
								<Mail className="h-5 w-5 text-primary" />
								<CardTitle className="font-display font-normal">Customer Information</CardTitle>
							</div>
						</CardHeader>
						<CardContent className="space-y-3">
							<div>
								<p className="text-sm text-muted-foreground font-display font-light mb-1">
									Email
								</p>
								<p className="font-display font-light">{order.email}</p>
							</div>
							{(order.firstName || order.lastName) && (
								<div>
									<p className="text-sm text-muted-foreground font-display font-light mb-1">
										Name
									</p>
									<p className="font-display font-light">
										{order.firstName} {order.lastName}
									</p>
								</div>
							)}
						</CardContent>
					</Card>

					{/* Fulfillment */}
					<Card className="border-2">
						<CardHeader>
							<div className="flex items-center gap-2">
								<Truck className="h-5 w-5 text-primary" />
								<CardTitle className="font-display font-normal">Fulfillment</CardTitle>
							</div>
						</CardHeader>
						<CardContent className="space-y-4">
							<div>
								<p className="text-sm text-muted-foreground font-display font-light mb-2">
									Order Status
								</p>
								<Badge variant={statusInfo.variant} className="font-display font-light">
									{statusInfo.label}
								</Badge>
							</div>

							{order.trackingNumber && (
								<div>
									<p className="text-sm text-muted-foreground font-display font-light mb-2">
										Tracking Number
									</p>
									<p className="font-display font-light font-mono text-sm">
										{order.trackingNumber}
									</p>
								</div>
							)}

							<div className="pt-4 border-t space-y-2">
								{order.confirmedAt && (
									<div className="flex justify-between text-sm">
										<span className="text-muted-foreground font-display font-light">Confirmed</span>
										<span className="font-display font-light">
											{formatDate(order.confirmedAt)}
										</span>
									</div>
								)}
								{order.shippedAt && (
									<div className="flex justify-between text-sm">
										<span className="text-muted-foreground font-display font-light">Shipped</span>
										<span className="font-display font-light">
											{formatDate(order.shippedAt)}
										</span>
									</div>
								)}
								{order.deliveredAt && (
									<div className="flex justify-between text-sm">
										<span className="text-muted-foreground font-display font-light">Delivered</span>
										<span className="font-display font-light">
											{formatDate(order.deliveredAt)}
										</span>
									</div>
								)}
							</div>
						</CardContent>
					</Card>

					{/* Notes */}
					{(order.notes || order.internalNotes) && (
						<Card className="border-2">
							<CardHeader>
								<CardTitle className="font-display font-normal">Notes</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								{order.notes && (
									<div>
										<p className="text-sm text-muted-foreground font-display font-light mb-2">
											Customer Notes
										</p>
										<p className="font-display font-light text-sm">{order.notes}</p>
									</div>
								)}
								{order.internalNotes && (
									<div>
										<p className="text-sm text-muted-foreground font-display font-light mb-2">
											Internal Notes
										</p>
										<p className="font-display font-light text-sm">{order.internalNotes}</p>
									</div>
								)}
							</CardContent>
						</Card>
					)}

					{/* Metadata */}
					<Card className="border-2">
						<CardHeader>
							<CardTitle className="font-display font-normal">Order Details</CardTitle>
						</CardHeader>
						<CardContent className="space-y-3 text-sm">
							<div className="flex justify-between">
								<span className="text-muted-foreground font-display font-light">Order ID</span>
								<span className="font-display font-light font-mono text-xs">{order.id}</span>
							</div>
							<div className="flex justify-between">
								<span className="text-muted-foreground font-display font-light">Created</span>
								<span className="font-display font-light">
									{formatDate(order.createdAt)}
								</span>
							</div>
							{order.updatedAt && (
								<div className="flex justify-between">
									<span className="text-muted-foreground font-display font-light">Updated</span>
									<span className="font-display font-light">
										{formatDate(order.updatedAt)}
									</span>
								</div>
							)}
							{order.promoterId && (
								<div className="flex justify-between">
									<span className="text-muted-foreground font-display font-light">Promoter</span>
									<Link
										href={`/admin/promoters/${order.promoterId}`}
										className="font-display font-light text-primary hover:underline"
									>
										View Promoter
									</Link>
								</div>
							)}
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}