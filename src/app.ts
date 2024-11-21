import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import authRoutes from "./routes/authRoutes";
import invoiceRoutes from "./routes/invoiceRoutes";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

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
app.use(cookieParser());
app.use(
    cors({
        origin:
            process.env.NODE_ENV === "production"
                ? "https://invoice-tracker.adamrichardturner.dev"
                : "http://localhost:3000",
        credentials: true,
    }),
);

// Routes
app.use("/user", authRoutes);
app.use("/api", invoiceRoutes);

// Start server
const port = process.env.PORT || 5000;
const server = app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});

export { server };
