import express from "express";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";

const router = express.Router();

router.post("/demo-login", async (req: Request, res: Response) => {
    try {
        const token = jwt.sign(
            { id: "demo-user", email: "demo@example.com" },
            process.env.JWT_SECRET as string,
            { expiresIn: "24h" },
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            path: "/",
            maxAge: 24 * 60 * 60 * 1000,
        });

        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: "Failed to create demo session" });
    }
});

export default router;
