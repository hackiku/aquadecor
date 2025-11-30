// src/app/(account)/_components/EditAddress.tsx
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";

import { Button } from "~/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "~/components/ui/dialog";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Checkbox } from "~/components/ui/checkbox";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "~/components/ui/select";

// TODO: Replace with real countries from tRPC
const MOCK_COUNTRIES = [
	{ code: "US", name: "United States" },
	{ code: "DE", name: "Germany" },
	{ code: "RS", name: "Serbia" },
	{ code: "GB", name: "United Kingdom" },
];

const addressSchema = z.object({
	label: z.string().min(1, "Label is required (e.g. Home)"),
	firstName: z.string().min(1, "First name is required"),
	lastName: z.string().min(1, "Last name is required"),
	company: z.string().optional(),
	streetAddress1: z.string().min(5, "Address is required"),
	streetAddress2: z.string().optional(),
	city: z.string().min(1, "City is required"),
	state: z.string().optional(),
	postalCode: z.string().min(1, "Postal code is required"),
	countryCode: z.string().min(2, "Country is required"),
	phone: z.string().optional(),
	isDefault: z.boolean().default(false),
});

type AddressFormValues = z.infer<typeof addressSchema>;

interface EditAddressProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	initialData?: AddressFormValues; // Pass this if editing
	mode?: "create" | "edit";
}

export function EditAddress({
	open,
	onOpenChange,
	initialData,
	mode = "create"
}: EditAddressProps) {
	const [isLoading, setIsLoading] = useState(false);

	const form = useForm<AddressFormValues>({
		resolver: zodResolver(addressSchema),
		defaultValues: initialData || {
			label: "Home",
			firstName: "",
			lastName: "",
			company: "",
			streetAddress1: "",
			streetAddress2: "",
			city: "",
			state: "",
			postalCode: "",
			countryCode: "",
			phone: "",
			isDefault: false,
		},
	});

	async function onSubmit(data: AddressFormValues) {
		setIsLoading(true);
		console.log("Submitting:", data);

		// TODO: Call tRPC mutation here
		// await api.account.address.create.mutate(data);

		setTimeout(() => {
			setIsLoading(false);
			onOpenChange(false);
			form.reset();
		}, 1000);
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle className="font-display font-medium text-2xl">
						{mode === "create" ? "Add New Address" : "Edit Address"}
					</DialogTitle>
					<DialogDescription className="font-display font-light">
						{mode === "create"
							? "Add a new shipping destination to your account."
							: "Update your existing shipping details."}
					</DialogDescription>
				</DialogHeader>

				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-4">

						{/* Label & Default */}
						<div className="flex gap-4 items-end">
							<FormField
								control={form.control}
								name="label"
								render={({ field }) => (
									<FormItem className="flex-1">
										<FormLabel>Label</FormLabel>
										<FormControl>
											<Input placeholder="e.g. Home, Office" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="isDefault"
								render={({ field }) => (
									<FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-3 mb-2">
										<FormControl>
											<Checkbox
												checked={field.value}
												onCheckedChange={field.onChange}
											/>
										</FormControl>
										<div className="space-y-1 leading-none">
											<FormLabel>
												Set as default
											</FormLabel>
										</div>
									</FormItem>
								)}
							/>
						</div>

						{/* Name */}
						<div className="grid grid-cols-2 gap-4">
							<FormField
								control={form.control}
								name="firstName"
								render={({ field }) => (
									<FormItem>
										<FormLabel>First Name</FormLabel>
										<FormControl>
											<Input {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="lastName"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Last Name</FormLabel>
										<FormControl>
											<Input {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						{/* Company & Phone */}
						<div className="grid grid-cols-2 gap-4">
							<FormField
								control={form.control}
								name="company"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Company (Optional)</FormLabel>
										<FormControl>
											<Input {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="phone"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Phone</FormLabel>
										<FormControl>
											<Input type="tel" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						{/* Street */}
						<FormField
							control={form.control}
							name="streetAddress1"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Address</FormLabel>
									<FormControl>
										<Input placeholder="Street address" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="streetAddress2"
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<Input placeholder="Apartment, suite, etc. (optional)" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						{/* City/State/Zip */}
						<div className="grid grid-cols-3 gap-4">
							<FormField
								control={form.control}
								name="city"
								render={({ field }) => (
									<FormItem>
										<FormLabel>City</FormLabel>
										<FormControl>
											<Input {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="state"
								render={({ field }) => (
									<FormItem>
										<FormLabel>State/Province</FormLabel>
										<FormControl>
											<Input {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="postalCode"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Postal Code</FormLabel>
										<FormControl>
											<Input {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						{/* Country */}
						<FormField
							control={form.control}
							name="countryCode"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Country</FormLabel>
									<Select onValueChange={field.onChange} defaultValue={field.value}>
										<FormControl>
											<SelectTrigger>
												<SelectValue placeholder="Select country" />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											{MOCK_COUNTRIES.map((c) => (
												<SelectItem key={c.code} value={c.code}>
													{c.name}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									<FormMessage />
								</FormItem>
							)}
						/>

						<DialogFooter className="pt-4">
							<Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
								Cancel
							</Button>
							<Button type="submit" disabled={isLoading} className="rounded-full px-8">
								{isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
								{mode === "create" ? "Save Address" : "Update Address"}
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}