import { Router } from "express";
import {
    registerUser,
    confirmEmail,
    loginUser,
    logoutUser,
    loginWithDemoAccount,
} from "../controllers/authController";

const router = Router();

router.post("/register", registerUser);
router.get("/confirm-email", confirmEmail);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.post("/demo-login", loginWithDemoAccount);

export default router;
