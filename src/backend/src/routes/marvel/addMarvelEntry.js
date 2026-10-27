import express from "express";
import {pool} from "../../pool.js";

const router = express.Router();

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

export default router;
