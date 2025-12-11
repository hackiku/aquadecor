// @ts-nocheck

// src/app/admin/promo/sales/_components/SaleForm.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "~/components/ui/select";
import { Switch } from "~/components/ui/switch";
import { HexColorPicker } from "react-colorful";
import { api } from "~/trpc/react";
import { SaleBanner } from "~/components/cta/sale/SaleBanner";
import { CountdownBanner } from "~/components/cta/sale/CountdownBanner";
import { FlashSaleBanner } from "~/components/cta/sale/FlashSaleBanner";
import { MinimalBanner } from "~/components/cta/sale/MinimalBanner";
import { TimeSelector } from "./TimeSelector";
import type { Sale } from "~/server/db/schema/sales"; 

type BannerType = "SaleBanner" | "CountdownBanner" | "FlashSaleBanner" | "MinimalBanner";

interface SaleFormProps {
	sale?: Sale;
}

export function SaleForm({ sale }: SaleFormProps) {
	const router = useRouter();
	const isEditMode = !!sale;

	// Form state
	const [name, setName] = useState(sale?.name ?? "");
	const [slug, setSlug] = useState(sale?.slug ?? "");
	const [discountCode, setDiscountCode] = useState(sale?.discountCode ?? "");
	const [discountPercent, setDiscountPercent] = useState(sale?.discountPercent ?? 25);
	const [startsAt, setStartsAt] = useState(
		sale?.startsAt ? new Date(sale.startsAt).toISOString().slice(0, 16) : ""
	);
	const [endsAt, setEndsAt] = useState(
		sale?.endsAt ? new Date(sale.endsAt).toISOString().slice(0, 16) : ""
	);
	const [bannerType, setBannerType] = useState<BannerType>(
		sale?.bannerType ?? "CountdownBanner"
	);

	// Color states - default to simple values, hydrate from CSS after mount
	const [backgroundColor, setBackgroundColor] = useState(
		sale?.bannerConfig?.backgroundColor ?? "#000000"
	);
	const [textColor, setTextColor] = useState(
		sale?.bannerConfig?.textColor ?? "#ffffff"
	);
	const [showBgPicker, setShowBgPicker] = useState(false);
	const [showTextPicker, setShowTextPicker] = useState(false);

	const [customMessage, setCustomMessage] = useState(
		sale?.bannerConfig?.customMessage ?? ""
	);
	const [visibleOn, setVisibleOn] = useState(
		sale?.visibleOn?.join(", ") ?? "/, /shop, /shop/*"
	);
	const [isActive, setIsActive] = useState(sale?.isActive ?? true);

	// Hydrate primary color from CSS after mount (no SSR/CSR mismatch)
	useEffect(() => {
		if (!sale?.bannerConfig?.backgroundColor) {
			const primary = getComputedStyle(document.documentElement)
				.getPropertyValue('--primary')
				.trim();
			if (primary) {
				// Convert hsl to hex if needed, or just use the hsl value
				setBackgroundColor(primary.startsWith('#') ? primary : '#3b82f6'); // fallback blue
			}
		}
	}, [sale]);

	const createSale = api.admin.sale.create.useMutation({
		onSuccess: () => {
			router.push("/admin/promo/sales");
		},
	});

	const updateSale = api.admin.sale.update.useMutation({
		onSuccess: () => {
			router.push("/admin/promo/sales");
		},
	});

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		const data = {
			name,
			slug: slug || name.toLowerCase().replace(/\s+/g, "-"),
			discountCode: discountCode.toUpperCase(),
			discountPercent,
			startsAt: new Date(startsAt),
			endsAt: new Date(endsAt),
			bannerType,
			bannerConfig: {
				backgroundColor,
				textColor,
				customMessage,
				showCountdown: ["CountdownBanner", "FlashSaleBanner"].includes(bannerType),
			},
			visibleOn: visibleOn.split(",").map((p) => p.trim()),
			isActive,
		};

		if (isEditMode) {
			await updateSale.mutateAsync({ id: sale.id, ...data });
		} else {
			await createSale.mutateAsync(data);
		}
	};

	// Preview banner
	const renderBannerPreview = () => {
		const props = {
			name: name || "Sale Name",
			discountCode: discountCode || "CODE25",
			discountPercent: discountPercent || 25,
			backgroundColor,
			textColor,
			customMessage,
		};

		switch (bannerType) {
			case "CountdownBanner":
				return (
					<CountdownBanner
						{...props}
						endsAt={endsAt ? new Date(endsAt) : new Date(Date.now() + 86400000)}
					/>
				);
			case "FlashSaleBanner":
				return (
					<FlashSaleBanner
						{...props}
						endsAt={endsAt ? new Date(endsAt) : new Date(Date.now() + 86400000)}
					/>
				);
			case "MinimalBanner":
				return <MinimalBanner {...props} />;
			case "SaleBanner":
			default:
				return <SaleBanner {...props} />;
		}
	};

	// Quick preset colors
	const presetColors = [
		{ name: "Brand Blue", color: "#3b82f6" },
		{ name: "Black", color: "#000000" },
		{ name: "Red", color: "#ef4444" },
		{ name: "Purple", color: "#8b5cf6" },
	];

	return (
		<form onSubmit={handleSubmit} className="space-y-8">
			{/* Banner Preview */}
			<Card className="border-2">
				<CardHeader>
					<CardTitle className="font-display font-normal">Live Preview</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="border rounded-lg overflow-hidden">
						{renderBannerPreview()}
					</div>
				</CardContent>
			</Card>

			<div className="grid gap-8 lg:grid-cols-2">
				{/* Basic Info */}
				<Card className="border-2">
					<CardHeader>
						<CardTitle className="font-display font-normal">Basic Information</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="name">Campaign Name *</Label>
							<Input
								id="name"
								value={name}
								onChange={(e) => setName(e.target.value)}
								placeholder="Black Friday 2025"
								required
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="slug">Slug</Label>
							<Input
								id="slug"
								value={slug}
								onChange={(e) => setSlug(e.target.value)}
								placeholder="black-friday-2025"
							/>
							<p className="text-xs text-muted-foreground font-display font-light">
								Auto-generated from name if left empty
							</p>
						</div>

						<div className="grid grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label htmlFor="discountCode">Discount Code *</Label>
								<Input
									id="discountCode"
									value={discountCode}
									onChange={(e) => setDiscountCode(e.target.value)}
									placeholder="BLACKFRIDAY25"
									required
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="discountPercent">Discount % *</Label>
								<Input
									id="discountPercent"
									type="number"
									min="0"
									max="100"
									value={discountPercent}
									onChange={(e) => setDiscountPercent(Number(e.target.value))}
									required
								/>
							</div>
						</div>

						<div className="grid grid-cols-2 gap-4">
							<TimeSelector
								id="startsAt"
								label="Starts At *"
								value={startsAt}
								onChange={setStartsAt}
								required
							/>

							<TimeSelector
								id="endsAt"
								label="Ends At *"
								value={endsAt}
								onChange={setEndsAt}
								required
							/>
						</div>

						<div className="flex items-center justify-between">
							<Label htmlFor="isActive">Active</Label>
							<Switch
								id="isActive"
								checked={isActive}
								onCheckedChange={setIsActive}
							/>
						</div>
					</CardContent>
				</Card>

				{/* Banner Configuration */}
				<Card className="border-2">
					<CardHeader>
						<CardTitle className="font-display font-normal">Banner Settings</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="bannerType">Banner Type *</Label>
							<Select value={bannerType} onValueChange={(v) => setBannerType(v as BannerType)}>
								<SelectTrigger>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="CountdownBanner">Countdown Banner</SelectItem>
									<SelectItem value="FlashSaleBanner">Flash Sale Banner</SelectItem>
									<SelectItem value="SaleBanner">Standard Banner</SelectItem>
									<SelectItem value="MinimalBanner">Minimal Banner</SelectItem>
								</SelectContent>
							</Select>
						</div>

						<div className="grid grid-cols-2 gap-4">
							{/* Background Color */}
							<div className="space-y-2">
								<Label>Background Color</Label>

								{/* Preset colors */}
								<div className="flex gap-2 mb-2">
									{presetColors.map((preset) => (
										<button
											key={preset.color}
											type="button"
											onClick={() => setBackgroundColor(preset.color)}
											className="w-8 h-8 rounded border-2 border-border hover:scale-110 transition-transform"
											style={{ backgroundColor: preset.color }}
											title={preset.name}
										/>
									))}
								</div>

								{/* Color picker toggle */}
								<div className="relative">
									<Input
										value={backgroundColor}
										onChange={(e) => setBackgroundColor(e.target.value)}
										onClick={() => setShowBgPicker(!showBgPicker)}
										readOnly
										className="cursor-pointer"
									/>
									{showBgPicker && (
										<div className="absolute z-10 mt-2">
											<div
												className="fixed inset-0"
												onClick={() => setShowBgPicker(false)}
											/>
											<HexColorPicker
												color={backgroundColor}
												onChange={setBackgroundColor}
											/>
										</div>
									)}
								</div>
							</div>

							{/* Text Color */}
							<div className="space-y-2">
								<Label>Text Color</Label>

								{/* Preset colors */}
								<div className="flex gap-2 mb-2">
									<button
										type="button"
										onClick={() => setTextColor("#ffffff")}
										className="w-8 h-8 rounded border-2 border-border hover:scale-110 transition-transform"
										style={{ backgroundColor: "#ffffff" }}
										title="White"
									/>
									<button
										type="button"
										onClick={() => setTextColor("#000000")}
										className="w-8 h-8 rounded border-2 border-border hover:scale-110 transition-transform"
										style={{ backgroundColor: "#000000" }}
										title="Black"
									/>
								</div>

								{/* Color picker toggle */}
								<div className="relative">
									<Input
										value={textColor}
										onChange={(e) => setTextColor(e.target.value)}
										onClick={() => setShowTextPicker(!showTextPicker)}
										readOnly
										className="cursor-pointer"
									/>
									{showTextPicker && (
										<div className="absolute z-10 mt-2">
											<div
												className="fixed inset-0"
												onClick={() => setShowTextPicker(false)}
											/>
											<HexColorPicker
												color={textColor}
												onChange={setTextColor}
											/>
										</div>
									)}
								</div>
							</div>
						</div>

						<div className="space-y-2">
							<Label htmlFor="customMessage">Custom Message</Label>
							<Textarea
								id="customMessage"
								value={customMessage}
								onChange={(e) => setCustomMessage(e.target.value)}
								placeholder="Optional custom message for banner"
								rows={2}
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="visibleOn">Visible On Pages</Label>
							<Input
								id="visibleOn"
								value={visibleOn}
								onChange={(e) => setVisibleOn(e.target.value)}
								placeholder="/, /shop, /shop/*"
							/>
							<p className="text-xs text-muted-foreground font-display font-light">
								Comma-separated list. Use /* for wildcards.
							</p>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Actions */}
			<div className="flex justify-end gap-4">
				<Button
					type="button"
					variant="outline"
					onClick={() => router.push("/admin/promo/sales")}
				>
					Cancel
				</Button>
				<Button type="submit" disabled={createSale.isPending || updateSale.isPending}>
					{isEditMode ? "Update Sale" : "Create Sale"}
				</Button>
			</div>
		</form>
	);
}