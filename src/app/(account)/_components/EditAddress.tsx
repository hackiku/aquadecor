// src/app/(account)/_components/EditAddress.tsx

"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { api } from "~/trpc/react";
import { toast } from "sonner";

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

const addressSchema = z.object({
	label: z.string().min(1, "Label is required"),
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
	initialData?: any; // The raw address object from DB
	mode?: "create" | "edit";
}

export function EditAddress({
	open,
	onOpenChange,
	initialData,
	mode = "create"
}: EditAddressProps) {
	const utils = api.useUtils();

	// Fetch countries from your admin router (we'll make it public)
	const { data: countries, isLoading: countriesLoading } = api.publicCountry.getAllForShipping.useQuery() ?? { data: undefined, isLoading: false };

	const form = useForm<AddressFormValues>({
		resolver: zodResolver(addressSchema),
		defaultValues: {
			label: "Home",
			firstName: "",
			lastName: "",
			isDefault: false,
		},
	});

	// Reset/Populate form when opening
	useEffect(() => {
		if (open) {
			if (mode === "edit" && initialData) {
				form.reset({
					label: initialData.label,
					firstName: initialData.firstName,
					lastName: initialData.lastName,
					company: initialData.company || "",
					streetAddress1: initialData.streetAddress1,
					streetAddress2: initialData.streetAddress2 || "",
					city: initialData.city,
					state: initialData.state || "",
					postalCode: initialData.postalCode,
					countryCode: initialData.countryCode,
					phone: initialData.phone || "",
					isDefault: initialData.isDefault,
				});
			} else {
				form.reset({
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
				});
			}
		}
	}, [open, mode, initialData, form]);

	// Mutations
	const createMutation = api.account.address.create.useMutation({
		onSuccess: () => {
			toast.success("Address created");
			utils.account.address.getAll.invalidate();
			onOpenChange(false);
		},
		onError: (err) => toast.error(err.message)
	});

	const updateMutation = api.account.address.update.useMutation({
		onSuccess: () => {
			toast.success("Address updated");
			utils.account.address.getAll.invalidate();
			onOpenChange(false);
		},
		onError: (err) => toast.error(err.message)
	});

	async function onSubmit(data: AddressFormValues) {
		if (mode === "create") {
			createMutation.mutate(data);
		} else {
			if (!initialData?.id) return;
			updateMutation.mutate({ ...data, id: initialData.id });
		}
	}

	const isSubmitting = createMutation.isPending || updateMutation.isPending;

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
											<FormLabel className="cursor-pointer">
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
									<Select onValueChange={field.onChange} value={field.value || ""}>
										<FormControl>
											<SelectTrigger>
												<SelectValue placeholder="Select country" />
											</SelectTrigger>
										</FormControl>
										<SelectContent className="max-h-[300px]">
											{countriesLoading ? (
												<div className="flex items-center justify-center py-4">
													<Loader2 className="h-4 w-4 animate-spin" />
												</div>
											) : countries && countries.length > 0 ? (
												countries.map((country) => (
													<SelectItem key={country.iso2} value={country.iso2}>
														{country.flagEmoji && `${country.flagEmoji} `}
														{country.name}
													</SelectItem>
												))
											) : (
												<div className="py-4 text-center text-sm text-muted-foreground">
													No countries available
												</div>
											)}
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
							<Button type="submit" disabled={isSubmitting} className="rounded-full px-8">
								{isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
								{mode === "create" ? "Save Address" : "Update Address"}
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}