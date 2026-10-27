import express from "express";
import {pool} from "../../pool.js";

const router = express.Router();

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

export default router;
