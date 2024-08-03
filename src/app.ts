import express from "express";
import session from "express-session";
import passport from "passport";
import cors from "cors";
import { pool } from "./config/database";
import pgSession from "connect-pg-simple";
import "./config/passport";
import authRoutes from "./routes/authRoutes";
import invoicesRoutes from "./routes/invoiceRoutes";
import { confirmEmail, registerUser } from "./controllers/authController";
// Import other necessary modules

const app = express();
const PgSession = pgSession(session);

// CORS configuration
const corsOptions = {
    origin: process.env.FRONTEND_URL,
    credentials: true,
    optionsSuccessStatus: 200,
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Handle preflight requests
app.options("*", cors(corsOptions));

// Session configuration
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
            maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
            httpOnly: true,
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        },
    }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(passport.initialize());
app.use(passport.session());

// Use auth routes
app.use("/auth", authRoutes);
// Other routes
app.use("/api", invoicesRoutes);

const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
