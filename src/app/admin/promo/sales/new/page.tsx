// src/app/admin/promo/sales/new/page.tsx

import { SaleForm } from "../_components/SaleForm";

export default function NewSalePage() {
	return (
		<div className="space-y-8">
			<div className="space-y-2">
				<h1 className="text-4xl font-display font-extralight tracking-tight">
					Create New Sale
				</h1>
				<p className="text-muted-foreground font-display font-light text-lg">
					Set up a new promotional campaign
				</p>
			</div>

			<SaleForm />
		</div>
	);
}