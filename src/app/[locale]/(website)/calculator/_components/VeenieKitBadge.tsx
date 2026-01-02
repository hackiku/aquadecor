// src/app/(website)/calculator/_components/VeenieKitBadge.tsx
"use client";

import { Rocket } from "lucide-react";

export function VeenieKitBadge() {
	return (
		<a
			href="https://veenie.space/kit"
			target="_blank"
			rel="dofollow"
			className="inline-flex items-center gap-2 px-2 py-1 bg-linear-to-r from-indigo-500/10 to-purple-500/10 hover:from-indigo-500/20 hover:to-purple-500/20 border border-indigo-500/20 rounded-full text-[0.6em] transition-all group"
		>
			<div className="relative">
				<Rocket className="w-4 h-4 text-indigo-500 group-hover:text-purple-500 transition-colors group-hover:rotate-12 transition-transform" />
				<div className="absolute inset-0 bg-indigo-500/20 blur-md rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
			</div>
			<span className="font-display font-medium">
				3D by{" "}
				<span className="bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent font-semibold">
					Veenie Kit
				</span>
			</span>
		</a>
	);
}