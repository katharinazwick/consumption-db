import express from "express";
import {pool} from "../../pool.js";

const router = express.Router();

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
