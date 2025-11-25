// src/app/admin/_data/promoters.ts

export interface Promoter {
	id: string;
	firstName: string;
	lastName: string;
	email: string;
	
	// Promo codes
	codes: PromoterCode[];
	
	// Stats
	totalOrders: number;
	totalRevenue: number;  // in cents
	totalCommission: number;  // in cents
	
	// Status
	isActive: boolean;
	
	// Timestamps
	createdAt: Date;
	lastOrderAt?: Date;
}

export interface PromoterCode {
	code: string;
	discountPercent: number;
	commissionPercent: number;
	isActive: boolean;
	usageCount: number;
	createdAt: Date;
}

// Mock data
export const mockPromoters: Promoter[] = [
	{
		id: "1",
		firstName: "Milos",
		lastName: "Spremo",
		email: "milos@example.com",
		codes: [],
		totalOrders: 0,
		totalRevenue: 0,
		totalCommission: 0,
		isActive: true,
		createdAt: new Date("2024-01-15"),
	},
	{
		id: "2",
		firstName: "Nemanja",
		lastName: "Milin",
		email: "nemanja@example.com",
		codes: [
			{
				code: "NEMANJA10",
				discountPercent: 20,
				commissionPercent: 3,
				isActive: true,
				usageCount: 15,
				createdAt: new Date("2024-02-01"),
			},
		],
		totalOrders: 15,
		totalRevenue: 450000,
		totalCommission: 13500,
		isActive: true,
		createdAt: new Date("2024-01-20"),
	},
	{
		id: "3",
		firstName: "Jovan",
		lastName: "Cvetkov",
		email: "jovan@example.com",
		codes: [
			{
				code: "JOVAN20",
				discountPercent: 20,
				commissionPercent: 10,
				isActive: true,
				usageCount: 42,
				createdAt: new Date("2024-03-01"),
			},
		],
		totalOrders: 42,
		totalRevenue: 1240000,
		totalCommission: 124000,
		isActive: true,
		createdAt: new Date("2024-02-10"),
	},
	{
		id: "4",
		firstName: "New",
		lastName: "User",
		email: "newuser@example.com",
		codes: [
			{
				code: "NEWUSER10",
				discountPercent: 10,
				commissionPercent: 5,
				isActive: true,
				usageCount: 8,
				createdAt: new Date("2024-04-01"),
			},
		],
		totalOrders: 8,
		totalRevenue: 180000,
		totalCommission: 9000,
		isActive: true,
		createdAt: new Date("2024-03-15"),
	},
	{
		id: "5",
		firstName: "Branka",
		lastName: "Nemet",
		email: "branka@aquadecor.com",
		codes: [
			{
				code: "SUMMER20",
				discountPercent: 20,
				commissionPercent: 5,
				isActive: true,
				usageCount: 67,
				createdAt: new Date("2024-06-01"),
			},
			{
				code: "NYSALE2025",
				discountPercent: 25,
				commissionPercent: 5,
				isActive: true,
				usageCount: 23,
				createdAt: new Date("2024-12-20"),
			},
		],
		totalOrders: 90,
		totalRevenue: 2850000,
		totalCommission: 142500,
		isActive: true,
		createdAt: new Date("2024-01-01"),
	},
	{
		id: "6",
		firstName: "Joey",
		lastName: "Mullen",
		email: "joey@example.com",
		codes: [
			{
				code: "JOEY15",
				discountPercent: 15,
				commissionPercent: 5,
				isActive: true,
				usageCount: 31,
				createdAt: new Date("2024-05-01"),
			},
		],
		totalOrders: 31,
		totalRevenue: 890000,
		totalCommission: 44500,
		isActive: true,
		createdAt: new Date("2024-04-20"),
	},
	{
		id: "7",
		firstName: "Milos",
		lastName: "Promoter",
		email: "milos.promo@example.com",
		codes: [
			{
				code: "MILOS20",
				discountPercent: 20,
				commissionPercent: 5,
				isActive: true,
				usageCount: 19,
				createdAt: new Date("2024-07-01"),
			},
		],
		totalOrders: 19,
		totalRevenue: 520000,
		totalCommission: 26000,
		isActive: true,
		createdAt: new Date("2024-06-15"),
	},
];