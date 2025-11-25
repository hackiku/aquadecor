// src/app/admin/promoters/_components/InvitePromoterModal.tsx

"use client";

import { useState } from "react";
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

interface InvitePromoterModalProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function InvitePromoterModal({ open, onOpenChange }: InvitePromoterModalProps) {
	const [email, setEmail] = useState("");
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [birthDate, setBirthDate] = useState("");

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		// TODO: Handle invite submission
		console.log({ email, firstName, lastName, birthDate });
		onOpenChange(false);
		// Reset form
		setEmail("");
		setFirstName("");
		setLastName("");
		setBirthDate("");
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[500px]">
				<DialogHeader>
					<DialogTitle className="font-display font-normal text-2xl">
						Invite new promoter
					</DialogTitle>
					<DialogDescription className="font-display font-light">
						Fill out the promoter information below and invite.
					</DialogDescription>
				</DialogHeader>

				<form onSubmit={handleSubmit} className="space-y-6 pt-4">
					<div className="space-y-2">
						<Label htmlFor="email" className="font-display font-normal">
							Email
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
							Invite will be sent to this email address.
						</p>
					</div>

					<div className="space-y-2">
						<Label htmlFor="firstName" className="font-display font-normal">
							First name
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
							Last name
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

					<div className="space-y-2">
						<Label htmlFor="birthDate" className="font-display font-normal">
							Birth date
						</Label>
						<Input
							id="birthDate"
							type="date"
							value={birthDate}
							onChange={(e) => setBirthDate(e.target.value)}
							className="font-display font-light"
						/>
					</div>

					<div className="flex justify-end gap-3 pt-4">
						<Button
							type="button"
							variant="outline"
							onClick={() => onOpenChange(false)}
							className="rounded-full font-display font-light"
						>
							Cancel
						</Button>
						<Button
							type="submit"
							className="rounded-full font-display font-light"
						>
							Send invite
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
}