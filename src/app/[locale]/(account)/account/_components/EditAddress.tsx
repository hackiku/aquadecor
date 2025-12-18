// src/app/[locale]/account/_components/EditAddress.tsx
// @ts-nocheck
"use client";

import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { api } from "~/trpc/react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

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
	Field,
	FieldGroup,
	FieldLabel,
	FieldError,
} from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import { Checkbox } from "~/components/ui/checkbox";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "~/components/ui/select";

// Validation schema
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
	initialData?: any;
	mode?: "create" | "edit";
}

export function EditAddress({
	open,
	onOpenChange,
	initialData,
	mode = "create"
}: EditAddressProps) {
	const t = useTranslations("account.addresses.form");
	const tToast = useTranslations("account.toast");
	const utils = api.useUtils();

	// Fetch countries
	const { data: countries, isLoading: countriesLoading } = api.publicCountry.getAllForShipping.useQuery();

	const form = useForm<AddressFormValues>({
		resolver: zodResolver(addressSchema),
		defaultValues: {
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

	// Reset/Populate form when opening
	useEffect(() => {
		if (open) {
			if (mode === "edit" && initialData) {
				form.reset({
					label: initialData.label || "",
					firstName: initialData.firstName || "",
					lastName: initialData.lastName || "",
					company: initialData.company || "",
					streetAddress1: initialData.streetAddress1 || "",
					streetAddress2: initialData.streetAddress2 || "",
					city: initialData.city || "",
					state: initialData.state || "",
					postalCode: initialData.postalCode || "",
					countryCode: initialData.countryCode || "",
					phone: initialData.phone || "",
					isDefault: initialData.isDefault || false,
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
			toast.success(tToast("addressCreated"));
			utils.account.address.getAll.invalidate();
			onOpenChange(false);
		},
		onError: (err) => toast.error(err.message)
	});

	const updateMutation = api.account.address.update.useMutation({
		onSuccess: () => {
			toast.success(tToast("addressUpdated"));
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
						{mode === "create" ? t("addTitle") : t("editTitle")}
					</DialogTitle>
					<DialogDescription className="font-display font-light">
						{mode === "create" ? t("addDescription") : t("editDescription")}
					</DialogDescription>
				</DialogHeader>

				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-4">
					<FieldGroup>
						{/* Label & Default */}
						<div className="flex gap-4 items-end">
							<Controller
								name="label"
								control={form.control}
								render={({ field, fieldState }) => (
									<Field data-invalid={fieldState.invalid} className="flex-1">
										<FieldLabel>{t("label")}</FieldLabel>
										<Input {...field} placeholder={t("labelPlaceholder")} />
										{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
									</Field>
								)}
							/>
							<Controller
								name="isDefault"
								control={form.control}
								render={({ field }) => (
									<Field orientation="horizontal" className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-3 mb-2">
										<Checkbox
											checked={field.value}
											onCheckedChange={field.onChange}
										/>
										<FieldLabel className="cursor-pointer">
											{t("isDefault")}
										</FieldLabel>
									</Field>
								)}
							/>
						</div>

						{/* Name */}
						<div className="grid grid-cols-2 gap-4">
							<Controller
								name="firstName"
								control={form.control}
								render={({ field, fieldState }) => (
									<Field data-invalid={fieldState.invalid}>
										<FieldLabel>{t("firstName")}</FieldLabel>
										<Input {...field} />
										{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
									</Field>
								)}
							/>
							<Controller
								name="lastName"
								control={form.control}
								render={({ field, fieldState }) => (
									<Field data-invalid={fieldState.invalid}>
										<FieldLabel>{t("lastName")}</FieldLabel>
										<Input {...field} />
										{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
									</Field>
								)}
							/>
						</div>

						{/* Company & Phone */}
						<div className="grid grid-cols-2 gap-4">
							<Controller
								name="company"
								control={form.control}
								render={({ field, fieldState }) => (
									<Field data-invalid={fieldState.invalid}>
										<FieldLabel>{t("company")}</FieldLabel>
										<Input {...field} />
										{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
									</Field>
								)}
							/>
							<Controller
								name="phone"
								control={form.control}
								render={({ field, fieldState }) => (
									<Field data-invalid={fieldState.invalid}>
										<FieldLabel>{t("phone")}</FieldLabel>
										<Input type="tel" {...field} />
										{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
									</Field>
								)}
							/>
						</div>

						{/* Street */}
						<Controller
							name="streetAddress1"
							control={form.control}
							render={({ field, fieldState }) => (
								<Field data-invalid={fieldState.invalid}>
									<FieldLabel>{t("address")}</FieldLabel>
									<Input {...field} placeholder={t("addressPlaceholder")} />
									{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
								</Field>
							)}
						/>
						<Controller
							name="streetAddress2"
							control={form.control}
							render={({ field, fieldState }) => (
								<Field data-invalid={fieldState.invalid}>
									<Input {...field} placeholder={t("apartment")} />
									{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
								</Field>
							)}
						/>

						{/* City/State/Zip */}
						<div className="grid grid-cols-3 gap-4">
							<Controller
								name="city"
								control={form.control}
								render={({ field, fieldState }) => (
									<Field data-invalid={fieldState.invalid}>
										<FieldLabel>{t("city")}</FieldLabel>
										<Input {...field} />
										{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
									</Field>
								)}
							/>
							<Controller
								name="state"
								control={form.control}
								render={({ field, fieldState }) => (
									<Field data-invalid={fieldState.invalid}>
										<FieldLabel>{t("state")}</FieldLabel>
										<Input {...field} />
										{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
									</Field>
								)}
							/>
							<Controller
								name="postalCode"
								control={form.control}
								render={({ field, fieldState }) => (
									<Field data-invalid={fieldState.invalid}>
										<FieldLabel>{t("postalCode")}</FieldLabel>
										<Input {...field} />
										{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
									</Field>
								)}
							/>
						</div>

						{/* Country */}
						<Controller
							name="countryCode"
							control={form.control}
							render={({ field, fieldState }) => (
								<Field data-invalid={fieldState.invalid}>
									<FieldLabel>{t("country")}</FieldLabel>
									<Select
										value={field.value}
										onValueChange={field.onChange}
									>
										<SelectTrigger aria-invalid={fieldState.invalid}>
											<SelectValue placeholder={t("selectCountry")} />
										</SelectTrigger>
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
													{t("noCountries")}
												</div>
											)}
										</SelectContent>
									</Select>
									{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
								</Field>
							)}
						/>
					</FieldGroup>

					<DialogFooter className="pt-4">
						<Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
							{t("cancel")}
						</Button>
						<Button type="submit" disabled={isSubmitting} className="rounded-full px-8">
							{isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
							{mode === "create" ? t("save") : t("update")}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}