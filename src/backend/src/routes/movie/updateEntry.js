import express from "express";
import {pool} from "../../pool.js";

const router = express.Router();

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

export default router;
