// src/app/(website)/calculator/_components/shipping/CountrySelect.tsx

"use client";

interface CountrySelectProps {
	selected: string;
	onChange: (country: string) => void;
}

// Popular countries list (can expand this later)
const COUNTRIES = [
	{ code: "US", name: "United States" },
	{ code: "DE", name: "Germany" },
	{ code: "GB", name: "United Kingdom" },
	{ code: "CA", name: "Canada" },
	{ code: "NL", name: "Netherlands" },
	{ code: "AU", name: "Australia" },
	{ code: "FR", name: "France" },
	{ code: "IT", name: "Italy" },
	{ code: "ES", name: "Spain" },
	{ code: "CH", name: "Switzerland" },
	{ code: "AT", name: "Austria" },
	{ code: "BE", name: "Belgium" },
	{ code: "SE", name: "Sweden" },
	{ code: "NO", name: "Norway" },
	{ code: "DK", name: "Denmark" },
	{ code: "PL", name: "Poland" },
	{ code: "CZ", name: "Czech Republic" },
	{ code: "RS", name: "Serbia" },
	{ code: "JP", name: "Japan" },
	{ code: "SG", name: "Singapore" },
	{ code: "NZ", name: "New Zealand" },
	{ code: "OTHER", name: "Other (specify in notes)" },
].sort((a, b) => a.name.localeCompare(b.name));

export function CountrySelect({ selected, onChange }: CountrySelectProps) {
	return (
		<section className="py-12 space-y-6">
			<div className="space-y-3">
				<h2 className="text-2xl md:text-3xl font-display font-light">
					Shipping Country
				</h2>
				<p className="text-muted-foreground font-display font-light text-lg">
					Select your shipping destination. All orders include free worldwide shipping.
				</p>
			</div>

			<div className="max-w-xl space-y-4">
				{/* Dropdown */}
				<div className="relative">
					<select
						value={selected}
						onChange={(e) => onChange(e.target.value)}
						className="block w-full px-4 py-4 text-base rounded-xl border-2 border-border bg-background appearance-none font-display font-light cursor-pointer hover:border-primary/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors"
					>
						<option value="" disabled>
							Select your country
						</option>
						{COUNTRIES.map((country) => (
							<option key={country.code} value={country.code}>
								{country.name}
							</option>
						))}
					</select>

					{/* Chevron icon */}
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="20"
						height="20"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
						className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
					>
						<path d="m6 9 6 6 6-6" />
					</svg>
				</div>

				{/* Shipping info */}
				<div className="p-4 bg-primary/5 rounded-xl border border-primary/20">
					<div className="flex items-start gap-3">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="20"
							height="20"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
							className="text-primary shrink-0 mt-0.5"
						>
							<path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" />
							<path d="M15 18H9" />
							<path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14" />
							<circle cx="17" cy="18" r="2" />
							<circle cx="7" cy="18" r="2" />
						</svg>
						<div className="space-y-1">
							<p className="text-sm font-display font-medium text-primary">
								Free Worldwide Shipping
							</p>
							<p className="text-xs text-muted-foreground font-display font-light">
								10-12 business days production + 5-6 business days delivery
							</p>
						</div>
					</div>
				</div>

				{/* Country not listed notice */}
				{selected === "OTHER" && (
					<div className="p-4 bg-accent/5 rounded-xl border">
						<p className="text-sm text-muted-foreground font-display font-light">
							💡 Don't see your country? No problem! Please specify your location in the notes section when submitting your quote request.
						</p>
					</div>
				)}
			</div>
		</section>
	);
}