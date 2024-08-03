import express from "express";
import session from "express-session";
import passport from "passport";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/authRoutes";
import clientRoutes from "./routes/clientRoutes";
import invoiceRoutes from "./routes/invoiceRoutes";
import logger from "./middleware/logger";
import { pool } from "./config/database";
import pgSession from "connect-pg-simple";
import "./config/passport";

dotenv.config();

const app = express();
const port = process.env.PORT || 8080;

// Read allowed origins from environment variables and split into an array
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(",") || [];

app.use(
    cors({
        origin: (origin, callback) => {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error("Not allowed by CORS"));
            }
        },
        methods: "GET,POST,PUT,DELETE,OPTIONS",
        allowedHeaders: "Content-Type, Authorization",
        credentials: true,
    }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(logger);

app.use((req, res, next) => {
    const oldSend = res.send;
    res.send = function (body?: any) {
        res.locals.body = body;
        return oldSend.call(res, body);
    };
    next();
});

// Configure session store
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
            secure: process.env.NODE_ENV === "production", // Use secure cookies in production
            maxAge: 30 * 24 * 60 * 60 * 1000, // Cookie expiration: 30 days
            httpOnly: true,
        },
    }),
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/auth", authRoutes);
app.use("/api", clientRoutes);
app.use("/api", invoiceRoutes);

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
