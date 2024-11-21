import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { pool } from "../config/database"; // Adjust the import based on your structure
import bcrypt from "bcrypt"; // Ensure bcrypt is installed: npm install bcrypt

const router = express.Router();

router.post("/demo-login", async (req: Request, res: Response) => {
    try {
        const demoCredentials = {
            email: process.env.DEMO_EMAIL,
            password: process.env.DEMO_PASSWORD,
        };

        if (!demoCredentials.email || !demoCredentials.password) {
            return res
                .status(500)
                .json({ message: "Demo credentials not configured" });
        }

        // Find the demo user
        const result = await pool.query(
            "SELECT id, email, password_hash FROM users WHERE email = $1",
            [demoCredentials.email],
        );

        if (result.rows.length === 0) {
            return res.status(401).json({ message: "Demo user not found" });
        }

        const user = result.rows[0];

        // Compare the password using bcrypt
        const isValidPassword = await bcrypt.compare(
            demoCredentials.password,
            user.password_hash,
        );

        if (!isValidPassword) {
            return res
                .status(401)
                .json({ message: "Invalid demo credentials" });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET as string,
            { expiresIn: "24h" },
        );

        // Set cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            path: "/",
            maxAge: 24 * 60 * 60 * 1000,
        });

        return res.json({ success: true });
    } catch (error) {
        console.error("Demo login error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});

export default router;
