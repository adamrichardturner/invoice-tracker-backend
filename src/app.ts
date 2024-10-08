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
import http from "http";

dotenv.config({
    path:
        process.env.NODE_ENV === "production"
            ? ".env.production.local"
            : ".env.development.local",
});

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
            secure: process.env.NODE_ENV === "production",
            httpOnly: true,
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            maxAge: 30 * 24 * 60 * 60 * 1000,
        },
    }),
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/user", authRoutes);
app.use("/api", invoiceRoutes);

let server: http.Server;

if (process.env.NODE_ENV !== "development") {
    const port = process.env.PORT || 8080;
    server = app.listen(port, () => {
        console.log(`Server running at http://localhost:${port}/`);
    });
}

export { server };
