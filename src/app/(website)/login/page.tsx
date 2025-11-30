// src/app/(website)/login/page.tsx
"use client";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import Link from "next/link";
import { useState } from "react";
import { Sparkles } from "lucide-react";

export default function LoginPage() {
	const [formData, setFormData] = useState({
		email: "",
		password: "",
	});
	const [isLoading, setIsLoading] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		// TODO: Implement actual login
		console.log("Login:", formData);
		setTimeout(() => setIsLoading(false), 2000);
	};

	const handleGoogleLogin = () => {
		// TODO: Implement Google OAuth
		console.log("Google login");
	};

	const handleDevFill = () => {
		setFormData({
			email: "brankanemet15@gmail.com",
			password: "password123",
		});
	};

	return (
		<section className="py-44 lg:py-48 max-w-7xl mx-auto flex flex-col justify-center min-h-[100dvh] px-4">
			<div className="max-w-lg w-full mx-auto flex flex-col justify-center h-full">
				<h1 className="text-2xl lg:text-4xl font-display font-extralight my-8">
					Welcome back
				</h1>

				<form onSubmit={handleSubmit} className="space-y-6">
					<div className="space-y-4">
						{/* Email */}
						<div className="space-y-2">
							<Label htmlFor="email">
								Email<span className="text-red-400">*</span>
							</Label>
							<Input
								id="email"
								type="email"
								placeholder="you@example.com"
								value={formData.email}
								onChange={(e) => setFormData({ ...formData, email: e.target.value })}
								className="rounded-2xl px-3 py-6 text-base"
								required
							/>
						</div>

						{/* Password */}
						<div className="space-y-2">
							<div className="flex justify-between text-base flex-row items-center">
								<Label htmlFor="password">
									Password<span className="text-red-400">*</span>
								</Label>
								<Link
									href="/forgot-password"
									className="text-primary text-sm hover:underline hover:underline-offset-2 font-display font-normal dark:font-light"
								>
									Forgot password?
								</Link>
							</div>
							<Input
								id="password"
								type="password"
								placeholder="••••••••••"
								value={formData.password}
								onChange={(e) => setFormData({ ...formData, password: e.target.value })}
								className="rounded-2xl px-3 py-6 text-base"
								required
							/>
						</div>
					</div>

					<Button
						type="submit"
						className="w-full rounded-full px-9 py-3.5 font-display font-normal"
						disabled={isLoading}
						aria-label="Log in"
					>
						{isLoading ? "Signing in..." : "Log in"}
					</Button>
				</form>

				{/* Divider */}
				<div className="flex items-center gap-x-4 max-w-lg my-4">
					<hr className="w-full h-1" />
					<span className="text-sm text-muted-foreground">or</span>
					<hr className="w-full h-1" />
				</div>

				{/* OAuth */}
				<div className="space-y-4 flex flex-col w-full">
					<Button
						variant="outline"
						className="rounded-full gap-x-2 px-9 py-3.5 font-display font-normal border-stone-400 text-zinc-950 dark:hover:text-zinc-950 dark:text-white bg-transparent hover:bg-stone-100 hover:text-zinc-950"
						onClick={handleGoogleLogin}
					>
						<svg
							stroke="currentColor"
							fill="currentColor"
							strokeWidth="0"
							version="1.1"
							x="0px"
							y="0px"
							viewBox="0 0 48 48"
							enableBackground="new 0 0 48 48"
							height="18"
							width="18"
							xmlns="http://www.w3.org/2000/svg"
						>
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
						Continue with Google
					</Button>
				</div>

				{/* Sign Up Link */}
				<Link
					href="/register"
					className="font-display w-max mx-auto mt-4 text-muted-foreground font-light inline transition-all duration-300 relative after:content-[''] after:absolute after:block after:w-0 after:h-[1px] after:bg-primary after:transition-all after:duration-300 after:ease-in-out hover:after:w-full hover:text-primary"
				>
					Don't have an account?
				</Link>

				{/* Dev Fill Button */}
				{process.env.NODE_ENV === "development" && (
					<button
						type="button"
						onClick={handleDevFill}
						className="absolute bottom-4 right-4 p-2 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors text-primary"
						title="Fill with dev data"
					>
						<Sparkles className="h-4 w-4" />
					</button>
				)}
			</div>
		</section>
	);
}