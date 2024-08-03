import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { pool } from "./database";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();

passport.serializeUser((user: any, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
    try {
        const res = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
        done(null, res.rows[0]);
    } catch (err) {
        done(err, null);
    }
});

passport.use(
    new LocalStrategy(
        {
            usernameField: "email",
            passwordField: "password",
        },
        async (email, password, done) => {
            try {
                const res = await pool.query(
                    "SELECT * FROM users WHERE email = $1",
                    [email],
                );
                const user = res.rows[0];
                if (!user) {
                    return done(null, false, { message: "Incorrect email." });
                }
                if (!user.email_confirmed) {
                    return done(null, false, {
                        message: "Email not confirmed.",
                    });
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
