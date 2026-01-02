// src/app/admin/_components/primitives/EditDrawer.tsx

"use client";

import { useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Switch } from "~/components/ui/switch";
import { Textarea } from "~/components/ui/textarea";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
	DialogDescription,
} from "~/components/ui/dialog";
import { Separator } from "~/components/ui/separator";
import { Info } from "lucide-react";

// Define a Union Type to handle both Data fields (with keys) and Layout fields (no keys)
export type DrawerField<T> =
	| {
		// Data Fields
		key: keyof T;
		label: string;
		type?: "text" | "number" | "boolean" | "textarea" | "readonly";
		description?: string;
	}
	| {
		// Layout: Section Header
		key?: never; // Explicitly no key needed
		type: "header";
		label: string;
	}
	| {
		// Layout: Divider
		key?: never;
		type: "divider";
	}
	| {
		// Layout: Info Block
		key?: never;
		type: "info";
		label: string;
		value: string;
	};

interface EditDrawerProps<T> {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	data: T | null;
	title?: string;
	description?: string;
	isLoading?: boolean;
	onSave: (data: T) => void;
	fields: DrawerField<T>[];
}

export function EditDrawer<T>({
	open,
	onOpenChange,
	data,
	title = "Edit Item",
	description = "Make changes to the item properties below.",
	isLoading = false,
	onSave,
	fields
}: EditDrawerProps<T>) {
	const [formData, setFormData] = useState<Partial<T>>({});

	useEffect(() => {
		if (data) {
			setFormData({ ...data });
		}
	}, [data]);

	const handleChange = (key: keyof T, value: any) => {
		setFormData(prev => ({ ...prev, [key]: value }));
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (data && formData) {
			onSave({ ...data, ...formData });
			onOpenChange(false);
		}
	};

	if (!data) return null;

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[500px]">
				<DialogHeader>
					<DialogTitle>{title}</DialogTitle>
					<DialogDescription>{description}</DialogDescription>
				</DialogHeader>

				<form onSubmit={handleSubmit} className="space-y-5 py-4">
					{fields.map((field, index) => {
						// FIX: Use 'field.key' if it exists, otherwise fallback to index.
						// This solves the "duplicate key undefined" error.
						const uniqueKey = (field as any).key ? String((field as any).key) : `layout-${index}`;

						// 1. RENDER LAYOUT ITEMS (No Data Binding)
						if (field.type === "header") {
							return (
								<div key={uniqueKey} className="pt-2">
									<h4 className="text-sm font-medium text-foreground">{field.label}</h4>
								</div>
							);
						}

						if (field.type === "divider") {
							return <Separator key={uniqueKey} className="my-2" />;
						}

						if (field.type === "info") {
							return (
								<div key={uniqueKey} className="bg-muted/50 p-3 rounded-md flex gap-3 text-sm text-muted-foreground border">
									<Info className="w-4 h-4 mt-0.5 shrink-0" />
									<div className="space-y-1">
										<p className="font-medium text-foreground text-xs">{field.label}</p>
										<p className="text-xs leading-relaxed">{field.value}</p>
									</div>
								</div>
							);
						}

						// 2. RENDER DATA ITEMS (Bind to formData)
						// Typescript needs help here to know 'field' is the Data variant
						const dataField = field as Extract<DrawerField<T>, { key: keyof T }>;

						return (
							<div key={uniqueKey} className="space-y-2">
								<div className="flex items-center justify-between">
									<Label htmlFor={String(dataField.key)}>{dataField.label}</Label>
									{dataField.type === "boolean" && (
										<Switch
											id={String(dataField.key)}
											checked={!!formData[dataField.key]}
											onCheckedChange={(checked) => handleChange(dataField.key, checked)}
										/>
									)}
								</div>

								{dataField.description && (
									<p className="text-[10px] text-muted-foreground">{dataField.description}</p>
								)}

								{/* Text Input */}
								{(!dataField.type || dataField.type === "text") && (
									<Input
										id={String(dataField.key)}
										value={String(formData[dataField.key] || "")}
										onChange={(e) => handleChange(dataField.key, e.target.value)}
									/>
								)}

								{/* Number Input */}
								{dataField.type === "number" && (
									<Input
										id={String(dataField.key)}
										type="number"
										value={String(formData[dataField.key] || 0)}
										onChange={(e) => handleChange(dataField.key, parseFloat(e.target.value))}
									/>
								)}

								{/* Textarea */}
								{dataField.type === "textarea" && (
									<Textarea
										id={String(dataField.key)}
										value={String(formData[dataField.key] || "")}
										onChange={(e) => handleChange(dataField.key, e.target.value)}
										rows={3}
									/>
								)}

								{/* Readonly */}
								{dataField.type === "readonly" && (
									<div className="px-3 py-2 bg-muted rounded-md text-sm text-muted-foreground border opacity-80 cursor-not-allowed">
										{String(formData[dataField.key] || "—")}
									</div>
								)}
							</div>
						);
					})}

					<DialogFooter className="pt-2">
						<Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
							Cancel
						</Button>
						<Button type="submit" disabled={isLoading}>
							{isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
							Save Changes
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}

// Helper component for loader just in case
function Loader2({ className }: { className?: string }) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
			className={className}
		>
			<path d="M21 12a9 9 0 1 1-6.219-8.56" />
		</svg>
	)
}