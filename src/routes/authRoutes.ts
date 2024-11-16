import express from "express";
import {
    registerUser,
    loginWithDemoAccount,
} from "../controllers/authController";

const router = express.Router();

router.post("/register", registerUser);
router.post("/demo-login", loginWithDemoAccount);

export default router;
