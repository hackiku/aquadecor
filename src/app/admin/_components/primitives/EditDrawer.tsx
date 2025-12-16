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

interface EditDrawerProps<T> {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	data: T | null;
	title?: string;
	onSave: (data: T) => void;
	fields: {
		key: keyof T;
		label: string;
		type?: "text" | "number" | "boolean" | "textarea" | "readonly";
		description?: string;
	}[];
}

export function EditDrawer<T>({
	open,
	onOpenChange,
	data,
	title = "Edit Item",
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
					<DialogDescription>
						Make changes to the item properties below.
					</DialogDescription>
				</DialogHeader>

				<form onSubmit={handleSubmit} className="space-y-6 py-4">
					{fields.map((field) => (
						<div key={String(field.key)} className="space-y-2">
							<div className="flex items-center justify-between">
								<Label htmlFor={String(field.key)}>{field.label}</Label>
								{field.type === "boolean" && (
									<Switch
										id={String(field.key)}
										checked={!!formData[field.key]}
										onCheckedChange={(checked) => handleChange(field.key, checked)}
									/>
								)}
							</div>

							{field.description && (
								<p className="text-[10px] text-muted-foreground">{field.description}</p>
							)}

							{field.type === "text" && (
								<Input
									id={String(field.key)}
									value={String(formData[field.key] || "")}
									onChange={(e) => handleChange(field.key, e.target.value)}
								/>
							)}

							{field.type === "number" && (
								<Input
									id={String(field.key)}
									type="number"
									value={String(formData[field.key] || 0)}
									onChange={(e) => handleChange(field.key, parseFloat(e.target.value))}
								/>
							)}

							{field.type === "textarea" && (
								<Textarea
									id={String(field.key)}
									value={String(formData[field.key] || "")}
									onChange={(e) => handleChange(field.key, e.target.value)}
									rows={3}
								/>
							)}

							{field.type === "readonly" && (
								<div className="px-3 py-2 bg-muted rounded-md text-sm text-muted-foreground border">
									{String(formData[field.key] || "—")}
								</div>
							)}
						</div>
					))}

					<DialogFooter>
						<Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
							Cancel
						</Button>
						<Button type="submit">Save Changes</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}