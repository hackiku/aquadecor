// src/app/admin/quotes/[id]/page.tsx

import { notFound, redirect } from "next/navigation";
import { db } from "~/server/db";
import { quotes } from "~/server/db/schema";
import { eq } from "drizzle-orm";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { ArrowLeft, Wand2, Package, MapPin, Mail, FileText } from "lucide-react";
import Link from "next/link";
import { ConvertToOrderButton } from "../_components/ConvertToOrderButton";

interface PageProps {
	params: Promise<{
		id: string;
	}>;
}

export default async function QuoteDetailPage({ params }: PageProps) {
	const { id } = await params;

	const quote = await db.query.quotes.findFirst({
		where: eq(quotes.id, id),
	});

	if (!quote) {
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

	const getStatusBadge = (status: typeof quote.status) => {
		const variants: Record<string, { variant: "secondary" | "default" | "destructive"; label: string }> = {
			pending: { variant: "secondary", label: "Pending Review" },
			quoted: { variant: "default", label: "Quote Sent" },
			accepted: { variant: "default", label: "Accepted → Order" },
			paid: { variant: "default", label: "Paid" },
			cancelled: { variant: "destructive", label: "Cancelled" },
			rejected: { variant: "destructive", label: "Rejected" },
		};
		return variants[status] || { variant: "secondary", label: status };
	};

	const statusInfo = getStatusBadge(quote.status);
	const dimensions = quote.dimensions as any;

	return (
		<div className="space-y-8">
			{/* Header */}
			<div className="flex items-start justify-between">
				<div className="space-y-4">
					<Button variant="ghost" asChild className="font-display font-light -ml-4">
						<Link href="/admin/quotes">
							<ArrowLeft className="mr-2 h-4 w-4" />
							Back to Quotes
						</Link>
					</Button>
					<div className="space-y-2">
						<div className="flex items-center gap-3">
							<h1 className="text-4xl font-display font-extralight tracking-tight">
								QUO-{quote.id.split("-")[0]}
							</h1>
							<Badge variant={statusInfo.variant} className="font-display font-light">
								{statusInfo.label}
							</Badge>
						</div>
						<p className="text-muted-foreground font-display font-light text-lg">
							{quote.email} • {formatDate(quote.createdAt)}
						</p>
					</div>
				</div>

				{/* THE MAGIC BUTTON */}
				{quote.status === "pending" && (
					<ConvertToOrderButton quoteId={quote.id} />
				)}
			</div>

			<div className="grid gap-8 lg:grid-cols-2">
				{/* Left Column */}
				<div className="space-y-6">
					{/* Price Summary */}
					<Card className="border-2">
						<CardHeader>
							<div className="flex items-center gap-2">
								<Package className="h-5 w-5 text-primary" />
								<CardTitle className="font-display font-normal">Price Estimate</CardTitle>
							</div>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="space-y-3 text-sm">
								<div className="flex justify-between">
									<span className="text-muted-foreground font-display font-light">Estimated Price</span>
									<span className="font-display font-normal">
										{formatPrice(quote.estimatedPriceEurCents, "EUR")}
									</span>
								</div>
								{quote.finalPriceEurCents && (
									<div className="flex justify-between border-t pt-3">
										<span className="font-display font-normal text-lg">Final Price</span>
										<span className="font-display font-normal text-lg text-green-600">
											{formatPrice(quote.finalPriceEurCents, "EUR")}
										</span>
									</div>
								)}
							</div>
						</CardContent>
					</Card>

					{/* Configuration Details */}
					<Card className="border-2">
						<CardHeader>
							<div className="flex items-center gap-2">
								<FileText className="h-5 w-5 text-primary" />
								<CardTitle className="font-display font-normal">Configuration</CardTitle>
							</div>
						</CardHeader>
						<CardContent className="space-y-3 text-sm">
							<div className="grid grid-cols-2 gap-4">
								<div>
									<p className="text-muted-foreground font-display font-light mb-1">Dimensions</p>
									<p className="font-display font-normal">
										{dimensions.width} × {dimensions.height} {dimensions.unit}
									</p>
									{dimensions.depth && (
										<p className="text-xs text-muted-foreground font-display font-light">
											Depth: {dimensions.depth} {dimensions.unit}
										</p>
									)}
								</div>

								<div>
									<p className="text-muted-foreground font-display font-light mb-1">Side Panels</p>
									<p className="font-display font-normal capitalize">
										{dimensions.sidePanels || "None"}
									</p>
									{dimensions.sidePanelWidth && (
										<p className="text-xs text-muted-foreground font-display font-light">
											Width: {dimensions.sidePanelWidth} {dimensions.unit}
										</p>
									)}
								</div>

								<div>
									<p className="text-muted-foreground font-display font-light mb-1">Filtration</p>
									<p className="font-display font-normal">
										{dimensions.filtrationCutout ? "Yes" : "No"}
									</p>
									{dimensions.filtrationType && (
										<p className="text-xs text-muted-foreground font-display font-light">
											{dimensions.filtrationType}
										</p>
									)}
								</div>

								<div>
									<p className="text-muted-foreground font-display font-light mb-1">Flexibility</p>
									<p className="font-display font-normal capitalize">
										{dimensions.flexibility || "Solid"}
									</p>
								</div>
							</div>

							{dimensions.additionalItems && dimensions.additionalItems.length > 0 && (
								<div className="pt-4 border-t">
									<p className="text-muted-foreground font-display font-light mb-2">
										Additional Items
									</p>
									<div className="space-y-1">
										{dimensions.additionalItems.map((item: any, idx: number) => (
											<p key={idx} className="text-sm font-display font-light">
												• {item.id} (Qty: {item.quantity})
											</p>
										))}
									</div>
								</div>
							)}

							{dimensions.notes && (
								<div className="pt-4 border-t">
									<p className="text-muted-foreground font-display font-light mb-2">
										Configuration Notes
									</p>
									<p className="text-sm font-display font-light">
										{dimensions.notes}
									</p>
								</div>
							)}
						</CardContent>
					</Card>

					{/* Customer Notes */}
					{quote.customerNotes && (
						<Card className="border-2">
							<CardHeader>
								<CardTitle className="font-display font-normal">Customer Notes</CardTitle>
							</CardHeader>
							<CardContent>
								<p className="font-display font-light text-sm">{quote.customerNotes}</p>
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
								<p className="font-display font-light">{quote.email}</p>
							</div>
							{(quote.firstName || quote.lastName) && (
								<div>
									<p className="text-sm text-muted-foreground font-display font-light mb-1">
										Name
									</p>
									<p className="font-display font-light">
										{quote.firstName} {quote.lastName}
									</p>
								</div>
							)}
							{quote.phone && (
								<div>
									<p className="text-sm text-muted-foreground font-display font-light mb-1">
										Phone
									</p>
									<p className="font-display font-light">{quote.phone}</p>
								</div>
							)}
							{quote.country && (
								<div>
									<p className="text-sm text-muted-foreground font-display font-light mb-1">
										Country
									</p>
									<p className="font-display font-light">{quote.country}</p>
								</div>
							)}
						</CardContent>
					</Card>

					{/* Timeline */}
					<Card className="border-2">
						<CardHeader>
							<CardTitle className="font-display font-normal">Timeline</CardTitle>
						</CardHeader>
						<CardContent className="space-y-3">
							<div className="space-y-2">
								<div className="flex justify-between text-sm">
									<span className="text-muted-foreground font-display font-light">Created</span>
									<span className="font-display font-light">
										{formatDate(quote.createdAt)}
									</span>
								</div>
								{quote.quotedAt && (
									<div className="flex justify-between text-sm">
										<span className="text-muted-foreground font-display font-light">Quoted</span>
										<span className="font-display font-light">
											{formatDate(quote.quotedAt)}
										</span>
									</div>
								)}
								{quote.acceptedAt && (
									<div className="flex justify-between text-sm">
										<span className="text-muted-foreground font-display font-light">Accepted</span>
										<span className="font-display font-light">
											{formatDate(quote.acceptedAt)}
										</span>
									</div>
								)}
								{quote.paidAt && (
									<div className="flex justify-between text-sm">
										<span className="text-muted-foreground font-display font-light">Paid</span>
										<span className="font-display font-light">
											{formatDate(quote.paidAt)}
										</span>
									</div>
								)}
							</div>
						</CardContent>
					</Card>

					{/* Admin Notes */}
					{quote.adminNotes && (
						<Card className="border-2">
							<CardHeader>
								<CardTitle className="font-display font-normal">Admin Notes</CardTitle>
							</CardHeader>
							<CardContent>
								<p className="font-display font-light text-sm">{quote.adminNotes}</p>
							</CardContent>
						</Card>
					)}

					{/* Metadata */}
					<Card className="border-2">
						<CardHeader>
							<CardTitle className="font-display font-normal">Quote Details</CardTitle>
						</CardHeader>
						<CardContent className="space-y-3 text-sm">
							<div className="flex justify-between">
								<span className="text-muted-foreground font-display font-light">Quote ID</span>
								<span className="font-display font-light font-mono text-xs">{quote.id}</span>
							</div>
							{quote.productId && (
								<div className="flex justify-between">
									<span className="text-muted-foreground font-display font-light">Product</span>
									<Link
										href={`/admin/catalog/products/${quote.productId}`}
										className="font-display font-light text-primary hover:underline"
									>
										View Product
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