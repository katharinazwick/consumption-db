import express from "express";
import {pool} from "../../pool.js";

const router = express.Router();

router.put("/update-actor/:id", async (req, res) => {
    const {id} = req.params;
    const name = (req.body.name || "").trim();
    if (!name) return res.status(400).json({error: "Name darf nicht leer sein!"});

    try {
        const dup = await pool.query(
            "SELECT 1 FROM actor WHERE LOWER(TRIM(name)) = LOWER($1) AND id <> $2",
            [name, id]
        );
        if (dup.rowCount > 0) return res.status(409).json({error: "Ein Schauspieler mit diesem Namen existiert bereits!"});

        const result = await pool.query("UPDATE actor SET name = $1 WHERE id = $2 RETURNING id, name", [name, id]);
        if (result.rowCount === 0) return res.status(404).json({error: "Schauspieler nicht gefunden"});
        res.json({message: "Name aktualisiert", updated: result.rows[0]});
    } catch (err) {
        console.error(err);
        res.status(500).json({error: "Fehler beim Aktualisieren"});
    }
});

export default router;
