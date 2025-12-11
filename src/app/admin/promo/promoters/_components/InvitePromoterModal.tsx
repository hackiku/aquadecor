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
import { Plus, Minus } from "lucide-react";
import { useRouter } from "next/navigation";

interface InvitePromoterModalProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onInviteSuccess: () => void; // For refetching the list
}

interface PromoCodeInput {
	code: string;
	discountPercent: number;
	commissionPercent: number;
}

export function InvitePromoterModal({ open, onOpenChange, onInviteSuccess }: InvitePromoterModalProps) {
	const router = useRouter();
	const [email, setEmail] = useState("");
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [codes, setCodes] = useState<PromoCodeInput[]>([]); // Array for multiple codes

	const createPromoter = api.admin.promoter.create.useMutation({
		onSuccess: (newPromoter) => {
			toast.success("Promoter invited successfully!");
			onOpenChange(false);
			onInviteSuccess(); // Refetch list
			// Redirect to detail page for further editing
			router.push(`/admin/promo/promoters/${encodeURIComponent(newPromoter.email)}`);
			// Reset form
			setEmail("");
			setFirstName("");
			setLastName("");
			setCodes([]);
		},
		onError: (error) => {
			toast.error(error.message || "Failed to invite promoter");
		},
	});

	const handleAddCode = () => {
		setCodes([...codes, { code: "", discountPercent: 10, commissionPercent: 5 }]); // Default values
	};

	const handleRemoveCode = (index: number) => {
		setCodes(codes.filter((_, i) => i !== index));
	};

	const handleCodeChange = (index: number, field: keyof PromoCodeInput, value: string | number) => {
		const newCodes = [...codes];
		newCodes[index][field] = value as never; // Type assertion for simplicity
		setCodes(newCodes);
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		// Validate codes
		const invalidCode = codes.find(c => !c.code || c.discountPercent < 0 || c.discountPercent > 100 || c.commissionPercent < 0 || c.commissionPercent > 100);
		if (invalidCode) {
			toast.error("Please fill out all code fields correctly (percentages 0-100).");
			return;
		}
		createPromoter.mutate({
			email,
			firstName,
			lastName,
			// Pass codes to mutation if needed, but since creation doesn't add codes, we'll add them on detail page
			// For now, creation just makes promoter; codes added later
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
						Fill out the promoter information. You can add initial discount codes here or on the detail page after creation.
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

					{/* Promo Codes Section */}
					<div className="space-y-4">
						<div className="flex items-center justify-between">
							<Label className="font-display font-normal">Initial Promo Codes</Label>
							<Button type="button" variant="outline" size="sm" onClick={handleAddCode} className="rounded-full">
								<Plus className="h-4 w-4 mr-2" /> Add Code
							</Button>
						</div>
						{codes.map((code, index) => (
							<div key={index} className="p-4 border rounded-lg space-y-2">
								<div className="flex justify-between items-center">
									<Label>Code {index + 1}</Label>
									<Button type="button" variant="ghost" size="sm" onClick={() => handleRemoveCode(index)}>
										<Minus className="h-4 w-4" />
									</Button>
								</div>
								<Input
									placeholder="PROMO10"
									value={code.code}
									onChange={(e) => handleCodeChange(index, "code", e.target.value)}
									required
								/>
								<div className="grid grid-cols-2 gap-2">
									<div>
										<Label className="text-xs">Discount %</Label>
										<Input
											type="number"
											min={0}
											max={100}
											value={code.discountPercent}
											onChange={(e) => handleCodeChange(index, "discountPercent", parseInt(e.target.value))}
											required
										/>
									</div>
									<div>
										<Label className="text-xs">Commission %</Label>
										<Input
											type="number"
											min={0}
											max={100}
											value={code.commissionPercent}
											onChange={(e) => handleCodeChange(index, "commissionPercent", parseInt(e.target.value))}
											required
										/>
									</div>
								</div>
							</div>
						))}
						{codes.length === 0 && (
							<p className="text-sm text-muted-foreground">No initial codes added. You can add them later on the detail page.</p>
						)}
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
							disabled={createPromoter.isPending || !email || !firstName || !lastName}
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