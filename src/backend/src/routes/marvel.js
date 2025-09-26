import express from "express";
import { pool } from "../pool.js";

const router = express.Router();

router.get("/get-marvelEntries", async (req, res) => {
    try {
        const { universum } = req.query;
        let query = `
            SELECT t.id, t.title, t.date, u.universum, u.position
            FROM marvel_title t
            JOIN marvel_universum u
            ON t.id = u.marvel_titleid
        `;
        const params = [];
        if (universum) {
            query += " WHERE u.universum = $1";
            params.push(universum);
        }
        query += " ORDER BY u.universum, u.position;";
        const { rows } = await pool.query(query, params);
        res.json(rows);
    } catch (err) {
        console.error("Fehler beim Abrufen der Marvel-Einträge:", err);
        res.status(500).json({ error: "Interner Serverfehler" });
    }
});

router.post("/add-marvelEntry", async (req, res) => {
    const { title, date, universum } = req.body;

    if (!title) {
        return res.status(400).json({ error: "Title darf nicht leer sein!" });
    }

    try {
        // Schritt 1: Titel speichern
        const result = await pool.query(
            `INSERT INTO marvel_title (title, date) VALUES ($1, $2) RETURNING id`,
            [title, date || null]
        );
        const titleId = result.rows[0].id;

        const universen = Array.isArray(universum) ? universum : [universum];

        for (const uniObj of universen) {
            // uniObj = { universum: "MCU", position: 1 }
            await pool.query(
                `INSERT INTO marvel_universum (marvel_titleid, universum, position) VALUES ($1, $2, $3)`,
                [titleId, uniObj.universum, uniObj.position]
            );
        }


        res.json({ success: true, id: titleId });
    } catch (error) {
        console.error("DB Error:", error);
        res.status(500).json({ error: "Fehler beim Speichern" });
    }
});

router.put("/update-marvelEntry/:id", async (req, res) => {
    const { id } = req.params;
    const { title, date } = req.body;

    if (!title) {
        return res.status(400).json({ error: "Title darf nicht leer sein!" });
    }

    try {
        await pool.query(
            `UPDATE marvel_title 
             SET title = $1, date = $2 
             WHERE id = $3`,
            [title, date || null, id]
        );

        res.json({ success: true, message: "Eintrag aktualisiert." });
    } catch (error) {
        console.error("Fehler beim Update:", error);
        res.status(500).json({ error: "Fehler beim Update" });
    }
});


router.delete("/delete-marvelEntry/:id", async (req, res) => {
    const { id } = req.params;

    try {
        // Schritt 1: Alle Universum-Zeilen löschen
        await pool.query(
            `DELETE FROM marvel_universum WHERE marvel_titleid = $1`,
            [id]
        );

        // Schritt 2: Den Titel löschen
        await pool.query(
            `DELETE FROM marvel_title WHERE id = $1`,
            [id]
        );

        res.json({ success: true, message: "Eintrag gelöscht." });
    } catch (error) {
        console.error("Fehler beim Löschen:", error);
        res.status(500).json({ error: "Fehler beim Löschen" });
    }
});

export default router;
