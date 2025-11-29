// src/app/admin/promo/sales/_components/TimeSelector.tsx
"use client";

import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

interface TimeSelectorProps {
	label: string;
	value: string; // ISO datetime-local format
	onChange: (value: string) => void;
	required?: boolean;
	id?: string;
}

export function TimeSelector({ label, value, onChange, required, id }: TimeSelectorProps) {
	// Convert to date if empty, default to UTC midnight today
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		let dateValue = e.target.value;

		// If user only sets date (no time), append midnight UTC
		if (dateValue && dateValue.length === 10) {
			dateValue = `${dateValue}T00:00`;
		}

		onChange(dateValue);
	};

	return (
		<div className="space-y-2">
			<Label htmlFor={id}>{label}</Label>
			<Input
				id={id}
				type="datetime-local"
				value={value}
				onChange={handleChange}
				required={required}
			/>
			<p className="text-xs text-muted-foreground font-display font-light">
				Defaults to midnight UTC if time not specified
			</p>
		</div>
	);
}