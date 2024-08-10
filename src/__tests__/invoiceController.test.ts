import request from "supertest";
import { app, server } from "../app";
import { pool } from "../config/database";

const generateRandomString = () => {
    return Math.random().toString(36).substring(2, 15);
};

describe("Invoice Controller", () => {
    let invoiceId: number;

    beforeAll(async () => {
        // Create an invoice to be used across all tests
        const randomString = generateRandomString();
        const newInvoice = {
            bill_from_street_address: "123 Main St",
            bill_from_city: "Metropolis",
            bill_from_postcode: "12345",
            bill_from_country: "Countryland",
            bill_to_email: `${randomString}@example.com`,
            bill_to_name: "John Doe",
            bill_to_street_address: "456 Elm St",
            bill_to_city: "Gotham",
            bill_to_postcode: "67890",
            bill_to_country: "Countryland",
            invoice_date: new Date(),
            payment_terms: "Net 30",
            project_description: "Website redesign",
            status: "draft",
            items: [
                {
                    item_description: "Design work",
                    item_quantity: 10,
                    item_price: 100.0,
                },
                {
                    item_description: "Development work",
                    item_quantity: 20,
                    item_price: 150.0,
                },
            ],
        };

        const res = await request(app).post("/api/invoices").send(newInvoice);
        invoiceId = res.body.id;
    });

    afterAll(async () => {
        await pool.end();
        if (server) {
            server.close();
        }
    });

    describe("GET /api/invoices", () => {
        it("should retrieve all invoices", async () => {
            const res = await request(app).get("/api/invoices");
            expect(res.statusCode).toEqual(200);
            expect(res.body).toBeInstanceOf(Array);
            expect(res.body.length).toBeGreaterThan(0);
        });
    });

    describe("GET /api/invoices/:id", () => {
        it("should retrieve an invoice by ID", async () => {
            const res = await request(app).get(`/api/invoices/${invoiceId}`);
            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty("id", invoiceId);
        });

        it("should return a 404 for a non-existent invoice", async () => {
            const res = await request(app).get(`/api/invoices/999999`);
            expect(res.statusCode).toEqual(404);
            expect(res.body).toHaveProperty("message", "Invoice not found");
        });
    });

    describe("PUT /api/invoices/:id", () => {
        it("should update an existing invoice", async () => {
            const updatedInvoice = {
                status: "paid",
                project_description: "Updated project description",
                invoice_date: new Date(),
                payment_terms: "Net 15",
                bill_from_street_address: "123 Main St",
                bill_from_city: "Metropolis",
                bill_from_postcode: "12345",
                bill_from_country: "Countryland",
                bill_to_name: "John Doe",
                bill_to_email: "johndoe@example.com",
                bill_to_street_address: "456 Elm St",
                bill_to_city: "Gotham",
                bill_to_postcode: "67890",
                bill_to_country: "Countryland",
                items: [
                    {
                        item_description: "Updated Design work",
                        item_quantity: 15,
                        item_price: 120.0,
                    },
                ],
            };

            const res = await request(app)
                .put(`/api/invoices/${invoiceId}`)
                .send(updatedInvoice);
            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty("status", updatedInvoice.status);
            expect(res.body.items).toBeInstanceOf(Array);
            expect(res.body.items.length).toEqual(1);
            expect(res.body.items[0]).toHaveProperty(
                "item_description",
                "Updated Design work",
            );
        });
    });

    describe("PUT /api/invoices/:id/status", () => {
        it("should update the status of an invoice", async () => {
            const res = await request(app)
                .put(`/api/invoices/${invoiceId}/status`)
                .send({ status: "pending" });
            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty("status", "pending");
        });

        it("should return a 404 for a non-existent invoice", async () => {
            const res = await request(app)
                .put(`/api/invoices/999999/status`)
                .send({ status: "pending" });
            expect(res.statusCode).toEqual(404);
            expect(res.body).toHaveProperty("message", "Invoice not found");
        });
    });

    describe("DELETE /api/invoices/:id", () => {
        it("should delete an invoice", async () => {
            const res = await request(app).delete(`/api/invoices/${invoiceId}`);
            expect(res.statusCode).toEqual(200);
            expect(res.text).toContain("Invoice deleted successfully.");
        });

        it("should return a 404 for a non-existent invoice", async () => {
            const res = await request(app).delete(`/api/invoices/999999`);
            expect(res.statusCode).toEqual(404);
            expect(res.body).toHaveProperty("message", "Invoice not found");
        });
    });
});
