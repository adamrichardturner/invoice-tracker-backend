import { Router } from "express";
import {
    createClient,
    getClients,
    updateClient,
    deleteClient,
} from "../controllers/clientController";

const router = Router();

router.post("/clients", createClient);
router.get("/clients", getClients);
router.put("/clients/:id", updateClient);
router.delete("/clients/:id", deleteClient);

export default router;
