// src/app/admin/catalog/products/[slug]/page.tsx
"use client";

import { Input } from "~/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";

export default function EditProductPage() {
	return (
		<Tabs defaultValue="en">
			<TabsList>
				<TabsTrigger value="en">🇺🇸 English</TabsTrigger>
				<TabsTrigger value="de">🇩🇪 Deutsch</TabsTrigger>
				<TabsTrigger value="nl">🇳🇱 Nederlands</TabsTrigger>
			</TabsList>

			<TabsContent value="en">
				<Input label="Product Name" name="name.en" />
				<Textarea label="Description" name="description.en" />
				<Input label="Meta Title" name="metaTitle.en" />
				<Input label="Image Alt Text" name="imageAlt.en" />
			</TabsContent>

			<TabsContent value="de">
				<Input label="Produktname" name="name.de" />
				{/* Same fields, German UI labels */}
			</TabsContent>

			<TabsContent value="nl">
				<Input label="Productnaam" name="name.nl" />
				{/* Same fields, Dutch UI labels */}
			</TabsContent>
		</Tabs>
	);
}
