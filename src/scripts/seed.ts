import { pool } from "../config/database";
import Decimal from "decimal.js";

type PaymentTerms = "Net 30 Days" | "14 Days" | "7 Days";
type InvoiceStatus = "draft" | "pending" | "paid";

interface SeedItem {
    item_description: string;
    item_quantity: number;
    item_price: number;
}

const britishFirstNames = [
    "Oliver",
    "George",
    "Harry",
    "Jack",
    "Jacob",
    "Noah",
    "Charlie",
    "Thomas",
    "Oscar",
    "William",
    "Ava",
    "Isla",
    "Emily",
    "Sophia",
    "Grace",
    "Amelia",
    "Olivia",
    "Jessica",
    "Lily",
    "Sophie",
];

const britishSurnames = [
    "Smith",
    "Jones",
    "Taylor",
    "Brown",
    "Williams",
    "Wilson",
    "Johnson",
    "Davies",
    "Patel",
    "Wright",
    "Evans",
    "Thomas",
    "Roberts",
    "Walker",
    "Thompson",
    "White",
];

const ukCities = [
    "London",
    "Manchester",
    "Birmingham",
    "Edinburgh",
    "Glasgow",
    "Bristol",
    "Leeds",
    "Liverpool",
    "Cardiff",
    "Newcastle upon Tyne",
];

const ukCountries = [
    "United Kingdom",
    "England",
    "Scotland",
    "Wales",
    "Northern Ireland",
];

const luxuryItemsCatalogue: SeedItem[] = [
    {
        item_description: "Hand-stitched leather briefcase",
        item_quantity: 1,
        item_price: 1450.0,
    },
    {
        item_description: "Bespoke wool suit",
        item_quantity: 1,
        item_price: 3200.0,
    },
    {
        item_description: "Fine bone china tea set",
        item_quantity: 1,
        item_price: 780.0,
    },
    {
        item_description: "Luxury timepiece",
        item_quantity: 1,
        item_price: 12500.0,
    },
    {
        item_description: "Cashmere overcoat",
        item_quantity: 1,
        item_price: 2100.0,
    },
    {
        item_description: "Silk tie (Royal Navy)",
        item_quantity: 2,
        item_price: 95.0,
    },
    {
        item_description: "Handmade brogues",
        item_quantity: 1,
        item_price: 640.0,
    },
    {
        item_description: "Crystal decanter set",
        item_quantity: 1,
        item_price: 980.0,
    },
    {
        item_description: "Mahogany writing desk",
        item_quantity: 1,
        item_price: 5400.0,
    },
    {
        item_description: "Vintage fountain pen",
        item_quantity: 1,
        item_price: 460.0,
    },
    {
        item_description: "British racing green luggage set",
        item_quantity: 1,
        item_price: 2750.0,
    },
    {
        item_description: "Gold cufflinks",
        item_quantity: 1,
        item_price: 1250.0,
    },
    {
        item_description: "Tailored dinner jacket",
        item_quantity: 1,
        item_price: 1850.0,
    },
    {
        item_description: "Silk pocket square (Burgundy)",
        item_quantity: 3,
        item_price: 45.0,
    },
    {
        item_description: "Handwoven Persian rug",
        item_quantity: 1,
        item_price: 7800.0,
    },
    {
        item_description: "Leather-bound notebook",
        item_quantity: 4,
        item_price: 38.0,
    },
    {
        item_description: "Crystal whisky tumblers (set of 6)",
        item_quantity: 1,
        item_price: 360.0,
    },
    {
        item_description: "Bespoke dress shirt",
        item_quantity: 2,
        item_price: 220.0,
    },
    {
        item_description: "Velvet smoking jacket",
        item_quantity: 1,
        item_price: 920.0,
    },
    {
        item_description: "Ebony walking cane",
        item_quantity: 1,
        item_price: 380.0,
    },
];

function sample<T>(arr: T[]): T {
    const index = Math.floor(Math.random() * arr.length);
    return arr[index];
}

function randomInt(minInclusive: number, maxInclusive: number): number {
    const min = Math.ceil(minInclusive);
    const max = Math.floor(maxInclusive);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generatePostcode(): string {
    const outward = `${String.fromCharCode(65 + randomInt(0, 25))}${randomInt(1, 9)}`;
    const inward = `${randomInt(1, 9)}${String.fromCharCode(65 + randomInt(0, 25))}${String.fromCharCode(65 + randomInt(0, 25))}`;
    return `${outward} ${inward}`;
}

async function createInvoiceWithItems(index: number): Promise<void> {
    const firstName = sample(britishFirstNames);
    const surname = sample(britishSurnames);
    const billToName = `${firstName} ${surname}`;
    const billToEmail = `${firstName.toLowerCase()}.${surname.toLowerCase()}@example.co.uk`;

    const billFromStreet = `${randomInt(10, 99)} Savile Row`;
    const billFromCity = "London";
    const billFromPostcode = generatePostcode();
    const billFromCountry = sample(ukCountries);

    const billToStreet = `${randomInt(1, 199)} Regent Street`;
    const billToCity = sample(ukCities);
    const billToPostcode = generatePostcode();
    const billToCountry = sample(ukCountries);

    const statusOptions: InvoiceStatus[] = ["draft", "pending", "paid"];
    const paymentTermsOptions: PaymentTerms[] = [
        "Net 30 Days",
        "14 Days",
        "7 Days",
    ];
    const invoiceDate = new Date();
    invoiceDate.setDate(invoiceDate.getDate() - randomInt(1, 120));

    const itemsCount = randomInt(2, 5);
    const chosenItems: SeedItem[] = [];
    for (let i = 0; i < itemsCount; i += 1) {
        const base = sample(luxuryItemsCatalogue);
        const quantity = randomInt(1, Math.max(1, base.item_quantity));
        chosenItems.push({
            item_description: base.item_description,
            item_price: base.item_price,
            item_quantity: quantity,
        });
    }

    let invoiceTotal = new Decimal(0);
    for (let i = 0; i < chosenItems.length; i += 1) {
        const it = chosenItems[i];
        const lineTotal = new Decimal(it.item_price).mul(it.item_quantity);
        invoiceTotal = invoiceTotal.add(lineTotal);
    }

    const client = await pool.connect();
    try {
        await client.query("BEGIN");

        const insertInvoice = await client.query(
            `INSERT INTO invoices (
                bill_from_street_address, bill_from_city, bill_from_postcode, bill_from_country,
                bill_to_email, bill_to_name, bill_to_street_address, bill_to_city,
                bill_to_postcode, bill_to_country, invoice_date, payment_terms,
                project_description, status, invoice_total
            ) VALUES (
                $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15
            ) RETURNING id`,
            [
                billFromStreet,
                billFromCity,
                billFromPostcode,
                billFromCountry,
                billToEmail,
                billToName,
                billToStreet,
                billToCity,
                billToPostcode,
                billToCountry,
                invoiceDate,
                sample(paymentTermsOptions),
                `Luxury retail order #${index + 1}`,
                sample(statusOptions),
                invoiceTotal.toNumber(),
            ],
        );

        const invoiceId: number = insertInvoice.rows[0].id;

        for (let i = 0; i < chosenItems.length; i += 1) {
            const it = chosenItems[i];
            const total = new Decimal(it.item_price)
                .mul(it.item_quantity)
                .toNumber();
            await client.query(
                `INSERT INTO invoice_items (
                    invoice_id, item_description, item_quantity, item_price, item_total
                ) VALUES ($1, $2, $3, $4, $5)`,
                [
                    invoiceId,
                    it.item_description,
                    it.item_quantity,
                    it.item_price,
                    total,
                ],
            );
        }

        await client.query("COMMIT");
    } catch (error) {
        await client.query("ROLLBACK");
        throw error;
    } finally {
        client.release();
    }
}

async function ensureSeeded(): Promise<void> {
    const result = await pool.query(
        "SELECT COUNT(*)::int AS count FROM invoices",
    );
    const currentCount: number = result.rows[0].count;
    if (currentCount >= 30) {
        return;
    }

    const toCreate = 30 - currentCount;
    for (let i = 0; i < toCreate; i += 1) {
        // eslint-disable-next-line no-await-in-loop
        await createInvoiceWithItems(currentCount + i);
    }
}

(async () => {
    try {
        await ensureSeeded();
        // eslint-disable-next-line no-console
        console.log("Database seeded with luxury invoices.");
        process.exit(0);
    } catch (err) {
        // eslint-disable-next-line no-console
        console.error("Seeding failed:", err);
        process.exit(1);
    }
})();
