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
//HTML laden und zurücksetzen bei aufrufen von / !?!?
// API-Endpunkt zum Speichern der Daten
app.post("/add-entry", async (req, res) => {
    const { title, viewingYear, stream, typ, description, incomplete } = req.body;

    if (!title) {
        return res.status(400).json({ error: "Title darf nicht leer sein!" });
    }

    try {
        const result = await pool.query(
            "INSERT INTO movie (title, viewingYear, stream, typ, description, incomplete) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
            [title, viewingYear, stream, typ, description, incomplete]
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

// API-Endpunkt zum Abrufen der gespeicherten Daten
app.get("/get-entries", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM movie ORDER BY title ASC");
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Fehler beim Abrufen der Daten!" });
    }
});
