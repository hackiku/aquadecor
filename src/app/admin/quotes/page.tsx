// src/app/admin/quotes/[id]/page.tsx
import { notFound } from "next/navigation";
import { db } from "~/server/db";
import { quotes } from "~/server/db/schema";
import { eq } from "drizzle-orm";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { ArrowLeft, Mail, MapPin, Ruler, Layers, Settings2, Receipt, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Separator } from "~/components/ui/separator";

interface PageProps {
	params: Promise<{ id: string }>;
}

export default async function QuoteDetailPage({ params }: PageProps) {
	const { id } = await params;

	// Use simple findFirst since we don't have complex relations yet
	const quote = await db.query.quotes.findFirst({
		where: eq(quotes.id, id),
		with: {
			product: true // To get the model name if linked
		}
	});

	if (!quote) notFound();

	// Type casting for the JSONB column
	const config = quote.dimensions as any;

	const formatPrice = (cents: number) => `€${(cents / 100).toFixed(2)}`;
	const formatDate = (date: Date) => new Intl.DateTimeFormat("en-GB", {
		day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit"
	}).format(date);

	return (
		<div className="space-y-8 pb-20">
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
							<h1 className="text-3xl font-display font-light">
								{quote.firstName} {quote.lastName}
							</h1>
							<Badge variant={quote.status === 'pending' ? 'secondary' : 'default'}>
								{quote.status}
							</Badge>
						</div>
						<p className="text-muted-foreground font-display font-light text-lg">
							Quote #{quote.id.slice(0, 8)} • {formatDate(quote.createdAt)}
						</p>
					</div>
				</div>

				{quote.status === 'pending' && (
					<Button size="lg" className="rounded-full bg-green-600 hover:bg-green-700">
						Convert to Order <ArrowRight className="ml-2 w-4 h-4" />
					</Button>
				)}
			</div>

			<div className="grid gap-8 lg:grid-cols-2">
				{/* Left Column: Configuration */}
				<div className="space-y-6">

					{/* Main Configuration Card */}
					<Card className="border-2 shadow-sm">
						<CardHeader className="bg-muted/5 pb-4">
							<div className="flex items-center gap-2 text-primary">
								<Settings2 className="h-5 w-5" />
								<CardTitle className="font-display font-normal">3D Configuration</CardTitle>
							</div>
						</CardHeader>
						<CardContent className="pt-6 space-y-6">

							{/* Dimensions Grid */}
							<div className="grid grid-cols-2 gap-4">
								<div className="space-y-1">
									<span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Dimensions</span>
									<div className="flex items-baseline gap-1">
										<Ruler className="w-4 h-4 text-muted-foreground self-center" />
										<span className="text-2xl font-light">
											{config.width} <span className="text-muted-foreground text-sm">W</span>
										</span>
										<span className="text-muted-foreground">×</span>
										<span className="text-2xl font-light">
											{config.height} <span className="text-muted-foreground text-sm">H</span>
										</span>
										<span className="text-sm text-muted-foreground ml-1">{config.unit}</span>
									</div>
								</div>
								<div className="space-y-1">
									<span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Material</span>
									<div className="flex items-center gap-2">
										<Layers className="w-4 h-4 text-muted-foreground" />
										<span className="text-lg capitalize">{config.filtrationType !== 'none' ? 'Flexible' : 'Standard'}</span>
									</div>
								</div>
							</div>

							<Separator />

							{/* Features List */}
							<div className="space-y-4">
								<div>
									<p className="text-sm font-medium mb-2">Model</p>
									<div className="p-3 bg-muted rounded-lg flex items-center justify-between">
										<span>{quote.product?.slug || "Category Default"}</span>
										{quote.productId && <Badge variant="outline">Specific Design</Badge>}
									</div>
								</div>

								<div className="grid grid-cols-2 gap-4">
									<div>
										<p className="text-sm font-medium mb-1">Side Panels</p>
										<p className="text-sm text-muted-foreground capitalize">
											{config.sidePanels === 'none' ? 'None' : `${config.sidePanels} (${config.sidePanelWidth}cm)`}
										</p>
									</div>
									<div>
										<p className="text-sm font-medium mb-1">Filtration</p>
										<p className="text-sm text-muted-foreground capitalize">
											{config.filtrationType}
										</p>
									</div>
								</div>
							</div>

							{/* Additional Items */}
							{config.additionalItems && config.additionalItems.length > 0 && (
								<div className="pt-2">
									<p className="text-sm font-medium mb-3">Additional Items</p>
									<div className="space-y-2">
										{config.additionalItems.map((item: any, idx: number) => (
											<div key={idx} className="flex justify-between items-center text-sm p-2 border rounded">
												<span>Item ID: <span className="font-mono text-xs">{item.id.slice(0, 8)}</span></span>
												<Badge variant="secondary">Qty: {item.quantity}</Badge>
											</div>
										))}
									</div>
								</div>
							)}
						</CardContent>
					</Card>

					{/* Customer Notes */}
					{(quote.customerNotes || config.notes) && (
						<Card className="border-2">
							<CardHeader>
								<CardTitle className="font-display font-normal text-base">Customer Notes</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="bg-amber-50 p-4 rounded-lg border border-amber-100 text-amber-900 text-sm italic">
									"{quote.customerNotes || config.notes}"
								</div>
							</CardContent>
						</Card>
					)}
				</div>

				{/* Right Column: Contact & Price */}
				<div className="space-y-6">

					{/* Price Card */}
					<Card className="border-2 border-primary/20 shadow-md">
						<CardHeader className="bg-primary/5 pb-4">
							<div className="flex items-center gap-2 text-primary">
								<Receipt className="h-5 w-5" />
								<CardTitle className="font-display font-normal">Pricing Estimate</CardTitle>
							</div>
						</CardHeader>
						<CardContent className="pt-6">
							<div className="flex flex-col items-center justify-center py-6 space-y-2">
								<span className="text-5xl font-display font-light tracking-tight text-primary">
									{formatPrice(quote.estimatedPriceEurCents)}
								</span>
								<span className="text-sm text-muted-foreground">Estimated Total (EUR)</span>
							</div>
							<p className="text-xs text-center text-muted-foreground px-8">
								* Final price may vary based on shipping calculation at conversion time.
							</p>
						</CardContent>
					</Card>

					{/* Customer Info */}
					<Card className="border-2">
						<CardHeader>
							<div className="flex items-center gap-2">
								<Mail className="h-5 w-5 text-muted-foreground" />
								<CardTitle className="font-display font-normal">Contact Details</CardTitle>
							</div>
						</CardHeader>
						<CardContent className="space-y-4">
							<div>
								<p className="text-sm text-muted-foreground font-display font-light mb-1">Email</p>
								<a href={`mailto:${quote.email}`} className="font-display font-medium text-primary hover:underline">
									{quote.email}
								</a>
							</div>
							<div className="grid grid-cols-2 gap-4">
								<div>
									<p className="text-sm text-muted-foreground font-display font-light mb-1">Name</p>
									<p className="font-display font-light">{quote.firstName} {quote.lastName}</p>
								</div>
								<div>
									<p className="text-sm text-muted-foreground font-display font-light mb-1">Country</p>
									<div className="flex items-center gap-1">
										<MapPin className="w-3 h-3 text-muted-foreground" />
										<span className="font-display font-light">{quote.country}</span>
									</div>
								</div>
							</div>
						</CardContent>
					</Card>

				</div>
			</div>
		</div>
	);
}