import express from "express";
import {pool} from "../../pool.js";

const router = express.Router();

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
