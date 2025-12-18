// src/app/[locale]/(account)/reset-password/page.tsx
"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Link } from "~/i18n/navigation";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "~/components/ui/card";
import { Loader2, CheckCircle2 } from "lucide-react";

export default function ResetPasswordPage() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const token = searchParams.get("token");
	const t = useTranslations("account");

	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");

		if (password !== confirmPassword) {
			setError("Passwords do not match");
			return;
		}

		if (password.length < 8) {
			setError("Password must be at least 8 characters");
			return;
		}

		if (!token) {
			setError("Invalid or missing reset token");
			return;
		}

		setLoading(true);

		try {
			// TODO: Implement password reset API call
			// const response = await fetch("/api/auth/reset-password", {
			// 	method: "POST",
			// 	headers: { "Content-Type": "application/json" },
			// 	body: JSON.stringify({ token, password }),
			// });

			// For now, just simulate success
			await new Promise(resolve => setTimeout(resolve, 1000));
			setSuccess(true);

			// Redirect to login after 2 seconds
			setTimeout(() => router.push("/login"), 2000);
		} catch (err) {
			setError("Failed to reset password. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	if (success) {
		return (
			<div className="flex min-h-screen items-center justify-center p-4 bg-gradient-to-b from-background to-muted/20">
				<Card className="w-full max-w-md">
					<CardHeader className="space-y-1 text-center">
						<div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
							<CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />
						</div>
						<CardTitle className="text-2xl font-display font-light">
							Password Reset
						</CardTitle>
						<CardDescription className="font-display font-light">
							Your password has been successfully reset
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<p className="text-sm text-muted-foreground text-center font-display">
							Redirecting to login...
						</p>
						<Link href="/login">
							<Button className="w-full h-11 rounded-full font-display font-medium">
								Go to Login
							</Button>
						</Link>
					</CardContent>
				</Card>
			</div>
		);
	}

	return (
		<div className="flex min-h-screen items-center justify-center p-4 bg-gradient-to-b from-background to-muted/20">
			<Card className="w-full max-w-md">
				<CardHeader className="space-y-1">
					<CardTitle className="text-2xl font-display font-light text-center">
						Create New Password
					</CardTitle>
					<CardDescription className="text-center font-display font-light">
						Enter your new password below
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-6">
					<form onSubmit={handleSubmit} className="space-y-4">
						{error && (
							<div className="p-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 rounded-lg">
								{error}
							</div>
						)}

						<div className="space-y-2">
							<label className="text-sm font-medium font-display">
								New Password
							</label>
							<Input
								type="password"
								placeholder="Enter new password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								required
								disabled={loading}
								className="h-11"
							/>
							<p className="text-xs text-muted-foreground font-display">
								Must be at least 8 characters
							</p>
						</div>

						<div className="space-y-2">
							<label className="text-sm font-medium font-display">
								Confirm Password
							</label>
							<Input
								type="password"
								placeholder="Re-enter new password"
								value={confirmPassword}
								onChange={(e) => setConfirmPassword(e.target.value)}
								required
								disabled={loading}
								className="h-11"
							/>
						</div>

						<Button
							type="submit"
							className="w-full h-11 rounded-full font-display font-medium"
							disabled={loading}
						>
							{loading ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									Resetting...
								</>
							) : (
								"Reset Password"
							)}
						</Button>
					</form>

					{/* Back to Login */}
					<div className="text-center text-sm font-display">
						<Link href="/login" className="text-primary hover:underline">
							Back to Login
						</Link>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}