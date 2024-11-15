import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JwtPayload } from "../types/jwt";
import { config } from "../config/config";

declare global {
    namespace Express {
        interface Request {
            user?: JwtPayload;
        }
    }
}

export const authenticateToken = (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res
            .status(401)
            .json({ message: "Authentication token required" });
    }

    try {
        const user = jwt.verify(token, config.jwt.secret) as JwtPayload;
        req.user = user;
        next();
    } catch (error) {
        return res.status(403).json({ message: "Invalid or expired token" });
    }
};
