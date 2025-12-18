// src/app/[locale]/(auth)/login/page.tsx
"use client";

import { signIn } from "next-auth/react";
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "~/components/ui/card";
import { useTranslations } from "next-intl";
import { Link } from "~/i18n/navigation";
import { Loader2 } from "lucide-react";

function LoginForm() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const t = useTranslations("account.login");

	const [email, setEmail] = useState("test@aquadecor.com");
	const [password, setPassword] = useState("password");
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);

		const result = await signIn("credentials", {
			email,
			password,
			redirect: false,
		});

		if (result?.ok) {
			const callbackUrl = searchParams.get("callbackUrl") || "/account";
			router.push(callbackUrl);
		} else {
			alert(t("invalidCredentials"));
			setLoading(false);
		}
	};

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
					<div className="space-y-2">
						<div className="flex items-center justify-between">
							<label className="text-sm font-medium font-display">
								{t("password")}
							</label>
							{/* Cast href to any to bypass strict type checking if route not in registry */}
							<Link
								href={"/forgot-password" as any}
								className="text-xs text-primary hover:underline font-display"
							>
								{t("forgotPassword")}
							</Link>
						</div>
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
					<Button
						type="submit"
						className="w-full h-11 rounded-full font-display font-medium"
						disabled={loading}
					>
						{loading ? (
							<>
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								{t("signingIn")}
							</>
						) : (
							t("signIn")
						)}
					</Button>
				</form>

				{/* Divider */}
				<div className="relative">
					<div className="absolute inset-0 flex items-center">
						<span className="w-full border-t" />
					</div>
					<div className="relative flex justify-center text-xs uppercase">
						<span className="bg-card px-2 text-muted-foreground font-display">
							{t("orContinueWith")}
						</span>
					</div>
				</div>

				{/* OAuth Button */}
				<Button
					type="button"
					variant="outline"
					className="w-full h-11 rounded-full font-display font-medium"
					onClick={() => signIn("google", { callbackUrl: "/account" })}
					disabled={loading}
				>
					<svg className="mr-2 h-4 w-4" viewBox="0 0 48 48">
						<path
							fill="#FFC107"
							d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
						/>
						<path
							fill="#FF3D00"
							d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
						/>
						<path
							fill="#4CAF50"
							d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
						/>
						<path
							fill="#1976D2"
							d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
						/>
					</svg>
					{t("google")}
				</Button>

				{/* Sign Up Link */}
				<div className="text-center text-sm font-display">
					<span className="text-muted-foreground">{t("noAccount")} </span>
					<Link href="/register" className="text-primary hover:underline font-medium">
						{t("signUp")}
					</Link>
				</div>

				{/* Dev Mode Notice */}
				{process.env.NODE_ENV === "development" && (
					<div className="text-center text-xs text-muted-foreground font-display bg-muted/50 p-3 rounded-lg">
						{t("devMode")}
					</div>
				)}
			</CardContent>
		</Card>
	);
}

export default function LoginPage() {
	return (
		<Suspense fallback={
			<Card className="w-full max-w-md">
				<CardContent className="p-12 flex justify-center">
					<Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
				</CardContent>
			</Card>
		}>
			<LoginForm />
		</Suspense>
	);
}