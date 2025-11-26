// src/app/admin/promo/promoters/_components/InvitePromoterModal.tsx

"use client";

import { useState } from "react";
import { api } from "~/trpc/react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { toast } from "sonner";

interface InvitePromoterModalProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function InvitePromoterModal({ open, onOpenChange }: InvitePromoterModalProps) {
	const [email, setEmail] = useState("");
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");

	const createPromoter = api.admin.promoter.create.useMutation({
		onSuccess: () => {
			toast.success("Promoter invited successfully!");
			onOpenChange(false);
			// Reset form
			setEmail("");
			setFirstName("");
			setLastName("");
		},
		onError: (error) => {
			toast.error(error.message || "Failed to invite promoter");
		},
	});

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		createPromoter.mutate({
			email,
			firstName,
			lastName,
		});
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[500px]">
				<DialogHeader>
					<DialogTitle className="font-display font-normal text-2xl">
						Invite New Promoter
					</DialogTitle>
					<DialogDescription className="font-display font-light">
						Fill out the promoter information below to send an invitation.
					</DialogDescription>
				</DialogHeader>

				<form onSubmit={handleSubmit} className="space-y-6 pt-4">
					<div className="space-y-2">
						<Label htmlFor="email" className="font-display font-normal">
							Email <span className="text-destructive">*</span>
						</Label>
						<Input
							id="email"
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							placeholder="email@example.com"
							required
							className="font-display font-light"
						/>
						<p className="text-xs text-muted-foreground font-display font-light">
							Invitation will be sent to this email address.
						</p>
					</div>

					<div className="space-y-2">
						<Label htmlFor="firstName" className="font-display font-normal">
							First Name <span className="text-destructive">*</span>
						</Label>
						<Input
							id="firstName"
							value={firstName}
							onChange={(e) => setFirstName(e.target.value)}
							placeholder="John"
							required
							className="font-display font-light"
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="lastName" className="font-display font-normal">
							Last Name <span className="text-destructive">*</span>
						</Label>
						<Input
							id="lastName"
							value={lastName}
							onChange={(e) => setLastName(e.target.value)}
							placeholder="Doe"
							required
							className="font-display font-light"
						/>
					</div>

					<div className="flex justify-end gap-3 pt-4">
						<Button
							type="button"
							variant="outline"
							onClick={() => onOpenChange(false)}
							disabled={createPromoter.isPending}
							className="rounded-full font-display font-light"
						>
							Cancel
						</Button>
						<Button
							type="submit"
							disabled={createPromoter.isPending}
							className="rounded-full font-display font-light"
						>
							{createPromoter.isPending ? "Sending..." : "Send Invite"}
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
}