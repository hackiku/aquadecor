// src/app/[locale]/(auth)/reset-password/page.tsx
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
	const t = useTranslations("account.resetPassword");

	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");

		if (password !== confirmPassword) {
			setError(t("errors.mismatch"));
			return;
		}

		if (password.length < 8) {
			setError(t("errors.tooShort"));
			return;
		}

		if (!token) {
			setError(t("errors.invalidToken"));
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

			await new Promise(resolve => setTimeout(resolve, 1000));
			setSuccess(true);

			// Redirect to login after 2 seconds
			setTimeout(() => router.push("/login"), 2000);
		} catch (err) {
			setError(t("errors.failed"));
		} finally {
			setLoading(false);
		}
	};

	if (success) {
		return (
			<Card className="w-full max-w-md">
				<CardHeader className="space-y-1 text-center">
					<div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
						<CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />
					</div>
					<CardTitle className="text-2xl font-display font-light">
						{t("success.title")}
					</CardTitle>
					<CardDescription className="font-display font-light">
						{t("success.message")}
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<p className="text-sm text-muted-foreground text-center font-display">
						{t("success.redirecting")}
					</p>
					<Link href="/login">
						<Button className="w-full h-11 rounded-full font-display font-medium">
							{t("success.action")}
						</Button>
					</Link>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card className="w-full max-w-md">
			<CardHeader className="space-y-1">
				<CardTitle className="text-2xl font-display font-light text-center">
					{t("title")}
				</CardTitle>
				<CardDescription className="text-center font-display font-light">
					{t("subtitle")}
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
							{t("password")}
						</label>
						<Input
							type="password"
							placeholder={t("passwordPlaceholder")}
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
							disabled={loading}
							className="h-11"
						/>
						<p className="text-xs text-muted-foreground font-display">
							{t("passwordHelp")}
						</p>
					</div>

					<div className="space-y-2">
						<label className="text-sm font-medium font-display">
							{t("confirmPassword")}
						</label>
						<Input
							type="password"
							placeholder={t("confirmPasswordPlaceholder")}
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
								{t("resetting")}
							</>
						) : (
							t("reset")
						)}
					</Button>
				</form>

				<div className="text-center text-sm font-display">
					<Link href="/login" className="text-primary hover:underline">
						{t("backToLogin")}
					</Link>
				</div>
			</CardContent>
		</Card>
	);
}