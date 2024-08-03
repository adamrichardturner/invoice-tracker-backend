import { Request, Response, NextFunction } from "express";
import passport from "passport";
import bcrypt from "bcrypt";
import { pool } from "../config/database";
import { sendConfirmationEmail } from "../utils/email";
import { v4 as uuidv4 } from "uuid";
import { AuthInfo } from "../types/auth";
import { User } from "../models/user";

export const registerUser = async (req: Request, res: Response) => {
    const { username, email, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const emailConfirmationToken = uuidv4();
        await pool.query(
            "INSERT INTO users (username, email, password_hash, email_confirmation_token) VALUES ($1, $2, $3, $4)",
            [username, email, hashedPassword, emailConfirmationToken],
        );
        await sendConfirmationEmail(email, emailConfirmationToken);
        res.status(201).send(
            "User registered. Please check your email to confirm.",
        );
    } catch (err) {
        console.error("Error registering user:", err);
        res.status(500).send("Server error.");
    }
};

export const confirmEmail = async (req: Request, res: Response) => {
    const { token } = req.query;
    try {
        const result = await pool.query(
            "UPDATE users SET email_confirmed = TRUE, email_confirmation_token = NULL WHERE email_confirmation_token = $1 RETURNING *",
            [token],
        );
        if (result.rowCount === 0) {
            return res.status(400).send("Invalid token.");
        }
        res.send("Email confirmed. You can now log in.");
    } catch (err) {
        console.error("Error confirming email:", err);
        res.status(500).send("Server error.");
    }
};

export const loginUser = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    passport.authenticate(
        "local",
        async (err: Error, user: User, info: AuthInfo) => {
            try {
                if (err) {
                    console.error("Error during authentication:", err);
                    return next(err);
                }
                if (!user) {
                    return res.status(400).send(info.message);
                }
                req.logIn(user, (err: Error) => {
                    if (err) {
                        console.error("Error logging in user:", err);
                        return next(err);
                    }
                    res.cookie("connect.sid", req.sessionID, {
                        httpOnly: true,
                        secure: process.env.NODE_ENV === "production",
                        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
                    });
                    return res.send({
                        user: sanitizeUser(user),
                        sessionID: req.sessionID,
                    });
                });
            } catch (err) {
                console.error("Unexpected error during login:", err);
                res.status(500).send("Server error.");
            }
        },
    )(req, res, next);
};

export const logoutUser = async (req: Request, res: Response) => {
    try {
        req.logout((err) => {
            if (err) {
                console.error("Error logging out user:", err);
                return res.status(500).send("Failed to log out.");
            }
            res.clearCookie("connect.sid");
            res.send("Logged out successfully.");
        });
    } catch (err) {
        console.error("Unexpected error during logout:", err);
        res.status(500).send("Server error.");
    }
};

const sanitizeUser = (user: User) => {
    return {
        id: user.id,
        username: user.username,
        email: user.email,
        email_confirmed: user.email_confirmed,
        profile_image_url: user.profile_image_url,
        created_at: user.created_at,
    };
};
