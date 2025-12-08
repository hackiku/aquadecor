// src/app/(website)/calculator/_context/UnitContext.tsx
"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import type { Unit } from "../calculator-types";

interface UnitContextType {
	unit: Unit;
	setUnit: (unit: Unit) => void;
	toggleUnit: () => void;
}

const UnitContext = createContext<UnitContextType | undefined>(undefined);

export function UnitProvider({ children }: { children: ReactNode }) {
	const [unit, setUnit] = useState<Unit>("cm");

	const toggleUnit = () => {
		setUnit(prev => prev === "cm" ? "inch" : "cm");
	};

	return (
		<UnitContext.Provider value={{ unit, setUnit, toggleUnit }}>
			{children}
		</UnitContext.Provider>
	);
}

export function useUnit() {
	const context = useContext(UnitContext);
	if (context === undefined) {
		throw new Error("useUnit must be used within a UnitProvider");
	}
	return context;
}

// Helper hooks for conversions
export function useUnitConverter() {
	const { unit } = useUnit();

	const convert = (cm: number): number => {
		if (unit === "inch") {
			return parseFloat((cm / 2.54).toFixed(1));
		}
		return cm;
	};

	const format = (cm: number): string => {
		const value = convert(cm);
		return unit === "inch" ? `${value}"` : `${value}cm`;
	};

	return { convert, format, unit };
}