// src/components/shop/checkout/CustomInputs.tsx
"use client";

import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Label } from "~/components/ui/label";

type CustomInput = {
	id: string;
	label: string;
	type: 'number' | 'text' | 'textarea';
	required: boolean;
	placeholder?: string;
	validation?: {
		min?: number;
		max?: number;
		maxLength?: number;
	};
};

interface CustomInputsProps {
	inputs: CustomInput[];
	values: Record<string, string>;
	errors: Record<string, string>;
	onChange: (id: string, value: string) => void;
}

export function CustomInputs({ inputs, values, errors, onChange }: CustomInputsProps) {
	if (!inputs || inputs.length === 0) return null;

	return (
		<div className="space-y-3 pb-4 border-b">
			{inputs.map((input) => (
				<div key={input.id} className="space-y-2">
					<Label className="text-sm font-display font-medium">
						{input.label}
						{input.required && <span className="text-destructive ml-1">*</span>}
					</Label>
					{input.type === 'textarea' ? (
						<Textarea
							placeholder={input.placeholder}
							value={values[input.id] || ''}
							onChange={(e) => onChange(input.id, e.target.value)}
							className="font-display font-light"
						/>
					) : (
						<Input
							type={input.type}
							placeholder={input.placeholder}
							value={values[input.id] || ''}
							onChange={(e) => onChange(input.id, e.target.value)}
							className="font-display font-light"
						/>
					)}
					{errors[input.id] && (
						<p className="text-xs text-destructive font-display">
							{errors[input.id]}
						</p>
					)}
					{!errors[input.id] && input.validation && (
						<p className="text-xs text-muted-foreground font-display">
							{input.validation.min !== undefined && input.validation.max !== undefined
								? `Range: ${input.validation.min} - ${input.validation.max}`
								: input.validation.min !== undefined
									? `Minimum: ${input.validation.min}`
									: input.validation.max !== undefined
										? `Maximum: ${input.validation.max}`
										: ''}
						</p>
					)}
				</div>
			))}
		</div>
	);
}