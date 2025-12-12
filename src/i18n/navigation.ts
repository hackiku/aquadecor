// src/i18n/navigation.ts
import { createNavigation } from 'next-intl/navigation';
import { routing } from './routing';

// Lightweight wrappers around Next.js' navigation APIs
// that automatically handle locale prefixes and translated pathnames
export const { Link, redirect, usePathname, useRouter, getPathname } =
	createNavigation(routing);