import express from "express";
import {pool} from "../pool.js";

const router = express.Router();
// Prüft, ob ein Titel existiert
router.get("/title-exists", async (req, res) => {
    const {title} = req.query;
    if (!title || !title.trim()) return res.status(400).json({error: "title query fehlt"});

    try {
        const {rows} = await pool.query(
            "SELECT typ FROM movie WHERE LOWER(TRIM(title)) = LOWER(TRIM($1))",
            [title]
        );
        res.json({exists: rows.length > 0, count: rows.length, types: rows.map(r => r.typ)});
    } catch (err) {
        console.error(err);
        res.status(500).json({error: "Fehler bei Titelprüfung"});
    }
});

// Daten hinzufügen
router.post("/add-entry", async (req, res) => {
    const {title, viewingYear, stream, typ, description, completed, favourite} = req.body;
    if (!title) return res.status(400).json({error: "Title darf nicht leer sein!"});

    try {
        const result = await pool.query(
            "INSERT INTO movie (title, viewingYear, stream, typ, description, completed, favourite) VALUES ($1,$2,$3,$4,$5,$6,$7 ) RETURNING *",
            [title, viewingYear, stream, typ, description, completed, favourite]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({error: "Fehler beim Speichern!"});
    }
});

// Daten abrufen mit Filter
router.get("/get-entries", async (req, res) => {
    const {incompleteFilter, favouriteFilter, typFilter, streamFilter, sort} = req.query;
    const filterArray = [];
    const filterValueArray = [];

    try {
        let sqlStatement = "SELECT * FROM movie";
        const arrayDynamic = {
            completed: incompleteFilter,
            favourite: favouriteFilter,
            typ: typFilter,
            stream: streamFilter
        };

        for (let key in arrayDynamic) {
            if (arrayDynamic[key]) {
                filterArray.push(`${key} = $${filterArray.length + 1}`);
                filterValueArray.push(arrayDynamic[key]);
            }
        }
        if (filterArray.length > 0) sqlStatement += " WHERE " + filterArray.join(" AND ");

        if (sort) {
            const sortPart = sort.split(" ");
            sqlStatement += ` ORDER BY ${sortPart[0]} ${sortPart[1] === "ascending" ? "ASC" : "DESC"}`;
        }

        const result = await pool.query(sqlStatement, filterValueArray);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({error: "Fehler beim Abrufen der Daten!"});
    }
});

// Delete, Edit, Update Entry
router.delete("/delete-entry/:id", async (req, res) => {
    const {id} = req.params;
    try {
        const result = await pool.query("DELETE FROM movie WHERE id = $1", [id]);
        if (result.rowCount === 0) return res.status(404).json({error: "Eintrag nicht gefunden"});
        res.json({message: "Eintrag erfolgreich gelöscht"});
    } catch (err) {
        console.error(err);
        res.status(500).json({error: "Fehler beim Löschen"});
    }
});

router.put("/edit-entry/:id", async (req, res) => {
    const {id} = req.params;
    try {
        const result = await pool.query(
            "UPDATE movie SET completed = NOT completed WHERE id = $1 RETURNING *",
            [id]
        );
        if (result.rowCount === 0) return res.status(404).json({error: "Eintrag nicht gefunden"});
        res.json({message: "Completed erfolgreich geändert", updated: result.rows[0]});
    } catch (err) {
        console.error(err);
        res.status(500).json({error: "Fehler beim Aktualisieren"});
    }
});

router.put("/update-entry/:id", async (req, res) => {
    const {id} = req.params;
    const updates = req.body;

    if (!updates || Object.keys(updates).length === 0) return res.status(400).json({error: "Keine Daten zum Aktualisieren"});

    const allowedColumns = {title: "title", viewingyear: "viewingyear", stream: "stream", description: "description"};
    const setClauses = [];
    const values = [];

    Object.entries(updates).forEach(([key, value]) => {
        if (allowedColumns[key]) {
            setClauses.push(`${allowedColumns[key]} = $${values.length + 1}`);
            values.push(value);
        }
    });

    if (setClauses.length === 0) return res.status(400).json({error: "Keine gültigen Spalten zum Aktualisieren"});
    values.push(id);

    try {
        const result = await pool.query(`UPDATE movie
                                         SET ${setClauses.join(", ")}
                                         WHERE id = $${values.length} RETURNING *`, values);
        if (result.rowCount === 0) return res.status(404).json({error: "Eintrag nicht gefunden"});
        res.json({message: "Eintrag erfolgreich aktualisiert!", updated: result.rows[0]});
    } catch (err) {
        console.error(err);
        res.status(500).json({error: "Fehler beim Bearbeiten des Eintrags"});
    }
});

// Favoriten-Status umschalten (Toggle: True wird zu False und umgekehrt)
router.put("/editFavourite-entry/:id", async (req, res) => {
    const {id} = req.params;
    try {
        const result = await pool.query(
            "UPDATE movie SET favourite = NOT favourite WHERE id = $1 RETURNING *",
            [id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({error: "Eintrag nicht gefunden"});
        }

        const updatedMovie = result.rows[0];
        const statusText = updatedMovie.favourite ? "als Favorit markiert" : "aus den Favoriten entfernt";

        res.json({
            message: `Eintrag erfolgreich ${statusText}!`,
            updated: updatedMovie
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({error: "Fehler beim Ändern des Favoriten-Status"});
    }
});

export default router;
