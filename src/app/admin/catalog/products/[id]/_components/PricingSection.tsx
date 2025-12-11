// src/app/admin/catalog/products/[id]/_components/PricingSection.tsx
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { api } from "~/trpc/react"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select"
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "~/components/ui/dialog"
import { Plus, Copy, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { MarketBadge } from "../../../_components/MarketBadge"
import { PricingEditorV2 } from "../../../_components/PricingEditorV2"
import { BundleTierEditor } from "./BundleTierEditor"

interface PricingSectionProps {
	productId: string
	pricingConfigs: any[]
	bundles: any[]
	selectedMarket: "US" | "ROW"
	setSelectedMarket: (market: "US" | "ROW") => void
}

export function PricingSection({
	productId,
	pricingConfigs,
	bundles,
	selectedMarket,
	setSelectedMarket,
}: PricingSectionProps) {
	const router = useRouter()
	const [createDialogOpen, setCreateDialogOpen] = useState(false)
	const [copyDialogOpen, setCopyDialogOpen] = useState(false)
	const [createFormData, setCreateFormData] = useState({
		market: "US" as const,
		currency: "USD" as const,
		pricingType: "simple" as const,
		unitPriceEurCents: 5000,
	})
	const [copyFormData, setCopyFormData] = useState({
		targetMarket: "US" as const,
		targetCurrency: "USD" as const,
		priceMultiplier: 1,
	})

	const createPricing = api.admin.pricing.create.useMutation({
		onSuccess: () => {
			toast.success("Pricing created successfully")
			setCreateDialogOpen(false)
			setCreateFormData({
				market: "US",
				currency: "USD",
				pricingType: "simple",
				unitPriceEurCents: 5000,
			})
			router.refresh()
		},
		onError: (error: any) => {
			toast.error(`Failed to create pricing: ${error.message}`)
		},
	})

	const copyPricing = api.admin.pricing.copyPricing.useMutation({
		onSuccess: () => {
			toast.success("Pricing copied successfully")
			setCopyDialogOpen(false)
			setCopyFormData({
				targetMarket: "US",
				targetCurrency: "USD",
				priceMultiplier: 1,
			})
			router.refresh()
		},
		onError: (error: any) => {
			toast.error(`Failed to copy pricing: ${error.message}`)
		},
	})

	const handleCreatePricing = () => {
		if (createFormData.pricingType === "simple" && createFormData.unitPriceEurCents <= 0) {
			toast.error("Price must be greater than 0")
			return
		}

		createPricing.mutate({
			productId,
			market: createFormData.market,
			currency: createFormData.currency,
			pricingType: createFormData.pricingType,
			unitPriceEurCents: createFormData.unitPriceEurCents,
			allowQuantity: true,
		})
	}

	const handleCopyPricing = () => {
		const sourcePricing = pricingConfigs.find((p) => p.market === "ROW")
		if (!sourcePricing) {
			toast.error("ROW pricing not found")
			return
		}

		if (copyFormData.priceMultiplier <= 0) {
			toast.error("Price multiplier must be greater than 0")
			return
		}

		copyPricing.mutate({
			sourcePricingId: sourcePricing.id,
			targetMarket: copyFormData.targetMarket,
			targetCurrency: copyFormData.targetCurrency,
			priceMultiplier: copyFormData.priceMultiplier,
		})
	}

	const rowPricing = pricingConfigs.find((p: any) => p.market === "ROW")
	const usPricing = pricingConfigs.find((p: any) => p.market === "US")

	return (
		<Card className="border-2">
			<CardHeader>
				<div className="flex items-center justify-between">
					<CardTitle className="font-display font-normal">Pricing & Markets</CardTitle>
					<div className="flex gap-2">
						<Button
							variant={selectedMarket === "ROW" ? "default" : "outline"}
							size="sm"
							onClick={() => setSelectedMarket("ROW")}
							className="rounded-full"
						>
							<MarketBadge market="ROW" showIcon />
						</Button>
						<Button
							variant={selectedMarket === "US" ? "default" : "outline"}
							size="sm"
							onClick={() => setSelectedMarket("US")}
							className="rounded-full"
						>
							<MarketBadge market="US" showIcon />
						</Button>
					</div>
				</div>
			</CardHeader>
			<CardContent>
				<div className="space-y-6">
					{/* ROW MARKET */}
					{selectedMarket === "ROW" && (
						<>
							{rowPricing ? (
								<div className="space-y-6">
									<PricingEditorV2
										pricing={rowPricing}
										onSaved={() => router.refresh()}
										onDeleted={() => router.refresh()}
									/>

									{rowPricing.pricingType === "quantity_bundle" && (
										<BundleTierEditor
											pricingId={rowPricing.id}
											bundles={bundles?.filter((b: any) => b.pricingId === rowPricing.id) || []}
											onUpdate={() => router.refresh()}
										/>
									)}

									{!usPricing && (
										<Dialog open={copyDialogOpen} onOpenChange={setCopyDialogOpen}>
											<DialogTrigger asChild>
												<Button variant="outline" className="w-full rounded-full gap-2 bg-transparent">
													<Copy className="h-4 w-4" />
													Quick Setup: Copy ROW to US Market
												</Button>
											</DialogTrigger>
											<DialogContent>
												<DialogHeader>
													<DialogTitle>Copy ROW Pricing to US Market</DialogTitle>
													<DialogDescription>
														Quickly set up US pricing by copying ROW pricing with a price multiplier
													</DialogDescription>
												</DialogHeader>
												<div className="space-y-4 py-4">
													<div className="space-y-2">
														<Label>Target Currency</Label>
														<Select
															value={copyFormData.targetCurrency}
															onValueChange={(value) =>
																setCopyFormData({ ...copyFormData, targetCurrency: value as any })
															}
														>
															<SelectTrigger>
																<SelectValue />
															</SelectTrigger>
															<SelectContent>
																<SelectItem value="USD">USD (United States)</SelectItem>
																<SelectItem value="CAD">CAD (Canada)</SelectItem>
																<SelectItem value="GBP">GBP (United Kingdom)</SelectItem>
															</SelectContent>
														</Select>
													</div>

													<div className="space-y-2">
														<Label>Price Multiplier</Label>
														<Input
															type="number"
															step="0.01"
															min="0.01"
															value={copyFormData.priceMultiplier}
															onChange={(e) =>
																setCopyFormData({
																	...copyFormData,
																	priceMultiplier: Number.parseFloat(e.target.value) || 1,
																})
															}
															placeholder="1.0"
														/>
														<p className="text-xs text-muted-foreground">
															Enter 1.1 to increase prices by 10%, 0.9 to decrease by 10%, etc.
														</p>
													</div>

													<div className="bg-muted p-3 rounded text-sm">
														<p className="font-display font-light">
															This will copy all ROW pricing and bundle tiers to the US market with the multiplier
															applied.
														</p>
													</div>

													<Button
														onClick={handleCopyPricing}
														disabled={copyPricing.isPending}
														className="w-full rounded-full"
													>
														{copyPricing.isPending ? (
															<Loader2 className="h-4 w-4 animate-spin mr-2" />
														) : (
															<Copy className="h-4 w-4 mr-2" />
														)}
														Copy Pricing
													</Button>
												</div>
											</DialogContent>
										</Dialog>
									)}
								</div>
							) : (
								<div className="py-12 text-center space-y-4">
									<p className="text-muted-foreground font-display font-light">No pricing configured for ROW market</p>
									<Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
										<DialogTrigger asChild>
											<Button variant="outline" className="rounded-full bg-transparent">
												<Plus className="mr-2 h-4 w-4" />
												Add Pricing
											</Button>
										</DialogTrigger>
										<DialogContent>
											<DialogHeader>
												<DialogTitle>Create ROW Pricing</DialogTitle>
												<DialogDescription>Set up pricing for the Rest of World market</DialogDescription>
											</DialogHeader>
											<div className="space-y-4 py-4">
												<div className="space-y-2">
													<Label>Pricing Type</Label>
													<Select
														value={createFormData.pricingType}
														onValueChange={(value) =>
															setCreateFormData({ ...createFormData, pricingType: value as any })
														}
													>
														<SelectTrigger>
															<SelectValue />
														</SelectTrigger>
														<SelectContent>
															<SelectItem value="simple">Simple - Single unit price</SelectItem>
															<SelectItem value="quantity_bundle">Bundle - Quantity tiers</SelectItem>
															<SelectItem value="configuration">Configuration - Calculator</SelectItem>
														</SelectContent>
													</Select>
												</div>

												<div className="space-y-2">
													<Label>Unit Price (€)</Label>
													<Input
														type="number"
														step="0.01"
														min="0"
														value={(createFormData.unitPriceEurCents / 100).toFixed(2)}
														onChange={(e) =>
															setCreateFormData({
																...createFormData,
																unitPriceEurCents: Math.round(Number.parseFloat(e.target.value || "0") * 100),
															})
														}
													/>
												</div>

												<Button
													onClick={handleCreatePricing}
													disabled={createPricing.isPending}
													className="w-full rounded-full"
												>
													{createPricing.isPending ? (
														<Loader2 className="h-4 w-4 animate-spin mr-2" />
													) : (
														<Plus className="h-4 w-4 mr-2" />
													)}
													Create Pricing
												</Button>
											</div>
										</DialogContent>
									</Dialog>
								</div>
							)}
						</>
					)}

					{/* US MARKET */}
					{selectedMarket === "US" && (
						<>
							{usPricing ? (
								<div className="space-y-6">
									<PricingEditorV2
										pricing={usPricing}
										onSaved={() => router.refresh()}
										onDeleted={() => router.refresh()}
									/>

									{usPricing.pricingType === "quantity_bundle" && (
										<BundleTierEditor
											pricingId={usPricing.id}
											bundles={bundles?.filter((b: any) => b.pricingId === usPricing.id) || []}
											onUpdate={() => router.refresh()}
										/>
									)}
								</div>
							) : (
								<div className="py-12 text-center space-y-4">
									<p className="text-muted-foreground font-display font-light">No pricing configured for US market</p>
									{rowPricing ? (
										<Dialog open={copyDialogOpen} onOpenChange={setCopyDialogOpen}>
											<DialogTrigger asChild>
												<Button variant="outline" className="rounded-full gap-2 bg-transparent">
													<Copy className="h-4 w-4" />
													Quick Setup: Copy ROW to US
												</Button>
											</DialogTrigger>
											<DialogContent>
												<DialogHeader>
													<DialogTitle>Copy ROW Pricing to US Market</DialogTitle>
													<DialogDescription>
														Quickly set up US pricing by copying ROW pricing with a price multiplier
													</DialogDescription>
												</DialogHeader>
												<div className="space-y-4 py-4">
													<div className="space-y-2">
														<Label>Target Currency</Label>
														<Select
															value={copyFormData.targetCurrency}
															onValueChange={(value) =>
																setCopyFormData({ ...copyFormData, targetCurrency: value as any })
															}
														>
															<SelectTrigger>
																<SelectValue />
															</SelectTrigger>
															<SelectContent>
																<SelectItem value="USD">USD (United States)</SelectItem>
																<SelectItem value="CAD">CAD (Canada)</SelectItem>
																<SelectItem value="GBP">GBP (United Kingdom)</SelectItem>
															</SelectContent>
														</Select>
													</div>

													<div className="space-y-2">
														<Label>Price Multiplier</Label>
														<Input
															type="number"
															step="0.01"
															min="0.01"
															value={copyFormData.priceMultiplier}
															onChange={(e) =>
																setCopyFormData({
																	...copyFormData,
																	priceMultiplier: Number.parseFloat(e.target.value) || 1,
																})
															}
															placeholder="1.0"
														/>
														<p className="text-xs text-muted-foreground">
															Enter 1.1 to increase prices by 10%, 0.9 to decrease by 10%, etc.
														</p>
													</div>

													<div className="bg-muted p-3 rounded text-sm">
														<p className="font-display font-light">
															This will copy all ROW pricing and bundle tiers to the US market with the multiplier
															applied.
														</p>
													</div>

													<Button
														onClick={handleCopyPricing}
														disabled={copyPricing.isPending}
														className="w-full rounded-full"
													>
														{copyPricing.isPending ? (
															<Loader2 className="h-4 w-4 animate-spin mr-2" />
														) : (
															<Copy className="h-4 w-4 mr-2" />
														)}
														Copy Pricing
													</Button>
												</div>
											</DialogContent>
										</Dialog>
									) : (
										<Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
											<DialogTrigger asChild>
												<Button variant="outline" className="rounded-full bg-transparent">
													<Plus className="mr-2 h-4 w-4" />
													Add Pricing
												</Button>
											</DialogTrigger>
											<DialogContent>
												<DialogHeader>
													<DialogTitle>Create US Pricing</DialogTitle>
													<DialogDescription>Set up pricing for the US market</DialogDescription>
												</DialogHeader>
												<div className="space-y-4 py-4">
													<div className="space-y-2">
														<Label>Pricing Type</Label>
														<Select
															value={createFormData.pricingType}
															onValueChange={(value) =>
																setCreateFormData({ ...createFormData, pricingType: value as any })
															}
														>
															<SelectTrigger>
																<SelectValue />
															</SelectTrigger>
															<SelectContent>
																<SelectItem value="simple">Simple - Single unit price</SelectItem>
																<SelectItem value="quantity_bundle">Bundle - Quantity tiers</SelectItem>
																<SelectItem value="configuration">Configuration - Calculator</SelectItem>
															</SelectContent>
														</Select>
													</div>

													<div className="space-y-2">
														<Label>Unit Price (€)</Label>
														<Input
															type="number"
															step="0.01"
															min="0"
															value={(createFormData.unitPriceEurCents / 100).toFixed(2)}
															onChange={(e) =>
																setCreateFormData({
																	...createFormData,
																	unitPriceEurCents: Math.round(Number.parseFloat(e.target.value || "0") * 100),
																})
															}
														/>
													</div>

													<Button
														onClick={handleCreatePricing}
														disabled={createPricing.isPending}
														className="w-full rounded-full"
													>
														{createPricing.isPending ? (
															<Loader2 className="h-4 w-4 animate-spin mr-2" />
														) : (
															<Plus className="h-4 w-4 mr-2" />
														)}
														Create Pricing
													</Button>
												</div>
											</DialogContent>
										</Dialog>
									)}
								</div>
							)}
						</>
					)}
				</div>
			</CardContent>
		</Card>
	)
}
