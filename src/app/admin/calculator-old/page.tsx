// @ts-nocheck
// src/app/admin/calculator-old/page.tsx

"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "~/components/ui/card";
import { BackgroundsManager } from "./_components/BackgroundsManager";
import { AddonsManager } from "./_components/AddonsManager";

export default function CalculatorAdminPage() {
	return (
		<div className="space-y-6 pb-20">
			<div>
				<h1 className="text-4xl font-display font-extralight tracking-tight">Calculator Settings</h1>
				<p className="text-muted-foreground font-display font-light text-lg">
					Configure available options for the public price calculator.
				</p>
			</div>

			<Tabs defaultValue="backgrounds" className="w-full space-y-6">
				<TabsList className="grid w-full grid-cols-2 max-w-[400px]">
					<TabsTrigger value="backgrounds">Background Models</TabsTrigger>
					<TabsTrigger value="addons">Additional Items</TabsTrigger>
				</TabsList>

				<TabsContent value="backgrounds">
					<Card>
						<CardHeader>
							<CardTitle>3D Background Categories</CardTitle>
							<CardDescription>
								Control which model lines appear in Step 1 of the calculator.
							</CardDescription>
						</CardHeader>
						<CardContent>
							<BackgroundsManager />
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value="addons">
					<Card>
						<CardHeader>
							<CardTitle>Checkout Add-ons</CardTitle>
							<CardDescription>
								Manage auxiliary products shown in the calculator flow (e.g. Filters, Tools).
							</CardDescription>
						</CardHeader>
						<CardContent>
							<AddonsManager />
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>
		</div>
	);
}