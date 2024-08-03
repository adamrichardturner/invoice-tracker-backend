import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { pool } from "./database";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { User } from "../models/user";

dotenv.config();

passport.use(
    new LocalStrategy(
        {
            usernameField: "email",
            passwordField: "password",
        },
        async (email, password, done) => {
            try {
                const result = await pool.query(
                    "SELECT * FROM users WHERE email = $1",
                    [email],
                );
                const user: User = result.rows[0];

                if (!user) {
                    return done(null, false, { message: "Incorrect email." });
                }

                const isMatch = await bcrypt.compare(
                    password,
                    user.password_hash,
                );

                if (!isMatch) {
                    return done(null, false, {
                        message: "Incorrect password.",
                    });
                }

                return done(null, user);
            } catch (err) {
                return done(err);
            }
        },
    ),
);

passport.serializeUser((user: Express.User, done) => {
    done(null, (user as User).id);
});

passport.deserializeUser(async (id: string, done) => {
    try {
        const res = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
        if (res.rows.length > 0) {
            done(null, res.rows[0]);
        } else {
            done(new Error("User not found"), null);
        }
    } catch (err) {
        done(err, null);
    }
});
