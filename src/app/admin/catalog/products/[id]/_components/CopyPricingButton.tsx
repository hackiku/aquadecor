// src/app/admin/catalog/products/[id]/_components/CopyPricingButton.tsx
"use client"

import { useState } from "react"
import { api } from "~/trpc/react"
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
import { Copy, Loader2 } from "lucide-react"
import { toast } from "sonner"

interface CopyPricingButtonProps {
	sourcePricingId: string
	targetMarket: "US" | "ROW"
	onSuccess?: () => void
}

export function CopyPricingButton({ sourcePricingId, targetMarket, onSuccess }: CopyPricingButtonProps) {
	const [open, setOpen] = useState(false)
	const [multiplier, setMultiplier] = useState("1.0")
	const [targetCurrency, setTargetCurrency] = useState(targetMarket === "US" ? "USD" : "EUR")

	const copyPricing = api.admin.pricing.copyPricing.useMutation({
		onSuccess: () => {
			toast.success("Pricing copied successfully")
			setOpen(false)
			setMultiplier("1.0")
			onSuccess?.()
		},
		onError: (error: any) => {
			toast.error(`Failed to copy pricing: ${error.message}`)
		},
	})

	const handleCopy = () => {
		const multiplierValue = Number.parseFloat(multiplier || "1")
		if (multiplierValue <= 0) {
			toast.error("Price multiplier must be greater than 0")
			return
		}

		copyPricing.mutate({
			sourcePricingId,
			targetMarket,
			targetCurrency: targetCurrency as any,
			priceMultiplier: multiplierValue,
		})
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button variant="outline" className="rounded-full bg-transparent">
					<Copy className="mr-2 h-4 w-4" />
					Copy ROW to {targetMarket}
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Copy ROW Pricing to {targetMarket} Market</DialogTitle>
					<DialogDescription>
						Quickly set up {targetMarket === "US" ? "US" : "ROW"} pricing by copying with a price multiplier
					</DialogDescription>
				</DialogHeader>
				<div className="space-y-4 py-4">
					<div className="space-y-2">
						<Label>Target Currency</Label>
						<Select value={targetCurrency} onValueChange={setTargetCurrency}>
							<SelectTrigger>
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="USD">USD (United States)</SelectItem>
								<SelectItem value="EUR">EUR (Europe)</SelectItem>
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
							value={multiplier}
							onChange={(e) => setMultiplier(e.target.value)}
							placeholder="1.0"
						/>
						<p className="text-xs text-muted-foreground">
							Use 1.0 to match ROW prices, 1.15 for 15% increase, 0.9 for 10% decrease
						</p>
					</div>

					<div className="bg-muted p-3 rounded text-sm">
						<p className="font-display font-light">
							This will copy all ROW pricing and bundle tiers to {targetMarket} market with the multiplier applied.
						</p>
					</div>

					<Button onClick={handleCopy} disabled={copyPricing.isPending} className="w-full rounded-full">
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
	)
}