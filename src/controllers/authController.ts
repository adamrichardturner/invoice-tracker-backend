import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { pool } from "../config/database";
import { JwtPayload } from "../types/jwt";
import { config } from "../config/config";

export const registerUser = async (req: Request, res: Response) => {
    const { username, email, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await pool.query(
            "INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id, email, username",
            [username, email, hashedPassword],
        );

        const user = result.rows[0];
        const userPayload: JwtPayload = {
            id: user.id,
            email: user.email,
            name: user.username,
        };

        const token = jwt.sign(userPayload, config.jwt.secret, {
            expiresIn: "24h",
        });

        res.status(201).json({
            success: true,
            token,
            user: userPayload,
        });
    } catch (err) {
        console.error("Error registering user:", err);
        res.status(500).send("Server error.");
    }
};

export const loginWithDemoAccount = async (req: Request, res: Response) => {
    try {
        const demoUser: JwtPayload = {
            id: "demo-user",
            email: "demo@demo.com",
            name: "Demo User",
        };

        const token = jwt.sign(demoUser, config.jwt.secret, {
            expiresIn: "24h",
        });

        res.status(200).json({
            success: true,
            token,
            user: demoUser,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Demo login failed",
        });
    }
};

export const demoLogin = async (req: Request, res: Response) => {
    try {
        const demoUser = {
            id: "demo-user",
            email: "demo@demo.com",
            role: "demo",
        };

        const token = jwt.sign(demoUser, process.env.JWT_SECRET as string, {
            expiresIn: "24h",
        });

        res.json({
            success: true,
            token,
            user: demoUser,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Demo login failed",
        });
    }
};
