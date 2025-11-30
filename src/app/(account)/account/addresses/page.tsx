// src/app/(account)/account/addresses/page.tsx
import { MobileAccountNav } from "../../_components/MobileAccountNav";
import { Button } from "~/components/ui/button";
import { Plus, MapPin, Pencil, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
export default function AddressesPage() {
	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl md:text-3xl font-display font-light">Addresses</h1>
					<p className="text-muted-foreground font-display font-light">
						Manage shipping and billing addresses.
					</p>
				</div>
				<MobileAccountNav />
			</div>
			<div className="grid md:grid-cols-2 gap-6">
				{/* Add New Card */}
				<button className="flex flex-col items-center justify-center h-full min-h-[200px] border-2 border-dashed rounded-xl hover:border-primary/50 hover:bg-muted/30 transition-all group">
					<div className="w-12 h-12 rounded-full bg-muted group-hover:bg-primary/10 flex items-center justify-center mb-3 transition-colors">
						<Plus className="h-6 w-6 text-muted-foreground group-hover:text-primary" />
					</div>
					<span className="font-display font-medium">Add New Address</span>
				</button>

				{/* Existing Address Card */}
				<Card className="relative group">
					<CardHeader className="pb-3">
						<div className="flex items-start justify-between">
							<div className="flex items-center gap-2">
								<MapPin className="h-4 w-4 text-primary" />
								<span className="font-display font-medium">Home</span>
								<Badge variant="secondary" className="text-xs font-normal">Default</Badge>
							</div>
						</div>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="text-sm font-display font-light text-muted-foreground space-y-1">
							<p className="text-foreground font-medium">Branka Nemet</p>
							<p>Example Street 123, Apt 4B</p>
							<p>11000 Belgrade</p>
							<p>Serbia</p>
							<p className="pt-2">+381 60 123 4567</p>
						</div>

						<div className="flex gap-2 pt-2">
							<Button variant="outline" size="sm" className="h-8 rounded-full">
								<Pencil className="h-3 w-3 mr-2" />
								Edit
							</Button>
							<Button variant="ghost" size="sm" className="h-8 rounded-full text-red-600 hover:text-red-700 hover:bg-red-50">
								<Trash2 className="h-3 w-3" />
							</Button>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
