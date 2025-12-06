// src/components/dev/ViewportSize.tsx

"use client";

import { useEffect, useState } from "react";

export function ViewportSize() {
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    const [showDimensions, setShowDimensions] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const updateSize = () => {
            setDimensions({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        };

        window.addEventListener("resize", updateSize);
        updateSize();

        return () => window.removeEventListener("resize", updateSize);
    }, []);

    if (process.env.NODE_ENV !== "development" || !mounted) return null;

    return (
        <button
            className="fixed bottom-10 right-0 z-9999 rounded-l-lg border-y border-l bg-background/95 px-3 py-2 backdrop-blur supports-[backdrop-filter]:bg-background/60 hover:bg-accent transition-colors shadow-lg"
            onClick={() => setShowDimensions(!showDimensions)}
        >
            <div className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
                {showDimensions ? (
                    <>
                        <span className="tabular-nums">
                            {dimensions.width}x{dimensions.height}
                        </span>
                        <span className="text-border">|</span>
                    </>
                ) : null}

                <span className="inline sm:hidden">xs</span>
                <span className="hidden sm:inline md:hidden">sm</span>
                <span className="hidden md:inline lg:hidden">md</span>
								<span className="hidden lg:inline xl:hidden">lg</span>
								<span className="hidden xl:inline 2xl:hidden">xl</span>
								<span className="hidden 2xl:inline">2xl</span>
            </div>
        </button>
    );
}
