// src/components/dev/UnderConstruction.tsx

import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Construction, ArrowLeft, Home } from "lucide-react";
import Link from "next/link";

interface UnderConstructionProps {
	title: string;
	description?: string;
}

export function UnderConstruction({ title, description }: UnderConstructionProps) {
	return (
		<div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
			<Card className="border-2 max-w-2xl w-full">
				<CardHeader>
					<div className="flex items-center gap-3">
						<Construction className="h-8 w-8 text-amber-500" />
						<CardTitle className="font-display font-normal text-2xl">
							{title}
						</CardTitle>
					</div>
				</CardHeader>
				<CardContent className="space-y-6">
					<div className="space-y-2">
						<p className="font-display font-light text-muted-foreground">
							{description || "This feature is currently under development."}
						</p>
						<p className="font-display font-light text-sm text-muted-foreground">
							Check back soon! In the meantime, explore other admin features.
						</p>
					</div>

					<div className="flex items-center gap-3">
						<Button
							asChild
							variant="default"
							className="rounded-full font-display font-light"
						>
							<Link href="/admin">
								<Home className="mr-2 h-4 w-4" />
								Back to Dashboard
							</Link>
						</Button>
						<Button
							asChild
							variant="outline"
							className="rounded-full font-display font-light"
						>
							<Link href="/admin/catalog">
								View Catalog
							</Link>
						</Button>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}