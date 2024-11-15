import { Router } from "express";
import {
    createInvoice,
    getInvoices,
    getInvoiceById,
    updateInvoice,
    updateInvoiceStatus,
    deleteInvoice,
} from "../controllers/invoiceController";
import { authenticateToken } from "../middleware/auth";

const router = Router();

router.use(authenticateToken);
router.post("/invoices", createInvoice);
router.get("/invoices", getInvoices);
router.get("/invoices/:id", getInvoiceById);
router.put("/invoices/:id", updateInvoice);
router.put("/invoices/:id/status", updateInvoiceStatus);
router.delete("/invoices/:id", deleteInvoice);

export default router;
