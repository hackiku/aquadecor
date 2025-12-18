// src/app/[locale]/(account)/register/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Link } from "~/i18n/navigation";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "~/components/ui/card";
import { Loader2 } from "lucide-react";

export default function RegisterPage() {
	const router = useRouter();
	const t = useTranslations("account.register");
	const tToast = useTranslations("account.toast");

	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");

		// Basic validation
		if (password !== confirmPassword) {
			setError("Passwords do not match");
			return;
		}

		if (password.length < 8) {
			setError("Password must be at least 8 characters");
			return;
		}

		setLoading(true);

		try {
			// TODO: Implement actual registration API call
			// const response = await fetch("/api/auth/register", {
			// 	method: "POST",
			// 	headers: { "Content-Type": "application/json" },
			// 	body: JSON.stringify({ name, email, password }),
			// });

			// For now, just simulate success
			await new Promise(resolve => setTimeout(resolve, 1000));

			// Redirect to login or auto-signin
			router.push("/login");
		} catch (err) {
			setError("Failed to create account");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="flex min-h-screen items-center justify-center p-4 bg-gradient-to-b from-background to-muted/20">
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
								{t("name")}
							</label>
							<Input
								type="text"
								placeholder={t("namePlaceholder")}
								value={name}
								onChange={(e) => setName(e.target.value)}
								required
								disabled={loading}
								className="h-11"
							/>
						</div>

						<div className="space-y-2">
							<label className="text-sm font-medium font-display">
								{t("email")}
							</label>
							<Input
								type="email"
								placeholder={t("emailPlaceholder")}
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								required
								disabled={loading}
								className="h-11"
							/>
						</div>

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
									{t("creating")}
								</>
							) : (
								t("createAccount")
							)}
						</Button>
					</form>

					{/* Terms */}
					<div className="text-center text-xs text-muted-foreground font-display">
						{t("terms")}{" "}
						<Link href="/terms" className="text-primary hover:underline">
							{t("termsLink")}
						</Link>{" "}
						{t("and")}{" "}
						<Link href="/privacy" className="text-primary hover:underline">
							{t("privacyLink")}
						</Link>
					</div>

					{/* Sign In Link */}
					<div className="text-center text-sm font-display">
						<span className="text-muted-foreground">{t("haveAccount")} </span>
						<Link href="/login" className="text-primary hover:underline font-medium">
							{t("signIn")}
						</Link>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}