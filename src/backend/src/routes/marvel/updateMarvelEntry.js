import express from "express";
import {pool} from "../../pool.js";

const router = express.Router();

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

export default router;
