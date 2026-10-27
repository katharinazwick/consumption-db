import express from "express";
import {pool} from "../../pool.js";

const router = express.Router();

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

export default router;
