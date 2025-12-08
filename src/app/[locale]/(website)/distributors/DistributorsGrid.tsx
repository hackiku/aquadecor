// src/app/distributors/DistributorsGrid.tsx

import { MapPin, Phone, Mail, Globe } from "lucide-react";
import Link from "next/link";

interface Distributor {
	name: string;
	location: string;
	phone?: string;
	email: string;
	website?: string;
	address?: string;
}

const DISTRIBUTORS: Distributor[] = [
	{
		name: "BCNaquaris Aquatic Life",
		location: "Barcelona, Spain",
		phone: "+34 123 4567",
		email: "info@bcnaquaris.com",
		website: "www.bcnaquaris.com",
	},
	{
		name: "Tulip Aqua",
		location: "Mumbai, India",
		address: "7/19 BLOSSOM CHS MILITARY ROAD MAROL, Andheri (East) Mumbai 400059",
		phone: "+91 9820072339",
		email: "tulipaqua@yahoo.com",
		website: "https://www.tulipaqua.com/",
	},
	{
		name: "Red Sea Aquariums",
		location: "Jeddah, Saudi Arabia",
		phone: "+966 12 658 8004",
		email: "info@redseaaquariums.com",
		website: "www.redseaaquariums.com",
	},
	{
		name: "Naturalists",
		location: "Manila, Philippines",
		address: "Oranbo Pasig City, Manila",
		phone: "+639175316466",
		email: "sales@naturalistsdesign.com",
		website: "www.naturalistsdesign.com",
	},
	{
		name: "Aqua Design",
		location: "Rishon Lezion, Israel",
		phone: "+972 52 3256567",
		email: "amir.aqua111@gmail.com",
		website: "www.aqua-design.co.il",
	},
	{
		name: "Aqua Wojtal Designers",
		location: "Poznan, Poland",
		phone: "+48 660 436 684",
		email: "biuro@aquawojtal.pl",
		website: "www.aquawojtal.pl",
	},
	{
		name: "Fixexotic",
		location: "Lisbon, Portugal",
		email: "loja@fixexotic.com",
		website: "www.fixexotic.com",
	},
	{
		name: "Pet Only Aquarium",
		location: "Budapest, Hungary",
		phone: "+367 0505 1177",
		email: "info@sugerfan.hu",
	},
];

interface DistributorsGridProps {
	className?: string;
}

export function DistributorsGrid({ className = "" }: DistributorsGridProps) {
	return (
		<div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
			{DISTRIBUTORS.map((distributor) => (
				<div
					key={distributor.name}
					className="group relative bg-card/50 backdrop-blur-sm rounded-2xl p-6 hover:bg-card/80 transition-all duration-300 hover:scale-[1.02]"
				>
					{/* Name */}
					<h3 className="text-xl font-display font-medium mb-4 group-hover:text-primary transition-colors">
						{distributor.name}
					</h3>

					{/* Contact Details */}
					<div className="space-y-3 text-sm font-display font-light">
						{/* Location */}
						<div className="flex items-start gap-2">
							<MapPin className="h-4 w-4 text-primary shrink-0 mt-0.5" />
							<span className="text-muted-foreground">
								{distributor.address || distributor.location}
							</span>
						</div>

						{/* Phone */}
						{distributor.phone && (
							<div className="flex items-center gap-2">
								<Phone className="h-4 w-4 text-primary shrink-0" />
								<a
									href={`tel:${distributor.phone}`}
									className="text-muted-foreground hover:text-primary transition-colors"
								>
									{distributor.phone}
								</a>
							</div>
						)}

						{/* Email */}
						<div className="flex items-center gap-2">
							<Mail className="h-4 w-4 text-primary shrink-0" />
							<a
								href={`mailto:${distributor.email}`}
								className="text-muted-foreground hover:text-primary transition-colors truncate"
							>
								{distributor.email}
							</a>
						</div>

						{/* Website */}
						{distributor.website && (
							<div className="flex items-center gap-2">
								<Globe className="h-4 w-4 text-primary shrink-0" />
								<a
									href={`https://${distributor.website.replace(/^https?:\/\//, '')}`}
									target="_blank"
									rel="noopener noreferrer"
									className="text-muted-foreground hover:text-primary transition-colors truncate"
								>
									{distributor.website.replace(/^https?:\/\//, '')}
								</a>
							</div>
						)}
					</div>
				</div>
			))}
		</div>
	);
}