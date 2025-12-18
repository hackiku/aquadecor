// src/app/[locale]/(auth)/forgot-password/page.tsx
"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "~/i18n/navigation";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "~/components/ui/card";
import { Loader2, ArrowLeft, Mail } from "lucide-react";

export default function ForgotPasswordPage() {
	const t = useTranslations("account.forgotPassword");

	const [email, setEmail] = useState("");
	const [loading, setLoading] = useState(false);
	const [sent, setSent] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);

		try {
			// TODO: Implement password reset API call
			// const response = await fetch("/api/auth/forgot-password", {
			// 	method: "POST",
			// 	headers: { "Content-Type": "application/json" },
			// 	body: JSON.stringify({ email }),
			// });

			await new Promise(resolve => setTimeout(resolve, 1000));
			setSent(true);
		} catch (err) {
			console.error(err);
		} finally {
			setLoading(false);
		}
	};

	if (sent) {
		return (
			<Card className="w-full max-w-md">
				<CardHeader className="space-y-1 text-center">
					<div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
						<Mail className="h-6 w-6 text-primary" />
					</div>
					<CardTitle className="text-2xl font-display font-light">
						{t("success.title")}
					</CardTitle>
					<CardDescription className="font-display font-light">
						{t("success.message")} <strong>{email}</strong>
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<p className="text-sm text-muted-foreground text-center font-display">
						{t("success.note")}
					</p>
					<Button
						variant="outline"
						className="w-full h-11 rounded-full font-display"
						onClick={() => setSent(false)}
					>
						{t("success.resend")}
					</Button>
					<div className="text-center">
						<Link
							href="/login"
							className="text-sm text-primary hover:underline font-display inline-flex items-center gap-1"
						>
							<ArrowLeft className="h-4 w-4" />
							{t("backToLogin")}
						</Link>
					</div>
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

					<Button
						type="submit"
						className="w-full h-11 rounded-full font-display font-medium"
						disabled={loading}
					>
						{loading ? (
							<>
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								{t("sending")}
							</>
						) : (
							t("sendLink")
						)}
					</Button>
				</form>

				<div className="text-center">
					<Link
						href="/login"
						className="text-sm text-primary hover:underline font-display inline-flex items-center gap-1"
					>
						<ArrowLeft className="h-4 w-4" />
						{t("backToLogin")}
					</Link>
				</div>
			</CardContent>
		</Card>
	);
}