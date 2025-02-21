import express from "express";
import cors from "cors";
import pg from "pg";

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Verbindung zur PostgreSQL-Datenbank
const pool = new pg.Pool({
    user: "postgres",
    host: "localhost",
    database: "consumption",
    password: "01042024Kz",
    port: 5432,
});

// API-Endpunkt zum Speichern der Daten
app.post("/add-entry", async (req, res) => {
    const { title, date, stream, typ, discription } = req.body;

    if (!title) {
        return res.status(400).json({ error: "Title darf nicht leer sein!" });
    }

    try {
        const result = await pool.query(
            "INSERT INTO movie (title, date, stream, typ, discription) VALUES ($1, $2, $3, $4, $5) RETURNING *",
            [title, date, stream, typ, discription]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Fehler beim Speichern!" });
    }
});

app.listen(port, () => {
    console.log(`Server läuft auf http://localhost:${port}`);
});
