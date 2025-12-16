// src/app/[locale]/account/settings/page.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { MobileAccountNav } from "../_components/MobileAccountNav";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	FormDescription,
} from "~/components/ui/form";
import { api } from "~/trpc/react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";

const profileSchema = z.object({
	name: z.string().min(1, "Name is required"),
	phone: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function SettingsPage() {
	const utils = api.useUtils();
	const { data: profile, isLoading } = api.account.getProfile.useQuery();

	const form = useForm<ProfileFormValues>({
		resolver: zodResolver(profileSchema),
		defaultValues: {
			name: "",
			phone: "",
		},
	});

	// Populate form when profile loads
	useEffect(() => {
		if (profile) {
			form.reset({
				name: profile.name || "",
				phone: profile.phone || "",
			});
		}
	}, [profile, form]);

	const updateMutation = api.account.updateProfile.useMutation({
		onSuccess: () => {
			toast.success("Profile updated successfully");
			utils.account.getProfile.invalidate();
		},
		onError: (err) => toast.error(err.message),
	});

	function onSubmit(data: ProfileFormValues) {
		updateMutation.mutate(data);
	}

	if (isLoading) {
		return (
			<div className="flex items-center justify-center py-12">
				<Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
			</div>
		);
	}

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl md:text-3xl font-display font-light">Settings</h1>
					<p className="text-muted-foreground font-display font-light">
						Manage your account settings and preferences
					</p>
				</div>
				<MobileAccountNav />
			</div>

			<div className="max-w-2xl">
				{/* Profile Settings */}
				<Card>
					<CardHeader>
						<CardTitle className="font-display font-medium">Profile Information</CardTitle>
						<CardDescription className="font-display font-light">
							Update your personal information
						</CardDescription>
					</CardHeader>
					<CardContent>
						<Form {...form}>
							<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
								<FormField
									control={form.control}
									name="name"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Full Name</FormLabel>
											<FormControl>
												<Input placeholder="John Doe" {...field} />
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
											<FormLabel>Phone Number</FormLabel>
											<FormControl>
												<Input type="tel" placeholder="+1 234 567 8900" {...field} />
											</FormControl>
											<FormDescription className="font-display font-light text-xs">
												Optional. Used for order updates and support.
											</FormDescription>
											<FormMessage />
										</FormItem>
									)}
								/>

								<div className="pt-4">
									<Button
										type="submit"
										disabled={updateMutation.isPending}
										className="rounded-full"
									>
										{updateMutation.isPending && (
											<Loader2 className="mr-2 h-4 w-4 animate-spin" />
										)}
										Save Changes
									</Button>
								</div>
							</form>
						</Form>
					</CardContent>
				</Card>

				{/* Email - Read Only */}
				<Card className="mt-6">
					<CardHeader>
						<CardTitle className="font-display font-medium">Email Address</CardTitle>
						<CardDescription className="font-display font-light">
							Your email is managed through your authentication provider
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="flex items-center justify-between p-4 border rounded-lg bg-muted/30">
							<div className="font-display font-light">{profile?.email}</div>
							<span className="text-xs text-muted-foreground">Verified</span>
						</div>
					</CardContent>
				</Card>

				{/* Account Actions */}
				<Card className="mt-6">
					<CardHeader>
						<CardTitle className="font-display font-medium text-red-600">
							Danger Zone
						</CardTitle>
						<CardDescription className="font-display font-light">
							Irreversible actions for your account
						</CardDescription>
					</CardHeader>
					<CardContent>
						<Button variant="destructive" className="rounded-full" disabled>
							Delete Account
						</Button>
						<p className="text-xs text-muted-foreground mt-2 font-display font-light">
							Contact support to delete your account
						</p>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}