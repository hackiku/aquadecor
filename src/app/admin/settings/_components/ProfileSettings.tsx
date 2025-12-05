// src/app/admin/settings/_components/ProfileSettings.tsx
"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { User, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface ProfileSettingsProps {
	user?: {
		name?: string | null;
		email?: string | null;
		image?: string | null;
	};
}

export function ProfileSettings({ user }: ProfileSettingsProps) {
	const [isLoading, setIsLoading] = useState(false);
	const [formData, setFormData] = useState({
		name: user?.name || "",
		email: user?.email || "",
	});

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);

		// TODO: Wire up to NextAuth profile update
		// Example:
		// await fetch('/api/auth/update-profile', {
		//   method: 'POST',
		//   body: JSON.stringify(formData),
		// });

		setTimeout(() => {
			toast.success("Profile updated successfully");
			setIsLoading(false);
		}, 1000);
	};

	return (
		<Card className="border-2">
			<CardHeader>
				<div className="flex items-center gap-2">
					<User className="h-5 w-5 text-primary" />
					<CardTitle className="font-display font-normal">Profile Information</CardTitle>
				</div>
				<CardDescription className="font-display font-light">
					Update your personal information
				</CardDescription>
			</CardHeader>
			<CardContent>
				<form onSubmit={handleSubmit} className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="name" className="font-display font-normal text-sm">
							Full Name
						</Label>
						<Input
							id="name"
							value={formData.name}
							onChange={(e) => setFormData({ ...formData, name: e.target.value })}
							placeholder="Ivan"
							className="font-display font-light"
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="email" className="font-display font-normal text-sm">
							Email Address
						</Label>
						<Input
							id="email"
							type="email"
							value={formData.email}
							onChange={(e) => setFormData({ ...formData, email: e.target.value })}
							placeholder="ivan@aquadecor.com"
							className="font-display font-light"
							disabled
						/>
						<p className="text-xs text-muted-foreground font-display font-light">
							Email changes require authentication provider verification
						</p>
					</div>

					<Button
						type="submit"
						disabled={isLoading}
						className="w-full rounded-full"
					>
						{isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
						Save Changes
					</Button>
				</form>
			</CardContent>
		</Card>
	);
}