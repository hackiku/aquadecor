// src/app/_components/ZigzagSection.tsx

import Image from "next/image";

interface ZigZagSectionProps {
	title: string;
	description: string;
	imageSrc: string;
	imageAlt: string;
	imageRight?: boolean;
}

export function ZigZagSection({
	title,
	description,
	imageSrc,
	imageAlt,
	imageRight = false,
}: ZigZagSectionProps) {
	return (
		<section className="py-24 md:py-32">
			<div className="container px-4">
				<div
					className={`grid gap-12 lg:grid-cols-2 lg:gap-16 items-center ${imageRight ? "lg:flex-row-reverse" : ""
						}`}
				>
					<div className={`space-y-6 ${imageRight ? "lg:order-2" : ""}`}>
						<h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
							{title}
						</h2>
						<p className="text-lg text-muted-foreground leading-relaxed">
							{description}
						</p>
					</div>

					<div className={`relative ${imageRight ? "lg:order-1" : ""}`}>
						<div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
							<Image
								src={imageSrc}
								alt={imageAlt}
								fill
								className="object-cover"
								sizes="(max-width: 1024px) 100vw, 50vw"
							/>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}