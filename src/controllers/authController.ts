import { Request, Response, NextFunction } from "express";
import passport from "passport";
import bcrypt from "bcrypt";
import { pool } from "../config/database";
import { sendConfirmationEmail } from "../utils/email";
import { v4 as uuidv4 } from "uuid";
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
        (err: any, user: User, info: { message: any }) => {
            if (err) {
                console.error("Error during authentication:", err);
                return next(err);
            }
            if (!user) {
                return res.status(400).send(info.message);
            }
            req.logIn(user, (err) => {
                if (err) {
                    console.error("Error logging in user:", err);
                    return next(err);
                }
                return res.send({
                    user: {
                        id: user.id,
                        username: user.username,
                        email: user.email,
                    },
                    sessionID: req.sessionID,
                });
            });
        },
    )(req, res, next);
};

export const logoutUser = (req: Request, res: Response) => {
    req.logout((err) => {
        if (err) {
            console.error("Error logging out user:", err);
            return res.status(500).send("Failed to log out.");
        }
        res.clearCookie("connect.sid");
        res.send("Logged out successfully.");
    });
};
