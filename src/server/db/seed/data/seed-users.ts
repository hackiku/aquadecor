// src/server/db/seed/data/seed-users.ts

export const usersSeedData = [
	{
		email: "admin@aquadecor.com",
		name: "Admin User",
		role: "admin",
		phone: "+381 60 123 4567",
		image: null
	},
	{
		email: "brankanemet15@gmail.com",
		name: "Branka Nemet",
		role: "customer",
		phone: "+381 60 987 6543",
		image: null
	},
];

export const addressesSeedData = [
	{
		userEmail: "brankanemet15@gmail.com",
		type: "shipping",
		isDefault: true,
		label: "Home",
		firstName: "Branka",
		lastName: "Nemet",
		streetAddress1: "Example Street 123",
		streetAddress2: "Apt 4B",
		city: "Belgrade",
		state: null,
		postalCode: "11000",
		countryCode: "RS",
		phone: "+381 60 987 6543",
	},
	{
		userEmail: "brankanemet15@gmail.com",
		type: "shipping",
		isDefault: false,
		label: "Office",
		firstName: "Branka",
		lastName: "Nemet",
		company: "AquaDecor LLC",
		streetAddress1: "Business Park 55",
		city: "Novi Sad",
		postalCode: "21000",
		countryCode: "RS",
		phone: "+381 60 987 6543",
	}
];