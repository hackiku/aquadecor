"use client"

import React from "react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "~/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "~/components/ui/table";
import { buttonVariants } from "~/components/ui/button";

const PROVIDERS = [
	{
		name: "TPG Express (Serbia)",
		url: "https://tpg-express.com/",
		type: "Regional freight forwarder / customs",
		notes: "Full-service sea/air/road freight + customs brokerage in Serbia & CEE. Good for pallet / container routing to EU ports."
	},
	{
		name: "Eurosender",
		url: "https://www.eurosender.com/en/gdd/shipping-serbia-united-states",
		type: "Courier aggregator / consolidation",
		notes: "Easy online quotes for Serbia→US; useful for single pallets and parcel consolidation."
	},
	{
		name: "ShipBob (freight & fulfillment)",
		url: "https://www.shipbob.com/product/freight/",
		type: "3PL / fulfillment + freight coordination",
		notes: "Receive bulk inbound shipments and fulfill in‑country (US) — best to amortize inbound freight."
	},
	{
		name: "DB Schenker (Serbia)",
		url: "https://www.dbschenker.com/rs-en",
		type: "Global forwarder / consolidation",
		notes: "Large global network; good for LCL/FCL and complex customs."
	},
	{
		name: "DSV Serbia",
		url: "https://www.dsv.com/en/countries/europe/serbia",
		type: "Global forwarder",
		notes: "Air/sea/road and customs clearing. Contact local office to quote Serbia→US routes."
	},
	{
		name: "Kuehne+Nagel (Serbia)",
		url: "https://rs.kuehne-nagel.com/sr/",
		type: "Global forwarder",
		notes: "Another major forwarder with LCL/FCL and contract logistics in the region."
	}
];

export default function SanctionsResearchPage() {
	return (
		<main className="container mx-auto my-24 p-8 md:p-16 space-y-8">
			<h1 className="text-3xl font-bold mb-2">Serbia → US: Legal Shipping & Logistics Options</h1>
			<p className="text-sm text-muted-foreground max-w-3xl">
				This page summarizes research on how Serbian companies like AquaDecor can legally and efficiently ship goods to the U.S. despite sanctions and expensive express shipping rates. It highlights the most viable freight forwarding services, fulfillment strategies, and regulatory considerations, with links and pricing breakdowns. Use it as a quick-reference for the operations and logistics team.
			</p>

			<section>
				<Card>
					<CardHeader>
						<CardTitle>Executive Overview</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-sm mb-4">
							Serbia’s direct exports to the U.S. are heavily impacted by tariffs and courier pricing. DHL and FedEx charge $400–$600 per parcel, often more than the product’s value. The viable path is to leverage EU transshipment hubs, consolidated sea/air freight, and U.S. third-party logistics (3PL) partners to bring down cost per unit. Below is a TL;DR of the approach.
						</p>
						<ul className="list-disc pl-5 space-y-2 text-sm">
							<li>Use regional or EU-based forwarders to consolidate goods (Serbia → Hungary/Croatia/Slovenia → U.S.).</li>
							<li>Ship in bulk (LCL or FCL) to the U.S. and store inventory in a domestic 3PL facility.</li>
							<li>Fulfill U.S. orders locally from that warehouse, cutting express costs entirely.</li>
							<li>Ensure compliance with new 2025 U.S. tariff (35% duty) and no de minimis exemption.</li>
						</ul>
					</CardContent>
				</Card>
			</section>

			<section>
				<h2 className="text-2xl font-semibold mt-8 mb-2">Freight Forwarders & Key Providers</h2>
				<p className="text-sm text-muted-foreground mb-4 max-w-3xl">
					These logistics partners can legally handle Serbia→U.S. shipments via land, sea, or air. Many route freight through EU ports like Rijeka, Koper, or Hamburg. Contact multiple providers to compare quotes for LCL (Less-than-Container Load) or palletized shipments.
				</p>
				<Card>
					<CardHeader>
						<CardTitle>Provider Directory</CardTitle>
					</CardHeader>
					<CardContent>
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead className="w-[200px]">Provider</TableHead>
									<TableHead>Service Type</TableHead>
									<TableHead>Notes</TableHead>
									<TableHead className="w-[120px]">Link</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{PROVIDERS.map((p) => (
									<TableRow key={p.name}>
										<TableCell className="font-medium">{p.name}</TableCell>
										<TableCell>{p.type}</TableCell>
										<TableCell className="text-sm">{p.notes}</TableCell>
										<TableCell>
											<Link href={p.url} target="_blank" rel="noopener noreferrer" className={buttonVariants({ size: "sm" })}>
												Open
											</Link>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</CardContent>
				</Card>
			</section>

			<section>
				<h2 className="text-2xl font-semibold mt-8 mb-2">Rerouting & Consolidation Strategy</h2>
				<p className="text-sm text-muted-foreground max-w-3xl mb-4">
					The most efficient workaround is to route Serbian goods through an EU distributor or partner hub. Serbia’s trade deals allow simplified export to EU borders; once in the EU, the shipment can be re-exported under EU logistics networks. Use Hungarian or Slovenian partners to forward consolidated shipments to the U.S.
				</p>
				<Card>
					<CardHeader>
						<CardTitle>Typical EU Route Breakdown</CardTitle>
					</CardHeader>
					<CardContent>
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Leg</TableHead>
									<TableHead>Mode</TableHead>
									<TableHead>Details</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								<TableRow>
									<TableCell>Belgrade → Budapest</TableCell>
									<TableCell>Road / Rail</TableCell>
									<TableCell>TPG Express or DB Schenker truck pickup to EU hub.</TableCell>
								</TableRow>
								<TableRow>
									<TableCell>Budapest → Hamburg / Koper / Rijeka</TableCell>
									<TableCell>Truck / Rail</TableCell>
									<TableCell>Forwarder consolidates multiple Serbian exporters for container loading.</TableCell>
								</TableRow>
								<TableRow>
									<TableCell>EU Port → US Port</TableCell>
									<TableCell>Sea Freight (LCL/FCL)</TableCell>
									<TableCell>25–35 days transit; up to 80% cheaper than express air freight.</TableCell>
								</TableRow>
								<TableRow>
									<TableCell>US Port → 3PL Warehouse</TableCell>
									<TableCell>Domestic Truck</TableCell>
									<TableCell>Handled by freight forwarder’s U.S. partner or your 3PL.</TableCell>
								</TableRow>
							</TableBody>
						</Table>
					</CardContent>
				</Card>
			</section>

			<section>
				<h2 className="text-2xl font-semibold mt-8 mb-2">U.S. Fulfillment Model</h2>
				<p className="text-sm text-muted-foreground max-w-3xl mb-4">
					Once your goods arrive in the U.S., store them at a fulfillment partner (3PL). This drastically reduces cost per order by converting international shipping into one bulk freight expense. Popular options include ShipBob, Shipwire, Red Stag, and Amazon FBA. Below is a sample cost breakdown for a single inbound pallet.
				</p>
				<Card>
					<CardHeader>
						<CardTitle>Pricing Model Cheatsheet</CardTitle>
					</CardHeader>
					<CardContent>
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Line Item</TableHead>
									<TableHead>Notes</TableHead>
									<TableHead>Example (per pallet)</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								<TableRow>
									<TableCell>Freight (LCL/FCL air or sea)</TableCell>
									<TableCell className="text-sm">Door pickup in Serbia → US port/warehouse. Compare door-to-door vs port-to-port.</TableCell>
									<TableCell>$300–$1,500</TableCell>
								</TableRow>
								<TableRow>
									<TableCell>Customs duties & VAT</TableCell>
									<TableCell className="text-sm">U.S. duties depend on HTS code — include brokerage fee.</TableCell>
									<TableCell>$0–$500</TableCell>
								</TableRow>
								<TableRow>
									<TableCell>Inland US delivery (port → 3PL)</TableCell>
									<TableCell className="text-sm">Local trucking/rail to fulfillment center.</TableCell>
									<TableCell>$100–$400</TableCell>
								</TableRow>
								<TableRow>
									<TableCell>3PL receiving & storage</TableCell>
									<TableCell className="text-sm">Inbound processing + monthly storage.</TableCell>
									<TableCell>$50–$200</TableCell>
								</TableRow>
							</TableBody>
						</Table>
						<p className="mt-3 text-xs text-muted-foreground">Numbers are estimates — always confirm quotes. Goal: achieve a per-unit landed cost far below express per-order rates.</p>
					</CardContent>
				</Card>
			</section>

			<section>
				<h2 className="text-2xl font-semibold mt-8 mb-2">Regulatory & Tariff Notes</h2>
				<p className="text-sm text-muted-foreground max-w-3xl mb-4">
					U.S. import duties for Serbian goods increased to 35% in August 2025, and the $800 de minimis exemption was removed. This means every shipment, regardless of value, now requires full customs clearance. Exporters must rely on compliant logistics partners who manage HTS classification and import brokerage properly.
				</p>
				<Card>
					<CardHeader>
						<CardTitle>Policy Reference Links</CardTitle>
					</CardHeader>
					<CardContent>
						<ul className="list-disc pl-5 space-y-2 text-sm">
							<li><Link href="https://www.trade.gov/country-commercial-guides/serbia-trade-agreements" target="_blank" className="underline">Serbia Trade Agreements – U.S. DOC</Link></li>
							<li><Link href="https://ustr.gov/trump-admin-tariffs-serbia-2025" target="_blank" className="underline">U.S. Tariff Announcement 2025</Link></li>
							<li><Link href="https://www.federalregister.gov/" target="_blank" className="underline">Federal Register – Latest customs policy updates</Link></li>
						</ul>
					</CardContent>
				</Card>
			</section>

			<footer className="pt-8 text-xs text-muted-foreground max-w-3xl">
				Compiled for AquaDecor. Deploy internally or share with logistics partners to coordinate next steps. Consider adding a quote-request form or an automated rate-comparison dashboard as next iteration.
			</footer>
		</main>
	);
}
