import express from "express";
import session from "express-session";
import passport from "passport";
import dotenv from "dotenv";
import authRoutes from "../routes/authRoutes";
import "./config/passport";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
    session({
        secret: process.env.SESSION_SECRET!,
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false }, // Set secure to true in production
    }),
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/auth", authRoutes);

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
