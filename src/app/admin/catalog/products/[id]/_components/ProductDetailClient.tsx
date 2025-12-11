// src/app/admin/catalog/products/[id]/_components/ProductDetailClient.tsx
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import { Button } from "~/components/ui/button"
import { Card } from "~/components/ui/card"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { api } from "~/trpc/react"
import { toast } from "sonner"
import { Loader2, Save, X, ChevronLeft, ChevronRight } from "lucide-react"
import { PricingSection } from "./PricingSection"

interface ProductDetailClientProps {
	product: any
	initialMarket?: "US" | "ROW"
}

export function ProductDetailClient({ product, initialMarket = "ROW" }: ProductDetailClientProps) {
	const router = useRouter()
	const [selectedMarket, setSelectedMarket] = useState<"US" | "ROW">(initialMarket)
	const [currentImageIndex, setCurrentImageIndex] = useState(0)
	const [isEditingBasic, setIsEditingBasic] = useState(false)
	const [formData, setFormData] = useState({
		name: product.name || "",
		description: product.description || "",
		categoryId: product.categoryId || "",
	})

	const updateProduct = api.admin.product.update.useMutation({
		onSuccess: () => {
			toast.success("Product updated")
			setIsEditingBasic(false)
			router.refresh()
		},
		onError: (error) => {
			toast.error(`Failed to update: ${error.message}`)
		},
	})

	const handleSaveBasic = () => {
		updateProduct.mutate({
			productId: product.id,
			name: formData.name,
			description: formData.description,
			categoryId: formData.categoryId,
		})
	}

	const pricingConfigs = product.pricingConfigs || []
	const bundles = product.bundles || []
	const images = product.images || []

	return (
		<div className="space-y-8">
			{/* HEADER */}
			<div className="flex items-center justify-between">
				<h1 className="text-3xl font-display font-light">{product.name}</h1>
				<Button variant="ghost" onClick={() => router.back()}>
					Back
				</Button>
			</div>

			{/* TWO COLUMN LAYOUT: Left Image, Right Details */}
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
				{/* LEFT: IMAGE GALLERY */}
				<div className="lg:col-span-1">
					<Card className="border-2">
						<CardContent className="pt-6">
							{images.length > 0 ? (
								<div className="space-y-4">
									<div className="relative aspect-square rounded-lg overflow-hidden bg-muted">
										<img
											src={images[currentImageIndex]?.url || "/placeholder.svg?height=400&width=400"}
											alt={product.name}
											className="w-full h-full object-cover"
										/>
									</div>
									{images.length > 1 && (
										<div className="flex items-center justify-between">
											<Button
												variant="outline"
												size="sm"
												onClick={() => setCurrentImageIndex((i) => (i - 1 + images.length) % images.length)}
											>
												<ChevronLeft className="h-4 w-4" />
											</Button>
											<p className="text-sm text-muted-foreground font-display font-light">
												{currentImageIndex + 1} of {images.length}
											</p>
											<Button
												variant="outline"
												size="sm"
												onClick={() => setCurrentImageIndex((i) => (i + 1) % images.length)}
											>
												<ChevronRight className="h-4 w-4" />
											</Button>
										</div>
									)}
								</div>
							) : (
								<div className="aspect-square rounded-lg bg-muted flex items-center justify-center">
									<p className="text-muted-foreground font-display font-light">No images</p>
								</div>
							)}
						</CardContent>
					</Card>
				</div>

				{/* RIGHT: BASIC PRODUCT DETAILS */}
				<div className="lg:col-span-2">
					<Card className="border-2">
						<CardHeader>
							<div className="flex items-center justify-between">
								<CardTitle className="font-display font-normal">Product Details</CardTitle>
								{!isEditingBasic ? (
									<Button variant="outline" size="sm" onClick={() => setIsEditingBasic(true)} className="rounded-full">
										Edit
									</Button>
								) : (
									<div className="flex gap-2">
										<Button
											variant="ghost"
											size="sm"
											onClick={() => {
												setIsEditingBasic(false)
												setFormData({
													name: product.name,
													description: product.description,
													categoryId: product.categoryId,
												})
											}}
											className="rounded-full"
										>
											<X className="h-4 w-4" />
										</Button>
										<Button
											size="sm"
											onClick={handleSaveBasic}
											disabled={updateProduct.isPending}
											className="rounded-full"
										>
											{updateProduct.isPending ? (
												<Loader2 className="h-4 w-4 animate-spin" />
											) : (
												<>
													<Save className="mr-2 h-4 w-4" />
													Save
												</>
											)}
										</Button>
									</div>
								)}
							</div>
						</CardHeader>
						<CardContent className="space-y-6">
							{isEditingBasic ? (
								<div className="space-y-4">
									<div className="space-y-2">
										<Label htmlFor="name" className="font-display font-light">
											Product Name
										</Label>
										<Input
											id="name"
											value={formData.name}
											onChange={(e) => setFormData({ ...formData, name: e.target.value })}
											className="font-display font-light"
										/>
									</div>
									<div className="space-y-2">
										<Label htmlFor="description" className="font-display font-light">
											Description
										</Label>
										<textarea
											id="description"
											value={formData.description}
											onChange={(e) => setFormData({ ...formData, description: e.target.value })}
											rows={4}
											className="w-full px-3 py-2 border rounded-md font-display font-light"
										/>
									</div>
								</div>
							) : (
								<div className="space-y-4">
									<div>
										<p className="text-sm text-muted-foreground font-display font-light mb-1">Name</p>
										<p className="text-lg font-display font-light">{product.name}</p>
									</div>
									<div>
										<p className="text-sm text-muted-foreground font-display font-light mb-1">Description</p>
										<p className="text-sm font-display font-light whitespace-pre-wrap">{product.description || "—"}</p>
									</div>
								</div>
							)}
						</CardContent>
					</Card>
				</div>
			</div>

			{/* FULL WIDTH: Pricing Section with PricingEditorV2 */}
			<PricingSection
				productId={product.id}
				pricingConfigs={pricingConfigs}
				bundles={bundles}
				selectedMarket={selectedMarket}
				setSelectedMarket={setSelectedMarket}
			/>
		</div>
	)
}
