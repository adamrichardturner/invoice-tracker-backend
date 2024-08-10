import express from "express";
import session from "express-session";
import { pool } from "./config/database";
import pgSession from "connect-pg-simple";
import cors from "cors";
import authRoutes from "./routes/authRoutes";
import invoiceRoutes from "./routes/invoiceRoutes";
import dotenv from "dotenv";
import "./config/passport";
import passport from "passport";

dotenv.config();

export const app = express();

const corsOptions = {
    origin:
        process.env.NODE_ENV === "production"
            ? "https://invoice-tracker.adamrichardturner.dev"
            : "http://localhost:5000",
    credentials: true,
    optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session configuration
const PgSession = pgSession(session);

app.use(
    session({
        store: new PgSession({
            pool: pool,
            tableName: "session",
        }),
        secret: process.env.SESSION_SECRET!,
        resave: false,
        saveUninitialized: false,
        cookie: {
            secure: process.env.NODE_ENV === "production", // must be true if using HTTPS
            httpOnly: true,
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        },
    }),
);

app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/user", authRoutes);
app.use("/api", invoiceRoutes);

const port = process.env.PORT || 8080;
const server = app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});

export { server };
