// src/app/admin/not-found.tsx

import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { FileQuestion, ArrowLeft, Home } from "lucide-react";
import Link from "next/link";

export default function AdminNotFound() {
	return (
		<div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
			<Card className="border-2 max-w-2xl w-full">
				<CardHeader>
					<div className="flex items-center gap-3">
						<FileQuestion className="h-8 w-8 text-muted-foreground" />
						<CardTitle className="font-display font-normal text-2xl">
							Page not found
						</CardTitle>
					</div>
				</CardHeader>
				<CardContent className="space-y-6">
					<div className="space-y-2">
						<p className="font-display font-light text-muted-foreground">
							The page you're looking for doesn't exist or hasn't been built yet.
						</p>
						<p className="font-display font-light text-sm text-muted-foreground">
							Some admin features are still under development. Check back soon!
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
								<ArrowLeft className="mr-2 h-4 w-4" />
								Go to Catalog
							</Link>
						</Button>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}