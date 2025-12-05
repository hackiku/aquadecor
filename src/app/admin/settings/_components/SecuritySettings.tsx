// src/app/admin/settings/_components/SecuritySettings.tsx
"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Shield, Loader2, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

export function SecuritySettings() {
	const [isLoading, setIsLoading] = useState(false);
	const [showPasswords, setShowPasswords] = useState({
		current: false,
		new: false,
		confirm: false,
	});
	const [formData, setFormData] = useState({
		currentPassword: "",
		newPassword: "",
		confirmPassword: "",
	});

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (formData.newPassword !== formData.confirmPassword) {
			toast.error("New passwords don't match");
			return;
		}

		if (formData.newPassword.length < 8) {
			toast.error("Password must be at least 8 characters");
			return;
		}

		setIsLoading(true);

		// TODO: Wire up to NextAuth password update
		// Example:
		// await fetch('/api/auth/change-password', {
		//   method: 'POST',
		//   body: JSON.stringify({
		//     currentPassword: formData.currentPassword,
		//     newPassword: formData.newPassword,
		//   }),
		// });

		setTimeout(() => {
			toast.success("Password updated successfully");
			setFormData({ currentPassword: "", newPassword: "", confirmPassword: "" });
			setIsLoading(false);
		}, 1000);
	};

	return (
		<Card className="border-2">
			<CardHeader>
				<div className="flex items-center gap-2">
					<Shield className="h-5 w-5 text-primary" />
					<CardTitle className="font-display font-normal">Security</CardTitle>
				</div>
				<CardDescription className="font-display font-light">
					Change your password and manage security settings
				</CardDescription>
			</CardHeader>
			<CardContent>
				<form onSubmit={handleSubmit} className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="currentPassword" className="font-display font-normal text-sm">
							Current Password
						</Label>
						<div className="relative">
							<Input
								id="currentPassword"
								type={showPasswords.current ? "text" : "password"}
								value={formData.currentPassword}
								onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
								placeholder="••••••••"
								className="font-display font-light pr-10"
							/>
							<Button
								type="button"
								variant="ghost"
								size="sm"
								className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
								onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
							>
								{showPasswords.current ? (
									<EyeOff className="h-4 w-4 text-muted-foreground" />
								) : (
									<Eye className="h-4 w-4 text-muted-foreground" />
								)}
							</Button>
						</div>
					</div>

					<div className="space-y-2">
						<Label htmlFor="newPassword" className="font-display font-normal text-sm">
							New Password
						</Label>
						<div className="relative">
							<Input
								id="newPassword"
								type={showPasswords.new ? "text" : "password"}
								value={formData.newPassword}
								onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
								placeholder="••••••••"
								className="font-display font-light pr-10"
							/>
							<Button
								type="button"
								variant="ghost"
								size="sm"
								className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
								onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
							>
								{showPasswords.new ? (
									<EyeOff className="h-4 w-4 text-muted-foreground" />
								) : (
									<Eye className="h-4 w-4 text-muted-foreground" />
								)}
							</Button>
						</div>
						<p className="text-xs text-muted-foreground font-display font-light">
							Must be at least 8 characters
						</p>
					</div>

					<div className="space-y-2">
						<Label htmlFor="confirmPassword" className="font-display font-normal text-sm">
							Confirm New Password
						</Label>
						<div className="relative">
							<Input
								id="confirmPassword"
								type={showPasswords.confirm ? "text" : "password"}
								value={formData.confirmPassword}
								onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
								placeholder="••••••••"
								className="font-display font-light pr-10"
							/>
							<Button
								type="button"
								variant="ghost"
								size="sm"
								className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
								onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
							>
								{showPasswords.confirm ? (
									<EyeOff className="h-4 w-4 text-muted-foreground" />
								) : (
									<Eye className="h-4 w-4 text-muted-foreground" />
								)}
							</Button>
						</div>
					</div>

					<Button
						type="submit"
						disabled={isLoading}
						className="w-full rounded-full"
					>
						{isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
						Update Password
					</Button>
				</form>
			</CardContent>
		</Card>
	);
}