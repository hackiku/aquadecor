// src/app/(website)/calculator/_components/dimensions/UnitToggle.tsx
"use client";

import { useUnit } from "../../_context/UnitContext";

export function UnitToggle() {
	const { unit, setUnit } = useUnit();

	return (
		<div className="inline-flex items-center gap-1 p-1 bg-muted rounded-full border">
			<button
				onClick={() => setUnit("cm")}
				className={`px-4 py-2 rounded-full text-sm font-display font-medium transition-all duration-200 ${unit === "cm"
						? "bg-primary text-white shadow-sm"
						: "text-muted-foreground hover:text-foreground"
					}`}
			>
				cm
			</button>
			<button
				onClick={() => setUnit("inch")}
				className={`px-4 py-2 rounded-full text-sm font-display font-medium transition-all duration-200 ${unit === "inch"
						? "bg-primary text-white shadow-sm"
						: "text-muted-foreground hover:text-foreground"
					}`}
			>
				in
			</button>
		</div>
	);
}