import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import authRoutes from "./routes/authRoutes";
import invoiceRoutes from "./routes/invoiceRoutes";
import dotenv from "dotenv";

// Load environment variables
dotenv.config({
    path:
        process.env.NODE_ENV === "production"
            ? ".env.production.local"
            : ".env.development.local",
});

// Initialize express app
export const app = express();

// Basic middleware
app.use(express.json());
app.use(
    cors({
        origin:
            process.env.NODE_ENV === "production"
                ? "https://invoice-tracker.adamrichardturner.dev"
                : "http://localhost:3000",
        credentials: true,
    }),
);

// JWT Authentication middleware
const authenticateToken = (req: any, res: any, next: any) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res.sendStatus(401);
    }

    jwt.verify(
        token,
        process.env.JWT_SECRET as string,
        (err: any, user: any) => {
            if (err) {
                return res.sendStatus(403);
            }
            req.user = user;
            next();
        },
    );
};

// Routes
app.use("/user", authRoutes);
app.use("/api", authenticateToken, invoiceRoutes); // Protected routes

// Start server
const port = process.env.PORT || 5000;
const server = app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});

export { server };
