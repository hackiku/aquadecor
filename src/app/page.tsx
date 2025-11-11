// src/app/page.tsx

import Link from "next/link";
import { HydrateClient } from "~/trpc/server";
import { Hero } from "./_components/Hero";
import { ZigZagSection } from "./_components/ZigzagSection";
import { ProductGallery } from "./_components/ProductGallery";
import { Features } from "./_components/Features";
import { CTASection } from "./_components/CTASection";
import { Nav } from "~/components/navigation/Nav";
import { Footer } from "~/components/navigation/Footer";

export default async function Home() {
	return (
		<HydrateClient>
			<Nav />
			<main className="min-h-screen">
				<Hero />
				<ZigZagSection
					title="Only Nature Can Copy Us"
					description="Our aquarium backgrounds are so lifelike that distinguishing between real materials and our products is nearly impossible. Each piece is handcrafted to recreate the natural beauty of underwater environments."
					imageSrc="/images/nature-copy.jpg"
					imageAlt="Realistic 3D aquarium background"
					imageRight={false}
				/>
				<ZigZagSection
					title="20+ Years of Excellence"
					description="Since 2003, we've designed over 1,000 unique models and shipped 50,000+ products worldwide. Our experience and commitment to quality make us the trusted choice for aquarium enthusiasts everywhere."
					imageSrc="/images/excellence.jpg"
					imageAlt="Aquadecor craftsmanship"
					imageRight={true}
				/>
				<ProductGallery />
				<Features />
				<CTASection />
			</main>
			<Footer />
		</HydrateClient>
	);
}