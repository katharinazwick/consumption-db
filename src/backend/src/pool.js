import pg from "pg";
import dotenv from "dotenv";
import path from "node:path";

dotenv.config({
    path: path.resolve( ".env"),
});
const { Pool } = pg;

export const pool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
});

// Verbindung testen
pool.connect()
    .then(() => console.log("✅ Mit PostgreSQL verbunden"))
    .catch((err) => console.error("❌ Fehler bei der DB-Verbindung:", err.message));
