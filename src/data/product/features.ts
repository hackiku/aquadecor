// src/data/product/features.ts

export interface Feature {
  id: string;
  title: string;
  description: string;
  iconName?: string; // For mapping to Lucide/Heroicons later
}

export interface MaterialSpec {
  property: string;
  value: string;
  testMethod?: string; // How they proved it in the blog
}

export const coreUSPs: Feature[] = [
  {
    id: "durability-1",
    title: "Lifetime Warranty",
    description: "We stand behind our quality with a warranty that covers durability and structural integrity for the life of the product.",
  },
  {
    id: "customization-1",
    title: "Fully Custom Dimensions",
    description: "Every background is built to the exact dimensions of your tank, accounting for bracing systems and internal overflow boxes.",
  },
  {
    id: "modular-1",
    title: "Modular Design",
    description: "Backgrounds are created in numbered sections for seamless assembly and easy installation, even in established tanks with center braces.",
  },
  {
    id: "filtration-1",
    title: "Hidden Equipment",
    description: "Hollow-back designs allow heaters, pipes, and filtration intakes to be completely hidden behind the background without obstructing water flow.",
  },
];

export const chemicalResistanceSpecs: Feature[] = [
  {
    id: "chem-1",
    title: "Hydrochloric Acid Resistant",
    description: "Our materials do not react to HCL, proving there is zero limestone content. This ensures your water pH and hardness (dGH) remain completely unaffected.",
  },
  {
    id: "chem-2",
    title: "Acetone Proof",
    description: "Resistant to harsh solvents like acetone (nail polish remover), ensuring the finish never peels or dissolves during deep cleaning.",
  },
  {
    id: "chem-3",
    title: "Heat & Flame Resistant",
    description: "Withstands open flames and boiling water without reshaping or losing viscosity. Safe to disinfect with boiling water if necessary.",
  },
];

export const structuralSpecs: MaterialSpec[] = [
  {
    property: "Core Material",
    value: "High-density Styrofoam core (Lightweight)",
    testMethod: "Does not displace significant water volume",
  },
  {
    property: "Surface Coating",
    value: "Hardened, non-toxic resin composite",
    testMethod: "Fish cannot pick at or damage the surface",
  },
  {
    property: "Weight Capacity",
    value: "Extremely High Load Bearing",
    testMethod: "Tested by driving a 1500kg car over a slim model without damage",
  },
  {
    property: "Sinking Ability",
    value: "Neutral/Sinking",
    testMethod: "Wood models have rock backings to ensure they stay submerged",
  },
];

export const maintenanceFeatures: Feature[] = [
  {
    id: "maint-1",
    title: "Scrub-Safe Surface",
    description: "The hardened surface allows for vigorous cleaning. Algae can be scrubbed off with plastic brushes without damaging the paint or texture.",
  },
  {
    id: "maint-2",
    title: "Neutral Water Chemistry",
    description: "Guaranteed not to leach chemicals or alter pH levels, making it safe for sensitive species like Discus or wild-caught Cichlids.",
  },
];