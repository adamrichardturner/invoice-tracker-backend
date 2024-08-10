import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config({
    path: `.env.${process.env.NODE_ENV || "development"}`,
});

export const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT!, 10),
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
});

pool.on("connect", () => {
    console.log(
        `Connected to the ${process.env.NODE_ENV} database (${process.env.DB_NAME})`,
    );
});

pool.on("error", (err) => {
    console.error("Unexpected error on idle client", err);
    process.exit(-1);
});
