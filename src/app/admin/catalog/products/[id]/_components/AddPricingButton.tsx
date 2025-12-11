// src/app/admin/catalog/products/[id]/_components/AddPricingButton.tsx
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
import { Plus, Loader2 } from "lucide-react"
import { toast } from "sonner"

interface AddPricingButtonProps {
	productId: string
	market: "US" | "ROW"
	sourcePricing?: any
	onSuccess?: () => void
}

export function AddPricingButton({ productId, market, onSuccess }: AddPricingButtonProps) {
	const [open, setOpen] = useState(false)
	const [pricingType, setPricingType] = useState("simple")
	const [unitPrice, setUnitPrice] = useState("50.00")

	const createPricing = api.admin.pricing.create.useMutation({
		onSuccess: () => {
			toast.success("Pricing created successfully")
			setOpen(false)
			setPricingType("simple")
			setUnitPrice("50.00")
			onSuccess?.()
		},
		onError: (error: any) => {
			toast.error(`Failed to create pricing: ${error.message}`)
		},
	})

	const handleCreate = () => {
		const priceInCents = Math.round(Number.parseFloat(unitPrice || "0") * 100)
		if (priceInCents <= 0) {
			toast.error("Price must be greater than 0")
			return
		}

		createPricing.mutate({
			productId,
			market,
			currency: market === "US" ? "USD" : "EUR",
			pricingType: pricingType as any,
			unitPriceEurCents: priceInCents,
			allowQuantity: true,
		})
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button variant="outline" className="rounded-full bg-transparent">
					<Plus className="mr-2 h-4 w-4" />
					Add Pricing
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Create {market} Pricing</DialogTitle>
					<DialogDescription>
						Set up {market === "US" ? "United States" : "Rest of World"} pricing for this product
					</DialogDescription>
				</DialogHeader>
				<div className="space-y-4 py-4">
					<div className="space-y-2">
						<Label>Pricing Type</Label>
						<Select value={pricingType} onValueChange={setPricingType}>
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
						<Label>Unit Price ({market === "US" ? "$" : "€"})</Label>
						<Input
							type="number"
							step="0.01"
							min="0"
							value={unitPrice}
							onChange={(e) => setUnitPrice(e.target.value)}
							placeholder="50.00"
						/>
					</div>

					<Button onClick={handleCreate} disabled={createPricing.isPending} className="w-full rounded-full">
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
	)
}
