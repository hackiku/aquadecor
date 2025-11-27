// src/components/proof/CompaniesLogos.tsx

import Image from "next/image";

const COMPANIES = [
	{ name: "Fluval", logo: "/logos/companies/logo-fluval.svg" },
	{ name: "Eheim", logo: "/logos/companies/eheim_logo.png" },
	{ name: "Tetra", logo: "/logos/companies/tetra_logo.svg" },
	{ name: "Juwel", logo: "/logos/companies/juwel-logo.svg" },
	{ name: "Aqueon", logo: "/logos/companies/aqueon_logo.png" },
	{ name: "Marineland", logo: "/logos/companies/marineland_logo.png" },
	{ name: "Oase", logo: "/logos/companies/oase_logo.svg" },
	{ name: "Ultum Nature Systems", logo: "/logos/companies/ultum_logo.png" },
];

interface CompaniesLogosProps {
	grayscale?: boolean;
	className?: string;
}

export function CompaniesLogos({ grayscale = false, className = "" }: CompaniesLogosProps) {
	return (
		<div className={`py-12 md:py-16 ${className}`}>
			<div className="text-center mb-8">
				<p className="uppercase tracking-widest text-sm md:text-base text-muted-foreground/60 font-display font-light">
					Compatible with leading aquarium brands
				</p>
			</div>

			<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8 md:gap-12 max-w-5xl mx-auto items-center">
				{COMPANIES.map((company) => (
					<div
						key={company.name}
						className="flex items-center justify-center h-12 md:h-16 relative"
					>
						<Image
							src={company.logo}
							alt={`${company.name} logo`}
							width={120}
							height={60}
							className={`
									object-contain max-h-full w-auto
									${grayscale ? "grayscale brightness-0 dark:brightness-200 opacity-60 hover:opacity-100 hover:grayscale-0 transition-all duration-300" : "opacity-80 hover:opacity-100 transition-opacity"}
								`}
						/>
					</div>
				))}
			</div>
		</div>
	);
}