export interface InvoiceItem {
    id: string;
    invoice_id: string;
    item_description: string;
    item_quantity: number;
    item_price: number;
    total_price: number;
    created_at?: Date;
}
