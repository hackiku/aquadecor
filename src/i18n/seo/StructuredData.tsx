// src/i18n/seo/StructuredData.tsx
'use client';

import { useEffect } from 'react';

interface StructuredDataProps {
	data: Record<string, any>;
}

export function StructuredData({ data }: StructuredDataProps) {
	useEffect(() => {
		// Inject schema into head
		const script = document.createElement('script');
		script.type = 'application/ld+json';
		script.textContent = JSON.stringify(data);
		document.head.appendChild(script);

		return () => {
			document.head.removeChild(script);
		};
	}, [data]);

	return null; // This component doesn't render anything
}