import express from "express";
import session from "express-session";
import cors from "cors";

const app = express();

// CORS configuration
app.use(
    cors({
        origin:
            process.env.NODE_ENV === "production"
                ? "https://invoice-tracker.adamrichardturner.dev"
                : "http://localhost:3000",
        credentials: true,
    }),
);

app.use(express.json());

// Session configuration
app.use(
    session({
        secret: process.env.SESSION_SECRET || "hamsandwhiches",
        resave: false,
        saveUninitialized: false,
        cookie: {
            secure: process.env.NODE_ENV === "production",
            httpOnly: true,
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            maxAge: 24 * 60 * 60 * 1000, // 24 hours
        },
    }),
);

export default app;
