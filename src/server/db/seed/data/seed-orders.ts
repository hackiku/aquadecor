// src/server/db/seed/data/seed-orders.ts

export const ordersSeedData = [
	// ===========================================================================
	// DATA IMPORT: PAGE 1
	// ===========================================================================
	{
		id: "ca885187-0de0-4b90-a304-f8c8b74aa3f3",
		orderNumber: "ORD-2025-1001",
		email: "m.a.chaney@verizon.net",
		firstName: "M.A.",
		lastName: "Chaney",
		status: "abandoned" as const,
		paymentStatus: "pending" as const,
		subtotal: 95850,
		discount: 0,
		shipping: 0,
		total: 95850, // $958.50
		currency: "USD",
		discountCode: "BlackFriday25",
		createdAt: new Date("2025-12-01T05:39:00"),
		items: [
			{
				productId: "prod_amazon_custom",
				productName: "Amazonas Setup (Custom)",
				quantity: 1,
				pricePerUnit: 95850,
				total: 95850,
				customizations: { dimensions: { width: 180, height: 60 }, unit: "cm" }
			}
		]
	},
	{
		id: "3effa02f-4847-4df2-97af-7e5fd26305dc",
		orderNumber: "ORD-2025-1002",
		email: "m.a.chaney@verizon.net",
		firstName: "M.A.",
		lastName: "Chaney",
		status: "abandoned" as const,
		paymentStatus: "pending" as const,
		subtotal: 95850,
		discount: 0,
		shipping: 0,
		total: 95850, // $958.50
		currency: "USD",
		discountCode: "BlackFriday25",
		createdAt: new Date("2025-12-01T05:39:00"),
		items: [
			{
				productId: "prod_amazon_custom",
				productName: "Amazonas Setup (Custom)",
				quantity: 1,
				pricePerUnit: 95850,
				total: 95850,
			}
		]
	},
	{
		id: "5d8beb36-550d-4419-b13c-d519d604b78f",
		orderNumber: "ORD-2025-1003",
		email: "john.lorenz.jl@gmail.com",
		firstName: "John",
		lastName: "Lorenz",
		status: "confirmed" as const, // Paid
		paymentStatus: "paid" as const,
		subtotal: 46800,
		discount: 11700, // 25% off
		shipping: 0,
		total: 35100, // $351.00
		currency: "USD",
		discountCode: "BlackFriday25",
		shippingAddress: {
			firstName: "John",
			lastName: "Lorenz",
			address1: "123 Maple Ave",
			city: "Chicago",
			state: "IL",
			postalCode: "60601",
			country: "USA"
		},
		createdAt: new Date("2025-12-01T00:48:00"),
		confirmedAt: new Date("2025-12-01T00:50:00"),
		items: [
			{
				productId: "prod_rock_module_c",
				productName: "Rock Module C",
				quantity: 3,
				pricePerUnit: 15600,
				total: 46800,
			}
		]
	},
	{
		id: "23d5d20c-59ba-40c1-944d-2fe8c63a6964",
		orderNumber: "ORD-2025-1004",
		email: "chrisglynn@me.com",
		firstName: "Chris",
		lastName: "Glynn",
		status: "abandoned" as const,
		paymentStatus: "pending" as const,
		subtotal: 26709,
		discount: 0,
		shipping: 0,
		total: 26709, // $267.09
		currency: "USD",
		discountCode: "BlackFriday25",
		createdAt: new Date("2025-12-01T00:11:00"),
		items: [
			{
				productId: "prod_thin_background",
				productName: "Thin Rock Background",
				quantity: 1,
				pricePerUnit: 26709,
				total: 26709,
			}
		]
	},
	{
		id: "f809f160-ec55-4c55-a41a-15c84eaa4abe",
		orderNumber: "ORD-2025-1005",
		email: "toby213504@gmail.com",
		firstName: "Toby",
		lastName: "Smith",
		status: "confirmed" as const,
		paymentStatus: "paid" as const,
		subtotal: 77400,
		discount: 19350,
		shipping: 0,
		total: 58050, // $580.50
		currency: "USD",
		discountCode: "BlackFriday25",
		shippingAddress: {
			firstName: "Toby",
			lastName: "Smith",
			address1: "88 Oak Lane",
			city: "Denver",
			state: "CO",
			postalCode: "80202",
			country: "USA"
		},
		createdAt: new Date("2025-11-30T23:55:00"),
		confirmedAt: new Date("2025-11-30T23:58:00"),
		items: [
			{
				productId: "prod_malawi_rock",
				productName: "Malawi Rock Wall",
				quantity: 1,
				pricePerUnit: 77400,
				total: 77400,
			}
		]
	},
	{
		id: "ff27aec5-ffa8-4059-a6a9-b49d71c4590f",
		orderNumber: "ORD-2025-1006",
		email: "ctjarmon@yahoo.com",
		firstName: "C.T.",
		lastName: "Jarmon",
		status: "confirmed" as const,
		paymentStatus: "paid" as const,
		subtotal: 31300,
		discount: 7825,
		shipping: 0,
		total: 23475, // $234.75
		currency: "USD",
		discountCode: "BlackFriday25",
		shippingAddress: {
			firstName: "C.T.",
			lastName: "Jarmon",
			address1: "555 Pine St",
			city: "Seattle",
			state: "WA",
			postalCode: "98101",
			country: "USA"
		},
		createdAt: new Date("2025-11-30T23:22:00"),
		confirmedAt: new Date("2025-11-30T23:25:00"),
		items: [
			{
				productId: "prod_corner_cover",
				productName: "Corner Filter Cover",
				quantity: 1,
				pricePerUnit: 31300,
				total: 31300,
			}
		]
	},
	{
		id: "27c34311-0fbc-4e04-bdcc-0fb26cc17e03",
		orderNumber: "ORD-2025-1007",
		email: "ctjarmon@yahoo.com",
		firstName: "C.T.",
		lastName: "Jarmon",
		status: "abandoned" as const,
		paymentStatus: "pending" as const,
		subtotal: 23475,
		discount: 0,
		shipping: 0,
		total: 23475, // $234.75
		currency: "USD",
		discountCode: "BlackFriday25",
		createdAt: new Date("2025-11-30T23:22:00"),
		items: [
			{
				productId: "prod_corner_cover",
				productName: "Corner Filter Cover",
				quantity: 1,
				pricePerUnit: 23475,
				total: 23475,
			}
		]
	},
	{
		id: "76213cb1-2fac-4a37-bacb-eb87f62d3788",
		orderNumber: "ORD-2025-1008",
		email: "babyphat072@hotmail.com",
		firstName: "Baby",
		lastName: "Phat",
		status: "abandoned" as const,
		paymentStatus: "pending" as const,
		subtotal: 4408,
		discount: 0,
		shipping: 0,
		total: 4408, // $44.08
		currency: "USD",
		createdAt: new Date("2025-11-30T23:21:00"),
		items: [
			{
				productId: "prod_glue_kit",
				productName: "Silicone Glue Kit",
				quantity: 2,
				pricePerUnit: 2204,
				total: 4408,
			}
		]
	},
	{
		id: "c1a5e7b7-c70e-4657-a79c-3a52e78e9f6d",
		orderNumber: "ORD-2025-1009",
		email: "B8rnard@yahoo.co.uk",
		firstName: "Bernard",
		lastName: "Uk",
		status: "confirmed" as const,
		paymentStatus: "paid" as const,
		subtotal: 11020,
		discount: 2755,
		shipping: 0,
		total: 8265, // $82.65
		currency: "USD",
		discountCode: "BlackFriday25",
		shippingAddress: {
			firstName: "Bernard",
			lastName: "Lowe",
			address1: "10 Downing St",
			city: "London",
			postalCode: "SW1A 2AA",
			country: "UK"
		},
		createdAt: new Date("2025-11-30T21:35:00"),
		confirmedAt: new Date("2025-11-30T21:40:00"),
		items: [
			{
				productId: "prod_sample_pack",
				productName: "Background Sample Pack",
				quantity: 1,
				pricePerUnit: 11020,
				total: 11020,
			}
		]
	},
	{
		id: "953d6610-28e8-417c-8116-99ba3157dd6e",
		orderNumber: "ORD-2025-1010",
		email: "jconlon90@yahoo.com",
		firstName: "J.",
		lastName: "Conlon",
		status: "confirmed" as const,
		paymentStatus: "paid" as const,
		subtotal: 40400,
		discount: 10100,
		shipping: 0,
		total: 30300, // $303.00
		currency: "USD",
		discountCode: "BlackFriday25",
		shippingAddress: {
			firstName: "James",
			lastName: "Conlon",
			address1: "45 River Rd",
			city: "Boston",
			state: "MA",
			postalCode: "02110",
			country: "USA"
		},
		createdAt: new Date("2025-11-30T19:30:00"),
		confirmedAt: new Date("2025-11-30T19:35:00"),
		items: [
			{
				productId: "prod_bottom_rock",
				productName: "Bottom Rock Segment",
				quantity: 2,
				pricePerUnit: 20200,
				total: 40400,
			}
		]
	},
	{
		id: "c0f686cc-a9ad-4615-a4e0-3003b083a744",
		orderNumber: "ORD-2025-1011",
		email: "ivan@pipewriter.io",
		firstName: "Ivan",
		lastName: "Dev",
		status: "abandoned" as const,
		paymentStatus: "pending" as const,
		subtotal: 23896,
		discount: 0,
		shipping: 0,
		total: 23896, // $238.96
		currency: "USD",
		createdAt: new Date("2025-11-30T18:26:00"),
		items: [
			{
				productId: "prod_rock_f",
				productName: "Rock Module F",
				quantity: 1,
				pricePerUnit: 23896,
				total: 23896,
			}
		]
	},
	{
		id: "27e822ec-8936-40b2-bf7d-d76fa463457b",
		orderNumber: "ORD-2025-1012",
		email: "matth.vallee@gmail.com",
		firstName: "Matthieu",
		lastName: "Vallee",
		status: "confirmed" as const,
		paymentStatus: "paid" as const,
		subtotal: 26600,
		discount: 6650,
		shipping: 0,
		total: 19950, // €199.50
		currency: "EUR",
		discountCode: "BlackFriday25",
		shippingAddress: {
			firstName: "Matthieu",
			lastName: "Vallee",
			address1: "15 Rue de la Paix",
			city: "Lyon",
			postalCode: "69002",
			country: "France"
		},
		createdAt: new Date("2025-11-30T14:22:00"),
		confirmedAt: new Date("2025-11-30T14:30:00"),
		items: [
			{
				productId: "prod_root_slim",
				productName: "Slim Root Background",
				quantity: 1,
				pricePerUnit: 26600,
				total: 26600,
			}
		]
	},
	{
		id: "9f110586-48f0-42fc-8ffb-89caa4082260",
		orderNumber: "ORD-2025-1013",
		email: "chayi22@yahoo.com",
		firstName: "Chayi",
		lastName: "User",
		status: "abandoned" as const,
		paymentStatus: "pending" as const,
		subtotal: 77400,
		discount: 0,
		shipping: 0,
		total: 77400, // $774.00
		currency: "USD",
		createdAt: new Date("2025-11-30T12:23:00"),
		items: [
			{
				productId: "prod_amazon_wood",
				productName: "Amazon Wood Large",
				quantity: 1,
				pricePerUnit: 77400,
				total: 77400,
			}
		]
	},
	{
		id: "5e84365a-5de6-48bf-bf65-a9488660ef39",
		orderNumber: "ORD-2025-1014",
		email: "Brodie.cann94@gmail.com",
		firstName: "Brodie",
		lastName: "Cann",
		status: "confirmed" as const,
		paymentStatus: "paid" as const,
		subtotal: 79190,
		discount: 19798,
		shipping: 0,
		total: 59392, // $593.92
		currency: "USD",
		discountCode: "BlackFriday25",
		shippingAddress: {
			firstName: "Brodie",
			lastName: "Cann",
			address1: "77 Sunset Blvd",
			city: "Los Angeles",
			state: "CA",
			postalCode: "90046",
			country: "USA"
		},
		createdAt: new Date("2025-11-30T08:51:00"),
		confirmedAt: new Date("2025-11-30T09:00:00"),
		items: [
			{
				productId: "prod_rock_wall_xl",
				productName: "Rock Wall XL",
				quantity: 1,
				pricePerUnit: 79190,
				total: 79190,
			}
		]
	},
	{
		id: "fa26686c-076f-432e-a6e9-f9869909d5df",
		orderNumber: "ORD-2025-1015",
		email: "Yairdhan@gmail.com",
		firstName: "Yair",
		lastName: "Dhan",
		status: "confirmed" as const,
		paymentStatus: "paid" as const,
		subtotal: 66236,
		discount: 16559,
		shipping: 0,
		total: 49677, // $496.77
		currency: "USD",
		discountCode: "BlackFriday25",
		shippingAddress: {
			firstName: "Yair",
			lastName: "Dhan",
			address1: "12 Kibbutz Rd",
			city: "Miami",
			state: "FL",
			postalCode: "33101",
			country: "USA"
		},
		createdAt: new Date("2025-11-30T06:01:00"),
		confirmedAt: new Date("2025-11-30T06:10:00"),
		items: [
			{
				productId: "prod_cichlid_stone",
				productName: "Cichlid Stone Set",
				quantity: 1,
				pricePerUnit: 66236,
				total: 66236,
			}
		]
	},
	{
		id: "c7a99416-fbb5-4d4e-b71c-044e3dedd109",
		orderNumber: "ORD-2025-1016",
		email: "Yairdhan@gmail.com",
		firstName: "Yair",
		lastName: "Dhan",
		status: "abandoned" as const,
		paymentStatus: "pending" as const,
		subtotal: 49677,
		discount: 0,
		shipping: 0,
		total: 49677, // $496.77
		currency: "USD",
		discountCode: "BlackFriday25",
		createdAt: new Date("2025-11-30T05:53:00"),
		items: [
			{
				productId: "prod_cichlid_stone",
				productName: "Cichlid Stone Set",
				quantity: 1,
				pricePerUnit: 49677,
				total: 49677,
			}
		]
	},
	{
		id: "0966f106-8e40-4e79-83d9-9373c6f527f9",
		orderNumber: "ORD-2025-1017",
		email: "schulz.michel1@googlemail.com",
		firstName: "Michel",
		lastName: "Schulz",
		status: "abandoned" as const,
		paymentStatus: "pending" as const,
		subtotal: 76000,
		discount: 0,
		shipping: 0,
		total: 76000, // €760.00
		currency: "EUR",
		createdAt: new Date("2025-11-30T04:16:00"),
		items: [
			{
				productId: "prod_amazon_complete",
				productName: "Amazon Complete Setup",
				quantity: 1,
				pricePerUnit: 76000,
				total: 76000,
			}
		]
	},
	{
		id: "7b739d24-34b7-4aba-9fff-d2a7e7e44f83",
		orderNumber: "ORD-2025-1018",
		email: "schulz.michel1@googlemail.com",
		firstName: "Michel",
		lastName: "Schulz",
		status: "abandoned" as const,
		paymentStatus: "pending" as const,
		subtotal: 38000,
		discount: 0,
		shipping: 0,
		total: 38000, // €380.00
		currency: "EUR",
		createdAt: new Date("2025-11-30T04:09:00"),
		items: [
			{
				productId: "prod_amazon_half",
				productName: "Amazon Half Setup",
				quantity: 1,
				pricePerUnit: 38000,
				total: 38000,
			}
		]
	},
	{
		id: "c09329de-6971-4615-b4f0-84bf5eebd4ca",
		orderNumber: "ORD-2025-1019",
		email: "jeffersdmd@gmail.com",
		firstName: "Jeffers",
		lastName: "DMD",
		status: "confirmed" as const,
		paymentStatus: "paid" as const,
		subtotal: 46900,
		discount: 11725,
		shipping: 0,
		total: 35175, // $351.75
		currency: "USD",
		discountCode: "BlackFriday25",
		shippingAddress: {
			firstName: "Jeffers",
			lastName: "Smith",
			address1: "21 Dental Way",
			city: "Phoenix",
			state: "AZ",
			postalCode: "85001",
			country: "USA"
		},
		createdAt: new Date("2025-11-30T01:35:00"),
		confirmedAt: new Date("2025-11-30T01:40:00"),
		items: [
			{
				productId: "prod_rock_f",
				productName: "Rock Module F",
				quantity: 1,
				pricePerUnit: 46900,
				total: 46900,
			}
		]
	},
	{
		id: "178152fb-af90-4def-af0a-b912dbeb62ab",
		orderNumber: "ORD-2025-1020",
		email: "omslaerbt@gmail.com",
		firstName: "Tom",
		lastName: "Slaer",
		status: "abandoned" as const,
		paymentStatus: "pending" as const,
		subtotal: 61875,
		discount: 0,
		shipping: 0,
		total: 61875, // $618.75
		currency: "USD",
		discountCode: "BlackFriday25",
		createdAt: new Date("2025-11-29T21:46:00"),
		items: [
			{
				productId: "prod_cichlid_cave",
				productName: "Cichlid Caves Mega Pack",
				quantity: 1,
				pricePerUnit: 61875,
				total: 61875,
			}
		]
	},
	{
		id: "a67bf4f2-7e98-4efd-af9b-048b06503bd0",
		orderNumber: "ORD-2025-1021",
		email: "omslaerbt@gmail.com",
		firstName: "Tom",
		lastName: "Slaer",
		status: "abandoned" as const,
		paymentStatus: "pending" as const,
		subtotal: 61875,
		discount: 0,
		shipping: 0,
		total: 61875, // $618.75
		currency: "USD",
		discountCode: "BlackFriday25",
		createdAt: new Date("2025-11-29T21:45:00"),
		items: [
			{
				productId: "prod_cichlid_cave",
				productName: "Cichlid Caves Mega Pack",
				quantity: 1,
				pricePerUnit: 61875,
				total: 61875,
			}
		]
	},
	{
		id: "6c03bafc-e5e1-46a0-ab22-0a148c985d89",
		orderNumber: "ORD-2025-1022",
		email: "omslaerbt@gmail.com",
		firstName: "Tom",
		lastName: "Slaer",
		status: "confirmed" as const,
		paymentStatus: "paid" as const,
		subtotal: 82500,
		discount: 20625,
		shipping: 0,
		total: 61875, // $618.75
		currency: "USD",
		discountCode: "BlackFriday25",
		shippingAddress: {
			firstName: "Tom",
			lastName: "Slaer",
			address1: "99 Ocean Dr",
			city: "San Diego",
			state: "CA",
			postalCode: "92101",
			country: "USA"
		},
		createdAt: new Date("2025-11-29T21:40:00"),
		confirmedAt: new Date("2025-11-29T21:42:00"),
		items: [
			{
				productId: "prod_cichlid_cave",
				productName: "Cichlid Caves Mega Pack",
				quantity: 1,
				pricePerUnit: 82500,
				total: 82500,
			}
		]
	},
	{
		id: "e24f356f-a3f5-404e-ab5d-96c240389818",
		orderNumber: "ORD-2025-1023",
		email: "omslaerbt@gmail.com",
		firstName: "Tom",
		lastName: "Slaer",
		status: "abandoned" as const,
		paymentStatus: "pending" as const,
		subtotal: 61875,
		discount: 0,
		shipping: 0,
		total: 61875, // $618.75
		currency: "USD",
		discountCode: "BlackFriday25",
		createdAt: new Date("2025-11-29T21:40:00"),
		items: [
			{
				productId: "prod_cichlid_cave",
				productName: "Cichlid Caves Mega Pack",
				quantity: 1,
				pricePerUnit: 61875,
				total: 61875,
			}
		]
	},
	{
		id: "8f096701-170c-443e-b661-ab10509b0786",
		orderNumber: "ORD-2025-1024",
		email: "jbramos80@gmail.com",
		firstName: "J.B.",
		lastName: "Ramos",
		status: "abandoned" as const,
		paymentStatus: "pending" as const,
		subtotal: 122900,
		discount: 0,
		shipping: 0,
		total: 122900, // $1,229.00
		currency: "USD",
		createdAt: new Date("2025-11-29T20:57:00"),
		items: [
			{
				productId: "prod_custom_huge",
				productName: "Massive Custom Rock",
				quantity: 1,
				pricePerUnit: 122900,
				total: 122900,
				customizations: { dimensions: { width: 250, height: 80 }, unit: "cm" }
			}
		]
	},
	// ===========================================================================
	// DATA IMPORT: PAGE 2
	// ===========================================================================
	{
		id: "b714d17b-4d6c-4738-b0a9-a7726b223fac",
		orderNumber: "ORD-2025-1025",
		email: "leeblockum@yahoo.com",
		firstName: "Lee",
		lastName: "Blockum",
		status: "confirmed" as const,
		paymentStatus: "paid" as const,
		subtotal: 82500,
		discount: 20625,
		shipping: 0,
		total: 61875, // $618.75
		currency: "USD",
		discountCode: "BlackFriday25",
		shippingAddress: {
			firstName: "Lee",
			lastName: "Blockum",
			address1: "442 Blockum Blvd",
			city: "Atlanta",
			state: "GA",
			postalCode: "30303",
			country: "USA"
		},
		createdAt: new Date("2025-11-29T18:38:00"),
		confirmedAt: new Date("2025-11-29T18:45:00"),
		items: [
			{
				productId: "prod_cichlid_cave",
				productName: "Cichlid Caves Mega Pack",
				quantity: 1,
				pricePerUnit: 82500,
				total: 82500,
			}
		]
	},
	{
		id: "58d89b30-e3dd-4adf-bcd5-e0fb6e038442",
		orderNumber: "ORD-2025-1026",
		email: "schuetze1262@web.de",
		firstName: "Hans",
		lastName: "Schuetze",
		status: "confirmed" as const,
		paymentStatus: "paid" as const,
		subtotal: 30900,
		discount: 7725,
		shipping: 0,
		total: 23175, // €231.75
		currency: "EUR",
		discountCode: "BlackFriday25",
		shippingAddress: {
			firstName: "Hans",
			lastName: "Schuetze",
			address1: "Berliner Str. 10",
			city: "Berlin",
			postalCode: "10115",
			country: "Germany"
		},
		createdAt: new Date("2025-11-29T16:23:00"),
		confirmedAt: new Date("2025-11-29T16:30:00"),
		items: [
			{
				productId: "prod_root_a",
				productName: "Root Model A",
				quantity: 1,
				pricePerUnit: 30900,
				total: 30900,
			}
		]
	},
	{
		id: "38f28bc2-b59a-4e6a-96cd-f1d22c909ab1",
		orderNumber: "ORD-2025-1027",
		email: "timothydiderich1@gmail.com",
		firstName: "Timothy",
		lastName: "Diderich",
		status: "confirmed" as const,
		paymentStatus: "paid" as const,
		subtotal: 50692,
		discount: 12673,
		shipping: 0,
		total: 38019, // $380.19
		currency: "USD",
		discountCode: "BlackFriday25",
		shippingAddress: {
			firstName: "Timothy",
			lastName: "Diderich",
			address1: "500 Lakeview Dr",
			city: "Detroit",
			state: "MI",
			postalCode: "48201",
			country: "USA"
		},
		createdAt: new Date("2025-11-29T15:17:00"),
		confirmedAt: new Date("2025-11-29T15:20:00"),
		items: [
			{
				productId: "prod_rock_module_e",
				productName: "Rock Module E",
				quantity: 2,
				pricePerUnit: 25346,
				total: 50692,
			}
		]
	},
	{
		id: "e8875761-1a78-4688-a9b0-0560f15be3b2",
		orderNumber: "ORD-2025-1028",
		email: "Yairdhan@gmail.com",
		firstName: "Yair",
		lastName: "Dhan",
		status: "abandoned" as const,
		paymentStatus: "pending" as const,
		subtotal: 49677,
		discount: 0,
		shipping: 0,
		total: 49677, // $496.77
		currency: "USD",
		discountCode: "BlackFriday25",
		createdAt: new Date("2025-11-29T09:58:00"),
		items: [
			{
				productId: "prod_cichlid_stone",
				productName: "Cichlid Stone Set",
				quantity: 1,
				pricePerUnit: 49677,
				total: 49677,
			}
		]
	},
	{
		id: "08e12305-98c7-478b-9c5b-1e2a8929fe07",
		orderNumber: "ORD-2025-1029",
		email: "Alexismoreno1997.am@gmail.com",
		firstName: "Alexis",
		lastName: "Moreno",
		status: "confirmed" as const,
		paymentStatus: "paid" as const,
		subtotal: 40600,
		discount: 10150,
		shipping: 0,
		total: 30450, // $304.50
		currency: "USD",
		discountCode: "BlackFriday25",
		shippingAddress: {
			firstName: "Alexis",
			lastName: "Moreno",
			address1: "777 Vegas Blvd",
			city: "Las Vegas",
			state: "NV",
			postalCode: "89109",
			country: "USA"
		},
		createdAt: new Date("2025-11-29T02:22:00"),
		confirmedAt: new Date("2025-11-29T02:25:00"),
		items: [
			{
				productId: "prod_rock_f",
				productName: "Rock Module F (Small)",
				quantity: 2,
				pricePerUnit: 20300,
				total: 40600,
			}
		]
	},
	{
		id: "07408efe-ab36-4f69-99cd-a2d19f6124df",
		orderNumber: "ORD-2025-1030",
		email: "kjackson719@yahoo.com",
		firstName: "K.",
		lastName: "Jackson",
		status: "confirmed" as const,
		paymentStatus: "paid" as const,
		subtotal: 46800,
		discount: 11700,
		shipping: 0,
		total: 35100, // $351.00
		currency: "USD",
		discountCode: "BlackFriday25",
		shippingAddress: {
			firstName: "K.",
			lastName: "Jackson",
			address1: "19 Jackson St",
			city: "Houston",
			state: "TX",
			postalCode: "77001",
			country: "USA"
		},
		createdAt: new Date("2025-11-29T01:28:00"),
		confirmedAt: new Date("2025-11-29T01:30:00"),
		items: [
			{
				productId: "prod_rock_module_c",
				productName: "Rock Module C",
				quantity: 3,
				pricePerUnit: 15600,
				total: 46800,
			}
		]
	},
	{
		id: "119e2ee6-48e3-435c-8908-d9d537ecd445",
		orderNumber: "ORD-2025-1031",
		email: "kjackson719@yahoo.com",
		firstName: "K.",
		lastName: "Jackson",
		status: "abandoned" as const,
		paymentStatus: "pending" as const,
		subtotal: 35100,
		discount: 0,
		shipping: 0,
		total: 35100, // $351.00
		currency: "USD",
		discountCode: "BlackFriday25",
		createdAt: new Date("2025-11-29T01:28:00"),
		items: [
			{
				productId: "prod_rock_module_c",
				productName: "Rock Module C",
				quantity: 1,
				pricePerUnit: 35100,
				total: 35100,
			}
		]
	},
	{
		id: "98edf3af-093f-49f5-92b0-a00663f323b9",
		orderNumber: "ORD-2025-1032",
		email: "weaver86@gmail.com",
		firstName: "W.",
		lastName: "Weaver",
		status: "confirmed" as const,
		paymentStatus: "paid" as const,
		subtotal: 55900,
		discount: 13975,
		shipping: 0,
		total: 41925, // $419.25
		currency: "USD",
		discountCode: "BlackFriday25",
		shippingAddress: {
			firstName: "William",
			lastName: "Weaver",
			address1: "404 Web Dev Ln",
			city: "San Francisco",
			state: "CA",
			postalCode: "94103",
			country: "USA"
		},
		createdAt: new Date("2025-11-29T01:04:00"),
		confirmedAt: new Date("2025-11-29T01:10:00"),
		items: [
			{
				productId: "prod_massive_rock",
				productName: "Massive Rock Background",
				quantity: 1,
				pricePerUnit: 55900,
				total: 55900,
			}
		]
	},
	{
		id: "51625705-c510-4a77-8e27-fd9829609ccf",
		orderNumber: "ORD-2025-1033",
		email: "Alexismoreno1997.am@gmail.com",
		firstName: "Alexis",
		lastName: "Moreno",
		status: "confirmed" as const,
		paymentStatus: "paid" as const,
		subtotal: 40600,
		discount: 10150,
		shipping: 0,
		total: 30450, // $304.50
		currency: "USD",
		discountCode: "BlackFriday25",
		shippingAddress: {
			firstName: "Alexis",
			lastName: "Moreno",
			address1: "777 Vegas Blvd",
			city: "Las Vegas",
			state: "NV",
			postalCode: "89109",
			country: "USA"
		},
		createdAt: new Date("2025-11-29T00:45:00"),
		confirmedAt: new Date("2025-11-29T00:50:00"),
		items: [
			{
				productId: "prod_rock_f",
				productName: "Rock Module F (Small)",
				quantity: 2,
				pricePerUnit: 20300,
				total: 40600,
			}
		]
	},
	{
		id: "ee9c0262-193c-462e-ad7a-bdef6f34ef4e",
		orderNumber: "ORD-2025-1034",
		email: "Alexismoreno1997.am@gmail.com",
		firstName: "Alexis",
		lastName: "Moreno",
		status: "abandoned" as const,
		paymentStatus: "pending" as const,
		subtotal: 60900,
		discount: 0,
		shipping: 0,
		total: 60900, // $609.00
		currency: "USD",
		discountCode: "BlackFriday25",
		createdAt: new Date("2025-11-29T00:42:00"),
		items: [
			{
				productId: "prod_rock_f_med",
				productName: "Rock Module F (Medium)",
				quantity: 3,
				pricePerUnit: 20300,
				total: 60900,
			}
		]
	},
	{
		id: "6a644e47-37f6-435c-9000-f92aefbad97b",
		orderNumber: "ORD-2025-1035",
		email: "cza4mallard@yahoo.com",
		firstName: "Cza",
		lastName: "Mallard",
		status: "confirmed" as const,
		paymentStatus: "paid" as const,
		subtotal: 46900,
		discount: 11725,
		shipping: 0,
		total: 35175, // $351.75
		currency: "USD",
		discountCode: "BlackFriday25",
		shippingAddress: {
			firstName: "Cza",
			lastName: "Mallard",
			address1: "12 Duck Pond Rd",
			city: "Portland",
			state: "OR",
			postalCode: "97201",
			country: "USA"
		},
		createdAt: new Date("2025-11-29T00:37:00"),
		confirmedAt: new Date("2025-11-29T00:40:00"),
		items: [
			{
				productId: "prod_rock_f",
				productName: "Rock Module F",
				quantity: 1,
				pricePerUnit: 46900,
				total: 46900,
			}
		]
	},
	{
		id: "59379bff-0cb4-400b-a64c-e5f63662f328",
		orderNumber: "ORD-2025-1036",
		email: "cza4mallard@yahoo.com",
		firstName: "Cza",
		lastName: "Mallard",
		status: "abandoned" as const,
		paymentStatus: "pending" as const,
		subtotal: 35175,
		discount: 0,
		shipping: 0,
		total: 35175, // $351.75
		currency: "USD",
		discountCode: "BlackFriday25",
		createdAt: new Date("2025-11-29T00:37:00"),
		items: [
			{
				productId: "prod_rock_f",
				productName: "Rock Module F",
				quantity: 1,
				pricePerUnit: 35175,
				total: 35175,
			}
		]
	},
	{
		id: "6cd491ce-c774-4b4c-8e15-2dd7c7fd36ff",
		orderNumber: "ORD-2025-1037",
		email: "Ramrezadm13@gmail.com",
		firstName: "Ramirez",
		lastName: "Admin",
		status: "confirmed" as const,
		paymentStatus: "paid" as const,
		subtotal: 46900,
		discount: 11725,
		shipping: 0,
		total: 35175, // $351.75
		currency: "USD",
		discountCode: "BlackFriday25",
		shippingAddress: {
			firstName: "Ramirez",
			lastName: "Admin",
			address1: "1313 Mockingbird Ln",
			city: "Dallas",
			state: "TX",
			postalCode: "75201",
			country: "USA"
		},
		createdAt: new Date("2025-11-28T23:32:00"),
		confirmedAt: new Date("2025-11-28T23:35:00"),
		items: [
			{
				productId: "prod_rock_f",
				productName: "Rock Module F",
				quantity: 1,
				pricePerUnit: 46900,
				total: 46900,
			}
		]
	},
	{
		id: "5d9b560d-2501-4eb6-9c43-8213b9bd3dbd",
		orderNumber: "ORD-2025-1038",
		email: "Ramrezadm13@gmail.com",
		firstName: "Ramirez",
		lastName: "Admin",
		status: "abandoned" as const,
		paymentStatus: "pending" as const,
		subtotal: 35175,
		discount: 0,
		shipping: 0,
		total: 35175, // $351.75
		currency: "USD",
		discountCode: "BlackFriday25",
		createdAt: new Date("2025-11-28T23:01:00"),
		items: [
			{
				productId: "prod_rock_f",
				productName: "Rock Module F",
				quantity: 1,
				pricePerUnit: 35175,
				total: 35175,
			}
		]
	},
	{
		id: "bbf23549-ce50-4077-b37e-688a74eb7bd9",
		orderNumber: "ORD-2025-1039",
		email: "Ramrezadm13@gmail.com",
		firstName: "Ramirez",
		lastName: "Admin",
		status: "abandoned" as const,
		paymentStatus: "pending" as const,
		subtotal: 35175,
		discount: 0,
		shipping: 0,
		total: 35175, // $351.75
		currency: "USD",
		discountCode: "BlackFriday25",
		createdAt: new Date("2025-11-28T22:58:00"),
		items: [
			{
				productId: "prod_rock_f",
				productName: "Rock Module F",
				quantity: 1,
				pricePerUnit: 35175,
				total: 35175,
			}
		]
	},
	{
		id: "359655a0-3a6c-49bb-bde6-321080d4df19",
		orderNumber: "ORD-2025-1040",
		email: "Coltin_dolha@hotmail.com",
		firstName: "Coltin",
		lastName: "Dolha",
		status: "abandoned" as const,
		paymentStatus: "pending" as const,
		subtotal: 33147,
		discount: 0,
		shipping: 0,
		total: 33147, // $331.47
		currency: "USD",
		discountCode: "BlackFriday25",
		createdAt: new Date("2025-11-28T22:25:00"),
		items: [
			{
				productId: "prod_rock_g",
				productName: "Rock Module G",
				quantity: 1,
				pricePerUnit: 33147,
				total: 33147,
			}
		]
	},
	{
		id: "85bde069-bc98-4eb0-b683-e62fd8b3a777",
		orderNumber: "ORD-2025-1041",
		email: "Coltin_dolha@hotmail.com",
		firstName: "Coltin",
		lastName: "Dolha",
		status: "confirmed" as const,
		paymentStatus: "paid" as const,
		subtotal: 44196,
		discount: 11049,
		shipping: 0,
		total: 33147, // $331.47
		currency: "USD",
		discountCode: "BlackFriday25",
		shippingAddress: {
			firstName: "Coltin",
			lastName: "Dolha",
			address1: "99 Hotmail Ave",
			city: "Seattle",
			state: "WA",
			postalCode: "98109",
			country: "USA"
		},
		createdAt: new Date("2025-11-28T22:24:00"),
		confirmedAt: new Date("2025-11-28T22:30:00"),
		items: [
			{
				productId: "prod_rock_g",
				productName: "Rock Module G",
				quantity: 1,
				pricePerUnit: 44196,
				total: 44196,
			}
		]
	},
	{
		id: "4b334491-aebe-48ee-809f-452b225dac2f",
		orderNumber: "ORD-2025-1042",
		email: "meatingx@gmail.com",
		firstName: "Meat",
		lastName: "Ingx",
		status: "confirmed" as const,
		paymentStatus: "paid" as const,
		subtotal: 80736,
		discount: 20184,
		shipping: 0,
		total: 60552, // $605.52
		currency: "USD",
		discountCode: "BlackFriday25",
		shippingAddress: {
			firstName: "M.",
			lastName: "Ingx",
			address1: "200 Meatpacking Dist",
			city: "New York",
			state: "NY",
			postalCode: "10014",
			country: "USA"
		},
		createdAt: new Date("2025-11-28T17:53:00"),
		confirmedAt: new Date("2025-11-28T18:00:00"),
		items: [
			{
				productId: "prod_rock_wall_l",
				productName: "Rock Wall L",
				quantity: 1,
				pricePerUnit: 80736,
				total: 80736,
			}
		]
	},
	{
		id: "33d74343-52ae-451a-bbbd-62ecfc5bbd8c",
		orderNumber: "ORD-2025-1043",
		email: "meatingx@gmail.com",
		firstName: "Meat",
		lastName: "Ingx",
		status: "abandoned" as const,
		paymentStatus: "pending" as const,
		subtotal: 68626,
		discount: 0,
		shipping: 0,
		total: 68626, // $686.26
		currency: "USD",
		discountCode: "RSFSLD",
		createdAt: new Date("2025-11-28T16:23:00"),
		items: [
			{
				productId: "prod_rock_wall_m",
				productName: "Rock Wall M",
				quantity: 1,
				pricePerUnit: 68626,
				total: 68626,
			}
		]
	},
	{
		id: "70457a00-617a-4f8b-a35e-bb9abd55f892",
		orderNumber: "ORD-2025-1044",
		email: "meatingx@gmail.com",
		firstName: "Meat",
		lastName: "Ingx",
		status: "abandoned" as const,
		paymentStatus: "pending" as const,
		subtotal: 68626,
		discount: 0,
		shipping: 0,
		total: 68626, // $686.26
		currency: "USD",
		discountCode: "RSFSLD",
		createdAt: new Date("2025-11-28T16:19:00"),
		items: [
			{
				productId: "prod_rock_wall_m",
				productName: "Rock Wall M",
				quantity: 1,
				pricePerUnit: 68626,
				total: 68626,
			}
		]
	},
	{
		id: "36af4748-b220-46d3-85fc-5cff4bf22c56",
		orderNumber: "ORD-2025-1045",
		email: "meatingx@gmail.com",
		firstName: "Meat",
		lastName: "Ingx",
		status: "abandoned" as const,
		paymentStatus: "pending" as const,
		subtotal: 68626,
		discount: 0,
		shipping: 0,
		total: 68626, // $686.26
		currency: "USD",
		discountCode: "RSFSLD",
		createdAt: new Date("2025-11-28T16:18:00"),
		items: [
			{
				productId: "prod_rock_wall_m",
				productName: "Rock Wall M",
				quantity: 1,
				pricePerUnit: 68626,
				total: 68626,
			}
		]
	},
	{
		id: "3243c0a8-fa90-45cf-a74e-e070d3927a7e",
		orderNumber: "ORD-2025-1046",
		email: "clash.emili123@gmail.com",
		firstName: "Emili",
		lastName: "Clash",
		status: "abandoned" as const,
		paymentStatus: "pending" as const,
		subtotal: 38019,
		discount: 0,
		shipping: 0,
		total: 38019, // $380.19
		currency: "USD",
		discountCode: "BlackFriday25",
		createdAt: new Date("2025-11-28T15:46:00"),
		items: [
			{
				productId: "prod_rock_module_e",
				productName: "Rock Module E",
				quantity: 1,
				pricePerUnit: 38019,
				total: 38019,
			}
		]
	},
	{
		id: "5d5977d6-25b7-410c-a43a-050c20a40fe2",
		orderNumber: "ORD-2025-1047",
		email: "guigz34160@gmail.com",
		firstName: "Guillaume",
		lastName: "Z.",
		status: "abandoned" as const,
		paymentStatus: "pending" as const,
		subtotal: 25875,
		discount: 0,
		shipping: 0,
		total: 25875, // €258.75
		currency: "EUR",
		discountCode: "BlackFriday25",
		createdAt: new Date("2025-11-28T15:25:00"),
		items: [
			{
				productId: "prod_rock_c",
				productName: "Rock Module C",
				quantity: 1,
				pricePerUnit: 25875,
				total: 25875,
			}
		]
	},
	{
		id: "8d1a2d7a-b21c-4a41-8999-304bf88c929b",
		orderNumber: "ORD-2025-1048",
		email: "guigz34160@gmail.com",
		firstName: "Guillaume",
		lastName: "Z.",
		status: "confirmed" as const,
		paymentStatus: "paid" as const,
		subtotal: 34500,
		discount: 8625,
		shipping: 0,
		total: 25875, // €258.75
		currency: "EUR",
		discountCode: "BlackFriday25",
		shippingAddress: {
			firstName: "Guillaume",
			lastName: "Z.",
			address1: "1 Rue de Provence",
			city: "Montpellier",
			postalCode: "34000",
			country: "France"
		},
		createdAt: new Date("2025-11-28T15:23:00"),
		confirmedAt: new Date("2025-11-28T15:30:00"),
		items: [
			{
				productId: "prod_rock_c",
				productName: "Rock Module C",
				quantity: 1,
				pricePerUnit: 34500,
				total: 34500,
			}
		]
	},
	{
		id: "2bf0bd86-29d8-43d0-a584-264359f19ca7",
		orderNumber: "ORD-2025-1049",
		email: "mariokoch5477@t-online.de",
		firstName: "Mario",
		lastName: "Koch",
		status: "confirmed" as const,
		paymentStatus: "paid" as const,
		subtotal: 22400,
		discount: 5600,
		shipping: 0,
		total: 16800, // €168.00
		currency: "EUR",
		discountCode: "BlackFriday25",
		shippingAddress: {
			firstName: "Mario",
			lastName: "Koch",
			address1: "Hauptstraße 45",
			city: "Hamburg",
			postalCode: "20095",
			country: "Germany"
		},
		createdAt: new Date("2025-11-28T14:05:00"),
		confirmedAt: new Date("2025-11-28T14:10:00"),
		items: [
			{
				productId: "prod_rock_a",
				productName: "Rock Module A",
				quantity: 1,
				pricePerUnit: 22400,
				total: 22400,
			}
		]
	},
	{
		id: "3018d138-cfa7-44f6-8224-0e9a18909820",
		orderNumber: "ORD-2025-1050",
		email: "mariokoch5477@t-online.de",
		firstName: "Mario",
		lastName: "Koch",
		status: "abandoned" as const,
		paymentStatus: "pending" as const,
		subtotal: 16800,
		discount: 0,
		shipping: 0,
		total: 16800, // €168.00
		currency: "EUR",
		discountCode: "BlackFriday25",
		createdAt: new Date("2025-11-28T14:05:00"),
		items: [
			{
				productId: "prod_rock_a",
				productName: "Rock Module A",
				quantity: 1,
				pricePerUnit: 16800,
				total: 16800,
			}
		]
	},
	{
		id: "3bac4a0e-4d37-460b-a80d-2d716a4e8858",
		orderNumber: "ORD-2025-1051",
		email: "mariokoch5477@t-online.de",
		firstName: "Mario",
		lastName: "Koch",
		status: "abandoned" as const,
		paymentStatus: "pending" as const,
		subtotal: 16800,
		discount: 0,
		shipping: 0,
		total: 16800, // €168.00
		currency: "EUR",
		discountCode: "BlackFriday25",
		createdAt: new Date("2025-11-28T14:01:00"),
		items: [
			{
				productId: "prod_rock_a",
				productName: "Rock Module A",
				quantity: 1,
				pricePerUnit: 16800,
				total: 16800,
			}
		]
	},
	{
		id: "da14c28e-e29a-413a-9841-dfb20a2b4c9b",
		orderNumber: "ORD-2025-1052",
		email: "schulz.michel1@googlemail.com",
		firstName: "Michel",
		lastName: "Schulz",
		status: "abandoned" as const,
		paymentStatus: "pending" as const,
		subtotal: 31050,
		discount: 0,
		shipping: 0,
		total: 31050, // €310.50
		currency: "EUR",
		discountCode: "BlackFriday25",
		createdAt: new Date("2025-11-28T13:29:00"),
		items: [
			{
				productId: "prod_amazon_s",
				productName: "Amazon Small",
				quantity: 1,
				pricePerUnit: 31050,
				total: 31050,
			}
		]
	},
	{
		id: "80d6c007-ea60-40fa-82b4-56e7d961d03c",
		orderNumber: "ORD-2025-1053",
		email: "dakermi@hotmail.com",
		firstName: "David",
		lastName: "Kermi",
		status: "confirmed" as const,
		paymentStatus: "paid" as const,
		subtotal: 11500,
		discount: 2875,
		shipping: 0,
		total: 8625, // €86.25
		currency: "EUR",
		discountCode: "BlackFriday25",
		shippingAddress: {
			firstName: "David",
			lastName: "Kermi",
			address1: "High St 1",
			city: "Dublin",
			postalCode: "D01",
			country: "Ireland"
		},
		createdAt: new Date("2025-11-28T09:36:00"),
		confirmedAt: new Date("2025-11-28T09:40:00"),
		items: [
			{
				productId: "prod_glue",
				productName: "Adhesive Pack",
				quantity: 2,
				pricePerUnit: 5750,
				total: 11500,
			}
		]
	},
	{
		id: "abe1013c-4751-446c-abc8-467517bcf4ab",
		orderNumber: "ORD-2025-1054",
		email: "Alexismoreno1997.am@gmail.com",
		firstName: "Alexis",
		lastName: "Moreno",
		status: "abandoned" as const,
		paymentStatus: "pending" as const,
		subtotal: 87120,
		discount: 0,
		shipping: 0,
		total: 87120, // $871.20
		currency: "USD",
		discountCode: "Kaveman10",
		createdAt: new Date("2025-11-28T02:08:00"),
		items: [
			{
				productId: "prod_rock_l_set",
				productName: "Rock Set L",
				quantity: 1,
				pricePerUnit: 87120,
				total: 87120,
			}
		]
	},
	{
		id: "7dbff779-b569-4312-8cd4-86a9f75e58c1",
		orderNumber: "ORD-2025-1055",
		email: "Alexismoreno1997.am@gmail.com",
		firstName: "Alexis",
		lastName: "Moreno",
		status: "abandoned" as const,
		paymentStatus: "pending" as const,
		subtotal: 43560,
		discount: 0,
		shipping: 0,
		total: 43560, // $435.60
		currency: "USD",
		discountCode: "Kaveman10",
		createdAt: new Date("2025-11-28T01:55:00"),
		items: [
			{
				productId: "prod_rock_m",
				productName: "Rock Module M",
				quantity: 1,
				pricePerUnit: 43560,
				total: 43560,
			}
		]
	},
	{
		id: "4d124900-ac50-4b66-a1c3-3ee0b03c2c92",
		orderNumber: "ORD-2025-1056",
		email: "Alexismoreno1997.am@gmail.com",
		firstName: "Alexis",
		lastName: "Moreno",
		status: "abandoned" as const,
		paymentStatus: "pending" as const,
		subtotal: 87120,
		discount: 0,
		shipping: 0,
		total: 87120, // $871.20
		currency: "USD",
		discountCode: "Kaveman10",
		createdAt: new Date("2025-11-28T01:53:00"),
		items: [
			{
				productId: "prod_rock_l_set",
				productName: "Rock Set L",
				quantity: 1,
				pricePerUnit: 87120,
				total: 87120,
			}
		]
	},
	// ===========================================================================
	// DATA IMPORT: PAGE 3
	// ===========================================================================
	{
		id: "1082c036-fc01-4dbe-a10f-b52219580013",
		orderNumber: "ORD-2025-1057",
		email: "chayi22@yahoo.com",
		firstName: "Chayi",
		lastName: "User",
		status: "abandoned" as const,
		paymentStatus: "pending" as const,
		subtotal: 53400,
		discount: 0,
		shipping: 0,
		total: 53400, // $534.00
		currency: "USD",
		createdAt: new Date("2025-11-27T14:04:00"),
		items: [
			{
				productId: "prod_amazon_b",
				productName: "Amazon Wood B",
				quantity: 1,
				pricePerUnit: 53400,
				total: 53400,
			}
		]
	},
	{
		id: "6a2a900c-5988-4dc7-a2b6-b426fa2a4b52",
		orderNumber: "ORD-2025-1058",
		email: "stevenleavitt@me.com",
		firstName: "Steven",
		lastName: "Leavitt",
		status: "abandoned" as const,
		paymentStatus: "pending" as const,
		subtotal: 43732,
		discount: 0,
		shipping: 0,
		total: 43732, // $437.32
		currency: "USD",
		createdAt: new Date("2025-11-27T13:57:00"),
		items: [
			{
				productId: "prod_rock_m",
				productName: "Rock Module M",
				quantity: 1,
				pricePerUnit: 43732,
				total: 43732,
			}
		]
	},
	{
		id: "f54f734c-09ab-406e-9430-4dd04c19f109",
		orderNumber: "ORD-2025-1059",
		email: "stevenleavitt@me.com",
		firstName: "Steven",
		lastName: "Leavitt",
		status: "abandoned" as const,
		paymentStatus: "pending" as const,
		subtotal: 43732,
		discount: 0,
		shipping: 0,
		total: 43732, // $437.32
		currency: "USD",
		createdAt: new Date("2025-11-27T13:57:00"),
		items: [
			{
				productId: "prod_rock_m",
				productName: "Rock Module M",
				quantity: 1,
				pricePerUnit: 43732,
				total: 43732,
			}
		]
	},
	{
		id: "e93f80c0-7911-4c1a-a580-e52c6faa7aee",
		orderNumber: "ORD-2025-1060",
		email: "stevenleavitt@me.com",
		firstName: "Steven",
		lastName: "Leavitt",
		status: "abandoned" as const,
		paymentStatus: "pending" as const,
		subtotal: 43732,
		discount: 0,
		shipping: 0,
		total: 43732, // $437.32
		currency: "USD",
		createdAt: new Date("2025-11-27T13:56:00"),
		items: [
			{
				productId: "prod_rock_m",
				productName: "Rock Module M",
				quantity: 1,
				pricePerUnit: 43732,
				total: 43732,
			}
		]
	},
	{
		id: "8151c7b8-835e-454d-ac5b-00562a4b591e",
		orderNumber: "ORD-2025-1061",
		email: "Chayi22@yahoo.com",
		firstName: "Chayi",
		lastName: "User",
		status: "abandoned" as const,
		paymentStatus: "pending" as const,
		subtotal: 53400,
		discount: 0,
		shipping: 0,
		total: 53400, // $534.00
		currency: "USD",
		createdAt: new Date("2025-11-26T21:02:00"),
		items: [
			{
				productId: "prod_amazon_b",
				productName: "Amazon Wood B",
				quantity: 1,
				pricePerUnit: 53400,
				total: 53400,
			}
		]
	},
	{
		id: "060946d8-8209-430f-89f9-70b238f19350",
		orderNumber: "ORD-2025-1062",
		email: "guigz34160@gmail.com",
		firstName: "Guillaume",
		lastName: "Z.",
		status: "abandoned" as const,
		paymentStatus: "pending" as const,
		subtotal: 34500,
		discount: 0,
		shipping: 0,
		total: 34500, // €345.00
		currency: "EUR",
		createdAt: new Date("2025-11-26T12:08:00"),
		items: [
			{
				productId: "prod_rock_c",
				productName: "Rock Module C",
				quantity: 1,
				pricePerUnit: 34500,
				total: 34500,
			}
		]
	},
	{
		id: "4e078f14-09a3-41f0-836e-fbaf2c9c0cfb",
		orderNumber: "ORD-2025-1063",
		email: "lyan1208@yahoo.com",
		firstName: "Lyan",
		lastName: "User",
		status: "abandoned" as const,
		paymentStatus: "pending" as const,
		subtotal: 49900,
		discount: 0,
		shipping: 0,
		total: 49900, // $499.00
		currency: "USD",
		createdAt: new Date("2025-11-26T10:59:00"),
		items: [
			{
				productId: "prod_rock_set_s",
				productName: "Rock Set Small",
				quantity: 1,
				pricePerUnit: 49900,
				total: 49900,
			}
		]
	},
	{
		id: "a5aa5fe3-0f82-4a5a-b2e5-939211a29c7c",
		orderNumber: "ORD-2025-1064",
		email: "michael.ruprechter@aon.at",
		firstName: "Michael",
		lastName: "Ruprechter",
		status: "confirmed" as const,
		paymentStatus: "paid" as const,
		subtotal: 49950,
		discount: 0,
		shipping: 0,
		total: 49950, // €499.50
		currency: "EUR",
		discountCode: "RAVQEM",
		shippingAddress: {
			firstName: "Michael",
			lastName: "Ruprechter",
			address1: "Schloss Schönbrunn 1",
			city: "Vienna",
			postalCode: "1130",
			country: "Austria"
		},
		createdAt: new Date("2025-11-26T09:11:00"),
		confirmedAt: new Date("2025-11-26T09:15:00"),
		items: [
			{
				productId: "prod_amazon_set",
				productName: "Amazon Wood Set",
				quantity: 1,
				pricePerUnit: 49950,
				total: 49950,
			}
		]
	},
	{
		id: "f37f8fbd-490d-413f-bbdb-892963d5554d",
		orderNumber: "ORD-2025-1065",
		email: "travdog380@aol.com",
		firstName: "Trav",
		lastName: "Dog",
		status: "confirmed" as const,
		paymentStatus: "paid" as const,
		subtotal: 48100,
		discount: 0,
		shipping: 0,
		total: 48100, // $481.00
		currency: "USD",
		shippingAddress: {
			firstName: "Travis",
			lastName: "Smith",
			address1: "380 Dogwood Ln",
			city: "Nashville",
			state: "TN",
			postalCode: "37201",
			country: "USA"
		},
		createdAt: new Date("2025-11-25T21:29:00"),
		confirmedAt: new Date("2025-11-25T21:30:00"),
		items: [
			{
				productId: "prod_rock_module_b",
				productName: "Rock Module B",
				quantity: 1,
				pricePerUnit: 48100,
				total: 48100,
			}
		]
	},
	{
		id: "4f09c9f3-b4ef-44a4-be67-d8d8b9a93891",
		orderNumber: "ORD-2025-1066",
		email: "travdog380@aol.com",
		firstName: "Trav",
		lastName: "Dog",
		status: "abandoned" as const,
		paymentStatus: "pending" as const,
		subtotal: 48100,
		discount: 0,
		shipping: 0,
		total: 48100, // $481.00
		currency: "USD",
		createdAt: new Date("2025-11-25T21:29:00"),
		items: [
			{
				productId: "prod_rock_module_b",
				productName: "Rock Module B",
				quantity: 1,
				pricePerUnit: 48100,
				total: 48100,
			}
		]
	},
	{
		id: "7e06f75d-b909-4118-b816-87fd226c0282",
		orderNumber: "ORD-2025-1067",
		email: "travdog380@aol.com",
		firstName: "Trav",
		lastName: "Dog",
		status: "abandoned" as const,
		paymentStatus: "pending" as const,
		subtotal: 48100,
		discount: 0,
		shipping: 0,
		total: 48100, // $481.00
		currency: "USD",
		createdAt: new Date("2025-11-25T21:27:00"),
		items: [
			{
				productId: "prod_rock_module_b",
				productName: "Rock Module B",
				quantity: 1,
				pricePerUnit: 48100,
				total: 48100,
			}
		]
	},
	{
		id: "9d106c48-8c7d-4553-9f3a-521d20a58827",
		orderNumber: "ORD-2025-1068",
		email: "travdog380@aol.com",
		firstName: "Trav",
		lastName: "Dog",
		status: "abandoned" as const,
		paymentStatus: "pending" as const,
		subtotal: 48100,
		discount: 0,
		shipping: 0,
		total: 48100, // $481.00
		currency: "USD",
		createdAt: new Date("2025-11-25T21:26:00"),
		items: [
			{
				productId: "prod_rock_module_b",
				productName: "Rock Module B",
				quantity: 1,
				pricePerUnit: 48100,
				total: 48100,
			}
		]
	},
	{
		id: "a2557f48-bca4-47fc-8114-45644221876f",
		orderNumber: "ORD-2025-1069",
		email: "travdog380@aol.com",
		firstName: "Trav",
		lastName: "Dog",
		status: "abandoned" as const,
		paymentStatus: "pending" as const,
		subtotal: 48100,
		discount: 0,
		shipping: 0,
		total: 48100, // $481.00
		currency: "USD",
		createdAt: new Date("2025-11-25T21:26:00"),
		items: [
			{
				productId: "prod_rock_module_b",
				productName: "Rock Module B",
				quantity: 1,
				pricePerUnit: 48100,
				total: 48100,
			}
		]
	},
	{
		id: "2aa7e5f5-2222-4fdd-8847-6066d21f8089",
		orderNumber: "ORD-2025-1070",
		email: "dakermo@hotmail.com",
		firstName: "David",
		lastName: "Kermo",
		status: "abandoned" as const,
		paymentStatus: "pending" as const,
		subtotal: 10580,
		discount: 0,
		shipping: 0,
		total: 10580, // $105.80
		currency: "USD",
		createdAt: new Date("2025-11-25T00:45:00"),
		items: [
			{
				productId: "prod_glue_kit",
				productName: "Silicone Glue Kit",
				quantity: 3,
				pricePerUnit: 3526,
				total: 10580,
			}
		]
	},
	{
		id: "e04dc394-8c8c-4242-817b-dbb324d893e5",
		orderNumber: "ORD-2025-1071",
		email: "Chayi22@yahoo.com",
		firstName: "Chayi",
		lastName: "User",
		status: "abandoned" as const,
		paymentStatus: "pending" as const,
		subtotal: 53400,
		discount: 0,
		shipping: 0,
		total: 53400, // $534.00
		currency: "USD",
		createdAt: new Date("2025-11-24T20:30:00"),
		items: [
			{
				productId: "prod_amazon_b",
				productName: "Amazon Wood B",
				quantity: 1,
				pricePerUnit: 53400,
				total: 53400,
			}
		]
	},
	{
		id: "289f9756-d9f0-4619-bc9d-21ffcd51e815",
		orderNumber: "ORD-2025-1072",
		email: "jason_rigdon@comcast.net",
		firstName: "Jason",
		lastName: "Rigdon",
		status: "abandoned" as const,
		paymentStatus: "pending" as const,
		subtotal: 40400,
		discount: 0,
		shipping: 0,
		total: 40400, // $404.00
		currency: "USD",
		createdAt: new Date("2025-11-24T14:32:00"),
		items: [
			{
				productId: "prod_rock_module_d",
				productName: "Rock Module D",
				quantity: 1,
				pricePerUnit: 40400,
				total: 40400,
			}
		]
	},
	{
		id: "a2111acf-13a7-432e-bcf3-cc8af42a54be",
		orderNumber: "ORD-2025-1073",
		email: "jason_rigdon@comcast.net",
		firstName: "Jason",
		lastName: "Rigdon",
		status: "abandoned" as const,
		paymentStatus: "pending" as const,
		subtotal: 40400,
		discount: 0,
		shipping: 0,
		total: 40400, // $404.00
		currency: "USD",
		createdAt: new Date("2025-11-24T14:31:00"),
		items: [
			{
				productId: "prod_rock_module_d",
				productName: "Rock Module D",
				quantity: 1,
				pricePerUnit: 40400,
				total: 40400,
			}
		]
	},
	{
		id: "9307fc3f-9375-46dc-8051-c217345c15a7",
		orderNumber: "ORD-2025-1074",
		email: "jason_rigdon@comcast.net",
		firstName: "Jason",
		lastName: "Rigdon",
		status: "abandoned" as const,
		paymentStatus: "pending" as const,
		subtotal: 40400,
		discount: 0,
		shipping: 0,
		total: 40400, // $404.00
		currency: "USD",
		createdAt: new Date("2025-11-24T14:29:00"),
		items: [
			{
				productId: "prod_rock_module_d",
				productName: "Rock Module D",
				quantity: 1,
				pricePerUnit: 40400,
				total: 40400,
			}
		]
	},
	{
		id: "2f4b2034-ea0a-4351-915f-5e73ea4dc17a",
		orderNumber: "ORD-2025-1075",
		email: "jason_rigdon@comcast.net",
		firstName: "Jason",
		lastName: "Rigdon",
		status: "abandoned" as const,
		paymentStatus: "pending" as const,
		subtotal: 40400,
		discount: 0,
		shipping: 0,
		total: 40400, // $404.00
		currency: "USD",
		createdAt: new Date("2025-11-24T14:29:00"),
		items: [
			{
				productId: "prod_rock_module_d",
				productName: "Rock Module D",
				quantity: 1,
				pricePerUnit: 40400,
				total: 40400,
			}
		]
	},
	{
		id: "56f4919e-e267-4ac2-a579-64c1e936594c",
		orderNumber: "ORD-2025-1076",
		email: "meatingx@gmail.com",
		firstName: "Meat",
		lastName: "Ingx",
		status: "abandoned" as const,
		paymentStatus: "pending" as const,
		subtotal: 69600,
		discount: 0,
		shipping: 0,
		total: 69600, // $696.00
		currency: "USD",
		createdAt: new Date("2025-11-23T06:02:00"),
		items: [
			{
				productId: "prod_rock_wall_xl",
				productName: "Rock Wall XL",
				quantity: 1,
				pricePerUnit: 69600,
				total: 69600,
			}
		]
	},
	{
		id: "a5978ec5-4854-4aea-b39a-0ec8b874d7df",
		orderNumber: "ORD-2025-1077",
		email: "teesha.gray@pfizer.com",
		firstName: "Teesha",
		lastName: "Gray",
		status: "confirmed" as const,
		paymentStatus: "paid" as const,
		subtotal: 48100,
		discount: 0,
		shipping: 0,
		total: 48100, // $481.00
		currency: "USD",
		shippingAddress: {
			firstName: "Teesha",
			lastName: "Gray",
			address1: "Pfizer Campus",
			city: "New York",
			state: "NY",
			postalCode: "10017",
			country: "USA"
		},
		createdAt: new Date("2025-11-22T09:23:00"),
		confirmedAt: new Date("2025-11-22T09:30:00"),
		items: [
			{
				productId: "prod_rock_module_b",
				productName: "Rock Module B",
				quantity: 1,
				pricePerUnit: 48100,
				total: 48100,
			}
		]
	},
	{
		id: "56481639-2b12-4a7b-b3f0-3b3eec240e70",
		orderNumber: "ORD-2025-1078",
		email: "brian_chambers@icmrs.co.uk",
		firstName: "Brian",
		lastName: "Chambers",
		status: "confirmed" as const,
		paymentStatus: "paid" as const,
		subtotal: 38000,
		discount: 0,
		shipping: 0,
		total: 38000, // €380.00
		currency: "EUR",
		shippingAddress: {
			firstName: "Brian",
			lastName: "Chambers",
			address1: "15 Oxford St",
			city: "London",
			postalCode: "W1D 1AA",
			country: "UK"
		},
		createdAt: new Date("2025-11-21T20:04:00"),
		confirmedAt: new Date("2025-11-21T20:10:00"),
		items: [
			{
				productId: "prod_amazon_s",
				productName: "Amazon Small",
				quantity: 1,
				pricePerUnit: 38000,
				total: 38000,
			}
		]
	},
	{
		id: "bd53c3c1-6606-4844-b0ff-a78c6660790a",
		orderNumber: "ORD-2025-1079",
		email: "jbramos80@gmail.com",
		firstName: "J.B.",
		lastName: "Ramos",
		status: "shipped" as const,
		paymentStatus: "paid" as const,
		subtotal: 82500,
		discount: 12375,
		shipping: 0,
		total: 70125, // $701.25
		currency: "USD",
		discountCode: "JOEY15",
		_promoterEmail: "joey@example.com",
		shippingAddress: {
			firstName: "J.B.",
			lastName: "Ramos",
			address1: "100 Beach Front",
			city: "San Diego",
			state: "CA",
			postalCode: "92101",
			country: "USA"
		},
		trackingNumber: "DHL-99887766",
		createdAt: new Date("2025-11-18T19:59:00"),
		confirmedAt: new Date("2025-11-18T20:00:00"),
		shippedAt: new Date("2025-11-20T10:00:00"),
		items: [
			{
				productId: "prod_custom_bg",
				productName: "Custom Background Set",
				quantity: 1,
				pricePerUnit: 82500,
				total: 82500,
			}
		]
	},
	{
		id: "af96fc19-da70-4d3b-8e02-d153e6c3f03a",
		orderNumber: "ORD-2025-1080",
		email: "jbramos80@gmail.com",
		firstName: "J.B.",
		lastName: "Ramos",
		status: "abandoned" as const,
		paymentStatus: "pending" as const,
		subtotal: 70125,
		discount: 0,
		shipping: 0,
		total: 70125, // $701.25
		currency: "USD",
		discountCode: "JOEY15",
		_promoterEmail: "joey@example.com",
		createdAt: new Date("2025-11-18T19:59:00"),
		items: [
			{
				productId: "prod_custom_bg",
				productName: "Custom Background Set",
				quantity: 1,
				pricePerUnit: 70125,
				total: 70125,
			}
		]
	},
	{
		id: "8ab110fd-ca88-4051-854b-58a235ffc53d",
		orderNumber: "ORD-2025-1081",
		email: "jbramos80@gmail.com",
		firstName: "J.B.",
		lastName: "Ramos",
		status: "abandoned" as const,
		paymentStatus: "pending" as const,
		subtotal: 104635,
		discount: 0,
		shipping: 0,
		total: 104635, // $1,046.35
		currency: "USD",
		discountCode: "JOEY15",
		_promoterEmail: "joey@example.com",
		createdAt: new Date("2025-11-17T22:43:00"),
		items: [
			{
				productId: "prod_huge_custom",
				productName: "Huge Custom Background",
				quantity: 1,
				pricePerUnit: 104635,
				total: 104635,
			}
		]
	},
	{
		id: "07e90a98-2798-4de0-a4c6-c50d6580635c",
		orderNumber: "ORD-2025-1082",
		email: "Yavorkrustev1407@gmail.com",
		firstName: "Yavor",
		lastName: "Krustev",
		status: "shipped" as const,
		paymentStatus: "paid" as const,
		subtotal: 14100,
		discount: 1410,
		shipping: 0,
		total: 12690, // €126.90
		currency: "EUR",
		discountCode: "LFBFSR",
		shippingAddress: {
			firstName: "Yavor",
			lastName: "Krustev",
			address1: "Vitosha Blvd 1",
			city: "Sofia",
			postalCode: "1000",
			country: "Bulgaria"
		},
		trackingNumber: "BG-POST-12345",
		createdAt: new Date("2025-11-17T02:27:00"),
		confirmedAt: new Date("2025-11-17T02:30:00"),
		shippedAt: new Date("2025-11-19T09:00:00"),
		items: [
			{
				productId: "prod_rock_s",
				productName: "Rock Module S",
				quantity: 2,
				pricePerUnit: 7050,
				total: 14100,
			}
		]
	},
	{
		id: "b0fcca72-871a-427c-92c2-871946eec56b",
		orderNumber: "ORD-2025-1083",
		email: "azurswama@gmail.com",
		firstName: "Azur",
		lastName: "Swama",
		status: "abandoned" as const,
		paymentStatus: "pending" as const,
		subtotal: 4500,
		discount: 0,
		shipping: 0,
		total: 4500, // €45.00
		currency: "EUR",
		createdAt: new Date("2025-11-13T08:14:00"),
		items: [
			{
				productId: "prod_glue",
				productName: "Glue Pack",
				quantity: 1,
				pricePerUnit: 4500,
				total: 4500,
			}
		]
	},
	{
		id: "eadf3633-cd3d-449d-967c-9d1f35ceba96",
		orderNumber: "ORD-2025-1084",
		email: "s.chaisty@outlook.com",
		firstName: "S.",
		lastName: "Chaisty",
		status: "shipped" as const,
		paymentStatus: "paid" as const,
		subtotal: 10000,
		discount: 0,
		shipping: 0,
		total: 10000, // €100.00
		currency: "EUR",
		shippingAddress: {
			firstName: "Sam",
			lastName: "Chaisty",
			address1: "10 Outlook Ave",
			city: "Manchester",
			postalCode: "M1 1AA",
			country: "UK"
		},
		trackingNumber: "RM-UK-8888",
		createdAt: new Date("2025-11-12T22:34:00"),
		confirmedAt: new Date("2025-11-12T22:40:00"),
		shippedAt: new Date("2025-11-14T11:00:00"),
		items: [
			{
				productId: "prod_gift_card",
				productName: "Gift Card €100",
				quantity: 1,
				pricePerUnit: 10000,
				total: 10000,
			}
		]
	},
	{
		id: "f7837ee6-dc14-4be1-b6ca-6c2947694249",
		orderNumber: "ORD-2025-1085",
		email: "Robertrolfe2025@gmail.com",
		firstName: "Robert",
		lastName: "Rolfe",
		status: "abandoned" as const,
		paymentStatus: "pending" as const,
		subtotal: 46900,
		discount: 0,
		shipping: 0,
		total: 46900, // $469.00
		currency: "USD",
		createdAt: new Date("2025-11-12T02:12:00"),
		items: [
			{
				productId: "prod_rock_module_f",
				productName: "Rock Module F",
				quantity: 1,
				pricePerUnit: 46900,
				total: 46900,
			}
		]
	},
	{
		id: "3c776625-407c-480e-a101-21a6256e446d",
		orderNumber: "ORD-2025-1086",
		email: "visuals.aqua@gmail.com",
		firstName: "Aqua",
		lastName: "Visuals",
		status: "shipped" as const,
		paymentStatus: "paid" as const,
		subtotal: 17100,
		discount: 1710,
		shipping: 0,
		total: 15390, // €153.90
		currency: "EUR",
		discountCode: "OWBEFK",
		shippingAddress: {
			firstName: "Aqua",
			lastName: "Admin",
			address1: "88 Design St",
			city: "Amsterdam",
			postalCode: "1011",
			country: "Netherlands"
		},
		trackingNumber: "NL-POST-555",
		createdAt: new Date("2025-11-10T15:21:00"),
		confirmedAt: new Date("2025-11-10T15:25:00"),
		shippedAt: new Date("2025-11-12T09:00:00"),
		items: [
			{
				productId: "prod_mini_rock",
				productName: "Mini Rock Set",
				quantity: 1,
				pricePerUnit: 17100,
				total: 17100,
			}
		]
	},
	{
		id: "35d947a1-9e6e-4e3c-be29-079b6edd949e",
		orderNumber: "ORD-2025-1087",
		email: "visuals.aqua@gmail.com",
		firstName: "Aqua",
		lastName: "Visuals",
		status: "abandoned" as const,
		paymentStatus: "pending" as const,
		subtotal: 12510,
		discount: 0,
		shipping: 0,
		total: 12510, // €125.10
		currency: "EUR",
		discountCode: "OWBEFK",
		createdAt: new Date("2025-11-10T15:17:00"),
		items: [
			{
				productId: "prod_mini_rock",
				productName: "Mini Rock Set",
				quantity: 1,
				pricePerUnit: 12510,
				total: 12510,
			}
		]
	},
	{
		id: "ceeab203-7520-4237-b382-0035abbe064b",
		orderNumber: "ORD-2025-1088",
		email: "jesseboychuk@hotmail.com",
		firstName: "Jesse",
		lastName: "Boychuk",
		status: "abandoned" as const,
		paymentStatus: "pending" as const,
		subtotal: 35844,
		discount: 0,
		shipping: 0,
		total: 35844, // $358.44
		currency: "USD",
		createdAt: new Date("2025-11-08T18:25:00"),
		items: [
			{
				productId: "prod_rock_module_e",
				productName: "Rock Module E",
				quantity: 1,
				pricePerUnit: 35844,
				total: 35844,
			}
		]
	},
	{
		id: "00b81b90-7146-443b-b65f-420ee1bc4de3",
		orderNumber: "ORD-2025-1089",
		email: "scljr2@gmail.com",
		firstName: "S.C.",
		lastName: "Jr",
		status: "delivered" as const,
		paymentStatus: "paid" as const,
		subtotal: 46900,
		discount: 0,
		shipping: 0,
		total: 46900, // $469.00
		currency: "USD",
		shippingAddress: {
			firstName: "Scott",
			lastName: "Clark",
			address1: "200 Gmail Ave",
			city: "San Jose",
			state: "CA",
			postalCode: "95110",
			country: "USA"
		},
		trackingNumber: "UPS-00998877",
		createdAt: new Date("2025-11-06T20:36:00"),
		confirmedAt: new Date("2025-11-06T20:40:00"),
		shippedAt: new Date("2025-11-08T10:00:00"),
		deliveredAt: new Date("2025-11-12T14:30:00"),
		items: [
			{
				productId: "prod_rock_module_f",
				productName: "Rock Module F",
				quantity: 1,
				pricePerUnit: 46900,
				total: 46900,
			}
		]
	},
	{
		id: "4afb669a-b24c-40b0-a186-460e0d6016b5",
		orderNumber: "ORD-2025-1090",
		email: "svennesvensen@web.de",
		firstName: "Svenne",
		lastName: "Svensen",
		status: "delivered" as const,
		paymentStatus: "paid" as const,
		subtotal: 29200,
		discount: 0,
		shipping: 0,
		total: 29200, // €292.00
		currency: "EUR",
		shippingAddress: {
			firstName: "Svenne",
			lastName: "Svensen",
			address1: "Hafenstraße 1",
			city: "Kiel",
			postalCode: "24103",
			country: "Germany"
		},
		trackingNumber: "DHL-DE-556677",
		createdAt: new Date("2025-11-06T10:17:00"),
		confirmedAt: new Date("2025-11-06T10:20:00"),
		shippedAt: new Date("2025-11-08T09:00:00"),
		deliveredAt: new Date("2025-11-10T12:00:00"),
		items: [
			{
				productId: "prod_amazon_s",
				productName: "Amazon Small",
				quantity: 1,
				pricePerUnit: 29200,
				total: 29200,
			}
		]
	}
];