// src/app/admin/catalog/trash/page.tsx

import { api } from "~/trpc/server";
import { Card } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { ArrowLeft, Trash2, RotateCcw } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { TrashActionsClient } from "./_components/TrashActionsClient";

export default async function TrashPage() {
	const trashedProducts = await api.admin.product.getTrash();

	return (
		<div className="space-y-8">
			{/* Header */}
			<div className="space-y-4">
				<Button variant="ghost" asChild className="font-display font-light -ml-4">
					<Link href="/admin/catalog">
						<ArrowLeft className="mr-2 h-4 w-4" />
						Back to Catalog
					</Link>
				</Button>
				<div className="flex items-start justify-between">
					<div className="space-y-2">
						<div className="flex items-center gap-3">
							<Trash2 className="h-8 w-8 text-muted-foreground" />
							<h1 className="text-4xl font-display font-extralight tracking-tight">
								Trash
							</h1>
						</div>
						<p className="text-muted-foreground font-display font-light text-lg">
							Manage soft-deleted products. Products can be restored or permanently deleted.
						</p>
					</div>
					{trashedProducts.length > 0 && (
						<TrashActionsClient productIds={trashedProducts.map(p => p.id)} />
					)}
				</div>
			</div>

			{/* Stats */}
			<Card className="border-2 p-6">
				<div className="flex items-center justify-between">
					<div>
						<p className="text-sm text-muted-foreground font-display font-light">
							Products in Trash
						</p>
						<p className="text-3xl font-display font-light">{trashedProducts.length}</p>
					</div>
					{trashedProducts.length > 0 && (
						<Badge variant="secondary" className="font-display font-light">
							Soft deleted items can be restored
						</Badge>
					)}
				</div>
			</Card>

			{/* Trashed Products */}
			{trashedProducts.length === 0 ? (
				<div className="py-16 text-center space-y-4">
					<p className="text-lg text-muted-foreground font-display font-light">
						Trash is empty
					</p>
					<Button asChild className="rounded-full">
						<Link href="/admin/catalog/products">
							View All Products
						</Link>
					</Button>
				</div>
			) : (
				<div className="grid gap-4">
					{trashedProducts.map((product) => (
						<Card key={product.id} className="border-2 hover:border-primary/30 transition-colors">
							<div className="p-6">
								<div className="flex items-center gap-6">
									{/* Image */}
									<div className="relative w-24 h-24 rounded-lg overflow-hidden bg-muted shrink-0">
										{product.heroImageUrl ? (
											<Image
												src={product.heroImageUrl}
												alt={product.name || 'Product'}
												fill
												className="object-cover"
											/>
										) : (
											<div className="flex items-center justify-center h-full">
												<Trash2 className="h-8 w-8 text-muted-foreground/30" />
											</div>
										)}
									</div>

									{/* Info */}
									<div className="flex-1 space-y-2">
										<div className="flex items-start justify-between">
											<div>
												<h3 className="font-display font-normal text-lg">
													{product.name || 'Untitled Product'}
												</h3>
												<p className="text-sm text-muted-foreground font-display font-light">
													{product.categoryName} • {product.sku}
												</p>
											</div>
										</div>
										<div className="flex items-center gap-3 text-sm text-muted-foreground font-display font-light">
											<span>
												Deleted: {new Date(product.deletedAt!).toLocaleDateString()}
											</span>
											{product.deletedBy && (
												<>
													<span>•</span>
													<span>By: {product.deletedBy}</span>
												</>
											)}
										</div>
									</div>

									{/* Actions */}
									<div className="flex items-center gap-2 shrink-0">
										<TrashActionsClient
											productIds={[product.id]}
											productName={product.name}
											showRestoreOnly
										/>
									</div>
								</div>
							</div>
						</Card>
					))}
				</div>
			)}
		</div>
	);
}