import { InvoiceItem } from "./invoiceItem";

export interface Invoice {
    id: string;
    bill_from_street_address: string;
    bill_from_city: string;
    bill_from_postcode: string;
    bill_from_country: string;
    bill_to_email: string;
    bill_to_name: string;
    bill_to_street_address: string;
    bill_to_city: string;
    bill_to_postcode: string;
    bill_to_country: string;
    invoice_date: Date;
    payment_terms: "Net 30 Days" | "14 Days" | "7 Days";
    project_description: string;
    status: "draft" | "pending" | "paid";
    created_at?: Date;
    updated_at?: Date;
    items: InvoiceItem[];
    invoice_total: string;
}
