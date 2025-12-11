// src/app/admin/promo/promoters/[email]/_components/PromoterDetailClient.tsx

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "~/trpc/react";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Switch } from "~/components/ui/switch";
import { ArrowLeft, Mail, Pencil, Save, Trash2, Plus } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { Separator } from "~/components/ui/separator";

interface PromoterDetailClientProps {
	promoter: any;
}

const formatPrice = (cents: number) => {
	return `€${(cents / 100).toFixed(2)}`;
};

export function PromoterDetailClient({ promoter: initialPromoter }: PromoterDetailClientProps) {
	const router = useRouter();
	const [promoter, setPromoter] = useState(initialPromoter);
	const [isEditingBasic, setIsEditingBasic] = useState(false);
	const [basicFormData, setBasicFormData] = useState({
		firstName: promoter.firstName,
		lastName: promoter.lastName,
		email: promoter.email,
		isActive: promoter.isActive,
	});

	const [editingCodeId, setEditingCodeId] = useState<string | null>(null);
	const [newCode, setNewCode] = useState({ code: "", discountPercent: 10, commissionPercent: 5 });

	const updatePromoter = api.admin.promoter.update.useMutation({
		onSuccess: (updated) => {
			toast.success("Promoter updated");
			setPromoter(updated);
			setIsEditingBasic(false);
			router.refresh();
		},
		onError: (error) => {
			toast.error(error.message || "Failed to update promoter");
		},
	});

	const deletePromoter = api.admin.promoter.delete.useMutation({
		onSuccess: () => {
			toast.success("Promoter deleted");
			router.push("/admin/promo/promoters");
		},
		onError: (error) => {
			toast.error(error.message || "Failed to delete promoter");
		},
	});

	const addCode = api.admin.promoter.addCode.useMutation({
		onSuccess: (newCode) => {
			toast.success("Code added");
			setPromoter({ ...promoter, codes: [...promoter.codes, newCode] });
			setNewCode({ code: "", discountPercent: 10, commissionPercent: 5 });
			router.refresh();
		},
		onError: (error) => {
			toast.error(error.message || "Failed to add code");
		},
	});

	const updateCode = api.admin.promoter.updateCode.useMutation({
		onSuccess: (updatedCode) => {
			if (!updatedCode) return; // Guard

			toast.success("Code updated");
			setPromoter({
				...promoter,
				codes: promoter.codes.map((c: any) =>
					c.id === updatedCode.id ? updatedCode : c
				),
			});
			setEditingCodeId(null);
			router.refresh();
		},
		onError: (error) => {
			toast.error(error.message || "Failed to update code");
		},
	});

	const deleteCode = api.admin.promoter.deleteCode.useMutation({
		onSuccess: () => {
			toast.success("Code deleted");
			setPromoter({
				...promoter,
				codes: promoter.codes.filter((c: any) => c.id !== editingCodeId),
			});
			setEditingCodeId(null);
			router.refresh();
		},
		onError: (error) => {
			toast.error(error.message || "Failed to delete code");
		},
	});

	const handleSaveBasic = () => {
		updatePromoter.mutate({
			id: promoter.id,
			...basicFormData,
		});
	};

	const handleDelete = () => {
		if (confirm(`Delete promoter "${promoter.firstName} ${promoter.lastName}"? This action cannot be undone.`)) {
			deletePromoter.mutate({ id: promoter.id });
		}
	};

	const handleAddCode = () => {
		addCode.mutate({
			promoterId: promoter.id,
			...newCode,
		});
	};

	const handleUpdateCode = (codeId: string, updatedData: { code?: string; discountPercent?: number; commissionPercent?: number }) => {
		updateCode.mutate({
			id: codeId,
			...updatedData,
		});
	};

	const handleDeleteCode = (codeId: string) => {
		if (confirm("Delete this code?")) {
			setEditingCodeId(codeId);
			deleteCode.mutate({ id: codeId });
		}
	};

	return (
		<div className="space-y-8">
			{/* Header */}
			<div className="space-y-2">
				<Link
					href="/admin/promo/promoters"
					className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 mb-4 w-fit"
				>
					<ArrowLeft className="h-4 w-4" />
					Back to Promoters
				</Link>
				<div className="flex items-center justify-between">
					<h1 className="text-4xl font-display font-extralight tracking-tight">
						{promoter.firstName} {promoter.lastName}
					</h1>
					<div className="flex gap-2">
						<Button variant="outline" className="font-display font-light" onClick={() => setIsEditingBasic(true)}>
							<Pencil className="mr-2 h-4 w-4" /> Edit
						</Button>
						<Button variant="destructive" className="font-display font-light" onClick={handleDelete}>
							<Trash2 className="mr-2 h-4 w-4" /> Delete
						</Button>
					</div>
				</div>
				<p className="text-muted-foreground font-display font-light text-lg flex items-center gap-2">
					<Mail className="h-4 w-4" />
					{promoter.email}
				</p>
			</div>

			<Separator />

			{/* Basic Info Edit Form */}
			{isEditingBasic && (
				<Card className="border-2">
					<CardHeader>
						<CardTitle className="font-display font-normal">Edit Basic Info</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="grid grid-cols-2 gap-4">
							<div>
								<Label htmlFor="firstName">First Name</Label>
								<Input
									id="firstName"
									value={basicFormData.firstName}
									onChange={(e) => setBasicFormData({ ...basicFormData, firstName: e.target.value })}
								/>
							</div>
							<div>
								<Label htmlFor="lastName">Last Name</Label>
								<Input
									id="lastName"
									value={basicFormData.lastName}
									onChange={(e) => setBasicFormData({ ...basicFormData, lastName: e.target.value })}
								/>
							</div>
						</div>
						<div>
							<Label htmlFor="email">Email</Label>
							<Input
								id="email"
								type="email"
								value={basicFormData.email}
								onChange={(e) => setBasicFormData({ ...basicFormData, email: e.target.value })}
							/>
						</div>
						<div className="flex items-center gap-2">
							<Switch
								checked={basicFormData.isActive}
								onCheckedChange={(checked) => setBasicFormData({ ...basicFormData, isActive: checked })}
							/>
							<Label>Active</Label>
						</div>
						<div className="flex justify-end gap-2">
							<Button variant="outline" onClick={() => setIsEditingBasic(false)}>Cancel</Button>
							<Button onClick={handleSaveBasic}><Save className="mr-2 h-4 w-4" /> Save</Button>
						</div>
					</CardContent>
				</Card>
			)}

			{/* Stats Overview */}
			<div className="grid gap-6 md:grid-cols-3">
				<Card className="border-2">
					<CardHeader className="p-4">
						<CardTitle className="font-display font-normal text-sm text-muted-foreground">
							Total Orders
						</CardTitle>
					</CardHeader>
					<CardContent className="p-4 pt-0">
						<p className="text-3xl font-display font-light">{promoter.totalOrders}</p>
					</CardContent>
				</Card>
				<Card className="border-2">
					<CardHeader className="p-4">
						<CardTitle className="font-display font-normal text-sm text-muted-foreground">
							Total Revenue
						</CardTitle>
					</CardHeader>
					<CardContent className="p-4 pt-0">
						<p className="text-3xl font-display font-light">
							{formatPrice(promoter.totalRevenue)}
						</p>
					</CardContent>
				</Card>
				<Card className="border-2">
					<CardHeader className="p-4">
						<CardTitle className="font-display font-normal text-sm text-muted-foreground">
							Total Commission
						</CardTitle>
					</CardHeader>
					<CardContent className="p-4 pt-0">
						<p className="text-3xl font-display font-light text-green-600">
							{formatPrice(promoter.totalCommission)}
						</p>
					</CardContent>
				</Card>
			</div>

			{/* Codes Section */}
			<Card className="border-2">
				<CardHeader>
					<div className="flex items-center justify-between">
						<CardTitle className="font-display font-normal">Discount Codes</CardTitle>
						<Button variant="outline" size="sm" className="rounded-full" onClick={() => setEditingCodeId("new")}>
							<Plus className="mr-2 h-4 w-4" /> Add Code
						</Button>
					</div>
				</CardHeader>
				<CardContent>
					<div className="space-y-4">
						{promoter.codes.length > 0 ? (
							promoter.codes.map((code: any) => (
								<div key={code.id} className="p-3 border rounded-lg bg-muted/50 space-y-2">
									{editingCodeId === code.id ? (
										<div className="space-y-2">
											<Input
												value={code.code}
												onChange={(e) => handleUpdateCode(code.id, { code: e.target.value })}
												placeholder="Code"
											/>
											<div className="grid grid-cols-2 gap-2">
												<Input
													type="number"
													value={code.discountPercent}
													onChange={(e) => handleUpdateCode(code.id, { discountPercent: parseInt(e.target.value) })}
													placeholder="Discount %"
												/>
												<Input
													type="number"
													value={code.commissionPercent}
													onChange={(e) => handleUpdateCode(code.id, { commissionPercent: parseInt(e.target.value) })}
													placeholder="Commission %"
												/>
											</div>
											<div className="flex justify-end gap-2">
												<Button variant="outline" size="sm" onClick={() => setEditingCodeId(null)}>Cancel</Button>
												<Button size="sm" onClick={() => handleUpdateCode(code.id, {})}><Save className="mr-2 h-4 w-4" /> Save</Button>
											</div>
										</div>
									) : (
										<>
											<div className="flex justify-between items-center">
												<Badge className="font-display font-normal text-base">{code.code}</Badge>
												<span className="text-sm font-display font-light text-muted-foreground">Used: {code.usageCount}</span>
											</div>
											<div className="mt-2 text-sm space-y-1">
												<p className="font-display font-light">
													Customer Discount: <span className="font-normal text-primary">{code.discountPercent}%</span>
												</p>
												<p className="font-display font-light">
													Promoter Commission: <span className="font-normal text-green-600">{code.commissionPercent}%</span>
												</p>
											</div>
											<div className="flex justify-end mt-2 gap-2">
												<Button variant="ghost" size="sm" className="font-display font-light" onClick={() => setEditingCodeId(code.id)}>Edit</Button>
												<Button variant="ghost" size="sm" className="font-display font-light text-destructive" onClick={() => handleDeleteCode(code.id)}>Delete</Button>
											</div>
										</>
									)}
								</div>
							))
						) : (
							<p className="text-muted-foreground text-center py-6 font-display font-light">
								No active codes for this promoter.
							</p>
						)}
						{/* New Code Form */}
						{editingCodeId === "new" && (
							<div className="p-3 border rounded-lg bg-muted/50 space-y-2">
								<Input
									placeholder="New Code (e.g., PROMO10)"
									value={newCode.code}
									onChange={(e) => setNewCode({ ...newCode, code: e.target.value })}
								/>
								<div className="grid grid-cols-2 gap-2">
									<Input
										type="number"
										min={0}
										max={100}
										placeholder="Discount %"
										value={newCode.discountPercent}
										onChange={(e) => setNewCode({ ...newCode, discountPercent: parseInt(e.target.value) })}
									/>
									<Input
										type="number"
										min={0}
										max={100}
										placeholder="Commission %"
										value={newCode.commissionPercent}
										onChange={(e) => setNewCode({ ...newCode, commissionPercent: parseInt(e.target.value) })}
									/>
								</div>
								<div className="flex justify-end gap-2">
									<Button variant="outline" size="sm" onClick={() => setEditingCodeId(null)}>Cancel</Button>
									<Button size="sm" onClick={handleAddCode}><Plus className="mr-2 h-4 w-4" /> Add</Button>
								</div>
							</div>
						)}
					</div>
				</CardContent>
			</Card>

			{/* Recent Orders (Read-only for now) */}
			<Card className="border-2">
				<CardHeader>
					<CardTitle className="font-display font-normal">Recent Orders (Last 10)</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="space-y-3">
						{promoter.orders.length > 0 ? (
							promoter.orders.map((order: any) => (
								<div key={order.id} className="flex justify-between items-center text-sm border-b pb-2 last:border-b-0 last:pb-0">
									<Link href={`/admin/orders/${order.id}`} className="hover:underline font-display font-light text-primary">
										Order #{order.orderNumber}
									</Link>
									<div className="text-right font-display font-normal">
										<p>{formatPrice(order.total)}</p>
										<p className="text-xs text-muted-foreground">
											Status: {order.status}
										</p>
									</div>
								</div>
							))
						) : (
							<p className="text-muted-foreground text-center py-6 font-display font-light">
								No recent orders attributed to this promoter.
							</p>
						)}
					</div>
				</CardContent>
			</Card>
		</div>
	);
}