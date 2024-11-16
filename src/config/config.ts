import dotenv from "dotenv";

dotenv.config({
    path:
        process.env.NODE_ENV === "production"
            ? ".env.production.local"
            : ".env.development.local",
});

export const config = {
    jwt: {
        secret: process.env.JWT_SECRET || "fallback_secret_key_for_development",
    },
};
