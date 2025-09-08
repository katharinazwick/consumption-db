import express from "express";
import cors from "cors";
import pg from "pg";
import dotenv from "dotenv";
import path from "node:path";
import {fileURLToPath} from "node:url";
import {compileETag} from "express/lib/utils.js";

dotenv.config();

const {Pool} = pg;
const app = express();
const port = 3000;

// __dirname in ES-Modulen simulieren
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// PostgreSQL Pool erstellen
const pool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
});

// Middleware
app.use(cors());
app.use(express.json());

// Verbindung testen
pool.connect()
    .then(() => console.log("✅ Mit PostgreSQL verbunden"))
    .catch((err) => console.error("❌ Fehler bei der DB-Verbindung:", err.message));

// Prüft, ob der Titel bereits existiert (case-insensitive, getrimmt)
app.get("/title-exists", async (req, res) => {
    const { title } = req.query;
    if (!title || !title.trim()) {
        return res.status(400).json({ error: "title query fehlt" });
    }

    try {
        const { rows } = await pool.query(
            "SELECT typ FROM movie WHERE LOWER(TRIM(title)) = LOWER(TRIM($1))",
            [title]
        );

        const count = rows.length;
        const types = rows.map(row => row.typ);

        res.json({ exists: count > 0, count, types });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Fehler bei Titelprüfung" });
    }
});


// API-Endpunkt zum Speichern der Daten
app.post("/add-entry", async (req, res) => {
    const {title, viewingYear, stream, typ, description, completed} = req.body;

    if (!title) {
        return res.status(400).json({error: "Title darf nicht leer sein!"});
    }

    try {
        const result = await pool.query(
            "INSERT INTO movie (title, viewingYear, stream, typ, description, completed) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
            [title, viewingYear, stream, typ, description, completed]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({error: "Fehler beim Speichern!"});
    }
});

// API-Endpunkt zum Abrufen der gespeicherten Daten
app.get("/get-entries", async (req, res) => {
    const {incompleteFilter, typFilter, streamFilter, sort} = req.query;

    const filterArray = [];
    const filterValueArray = [];

    try {
        let sqlStatement = "SELECT * FROM movie";
        const arrayDynamic = {
            completed: incompleteFilter,
            typ: typFilter,
            stream: streamFilter,
        };

        for (let key in arrayDynamic) {
            if (arrayDynamic[key]) {

                filterArray.push(`${key} = $${filterArray.length + 1}`);
                filterValueArray.push(arrayDynamic[key]);
            }
        }

        if (filterArray.length > 0) {
            sqlStatement += " WHERE " + filterArray.join(" AND ");
        }

        const sortPart = sort.split(" ");
        if (sortPart[1] == "ascending") {
            sortPart[1] = "ASC";
        } else sortPart[1] = "DESC";
        sqlStatement += ` ORDER BY ${sortPart[0]} ${sortPart[1]}`;

        console.log(sqlStatement);
        const result = await pool.query(sqlStatement, filterValueArray);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({error: "Fehler beim Abrufen der Daten!"});
    }
});

app.delete("/delete-entry/:id", async (req, res) => {
    const {id} = req.params;
    try {
        const result = await pool.query("DELETE FROM movie WHERE id = $1", [id]);

        if (result.rowCount === 0) {
            return res.status(404).json({error: "Eintrag nicht gefunden"});
        }

        res.status(200).json({message: "Eintrag erfolgreich gelöscht"});
    } catch (err) {
        console.error(err);
        res.status(500).json({error: "Fehler beim Löschen"});
    }
});

app.put("/edit-entry/:id", async (req, res) => {
    const {id} = req.params;

    try {
        // Toggle: completed = NOT completed
        const result = await pool.query(
            "UPDATE movie SET completed = NOT completed WHERE id = $1 RETURNING *",
            [id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({error: "Eintrag nicht gefunden"});
        }

        res.json({message: "Completed erfolgreich geändert", updated: result.rows[0]});
    } catch (err) {
        console.error(err);
        res.status(500).json({error: "Fehler beim Aktualisieren"});
    }
});

app.put("/update-entry/:id", async (req, res) => {
    const { id } = req.params;
    const updates = req.body; // title, viewingyear, stream, description

    if (!id) return res.status(400).json({ error: "Keine ID angegeben" });
    if (!updates || Object.keys(updates).length === 0) return res.status(400).json({ error: "Keine Daten zum Aktualisieren" });

    // Mapping der erlaubten Spalten auf DB-Spalten
    const allowedColumns = {
        title: "title",
        viewingyear: "viewingyear", // PostgreSQL-Spalte in deiner DB ist vermutlich viewingyear
        stream: "stream",
        description: "description"
    };

    const setClauses = [];
    const values = [];

    Object.entries(updates).forEach(([key, value], index) => {
        const column = allowedColumns[key];
        if (column) {
            setClauses.push(`${column} = $${values.length + 1}`);
            values.push(value);
        }
    });

    if (setClauses.length === 0) {
        return res.status(400).json({ error: "Keine gültigen Spalten zum Aktualisieren" });
    }

    values.push(id); // ID für WHERE-Klausel

    const query = `UPDATE movie SET ${setClauses.join(", ")} WHERE id = $${values.length} RETURNING *`;

    try {
        const result = await pool.query(query, values);
        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Eintrag nicht gefunden" });
        }
        res.json({ message: "Eintrag erfolgreich aktualisiert!", updated: result.rows[0] });
    } catch (err) {
        console.error("Fehler beim Bearbeiten:", err);
        res.status(500).json({ error: "Fehler beim Bearbeiten des Eintrags" });
    }
});


app.use(express.static(path.join(__dirname, "frontend")));

// Server starten
app.listen(port, () => {
    console.log(`✅ Server läuft auf http://localhost:${port}`);
});

